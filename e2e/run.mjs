// Run every check file in e2e/checks/ in name order, each in its own process, against the MCP test build.
import { readdirSync } from "fs";
import { join } from "path";

const dir = join(import.meta.dir, "checks");
const only = process.argv.slice(2);
let failed = 0;
for (const f of readdirSync(dir).filter((f) => f.endsWith(".mjs")).sort()) {
  if (only.length && !only.some((o) => f.includes(o))) continue;
  console.log(`## ${f}`);
  const p = Bun.spawnSync(["bun", join(dir, f)], { stdout: "inherit", stderr: "pipe" });
  if (p.exitCode !== 0) { failed++; console.log(`   (exit ${p.exitCode})`); }
}
console.log(failed ? `${failed} check file(s) failed` : "all check files passed");
process.exit(failed ? 1 : 0);
