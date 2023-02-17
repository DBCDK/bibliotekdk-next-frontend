/**
 * @file - unit test for some of the function in details section on workpage
 */

import { filterAndMerge } from "@/components/work/details/details.utils";

test("Test_detailsutils", () => {
  let baseArray = [
    {
      fisk: {
        label: "baselabel",
        value: "basevalue",
      },
    },
  ];

  // edge case - extending with null
  let extendingArray = null;
  let output = filterAndMerge({ baseArray, extendingArray });

  expect(output).toEqual(baseArray);
  // edge case - extending with empty array
  extendingArray = [];
  output = filterAndMerge({ baseArray, extendingArray });
  expect(output).toEqual(baseArray);

  // overwrite singe element
  extendingArray = [
    {
      fisk: {
        label: "extendinglabel",
        value: "extendingvalue",
      },
    },
  ];

  output = filterAndMerge({ baseArray, extendingArray });
  expect(output).toEqual(extendingArray);

  // replace an element in base array
  baseArray = [
    {
      fisk: {
        label: "baselabel",
        value: "basevalue",
      },
    },
    {
      hest: {
        label: "baselabel-1",
        value: "basevalue-1",
      },
    },
  ];

  let expected = [
    {
      fisk: {
        label: "extendinglabel",
        value: "extendingvalue",
      },
    },
    {
      hest: {
        label: "baselabel-1",
        value: "basevalue-1",
      },
    },
  ];
  output = filterAndMerge({ baseArray, extendingArray });
  expect(output).toEqual(expected);

  // replace middle element (order is important)
  baseArray = [
    {
      fisk: {
        label: "baselabel",
        value: "basevalue",
      },
    },
    {
      zebra: {
        label: "zebra-1",
        value: "zebravalue-1",
      },
    },
    {
      hest: {
        label: "baselabel-1",
        value: "basevalue-1",
      },
    },
  ];
  extendingArray = [
    {
      zebra: {
        label: "extendinglabel",
        value: "extendingvalue",
      },
    },
  ];

  expected = [
    {
      fisk: {
        label: "baselabel",
        value: "basevalue",
      },
    },
    {
      zebra: {
        label: "extendinglabel",
        value: "extendingvalue",
      },
    },
    {
      hest: {
        label: "baselabel-1",
        value: "basevalue-1",
      },
    },
  ];
  output = filterAndMerge({ baseArray, extendingArray });
  expect(output).toEqual(expected);

  // new value in extending
  extendingArray = [
    {
      krokodille: {
        label: "extendinglabel",
        value: "extendingvalue",
      },
    },
  ];
  expected = baseArray = [
    {
      fisk: {
        label: "baselabel",
        value: "basevalue",
      },
    },
    {
      zebra: {
        label: "zebra-1",
        value: "zebravalue-1",
      },
    },
    {
      hest: {
        label: "baselabel-1",
        value: "basevalue-1",
      },
    },
    {
      krokodille: {
        label: "extendinglabel",
        value: "extendingvalue",
      },
    },
  ];
  output = filterAndMerge({ baseArray, extendingArray });
  expect(output).toEqual(expected);
});
