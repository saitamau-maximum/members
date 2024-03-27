import { dirname, join } from "path";
import piko from "picocolors";
import { mkdir, readFile, readdir, writeFile } from "fs/promises";
import { exec } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const distDir = join(__dirname, "..", "dist");
const publicDir = join(__dirname, "..", "public");
const membersDir = join(__dirname, "../..", "members");

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
          delete memberInfo["$schema"];
          return memberInfo;
        })
      )
    ).filter(Boolean);
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
