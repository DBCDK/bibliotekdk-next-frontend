import { parseManifestation } from "../manifestationParser";
import twoRows from "./testmockups/objectWithTwoArray.json";
import twoElements from "./testmockups/objectWithtwoElements.json";
import oneElement from "./testmockups/objectWithOneElement.json";
import { test } from "@jest/globals";

test("Test_parseManifestation", () => {
  // corner cases empty array
  let input = [];
  let expected = [];
  let output = parseManifestation(input);
  expect(output).toEqual(expected);
  // empty object
  input = {};
  expected = [];
  output = parseManifestation(input);
  expect(output).toEqual(expected);

  // column with two rows
  output = parseManifestation(twoRows);

  // we expect each row to hold one or more elements
  expect(output).toMatchSnapshot();

  // two element
  output = parseManifestation(twoElements);
  expect(output).toMatchSnapshot();
});
