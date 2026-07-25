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
    ssl: getBoolean(process.env.MYSQL_SSL, false) ? {} : undefined,
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
  if (!(await columnExists("categories", "parent_id"))) {
    await getPool().query("ALTER TABLE categories ADD COLUMN parent_id VARCHAR(64) NULL");
  }

  if (!(await columnExists("categories", "sort_order"))) {
    await getPool().query("ALTER TABLE categories ADD COLUMN sort_order INT NOT NULL DEFAULT 0");
  }

  if (!(await indexExists("categories", "idx_categories_parent"))) {
    await getPool().query("ALTER TABLE categories ADD INDEX idx_categories_parent (parent_id)");
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

export async function ensureDatabaseSetup() {
  if (globalThis.__mtcrystalDbInitialized) {
    return;
  }

  const schemaPath = path.join(process.cwd(), "sql", "schema.sql");
  const schema = await fs.readFile(schemaPath, "utf8");
  await getPool().query(schema);
  await runMigrations();
  globalThis.__mtcrystalDbInitialized = true;
}
