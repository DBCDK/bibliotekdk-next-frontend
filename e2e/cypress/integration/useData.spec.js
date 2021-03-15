/**
 * @file
 * Test functionality of the useData hook.
 * See the api.stories.js file to make sense of these tests
 */
describe("Testing useData hook", () => {
  it(`is able to fetch data, showing the different load states`, () => {
    cy.visit("/iframe.html?id=hooks-usedata--fetching-data&viewMode=story");
    cy.contains("loader");
    cy.contains("langsomt");
    cy.contains("Doppler");
  });

  it(`shows error`, () => {
    cy.visit(
      "/iframe.html?id=hooks-usedata--error-fetching-data&viewMode=story"
    );
    cy.contains("error");
  });

  it(`same query should not create doublet entries in client state`, () => {
    cy.visit(
      "/iframe.html?id=hooks-usedata--exposing-client-state&viewMode=story"
    );
    cy.get("[data-cy=client-state]").then((el) => {
      const state = JSON.parse(el.text());

      const expected = {
        '{"query":"query ($workId: String!) {\\n    manifestation(pid: $workId) {\\n      title\\n    }\\n  }\\n  ","variables":{"workId":"870970-basis:51883322"}}': {
          data: { manifestation: { title: "Doppler : roman" } },
        },
      };
      expect(state).to.deep.equal(expected);
    });
  });

  it(`should show multiple entries in client state`, () => {
    cy.visit(
      "/iframe.html?id=hooks-usedata--exposing-client-state-multiple-entries&viewMode=story"
    );
    cy.get("[data-cy=client-state]").then((el) => {
      const state = JSON.parse(el.text());
      // console.log(JSON.stringify(state));

      const expected = {
        '{"query":"query ($workId: String!) {\\n    manifestation(pid: $workId) {\\n      title\\n    }\\n  }\\n  ","variables":{"workId":"870970-basis:51883322"}}': {
          data: { manifestation: { title: "Doppler : roman" } },
        },
        '{"query":"query ($workId: String!) {\\n    manifestation(pid: $workId) {\\n      title\\n    }\\n  }\\n  ","variables":{"workId":"870970-basis:46578295"}}': {
          data: {
            manifestation: { title: "Egne rækker : et muntert tidsbillede" },
          },
        },
      };
      expect(state).to.deep.equal(expected);
    });
  });

  it(`should show error in client state`, () => {
    cy.visit(
      "/iframe.html?id=hooks-usedata--exposing-client-state-with-error&viewMode=story"
    );
    cy.get("[data-cy=client-state]").then((el) => {
      const state = JSON.parse(el.text());
      // console.log(JSON.stringify(state));

      const expected = {
        '{"query":"query ($workId: String!) {\\n    manifestation(pid: $workId) {\\n      title\\n    }\\n  }\\n  ","variables":{}}': {
          data: {},
          error: [
            {
              message:
                'Variable "$workId" of required type "String!" was not provided.',
              locations: [{ line: 1, column: 8 }],
            },
          ],
        },
      };
      expect(state).to.deep.equal(expected);
    });
  });
});
