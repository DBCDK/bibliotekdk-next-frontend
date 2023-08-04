export const dummyData_localizations = {
  hitcount: 10,
  result: [
    { name: "This is some branch name" },
    { name: "This is some other branch name" },
    { name: "This is also a branch name" },
    { name: "A branch name" },
    { name: "Also a bracndh name" },
    { name: "This is some branch name" },
    { name: "This is some other branch name" },
    { name: "This is also a branch name" },
    { name: "A branch name" },
    { name: "Also a bracndh name" },
  ],
};

export const dummyData_localizationsItems_branches = {
  branches: {
    agencyUrl: "http://bibliotek.kk.dk/",
    result: [
      {
        agencyUrl: "no Url",
        name: "Silkeborg Bibliotek",
        branchId: "774000",
        agencyId: "774000",
        holdingStatus: {
          branchId: "774000",
          willLend: "true",
          expectedDelivery: "2021-11-18",
          localHoldingsId: "29317038",
          circulationRule: "Udlån 28 dage",
          issueId: "",
          department: "Børn",
          issueText: "",
          location: "Skønlitteratur",
          note: "",
          readyForLoan: "0",
          status: "OnLoan",
          subLocation: "Fantasy",
        },
      },
    ],
  },
};

export const dummyData_localizationsItems_holdings = {
  717500: {
    branches: {
      agencyUrl: "http://www.rdb.dk",
      result: [
        {
          name: "Rødovre Bibliotek",
          agencyId: "717500",
          branchWebsiteUrl: "http://www.rdb.dk",
          holdingStatus: {
            count: 1,
            lamp: {
              color: "green",
              message: "at_home",
            },
            holdingItems: [
              {
                branch: "Rødovre hovedbibliotek",
                branchId: "717500",
                willLend: "true",
                expectedDelivery: "2021-12-03",
                localHoldingsId: "22137298",
                circulationRule: "Månedslån vok A",
                issueId: "",
                department: "VOKSNE",
                issueText: "",
                location: "KÆLDER",
                note: "",
                readyForLoan: "1",
                status: "OnShelf",
                subLocation: "",
              },
            ],
          },
        },
      ],
    },
    monitor: "OK",
  },
  717501: {
    branches: {
      agencyUrl:
        "https://www.genvej.gentofte.bibnet.dk/sites/RKB/pub/patronstatus.html",
      result: [
        {
          name: "Islev Bibliotek: Trekanten",
          agencyId: "717500",
          branchWebsiteUrl: "http://www.rdb.dk",
          holdingStatus: {
            count: 0,
            lamp: {
              color: "white",
              message: "no_holdings",
            },
            holdingItems: [],
          },
        },
      ],
    },
    monitor: "OK",
  },
  710111: {
    branches: {
      agencyUrl: "http://bibliotek.kk.dk/",
      result: [
        {
          name: "Nørrebro Bibliotek",
          agencyId: "710100",
          branchId: "710111",
          branchWebsiteUrl: "http://bibliotek.kk.dk/biblioteker/norrebro",
          holdingStatus: {
            count: 1,
            lamp: {
              color: "yellow",
              message: "2021-12-03",
            },
            holdingItems: [
              {
                branch: "Nørrebro",
                branchId: "710111",
                willLend: "true",
                expectedDelivery: "2021-12-03",
                localHoldingsId: "22137298",
                circulationRule: "Standard",
                issueId: "",
                department: "Voksen",
                issueText: "",
                location: "",
                note: "",
                readyForLoan: "0",
                status: "OnLoan",
                subLocation: "Skønlitteratur",
              },
            ],
          },
        },
      ],
    },
    monitor: "OK",
  },
};
