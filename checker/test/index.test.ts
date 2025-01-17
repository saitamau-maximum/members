import { expect, it } from "vitest";

import { main } from "../src/main.js";
import { ERRORS, WARN } from "../src/const.js";

const cwd = process.cwd();

it("should work", async () => {
  expect(await main(cwd, [])).toStrictEqual([0, WARN.no_files]);
});

it("skip file not in members dir", async () => {
  expect(await main(cwd, ["node", "cli.js", "foobar"])).toStrictEqual([0, ""]);
});

it("skip README file", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "../test/README.md"])
  ).toStrictEqual([0, ""]);
});

it("not found", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "test/files/foobar"])
  ).toStrictEqual([1, ERRORS.file_not_found]);
});

it("not file", async () => {
  expect(await main(cwd, ["node", "cli.js", "test/files"])).toStrictEqual([
    1,
    ERRORS.file_not_found,
  ]);
});

it("not json file", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "test/files/foobar.js"])
  ).toStrictEqual([1, ERRORS.not_json_file]);
});

it("invalid json file", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "test/files/not-valid.json"])
  ).toStrictEqual([1, ERRORS.not_valid_json]);
});

it("incorrect schema", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "test/files/incorrect-schema.json"])
  ).toStrictEqual([1, ERRORS.not_match_schema]);
});

it("incorrect schema path", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "test/files/incorrect-path.json"])
  ).toStrictEqual([1, ERRORS.not_correct_schema_path]);
});

it("filename and name not match", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "test/files/incorrect-name.json"])
  ).toStrictEqual([1, ERRORS.name_not_match]);
});

it("invalid id", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "test/files/invalid-id.json"])
  ).toStrictEqual([1, ERRORS.invalid_id]);
});

it("invalid grade", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "test/files/invalid-grade.json"])
  ).toStrictEqual([1, ERRORS.invalid_grade]);
});

it("correct schema", async () => {
  expect(
    await main(cwd, ["node", "cli.js", "test/files/correct-schema.json"])
  ).toStrictEqual([0, ""]);
});

it("multiple files", async () => {
  expect(
    await main(cwd, [
      "node",
      "cli.js",
      "test/files/correct-schema.json",
      "test/files/correct-schema.json",
    ])
  ).toStrictEqual([0, ""]);
});
