import { parseManifestation } from "../manifestationParser";
import twoRows from "./__fixtures__/objectWithTwoArray.json";
import twoElements from "./__fixtures__/objectWithtwoElements.json";

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

test("uses edition summary for the expanded manifestation", () => {
  const output = parseManifestation({
    edition: {
      edition: "6. udgave",
      summary: "6. udgave, 2. oplag",
    },
  });

  expect(output.find(({ dataField }) => dataField === "edition")?.value).toBe(
    "6. udgave, 2. oplag"
  );
});
