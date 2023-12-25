import { existsSync, readFileSync, statSync } from "fs";
import { resolve, sep } from "path";

import picocolors from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as logger from "./log";
import schema from "./schema";
import { ERRORS, INFO, WARN } from "./const";

export async function main(
  cwd: string,
  argv: string[]
): Promise<[number, string]> {
  const args = yargs(hideBin(argv))
    .command("* [files...]", "check if the given files match the schema")
    .option("verbose", {
      alias: "v",
      describe: "print more information",
      type: "boolean",
      default: false,
    })
    .positional("files", {
      describe: "the JSON files to check",
      type: "string",
      array: true,
    }).argv;

  const { files, verbose } = args instanceof Promise ? await args : args;

  logger.setVerbose(verbose);

  logger.debug("files", files);
  logger.debug("cwd", cwd);
  const correctSchemaPath = resolve(
    __filename,
    "..",
    "..",
    "..",
    "members.schema.json"
  );
  logger.debug("correctSchemaPath", correctSchemaPath);

  const membersDir = resolve(__filename, "..", "..", "..", "members");
  logger.debug("membersDir", membersDir);

  if (!files || files.length === 0) {
    logger.newline();
    logger.warn(WARN.no_files);
    logger.info("Add --help to see the available options");
    return [0, WARN.no_files];
  }

  logger.debug("schema", schema);

  for (const file of files) {
    logger.newline();
    const path = resolve(cwd, file);
    logger.info(picocolors.bold(path));

    if (!path.startsWith(membersDir) && !path.includes(`test${sep}files`)) {
      logger.info(INFO.skip_not_in_members_dir);
      continue;
    }

    // Check if the file exists and is a file
    if (!existsSync(path) || !statSync(path).isFile()) {
      logger.error(ERRORS.file_not_found);
      return [1, ERRORS.file_not_found];
    }

    // Check if the file is a JSON file
    if (!path.endsWith(".json")) {
      logger.error(ERRORS.not_json_file);
      return [1, ERRORS.not_json_file];
    }

    // Check if the file matches the schema
    const fileContent = readFileSync(path, "utf-8");
    logger.debug("fileContent", fileContent);

    // Check if the file is valid JSON
    try {
      JSON.parse(fileContent);
    } catch (error) {
      logger.error(ERRORS.not_valid_json);
      return [1, ERRORS.not_valid_json];
    }

    // Check if the file matches the schema
    const parsed = schema.safeParse(JSON.parse(fileContent));
    if (!parsed.success) {
      logger.error(ERRORS.not_match_schema);
      return [1, ERRORS.not_match_schema];
    }

    // Check if the schema is correct
    const schemaPath = resolve(cwd, file, parsed.data.$schema);
    logger.debug("schemaPath", schemaPath);

    if (schemaPath !== correctSchemaPath) {
      logger.error(ERRORS.not_correct_schema_path);
      return [1, ERRORS.not_correct_schema_path];
    }

    // Check if the filename matches the name
    if (parsed.data.name !== file.replace(".json", "").split("/").pop()) {
      logger.error(ERRORS.name_not_match);
      return [1, ERRORS.name_not_match];
    }

    // Check if the id is correct
    if (!/^[1-9][0-9]+$/.test(parsed.data.id)) {
      logger.error(ERRORS.invalid_id);
      logger.info("hint: the id only contains numbers");
      logger.info(
        "  see the GitHub Settings: https://github.com/settings/emails"
      );
      logger.info(
        "    and you'll find the email address like: [id]+[username]@users.noreply.github.com"
      );
      return [1, ERRORS.invalid_id];
    }

    // Check if the grade is correct
    for (const grade of parsed.data.grade) {
      if (!/^[0-9]{2}[BMD]$/.test(grade)) {
        logger.error(ERRORS.invalid_grade, "for:", grade);
        logger.info(
          "hint: the grade only contains 2-digit number and B, M or D (uppercase)"
        );
        return [1, ERRORS.invalid_grade];
      }
    }

    logger.success("The file matches the schema");
  }

  return [0, ""];
}
