import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const output = path.join(root, "dist");

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    if (result.error) console.error(result.error);
    process.exit(result.status ?? 1);
  }
}

function copyBuild(source, destination) {
  if (!existsSync(source)) {
    throw new Error(`Expected build output was not created: ${source}`);
  }
  mkdirSync(destination, { recursive: true });
  cpSync(source, destination, { recursive: true });
}

run(npm, ["run", "build"], path.join(root, "dashboard"));
run(npm, ["run", "build"], path.join(root, "apps/commander-dashboard"));
run(npm, ["run", "build:client"], path.join(root, "apps/welfare-dashboard"));

rmSync(output, { recursive: true, force: true });
copyBuild(path.join(root, "dashboard/dist"), output);
copyBuild(
  path.join(root, "apps/commander-dashboard/dist"),
  path.join(output, "commander"),
);
copyBuild(
  path.join(root, "apps/welfare-dashboard/dist/public"),
  path.join(output, "welfare"),
);

console.log("Unified Vercel frontend created in dist/.");
