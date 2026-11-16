import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 3,
});

pool.on("error", (err) => {
  console.error("Unexpected Postgres error", err);
});