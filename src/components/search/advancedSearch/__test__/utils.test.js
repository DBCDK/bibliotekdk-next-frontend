import { checkAndExpandInputFields, convertStateToCql } from "../utils";
import { LogicalOperatorsEnum } from "@/components/search/enums";

test('escapes quotes once when converting a field containing "AND" to CQL', () => {
  const actual = convertStateToCql({
    inputFields: [
      {
        value: '"En baggårds hemmeligheder" AND skalk',
        prefixLogicalOperator: null,
        searchIndex: "term.default",
      },
    ],
  });

  expect(actual).toBe(
    '((term.default="\\"En baggårds hemmeligheder\\"" AND term.default="skalk" ))'
  );
});

test.each([
  ["plain text", "hest", '(term.default="hest")'],
  ["question marks", "hvad?", '(term.default="hvad\\?")'],
  ["backslashes", "C:\\temp", '(term.default="C:\\\\temp")'],
  ["asterisk truncation", "hest*", '(term.default="hest*")'],
])("converts %s to CQL", (_description, value, expected) => {
  const actual = convertStateToCql({
    inputFields: [
      {
        value,
        prefixLogicalOperator: null,
        searchIndex: "term.default",
      },
    ],
  });

  expect(actual).toBe(expected);
});

test("add to inputfields on OR, AND operators", () => {
  // special case - empty array
  let actual = checkAndExpandInputFields([{}]);
  let expected = [{}];
  expect(actual).toEqual(expected);

  // special case - stupid input
  actual = checkAndExpandInputFields(null);
  expected = [];
  expect(actual).toEqual(expected);

  // plain object - no OR, AND operators
  const plain = [
    {
      value: "Robert Fisker",
      prefixLogicalOperator: null,
      searchIndex: "term.default",
    },
  ];

  expected = [
    {
      value: "Robert Fisker",
      prefixLogicalOperator: null,
      searchIndex: "term.default",
    },
  ];

  actual = checkAndExpandInputFields(plain);
  expect(actual).toEqual(expected);

  const plainAND = [
    {
      value: "Robert Fisker AND hest",
      prefixLogicalOperator: null,
      searchIndex: "term.default",
    },
  ];

  // we expect the value to be split in two inputfields
  expected = [
    {
      value: "Robert Fisker",
      prefixLogicalOperator: null,
      searchIndex: "term.default",
      startParenthesis: true,
    },
    {
      startParenthesis: false,
      value: "hest",
      prefixLogicalOperator: LogicalOperatorsEnum.AND,
      searchIndex: "term.default",
      endParenthesis: true,
    },
  ];

  actual = checkAndExpandInputFields(plainAND);
  expect(actual).toEqual(expected);

  // multiple input
  const multiinput = [
    {
      value: "Robert Fisker AND hest",
      prefixLogicalOperator: null,
      searchIndex: "term.default",
    },
    {
      value: "fisk NOT hest",
      prefixLogicalOperator: LogicalOperatorsEnum.OR,
      searchIndex: "term.subject",
    },
  ];

  // we expect each inputfile to be split and the connecting operator to be from previous inputfield
  expected = [
    {
      value: "Robert Fisker",
      prefixLogicalOperator: null,
      searchIndex: "term.default",
      startParenthesis: true,
    },
    {
      endParenthesis: true,
      value: "hest",
      prefixLogicalOperator: LogicalOperatorsEnum.AND,
      searchIndex: "term.default",
      startParenthesis: false,
    },
    {
      startParenthesis: true,
      prefixLogicalOperator: LogicalOperatorsEnum.OR,
      searchIndex: "term.subject",
      value: "fisk",
    },
    {
      endParenthesis: true,
      startParenthesis: false,
      prefixLogicalOperator: "NOT",
      searchIndex: "term.subject",
      value: "hest",
    },
  ];

  actual = checkAndExpandInputFields(multiinput);
  expect(actual).toEqual(expected);

  // now with parentesis
});
