import {
  AvailabilityEnum,
  checkAvailableLater,
  checkAvailableNever,
  checkAvailableNow,
  checkUnknownAvailability,
  compareDate,
  dateIsToday,
  enrichBranches,
  getAvailability,
  getAvailabilityAccumulated,
  getExpectedDeliveryAccumulatedFromHoldings,
  getHoldingsWithInfoOnPickupAllowed,
  HoldingStatusEnum,
  publicLibraryDoesNotOwn,
  sortByAvailability,
} from "@/components/hooks/useHandleAgencyAccessData";
import { dateObjectToDateOnlyString } from "@/utils/datetimeConverter";

const today = dateObjectToDateOnlyString(new Date());
const tomorrow = dateObjectToDateOnlyString(
  new Date(Date.now() + 24 * 60 * 60 * 1000)
);
const never = "never";

describe("dataIsToday", () => {
  it("should find out if today is today", () => {
    const actual = dateIsToday(today);
    const expected = true;

    expect(actual).toEqual(expected);
  });

  it("should find out earlier that today is not today", () => {
    const actual = dateIsToday(tomorrow);
    const expected = false;

    expect(actual).toEqual(expected);
  });

  it("should find out that null is not today", () => {
    const actual = dateIsToday(null);
    const expected = false;

    expect(actual).toEqual(expected);
  });

  it("should find out that undefined is not today", () => {
    const actual = dateIsToday(undefined);
    const expected = false;

    expect(actual).toEqual(expected);
  });

  it("should find out that a number is not today", () => {
    const actual = dateIsToday(2131241);
    const expected = false;

    expect(actual).toEqual(expected);
  });
});

