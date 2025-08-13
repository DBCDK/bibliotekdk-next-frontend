// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const fbiApiPath = Cypress.env("fbiApiPath");
require("cypress-plugin-tab");
require("@frsource/cypress-plugin-visual-regression-diff");

/**
 * Tabs function
 * @param {number} n // n is number of tabs -> default to 1
 *
 */
Cypress.Commands.add("tabs", (n = 1) => {
  for (let i = 0; i < Number(n); i++) {
    cy.tab();
  }
});

Cypress.Commands.add("visitWithConsoleSpy", (url) => {
  cy.visit(url);
  cy.window()
    .its("console")
    .then((console) => {
      cy.spy(console, "debug").as("log");
    });
});

Cypress.Commands.add("verifyMatomoEvent", (event) => {
  cy.window().then((window) => {
    expect(window?._paq?.[0], "Verifying matomo event").to.deep.equal(event);
    window._paq = [];
  });
});

Cypress.Commands.add("getConsoleEntry", (match) => {
  return cy
    .get("@log")
    .invoke("getCalls")
    .then((calls) => {
      const filtered = calls.filter((call) => call.args[0] === match);

      return filtered?.length > 0 ? filtered[filtered.length - 1].args : null;
    });
});

Cypress.Commands.add("login", () => {
  cy.intercept("/api/auth/session", {
    body: {
      user: {
        uniqueId: "3ad8276b-43ed-430e-891d-3238996da656",
        agencies: [
          { agencyId: "190110", userId: "lkh@dbc.dk", userIdType: "LOCAL" },
          { agencyId: "191977", userId: "10003", userIdType: "LOCAL" },
          { agencyId: "191977", userId: "0102033696", userIdType: "CPR" },
          { agencyId: "790900", userId: "C04122017435", userIdType: "LOCAL" },
        ],
      },
      expires: "2021-06-26T07:00:09.408Z",
      accessToken: "dummy-token",
    },
  });
  cy.fixture("user.json").then((fixture) => {
    cy.intercept("POST", `${fbiApiPath}`, (req) => {
      if (req.body.query.includes("user {")) {
        req.reply(fixture);
      }
    });
  });
});

Cypress.Commands.add("consentAllowAll", () => {
  cy.get("#CybotCookiebotDialog", { timeout: 10000 })
    .should("be.visible")
    .then(($box) => {
      if ($box.is(":visible")) {
        cy.get("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll", {
          timeout: 10000,
        }).click();
      }
    });
});

Cypress.Commands.add("cssVar", (cssVarName) => {
  return cy.document().then((doc) => {
    return window
      .getComputedStyle(doc.body)
      .getPropertyValue(cssVarName)
      .trim();
  });
});
/**
 * matchImageSnapshot
 *
 * Ensures `.modal_dialog` is fully expanded before taking a visual snapshot.
 * Calculates the total height of all descendants, sets it temporarily,
 * takes the snapshot, then restores original styles.
 *
 * Usage:
 *   cy.matchImageSnapshot(options)
 *   cy.get('.modal_container').matchImageSnapshot(options)
 */
Cypress.Commands.add(
  "matchImageSnapshot",
  { prevSubject: "optional" },
  (subject, options = {}) => {
    let originalHeight;
    let originalPosition;

    // Sikrer ingen skalering og ens rendering
    const screenshotDefaults = {
      forceDeviceScaleFactor: false,
      screenshotConfig: {
        capture: "runner",
        scale: false,
        disableTimersAndAnimations: true,
        log: false,
      },
    };

    /** Get max bottom position of all descendants */
    function calculateContentHeight(root) {
      let maxBottom = 0;
      root.querySelectorAll("*").forEach((el) => {
        const bottom = el.offsetTop + el.offsetHeight;
        if (bottom > maxBottom) maxBottom = bottom;
      });
      return maxBottom;
    }

    /** Take snapshot of subject or full page */
    function takeSnapshot() {
      const allOpts = { ...screenshotDefaults, ...options };
      if (subject) {
        return cy.wrap(subject, { log: false }).matchImage(allOpts);
      }
      return cy.matchImage(allOpts);
    }

    // Tilføj lidt CSS for at fjerne animationer og stabilisere font-rendering
    cy.document({ log: false }).then((doc) => {
      const styleId = "__no_scale_style";
      if (!doc.getElementById(styleId)) {
        const style = doc.createElement("style");
        style.id = styleId;
        style.innerHTML = `
          *,*::before,*::after {
            transition: none !important;
            animation: none !important;
          }
          html,body { -webkit-font-smoothing: antialiased; }
        `;
        doc.head.appendChild(style);
      }
    });

    return cy.get("body", { log: false }).then(($body) => {
      const dialog = $body.find(".modal_dialog")[0];

      if (dialog) {
        originalHeight = dialog.style.height;
        originalPosition = dialog.style.position;

        const contentHeight = calculateContentHeight(dialog);
        dialog.style.setProperty("height", `${contentHeight}px`, "important");
        dialog.style.setProperty("position", "absolute", "important");
      }

      return takeSnapshot().then(() => {
        if (dialog) {
          originalHeight
            ? dialog.style.setProperty("height", originalHeight)
            : dialog.style.removeProperty("height");
          originalPosition
            ? dialog.style.setProperty("position", originalPosition)
            : dialog.style.removeProperty("position");
        }
      });
    });
  }
);
