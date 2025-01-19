import { exec } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import piko from "picocolors";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const distDir = join(__dirname, "..", "dist");
const publicDir = join(__dirname, "..", "public");
const membersDir = join(__dirname, "../..", "data");

const main = async () => {
  if (process.platform === "win32") {
    console.error(piko.red("このコマンドはWindowsでは実行できません。"));
    process.exit(1);
  }

  try {
    await mkdir(distDir);

    console.log("Building...");
    console.log("Copying public files...");
    await new Promise((resolve, reject) => {
      exec(`cp -r ${publicDir}/* ${distDir}`, (err, stdout, stderr) => {
        if (err) {
          console.error(piko.red("予期せぬエラーが発生しました。"));
          console.error(err);
          process.exit(1);
        }
        if (stdout) console.log(stdout);
        if (stderr) console.error(stderr);
        resolve(stdout);
      });
    });
    console.log("Rollup members files...");
    const members = await readdir(membersDir);
    const membersInfo = (
      await Promise.all(
        members.map(async (member) => {
          if (!member.endsWith(".json")) return;
          const memberFile = join(membersDir, member);
          const memberInfoJSON = await readFile(memberFile);
          const memberInfo = JSON.parse(memberInfoJSON.toString());
          memberInfo.$schema = undefined;
          return memberInfo;
        })
      )
    )
      .filter(Boolean)
      .sort((a, b) => Number.parseInt(a.id, 10) - Number.parseInt(b.id, 10));
    const membersInfoJSON = JSON.stringify(membersInfo);
    await writeFile(join(distDir, "index.json"), membersInfoJSON, "utf-8");
    console.log("Done.");
  } catch (e) {
    console.error(piko.red("予期せぬエラーが発生しました。"));
    console.error(e);
    process.exit(1);
  }
};

main();
