import { existsSync, readFileSync, statSync } from "fs";
import { resolve } from "path";

import picocolors from "picocolors";
import yargs from "yargs";

import * as logger from "./log";
import schema from "./schema";

const args = yargs
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
  })
  .parseSync();

const { files, verbose } = args;

logger.setVerbose(verbose);

logger.debug("files", files);
logger.debug("cwd", process.cwd());

if (!files || files.length === 0) {
  logger.newline();
  logger.warn("No files to check");
  logger.info("Add --help to see the available options");
  process.exit(0);
}

logger.debug("schema", schema);

for (const file of files) {
  logger.newline();
  const path = resolve(process.cwd(), file);
  logger.info(picocolors.bold(path));

  // Check if the file exists and is a file
  if (!existsSync(path) || !statSync(path).isFile()) {
    logger.error("File not found");
    process.exit(1);
  }

  // Check if the file is a JSON file
  if (!path.endsWith(".json")) {
    logger.error("File is not a JSON file");
    process.exit(1);
  }

  // Check if the file matches the schema
  const fileContent = readFileSync(path, "utf-8");
  logger.debug("fileContent", fileContent);

  // Check if the file is valid JSON
  try {
    JSON.parse(path);
  } catch (error) {
    logger.error("File is not valid JSON");
    process.exit(1);
  }

  // Check if the file matches the schema
  if (schema.safeParse(JSON.parse(fileContent)).success) {
    logger.success("File matches the schema");
  } else {
    logger.error("File does not match the schema");
    process.exit(1);
  }
}
