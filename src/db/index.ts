import "https://deno.land/x/dotenv@v3.2.2/load.ts";
import postgres from "https://deno.land/x/postgresjs@v3.3.5/mod.js";

// We use PostgresJS here so that we have a much easier time running on serverless
// or deploy / netlify. 

const url = Deno.env.get("DATABASE_URL")

if (url === null) {
    console.error(`DATABASE_URL must point to a valid Neon Project`)
    Deno.exit(1);
}

const sql = postgres(url, { ssl: "require" });
  
export default sql;
