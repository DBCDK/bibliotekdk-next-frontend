import ManifestationParserObject from "../ManifestationParserObject";
import twoRows from "./testmockups/objectWithTwoArray.json";
import twoElements from "./testmockups/objectWithtwoElements.json";
import oneElement from "./testmockups/objectWithOneElement.json";
import { test } from "@jest/globals";

test("Test_splitInColumns method", () => {
  const parser = new ManifestationParserObject({});
  // corner cases empty array
  let input = [];
  let expected = [];
  let output = parser._splitInColumns(input);
  expect(output).toEqual(expected);
  // empty object
  input = {};
  expected = [];
  output = parser._splitInColumns(input);
  expect(output).toEqual(expected);

  // column with two rows
  output = parser._splitInColumns(twoRows);
  // we expect each row to hold one or more elements
  expect(output["col1"]).toBeDefined();
  expect(output["col2"]).toBeDefined();
  expect(output["col1"].length >= 1).toBeTruthy();
  expect(output["col2"].length >= 1).toBeTruthy();

  // two element
  output = parser._splitInColumns(twoElements);
  // we expect both columns to hold one element
  expect(output["col1"].length === 1).toBeTruthy();
  expect(output["col2"].length === 1).toBeTruthy();
  // one element only
  output = parser._splitInColumns(oneElement);
  // we expect column 2 to be empty and column 1 to hold the one element
  expect(output["col1"].length === 1).toBeTruthy();
  expect(output["col2"].length === 0).toBeTruthy();
});
