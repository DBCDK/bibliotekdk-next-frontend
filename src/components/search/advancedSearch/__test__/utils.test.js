import { checkAndExpandInputFields } from "../utils";
import { LogicalOperatorsEnum } from "@/components/search/enums";

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
    },
    {
      value: "hest",
      prefixLogicalOperator: LogicalOperatorsEnum.AND,
      searchIndex: "term.default",
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
    },
    {
      value: "hest",
      prefixLogicalOperator: LogicalOperatorsEnum.AND,
      searchIndex: "term.default",
    },
    {
      prefixLogicalOperator: LogicalOperatorsEnum.OR,
      searchIndex: "term.subject",
      value: "fisk",
    },
    {
      prefixLogicalOperator: "NOT",
      searchIndex: "term.subject",
      value: "hest",
    },
  ];

  actual = checkAndExpandInputFields(multiinput);
  expect(actual).toEqual(expected);
});
