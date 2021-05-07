import { sortReviews } from "../utils";
import { test } from "@jest/globals";
import allReviews from "./allreviewtypes.json";

test("Test_sortReviews", () => {
  // corner cases empty array
  let input = [];
  let expected = [];
  let output = sortReviews(input);
  expect(output).toEqual(expected);
  // empty object
  input = {};
  expected = [];
  output = sortReviews(input);
  expect(output).toEqual(expected);

  input = allReviews;
  output = sortReviews(input);
  expect(output).toMatchSnapshot();
});
