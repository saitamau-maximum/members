import { existsSync, readFileSync, statSync } from "fs";
import { resolve } from "path";

import picocolors from "picocolors";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import * as logger from "./log";
import schema from "./schema";
import { ERRORS, WARN } from "./const";

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
      logger.error(error);
      return [1, ERRORS.not_valid_json];
    }

    // Check if the file matches the schema
    if (schema.safeParse(JSON.parse(fileContent)).success) {
      logger.success("The file matches the schema");
    } else {
      logger.error(ERRORS.not_match_schema);
      return [1, ERRORS.not_match_schema];
    }
  }

  return [0, ""];
}
