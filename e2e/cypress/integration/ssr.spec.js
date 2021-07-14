const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");

function getPageHead(path) {
  return cy
    .request({
      url: `${nextjsBaseUrl}${path}`,
      // Imitate a web crawler
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      },
    })
    .its("body")
    .then((html) => {
      return {
        title: html.match(/<title>(.*?)<\/title>/)[1],
        description: html.match(
          /<meta name="description" content="(.*?)"/
        )?.[1],
        "og:url": html.match(/<meta property="og:url" content="(.*?)"/)?.[1],
        "og:title": html.match(
          /<meta property="og:title" content="(.*?)"/
        )?.[1],
        "og:description": html.match(
          /<meta property="og:description" content="(.*?)"/
        )?.[1],
        "og:image": html.match(
          /<meta property="og:image" content="(.*?)"/
        )?.[1],
        alternate: html.match(
          /<link rel=\"alternate\" hreflang=\".*?" href=\".*?"\/>/g
        ),
      };
    });
}
/**
 * Check that the site is server side rendered properly
 */
describe("Server Side Rendering", () => {
  context(`frontpage`, () => {
    it(`has correct metadata`, () => {
      getPageHead("/").then((res) => {
        expect(res.title).to.equal(
          "Bibliotek.dk | Lån fra alle Danmarks biblioteker"
        );
        expect(res.description).to.equal(
          "Én samlet indgang til alle landets biblioteker. Bestil her og hent på dit lokale bibliotek. Lån og reserver bøger, artikler, film, musik, spil, osv."
        );
        expect(res["og:url"]).to.equal("http://localhost:3000/");
        expect(res["og:title"]).to.equal(
          "Bibliotek.dk | Lån fra alle Danmarks biblioteker"
        );
        expect(res["og:description"]).to.equal(
          "Én samlet indgang til alle landets biblioteker. Bestil her og hent på dit lokale bibliotek. Lån og reserver bøger, artikler, film, musik, spil, osv."
        );
        expect(res["og:image"]).to.exist;
      });
    });

    it(`has correct alternate links`, () => {
      getPageHead("/").then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/"/>',
        ]);
      });
    });
  });

  context(`material`, () => {
    it(`has correct metadata`, () => {
      getPageHead(
        "/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763?type=Ebog"
      ).then((res) => {
        expect(res.title).to.equal(
          "Hest, hest, tiger, tiger af Mette E. Neerlin"
        );
        expect(res.description).to.equal(
          "Lån Hest, hest, tiger, tiger som bog, ebog eller lydbog. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online."
        );
        expect(res["og:url"]).to.equal(
          "http://localhost:3000/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763"
        );
        expect(res["og:title"]).to.equal(
          "Hest, hest, tiger, tiger af Mette E. Neerlin"
        );
        expect(res["og:description"]).to.equal(
          "Lån Hest, hest, tiger, tiger som bog, ebog eller lydbog. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online."
        );
        expect(res["og:image"]).to.exist;
      });
    });

    it(`has correct alternate links`, () => {
      getPageHead(
        "/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763?type=Ebog"
      ).then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/materiale/hest%2C-hest%2C-tiger%2C-tiger_mette-e.-neerlin/work-of%3A870970-basis%3A51701763"/>',
        ]);
      });
    });
  });

  context(`artikler`, () => {
    it(`has correct metadata`, () => {
      getPageHead("/artikler").then((res) => {
        expect(res.title).to.equal("Alle artikler | Bibliotek.dk");
        expect(res.description).to.equal(
          "Én samlet indgang til alle landets biblioteker. Bestil her og hent på dit lokale bibliotek. Lån og reserver bøger, artikler, film, musik, spil, osv."
        );
        expect(res["og:url"]).to.equal("http://localhost:3000/artikler");
        expect(res["og:title"]).to.equal("Alle artikler | Bibliotek.dk");
        expect(res["og:description"]).to.equal(
          "Én samlet indgang til alle landets biblioteker. Bestil her og hent på dit lokale bibliotek. Lån og reserver bøger, artikler, film, musik, spil, osv."
        );
        expect(res["og:image"]).to.exist;
      });
    });

    it(`has correct alternate links`, () => {
      getPageHead("/artikler").then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/artikler"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/artikler"/>',
        ]);
      });
    });
  });

  context(`hjaelp`, () => {
    it(`has correct metadata`, () => {
      getPageHead("/hjaelp").then((res) => {
        expect(res.title).to.equal("Hjælp og vejledning | Bibliotek.dk");
        expect(res.description).to.equal(
          "Find hjælp og vejledning til bibliotek.dk omkring fx bestilling, søgning og login."
        );
        expect(res["og:url"]).to.equal("http://localhost:3000/hjaelp");
        expect(res["og:title"]).to.equal("Hjælp og vejledning | Bibliotek.dk");
        expect(res["og:description"]).to.equal(
          "Find hjælp og vejledning til bibliotek.dk omkring fx bestilling, søgning og login."
        );
        expect(res["og:image"]).to.exist;
      });
    });

    it(`has correct alternate links`, () => {
      getPageHead("/hjaelp").then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/hjaelp"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/hjaelp"/>',
        ]);
      });
    });
  });

  context(`hjaelp/faq`, () => {
    it(`has correct metadata`, () => {
      getPageHead("/hjaelp/faq").then((res) => {
        expect(res.title).to.equal("Hjælp og vejledning | Bibliotek.dk");
        expect(res.description).to.equal(
          "Find hjælp og vejledning til bibliotek.dk omkring fx bestilling, søgning og login."
        );
        expect(res["og:url"]).to.equal("http://localhost:3000/hjaelp/faq");
        expect(res["og:title"]).to.equal("Hjælp og vejledning | Bibliotek.dk");
        expect(res["og:description"]).to.equal(
          "Find hjælp og vejledning til bibliotek.dk omkring fx bestilling, søgning og login."
        );
        expect(res["og:image"]).to.exist;
      });
    });

    it(`has correct alternate links`, () => {
      getPageHead("/hjaelp/faq").then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/hjaelp/faq"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/hjaelp/faq"/>',
        ]);
      });
    });
  });

  context(`/hjaelp/find`, () => {
    it(`has correct metadata`, () => {
      getPageHead("/hjaelp/find?q=ost").then((res) => {
        expect(res.title).to.equal("Hjælp og vejledning | Bibliotek.dk");
        expect(res.description).to.equal(
          "Find hjælp og vejledning til bibliotek.dk omkring fx bestilling, søgning og login."
        );
        expect(res["og:url"]).to.equal(
          "http://localhost:3000/hjaelp/find?q=ost"
        );
        expect(res["og:title"]).to.equal("Hjælp og vejledning | Bibliotek.dk");
        expect(res["og:description"]).to.equal(
          "Find hjælp og vejledning til bibliotek.dk omkring fx bestilling, søgning og login."
        );
        expect(res["og:image"]).to.exist;
      });
    });

    it(`has correct alternate links`, () => {
      getPageHead("/hjaelp/find?q=ost").then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/hjaelp/find?q=ost"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/hjaelp/find?q=ost"/>',
        ]);
      });
    });
  });

  context(`find`, () => {
    it(`has correct metadata`, () => {
      getPageHead("/find?q=ost").then((res) => {
        expect(res.title).to.equal(
          "Alle resultater med &quot;ost&quot; | Bibliotek.dk"
        );
        expect(res.description).to.match(
          /Bibliotekerne har i alt \d+ resultater med &quot;ost&quot;. Bibliotek.dk er én samlet indgang til alle landets biblioteker. Bestil her og hent på dit lokale bibliotek. Lån og reserver bøger, artikler, film, musik, spil, osv./
        );
        expect(res["og:url"]).to.equal("http://localhost:3000/find?q=ost");
        expect(res["og:title"]).to.equal(
          "Alle resultater med &quot;ost&quot; | Bibliotek.dk"
        );
        expect(res["og:description"]).to.match(
          /Bibliotekerne har i alt \d+ resultater med &quot;ost&quot;. Bibliotek.dk er én samlet indgang til alle landets biblioteker. Bestil her og hent på dit lokale bibliotek. Lån og reserver bøger, artikler, film, musik, spil, osv./
        );
        expect(res["og:image"]).to.exist;
      });
    });

    it(`has correct alternate links`, () => {
      getPageHead("/find?q=ost&materialtype=movie").then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/find?q=ost&amp;materialtype=movie"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/find?q=ost&amp;materialtype=movie"/>',
        ]);
      });
    });
    it(`hitcount must be greater than 0`, () => {
      getPageHead("/find?q=ost").then((res) => {
        const hitcount = parseInt(
          res.description.match(/i alt (\d+) resultater/)[1],
          10
        );
        expect(hitcount).to.be.greaterThan(0);
      });
    });
    it(`Applying a filter results in lower hitcount`, () => {
      getPageHead("/find?q=ost").then((res) => {
        const hitcount = parseInt(
          res.description.match(/i alt (\d+) resultater/)[1],
          10
        );
        // Applying a filter should result in lower hitcount
        getPageHead("/find?q=ost&materialtype=movie").then((filteredRes) => {
          const filteredHitcount = parseInt(
            filteredRes.description.match(/i alt (\d+) resultater/)[1],
            10
          );
          expect(filteredHitcount).to.be.greaterThan(0);
          expect(hitcount).to.be.greaterThan(filteredHitcount);
        });
      });
    });
  });
});
