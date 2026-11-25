import { promises as fs } from "fs";
import path from "path";
import mysql, { type Pool, type PoolConnection, type RowDataPacket } from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __mtcrystalDbPool: Pool | undefined;
  // eslint-disable-next-line no-var
  var __mtcrystalDbInitialized: boolean | undefined;
}

function getBoolean(value: string | undefined, defaultValue = false) {
  if (value === undefined) {
    return defaultValue;
  }

  return value === "1" || value.toLowerCase() === "true";
}

export function getDatabaseConfig() {
  return {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "mtcrystal",
    // TiDB Cloud requires TLS 1.2+; set MYSQL_SSL=true for it.
    ssl: getBoolean(process.env.MYSQL_SSL, false) ? { minVersion: "TLSv1.2" } : undefined,
  };
}

export function getPool() {
  if (!globalThis.__mtcrystalDbPool) {
    globalThis.__mtcrystalDbPool = mysql.createPool({
      ...getDatabaseConfig(),
      waitForConnections: true,
      connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 5),
      queueLimit: 0,
      namedPlaceholders: true,
      multipleStatements: true,
      dateStrings: true,
    });
  }

  return globalThis.__mtcrystalDbPool;
}

export async function withTransaction<T>(handler: (connection: PoolConnection) => Promise<T>) {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await handler(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function query<T extends RowDataPacket[]>(sql: string, params?: unknown[]) {
  const [rows] = await getPool().query<T>(sql, params);
  return rows;
}

async function columnExists(table: string, column: string) {
  const rows = await query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column]
  );

  return Number(rows[0]?.count || 0) > 0;
}

async function indexExists(table: string, indexName: string) {
  const rows = await query<RowDataPacket[]>(
    `SELECT COUNT(*) AS count FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
    [table, indexName]
  );

  return Number(rows[0]?.count || 0) > 0;
}

async function tableRowCount(table: string) {
  const rows = await query<RowDataPacket[]>(`SELECT COUNT(*) AS count FROM ${table}`);
  return Number(rows[0]?.count || 0);
}

/**
 * Schema.sql only uses CREATE TABLE IF NOT EXISTS, so databases created before
 * nested categories existed never pick up the new columns. These migrations are
 * idempotent and safe to run on every boot.
 */
async function runMigrations() {
  // Pages were introduced with an HTML-friendly shape; it was replaced by plain
  // text (title + description + body). Add the new columns when the table
  // already exists from an earlier boot.
  if (!(await columnExists("pages", "description"))) {
    await getPool().query("ALTER TABLE pages ADD COLUMN description TEXT");
  }
  if (!(await columnExists("pages", "body"))) {
    await getPool().query("ALTER TABLE pages ADD COLUMN body LONGTEXT");
  }

  // Banners used to carry only the desktop artwork; the mobile variant was
  // added later, so it is nullable.
  if (!(await columnExists("banners", "mobile_image"))) {
    await getPool().query("ALTER TABLE banners ADD COLUMN mobile_image TEXT NULL");
  }

  if (!(await columnExists("categories", "parent_id"))) {
    await getPool().query("ALTER TABLE categories ADD COLUMN parent_id VARCHAR(64) NULL");
  }

  if (!(await columnExists("categories", "sort_order"))) {
    await getPool().query("ALTER TABLE categories ADD COLUMN sort_order INT NOT NULL DEFAULT 0");
  }

  if (!(await indexExists("categories", "idx_categories_parent"))) {
    await getPool().query("ALTER TABLE categories ADD INDEX idx_categories_parent (parent_id)");
  }

  // Single-row product/order writes depend on these; without them every
  // WHERE product_id = ? / order_id = ? degrades to a full table scan and
  // the long POST /api/products transaction holds locks even longer.
  const childIndexes: Array<[string, string, string]> = [
    ["product_images", "idx_product_images_product", "product_id"],
    ["product_bullet_points", "idx_product_bullets_product", "product_id"],
    ["product_categories", "idx_product_categories_product", "product_id"],
    ["order_items", "idx_order_items_order", "order_id"],
    ["payments", "idx_payments_order", "order_id"],
    ["user_addresses", "idx_user_addresses_user", "user_id"],
  ];
  for (const [table, indexName, column] of childIndexes) {
    if (!(await indexExists(table, indexName))) {
      // Another instance may add it between the check and the ALTER.
      await getPool()
        .query(`ALTER TABLE ${table} ADD INDEX ${indexName} (${column})`)
        .catch((error) => {
          if (error?.code !== "ER_DUP_KEYNAME") throw error;
        });
    }
  }

  // Products used to carry a single category slug. Seed the junction table from
  // that column so existing catalogs keep working after the upgrade.
  const [productCategoryCount, productCount] = await Promise.all([
    tableRowCount("product_categories"),
    tableRowCount("products"),
  ]);

  if (productCategoryCount === 0 && productCount > 0) {
    await getPool().query(
      `INSERT IGNORE INTO product_categories (product_id, category_slug, sort_order)
       SELECT id, category, 0 FROM products WHERE category <> ''`
    );
  }
}

// Shared promise so concurrent requests run setup once; parallel DDL fails on TiDB.
let setupPromise: Promise<void> | undefined;

export function ensureDatabaseSetup() {
  if (globalThis.__mtcrystalDbInitialized) {
    return Promise.resolve();
  }

  setupPromise ??= (async () => {
    const schemaPath = path.join(process.cwd(), "sql", "schema.sql");
    const schema = await fs.readFile(schemaPath, "utf8");
    await getPool().query(schema);
    await runMigrations();
    globalThis.__mtcrystalDbInitialized = true;
  })().catch((error) => {
    setupPromise = undefined;
    throw error;
  });

  return setupPromise;
}
