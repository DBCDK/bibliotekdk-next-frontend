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
      let jsonld;
      try {
        jsonld = JSON.parse(
          html.match(
            /<script type="application\/ld\+json">(.*?)<\/script>/
          )?.[1]
        );
      } catch (e) {}
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
          /<link rel="alternate" hreflang=".*?" href=".*?"\/>/g
        ),
        jsonld,
      };
    });
}
/**
 * Check that the site is server side rendered properly
 */
describe("Server Side Rendering", () => {
  describe(`frontpage`, () => {
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

  describe(`material`, () => {
    it(`has correct metadata`, () => {
      const descriptionExpectation =
        "Lån Hest, hest, tiger, tiger af Mette E. Neerlin som bog, e-bog eller lydbog. Bestil, reserver, lån fra alle danmarks biblioteker. Afhent på dit lokale bibliotek eller find online.";
      getPageHead(
        "/materiale/hest-hest-tiger-tiger_mette-e-neerlin/work-of:870970-basis:51701763?type=bog"
      ).then((res) => {
        expect(res.title).to.equal(
          "Hest, hest, tiger, tiger af Mette E. Neerlin"
        );
        expect(res.description).to.equal(descriptionExpectation);
        expect(res["og:url"]).to.equal(
          "http://localhost:3000/materiale/hest-hest-tiger-tiger_mette-e-neerlin/work-of:870970-basis:51701763"
        );
        expect(res["og:title"]).to.equal(
          "Hest, hest, tiger, tiger af Mette E. Neerlin"
        );
        expect(res["og:description"]).to.equal(descriptionExpectation);
        expect(res["og:image"]).to.exist;
      });
    });

    it(`has correct alternate links`, () => {
      getPageHead(
        "/materiale/hest-hest-tiger-tiger_mette-e-neerlin/work-of%3A870970-basis%3A51701763?type=e-bog"
      ).then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/materiale/hest-hest-tiger-tiger_mette-e-neerlin/work-of%3A870970-basis%3A51701763"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/materiale/hest-hest-tiger-tiger_mette-e-neerlin/work-of%3A870970-basis%3A51701763"/>',
        ]);
      });
    });

    it(`has json-ld for book`, () => {
      getPageHead(
        "/materiale/hest-hest-tiger-tiger_mette-e-neerlin/work-of%3A870970-basis%3A51701763?type=e-bog"
      ).then((res) => {
        expect(res.jsonld.mainEntity.url).to.equal(
          "http://localhost:3000/materiale/hest-hest-tiger-tiger_mette-e-neerlin/work-of:870970-basis:51701763"
        );
        expect(res.jsonld.mainEntity["@type"]).to.equal("Book");
      });
    });

    it(`has json-ld for article`, () => {
      getPageHead(
        "/materiale/psykopaten-paa-den-hvide-hest_nils-thorsen/work-of%3A870971-avis%3A33301561?type=artikel"
      ).then((res) => {
        expect(res.jsonld.mainEntity.url).to.equal(
          "http://localhost:3000/materiale/psykopaten-paa-den-hvide-hest_nils-thorsen/work-of:870971-avis:33301561"
        );

        expect(res.jsonld.mainEntity["@type"]).to.equal("Article");
        expect(res.jsonld.mainEntity.headLine).to.equal(
          "Psykopaten på den hvide hest"
        );
        expect(res.jsonld.mainEntity.abstract).to.exist;
        expect(res.jsonld.mainEntity.datePublished).to.equal("2008-10-04");
        expect(res.jsonld.mainEntity.publisher).to.deep.equal({
          "@type": "Organization",
          name: "Politiken",
        });
      });
    });

    it(`has json-ld for movie`, () => {
      getPageHead(
        "/materiale/junglebogen_jon-favreau/work-of:870970-basis:52331080"
      ).then((res) => {
        expect(res.jsonld.mainEntity.url).to.equal(
          "http://localhost:3000/materiale/junglebogen_jon-favreau/work-of:870970-basis:52331080"
        );

        expect(res.jsonld.mainEntity["@type"]).to.equal("Movie");
        expect(res.jsonld.mainEntity.name).to.equal("Junglebogen");
        expect(res.jsonld.mainEntity.image).to.exist;
        expect(res.jsonld.mainEntity.director).to.deep.equal([
          {
            "@type": "Person",
            name: "Jon Favreau",
          },
        ]);
        expect(res.jsonld.mainEntity.actor).to.deep.equal([
          { "@type": "Person", name: "Neel Sethi" },
        ]);
      });
    });

    it(`has json-ld for creative work`, () => {
      getPageHead(
        "/materiale/title_author/work-of%3A870970-basis%3A53189148?type=node"
      ).then((res) => {
        expect(res.jsonld.mainEntity.url).to.equal(
          // Redirect to proper, persistent workId
          "http://localhost:3000/materiale/midt-i-en-droem_vagn-noergaard/work-of:800010-katalog:99122931235705763"
        );

        expect(res.jsonld.mainEntity["@type"]).to.equal("CreativeWork");
        expect(res.jsonld.mainEntity.name).to.equal("Midt i en drøm");
        expect(res.jsonld.mainEntity.image).to.exist;
        expect(res.jsonld.mainEntity.creator).to.deep.equal([
          { "@type": "Person", name: "Vagn Nørgaard" },
        ]);
      });
    });
  });

  describe(`artikler`, () => {
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

  describe(`hjaelp`, () => {
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

  describe(`hjaelp/faq`, () => {
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

  describe(`/hjaelp/find`, () => {
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

  describe(`find`, () => {
    it(`has correct metadata`, () => {
      getPageHead("/find?q.all=ost").then((res) => {
        expect(res.title).to.equal(
          "Alle resultater med &quot;ost&quot; | Bibliotek.dk"
        );
        expect(res.description).to.match(
          /Bibliotekerne har i alt \d+ resultater med &quot;ost&quot;. Bibliotek.dk er én samlet indgang til alle landets biblioteker. Bestil her og hent på dit lokale bibliotek. Lån og reserver bøger, artikler, film, musik, spil, osv./
        );
        expect(res["og:url"]).to.equal("http://localhost:3000/find?q.all=ost");
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
      getPageHead("/find?q.all=ost&workTypes=movie").then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/find?workTypes=movie&amp;q.all=ost"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/find?workTypes=movie&amp;q.all=ost"/>',
        ]);
      });
    });
    it(`hitcount must be greater than 0`, () => {
      getPageHead("/find?q.all=ost").then((res) => {
        const hitcount = parseInt(
          res.description.match(/i alt (\d+) resultater/)[1],
          10
        );
        expect(hitcount).to.be.greaterThan(0);
      });
    });
    it(`Applying a filter results in lower hitcount`, () => {
      getPageHead("/find?q.all=ost").then((res) => {
        const hitcount = parseInt(
          res.description.match(/i alt (\d+) resultater/)[1],
          10
        );
        // Applying a filter should result in lower hitcount

        // worktype kan ligenu ikke fanges af serverside renderingen af hitcount da fetchAll forventer af router.query indeholder en param som hedder filters
        getPageHead("/find?q.all=ost&workTypes=movie").then((filteredRes) => {
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

  // @TODO pjo outcommented res.title + og:url .. fix later
  describe(`inspiration/material pages`, () => {
    it(`has correct metadata`, () => {
      getPageHead("/inspiration/boeger").then((res) => {
        expect(res.title).to.equal("Bøger");
        expect(res.description).to.exist;
        expect(res["og:url"]).to.equal(
          "http://localhost:3000/inspiration/boeger"
        );
        expect(res["og:title"]).to.equal("Bøger");
        expect(res["og:description"]).to.exist;
        expect(res["og:image"]).to.exist;
      });
    });

    it(`has correct alternate links`, () => {
      getPageHead("/inspiration/boeger").then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/inspiration/boeger"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/inspiration/boeger"/>',
        ]);
      });
    });
  });

  describe(`universe page`, () => {
    it.only(`has correct metadata`, () => {
      getPageHead("/univers/870979:134975679").then((res) => {
        expect(res.title?.toLowerCase()).to.contain("marvel");
        expect(res.description).to.exist;
        expect(res["og:url"]).to.equal(
          "http://localhost:3000/univers/870979:134975679"
        );
        expect(res["og:title"]?.toLowerCase()).to.contain("marvel");
        expect(res["og:description"]).to.exist;
      });
    });
    it.only(`has correct alternate links`, () => {
      getPageHead("/univers/870979:134975679").then((res) => {
        expect(res.alternate).to.deep.equal([
          '<link rel="alternate" hreflang="da" href="http://localhost:3000/univers/870979:134975679"/>',
          '<link rel="alternate" hreflang="en" href="http://localhost:3000/en/univers/870979:134975679"/>',
        ]);
      });
    });
  });
});
