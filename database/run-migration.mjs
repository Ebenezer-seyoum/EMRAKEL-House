import { readFile } from "node:fs/promises";
import { Client } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const migrationPath = process.argv[2] || "database/migrations/001_initial_emrakel.sql";

if (!databaseUrl) {
  console.error("DATABASE_URL is required.");
  process.exit(1);
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

try {
  const sql = await readFile(migrationPath, "utf8");
  await client.connect();
  await client.query(sql);
  const { rows } = await client.query(`
    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in (
        'profiles',
        'site_settings',
        'menu_categories',
        'menu_items',
        'gallery_images',
        'table_bookings',
        'orders',
        'order_items'
      )
    order by table_name;
  `);

  console.log(`Migration completed. Tables found: ${rows.map((row) => row.table_name).join(", ")}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
