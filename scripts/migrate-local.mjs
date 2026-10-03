import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
const root = process.cwd();
let config;
try {
  config = JSON.parse(readFileSync("dist/server/wrangler.json", "utf8"));
} catch {
  console.error("Run npm run build before applying local migrations.");
  process.exit(1);
}
const db = config.d1_databases?.find((b) => b.binding === "DB");
if (!db) {
  console.error("DB binding is missing from the build.");
  process.exit(1);
}
// A separate ignored config makes the migration directory unambiguous.
mkdirSync(".sites-runtime", { recursive: true });
const temporary = path.join(root, ".sites-runtime", "migration-config.json");
writeFileSync(
  temporary,
  JSON.stringify({
    name: "portfolio-local-migrations",
    compatibility_date: config.compatibility_date,
    d1_databases: [{ ...db, migrations_dir: path.join(root, "drizzle") }],
  }),
);
const result = spawnSync(
  process.execPath,
  [
    "--import",
    path.join(root, "scripts/sites-env.mjs"),
    path.join(root, "node_modules/wrangler/bin/wrangler.js"),
    "d1",
    "migrations",
    "apply",
    "DB",
    "--local",
    "--config",
    temporary,
    "--persist-to",
    path.resolve(root, process.env.D1_LOCAL_STATE || ".wrangler/state"),
  ],
  { stdio: "inherit" },
);
process.exit(result.status ?? 1);
