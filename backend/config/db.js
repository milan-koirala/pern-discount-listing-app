import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const {
  PGHOST,
  PGDATABASE,
  PGUSER,
  PGPASSWORD,
  PGPORT = 5432,  // Optional: default Postgres port
} = process.env;

// // environment variables set garera sql connection gareko
const connectionString = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGPORT}/${PGDATABASE}?sslmode=require`;

// Export the sql instance for queries
export const sql = neon(connectionString);
