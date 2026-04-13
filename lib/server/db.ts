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

export async function ensureDatabaseSetup() {
  if (globalThis.__mtcrystalDbInitialized) {
    return;
  }

  const schemaPath = path.join(process.cwd(), "sql", "schema.sql");
  const schema = await fs.readFile(schemaPath, "utf8");
  await getPool().query(schema);
  globalThis.__mtcrystalDbInitialized = true;
}
