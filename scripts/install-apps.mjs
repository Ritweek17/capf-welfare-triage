import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, CI: process.env.CI || "true" },
  });

  if (result.status !== 0) {
    if (result.error) console.error(result.error);
    process.exit(result.status ?? 1);
  }
}

run(npm, ["ci"], path.join(root, "capf-welfare-triage/dashboard"));
run(npm, ["ci"], path.join(root, "commander_dashboard/Login design"));
run(
  pnpm,
  ["install", "--frozen-lockfile"],
  path.join(root, "capf-welfare-dashboard-final/capf-welfare-dashboard"),
);
