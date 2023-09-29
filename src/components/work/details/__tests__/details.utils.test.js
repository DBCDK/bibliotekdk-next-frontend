/**
 * @file - unit test for some of the function in details section on workpage
 */

import {
  filterAndMerge,
  getLanguageValues,
} from "@/components/work/details/utils/details.utils";

test("Test get Languages method", () => {
  let manifestation = {};
  let actual = getLanguageValues(manifestation);
  let expected = {};
  expect(actual).toEqual(expected);

  // test main language is taken from original when mains isocode is "mul" (flere sprog)
  manifestation = {
    languages: {
      main: [
        {
          display: "flere sprog",
          isoCode: "mul",
        },
      ],
      original: [
        {
          display: "engelsk",
          isoCode: "eng",
        },
      ],
    },
  };

  actual = getLanguageValues(manifestation);
  expected = { main: "engelsk" };

  // test that main is taken from main when NOT multiple languages
  manifestation = {
    languages: {
      main: [
        {
          display: "fisk",
          isoCode: "dan",
        },
      ],
      original: [
        {
          display: "engelsk",
          isoCode: "eng",
        },
      ],
    },
  };

  actual = getLanguageValues(manifestation);
  expected = { main: "fisk" };

  // test sort - "dansk" should be on top
  manifestation = {
    languages: {
      spoken: [
        {
          display: "svensk",
          isoCode: "swe",
        },
        {
          display: "norsk",
          isoCode: "nor",
        },
        {
          display: "dansk",
          isoCode: "dan",
        },
        {
          display: "finsk",
          isoCode: "fin",
        },
        {
          display: "islandsk",
          isoCode: "ice",
        },
      ],
    },
  };

  actual = getLanguageValues(manifestation);
  expected = {
    main: [],
    spoken: ["dansk", "svensk", "norsk", "finsk", "islandsk"],
    subtitles: [],
  };
  expect(actual).toEqual(expected);
});

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