describe("checkAvailableNow", () => {
  it("available item in danishPublicLibrary is available", () => {
    const item = {
      agencyId: "789123",
      expectedDelivery: today,
      status: HoldingStatusEnum.ON_SHELF,
    };
    const actual = checkAvailableNow(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("item in danishPublicLibrary, expectedDelivery earlier, status ON_SHELF, is NOT available", () => {
    const item = {
      agencyId: "789123",
      expectedDelivery: tomorrow,
      status: HoldingStatusEnum.ON_SHELF,
    };
    const actual = checkAvailableNow(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("item in danishPublicLibrary, status not ON_SHELF, expectedDelivery today, is NOT available", () => {
    const item = {
      agencyId: "789123",
      expectedDelivery: today,
      status: HoldingStatusEnum.ON_LOAN,
    };
    const actual = checkAvailableNow(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("item in NOT danishPublicLibrary, status ON_LOAN, expectedDelivery today, IS available", () => {
    const item = {
      agencyId: "891234",
      expectedDelivery: today,
      status: HoldingStatusEnum.ON_LOAN,
    };
    const actual = checkAvailableNow(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("item in NOT danishPublicLibrary, status ON_LOAN, expectedDelivery 'never', IS NOT available", () => {
    const item = {
      agencyId: "891234",
      expectedDelivery: never,
      status: HoldingStatusEnum.ON_LOAN,
    };
    const actual = checkAvailableNow(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe("checkAvailableLater", () => {
  it("available item in danishPublicLibrary is also available later", () => {
    const item = {
      agencyId: "789123",
      expectedDelivery: today,
      status: HoldingStatusEnum.ON_SHELF,
    };
    const actual = checkAvailableLater(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("item in danishPublicLibrary, expectedDelivery tomorrow, status ON_SHELF, IS available later", () => {
    const item = {
      agencyId: "789123",
      expectedDelivery: tomorrow,
      status: HoldingStatusEnum.ON_SHELF,
    };
    const actual = checkAvailableLater(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("item in danishPublicLibrary, status ON_LOAN, expectedDelivery tomorrow, IS available later", () => {
    const item = {
      agencyId: "789123",
      expectedDelivery: tomorrow,
      status: HoldingStatusEnum.ON_LOAN,
    };
    const actual = checkAvailableLater(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("item in danishPublicLibrary, status NOT_FOR_LOAN, expectedDelivery today, IS NOT available later", () => {
    const item = {
      agencyId: "789123",
      expectedDelivery: today,
      status: HoldingStatusEnum.NOT_FOR_LOAN,
    };
    const actual = checkAvailableLater(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("item in not danishPublicLibrary, status ON_LOAN, expectedDelivery today, IS available later", () => {
    const item = {
      agencyId: "891234",
      expectedDelivery: today,
      status: HoldingStatusEnum.ON_LOAN,
    };
    const actual = checkAvailableLater(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("item in not danishPublicLibrary, status ON_LOAN, expectedDelivery 'never', IS NOT available later", () => {
    const item = {
      agencyId: "891234",
      expectedDelivery: never,
      status: HoldingStatusEnum.ON_LOAN,
    };
    const actual = checkAvailableLater(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe("checkAvailableNever", () => {
  it("item status NOT_FOR_LOAN, is never available", () => {
    const item = {
      expectedDelivery: today,
      status: HoldingStatusEnum.NOT_FOR_LOAN,
    };
    const actual = checkAvailableNever(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("item expectedDelivery 'never', status ON_SHELF, is never available", () => {
    const item = {
      expectedDelivery: never,
      status: HoldingStatusEnum.ON_SHELF,
    };
    const actual = checkAvailableNever(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("item expectedDelivery today, status ON_SHELF, is NOT never available", () => {
    const item = {
      expectedDelivery: today,
      status: HoldingStatusEnum.ON_SHELF,
    };
    const actual = checkAvailableNever(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe("publicLibraryDoesNotOwn", () => {
  it("publicLibrary with holdings", () => {
    const item = {
      agencyId: "789123",
    };
    const actual = publicLibraryDoesNotOwn(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("publicLibrary without holdings", () => {
    const item = {
      agencyId: "789123",
      noHoldingsFlag: true,
    };
    const actual = publicLibraryDoesNotOwn(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("non-publicLibrary with holdings", () => {
    const item = {
      agencyId: "891234",
    };
    const actual = publicLibraryDoesNotOwn(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("non-publicLibrary with holdings", () => {
    const item = {
      agencyId: "891234",
      noHoldingsFlag: true,
    };
    const actual = publicLibraryDoesNotOwn(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
});

describe("checkUnknownAvailability", () => {
  it("expectedDelivery is null, has unknown availability", () => {
    const item = {
      expectedDelivery: null,
    };
    const actual = checkUnknownAvailability(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("expectedDelivery is undefined, has unknown availability", () => {
    const item = {
      expectedDelivery: undefined,
    };
    const actual = checkUnknownAvailability(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
  it("item expectedDelivery 'never', has NOT unknown availability", () => {
    const item = {
      expectedDelivery: never,
    };
    const actual = checkUnknownAvailability(item);
    const expected = false;
    expect(actual).toEqual(expected);
  });
  it("item expectedDelivery a number, has unknown availability", () => {
    const item = {
      expectedDelivery: 1322141,
    };
    const actual = checkUnknownAvailability(item);
    const expected = true;
    expect(actual).toEqual(expected);
  });
});

describe("getAvailabilityAccumulated", () => {
  it("is accumulated available now", () => {
    const availability = {
      [AvailabilityEnum.NOW]: 1,
      [AvailabilityEnum.LATER]: 1,
      [AvailabilityEnum.NEVER]: 1,
      [AvailabilityEnum.UNKNOWN]: 1,
    };
    const actual = getAvailabilityAccumulated(availability);
    const expected = AvailabilityEnum.NOW;
    expect(actual).toEqual(expected);
  });
  it("is accumulated available later", () => {
    const availability = {
      [AvailabilityEnum.NOW]: 0,
      [AvailabilityEnum.LATER]: 1,
      [AvailabilityEnum.NEVER]: 1,
      [AvailabilityEnum.UNKNOWN]: 1,
    };
    const actual = getAvailabilityAccumulated(availability);
    const expected = AvailabilityEnum.LATER;
    expect(actual).toEqual(expected);
  });
  it("is accumulated available never", () => {
    const availability = {
      [AvailabilityEnum.NOW]: 0,
      [AvailabilityEnum.LATER]: 0,
      [AvailabilityEnum.NEVER]: 1,
      [AvailabilityEnum.UNKNOWN]: 1,
    };
    const actual = getAvailabilityAccumulated(availability);
    const expected = AvailabilityEnum.NEVER;
    expect(actual).toEqual(expected);
  });
  it("is accumulated available unknown", () => {
    const availability = {
      [AvailabilityEnum.NOW]: 0,
      [AvailabilityEnum.LATER]: 0,
      [AvailabilityEnum.NEVER]: 0,
      [AvailabilityEnum.UNKNOWN]: 1,
    };
    const actual = getAvailabilityAccumulated(availability);
    const expected = AvailabilityEnum.UNKNOWN;
    expect(actual).toEqual(expected);
  });
  it("is accumulated available not owned", () => {
    const availability = {
      [AvailabilityEnum.NOW]: 0,
      [AvailabilityEnum.LATER]: 0,
      [AvailabilityEnum.NEVER]: 0,
      [AvailabilityEnum.NOT_OWNED]: 1,
      [AvailabilityEnum.UNKNOWN]: 1,
    };
    const actual = getAvailabilityAccumulated(availability);
    const expected = AvailabilityEnum.NOT_OWNED;
    expect(actual).toEqual(expected);
  });
});

describe("getAvailability", () => {
  it("available now 1, available later 1, available never 1, available unknown 1", () => {
    const base = { agencyId: "789123", status: HoldingStatusEnum.ON_SHELF };

    const items = [
      { ...base, expectedDelivery: today },
      { ...base, expectedDelivery: tomorrow },
      { ...base, expectedDelivery: never },
      { ...base, noHoldingsFlag: true },
      { ...base, expectedDelivery: null },
    ];
    const actual = getAvailability(items);
    const expected = {
      [AvailabilityEnum.NOW]: 1,
      [AvailabilityEnum.LATER]: 1,
      [AvailabilityEnum.NEVER]: 1,
      [AvailabilityEnum.NOT_OWNED]: 1,
      [AvailabilityEnum.UNKNOWN]: 1,
    };
    expect(actual).toEqual(expected);
  });
});

describe("getExpectedDeliveryAccumulatedFromHoldings", () => {
  it("should give available now", () => {
    const items = [
      { expectedDelivery: today },
      { expectedDelivery: tomorrow },
      { expectedDelivery: never },
      { expectedDelivery: null },
    ];

    const actual = getExpectedDeliveryAccumulatedFromHoldings(items);
    expect(actual).toEqual(today);
  });
  it("should give available later", () => {
    const items = [
      { expectedDelivery: tomorrow },
      { expectedDelivery: never },
      { expectedDelivery: null },
    ];

    const actual = getExpectedDeliveryAccumulatedFromHoldings(items);
    expect(actual).toEqual(tomorrow);
  });
  it("should give available never", () => {
    const items = [{ expectedDelivery: never }, { expectedDelivery: null }];

    const actual = getExpectedDeliveryAccumulatedFromHoldings(items);
    expect(actual).toEqual(never);
  });
  it("should give available unknown", () => {
    const items = [{ expectedDelivery: null }];

    const actual = getExpectedDeliveryAccumulatedFromHoldings(items);
    expect(actual).toEqual(null);
  });
});

describe("getHoldingsWithInfoOnPickupAllowed", () => {
  it("enrich 1 holdingsItems with pickupAllowed", () => {
    const branch = {
      pickupAllowed: true,
      agencyId: "789000",
      holdingItems: [
        {
          branchId: "789123",
        },
      ],
    };
    const actual = getHoldingsWithInfoOnPickupAllowed(branch);
    const expected = [
      {
        branchId: "789123",
        pickupAllowed: true,
        agencyId: "789000",
      },
    ];
    expect(actual).toEqual(expected);
  });
  it("enrich multiple holdingsItems with pickupAllowed", () => {
    const branch = {
      pickupAllowed: true,
      agencyId: "789000",
      holdingItems: [
        {
          branchId: "789123",
        },
        {
          branchId: "789789",
        },
      ],
    };
    const actual = getHoldingsWithInfoOnPickupAllowed(branch);
    const expected = [
      {
        branchId: "789123",
        pickupAllowed: true,
        agencyId: "789000",
      },
      {
        branchId: "789789",
        pickupAllowed: true,
        agencyId: "789000",
      },
    ];
    expect(actual).toEqual(expected);
  });
  it("enrich 0 holdingsItems with pickupAllowed", () => {
    const branch = {
      pickupAllowed: true,
      agencyId: "789000",
      holdingItems: [],
    };
    const actual = getHoldingsWithInfoOnPickupAllowed(branch);
    const expected = [];
    expect(actual).toEqual(expected);
  });
});

describe("sortByAvailability", () => {
  it("pickupAllowed false last", () => {
    const a = { pickupAllowed: true };
    const b = { pickupAllowed: false };
    const actual = sortByAvailability(a, b);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("available now before later", () => {
    const a = { availabilityAccumulated: AvailabilityEnum.NOW };
    const b = { availabilityAccumulated: AvailabilityEnum.LATER };
    const actual = sortByAvailability(a, b);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("available later before never", () => {
    const a = { availabilityAccumulated: AvailabilityEnum.LATER };
    const b = { availabilityAccumulated: AvailabilityEnum.NEVER };
    const actual = sortByAvailability(a, b);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("available never before unknown", () => {
    const a = { availabilityAccumulated: AvailabilityEnum.NEVER };
    const b = { availabilityAccumulated: AvailabilityEnum.UNKNOWN };
    const actual = sortByAvailability(a, b);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("available later after now", () => {
    const a = { availabilityAccumulated: AvailabilityEnum.LATER };
    const b = { availabilityAccumulated: AvailabilityEnum.NOW };
    const actual = sortByAvailability(a, b);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("available never after later", () => {
    const a = { availabilityAccumulated: AvailabilityEnum.NEVER };
    const b = { availabilityAccumulated: AvailabilityEnum.LATER };
    const actual = sortByAvailability(a, b);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("available unknown after later", () => {
    const a = { availabilityAccumulated: AvailabilityEnum.UNKNOWN };
    const b = { availabilityAccumulated: AvailabilityEnum.NEVER };
    const actual = sortByAvailability(a, b);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
});

describe("enrichBranches", () => {
  it("empty holdings with branch pickupAllowed true, get availabilityAccumulated unknown", () => {
    const branch = {
      expectedDelivery: today,
      agencyId: "890000",
      pickupAllowed: true,
      holdingItems: [],
    };
    const actual = enrichBranches(branch).availabilityAccumulated;
    const expectedAvailabilityAccumulated = AvailabilityEnum.UNKNOWN;
    expect(actual).toEqual(expectedAvailabilityAccumulated);
  });
});

describe("compareDate", () => {
  it("Not a and not b gives 0", () => {
    const actual = compareDate(null, null);
    const expected = 0;
    expect(actual).toEqual(expected);
  });
  it("Not a and yes b gives 1", () => {
    const actual = compareDate(null, tomorrow);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Yes a and not b gives -1", () => {
    const actual = compareDate(tomorrow, null);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("Today a and tomorrow b gives -1", () => {
    const actual = compareDate(today, tomorrow);
    const expected = -1;
    expect(actual).toEqual(expected);
  });
  it("Tomorrow a and today b gives 1", () => {
    const actual = compareDate(tomorrow, today);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
  it("Never a and today b gives 1", () => {
    const actual = compareDate(never, today);
    const expected = 1;
    expect(actual).toEqual(expected);
  });
});
