const request = require("superagent");

const authors = require("./870979-parsed.json");
const fs = require("fs");
const enrichedAuthors = require("./enrichedAuthors.json");

export default async function handler(req, res) {
  const { name } = req.query;
  const ok = true;
  //const data = await find(name);
  res.status(ok ? 200 : 500).json({ wikiData: await find(name) });
}

async function find(name) {
  // look in enriched array
  const alreadyFetched = enrichedAuthors.filter(
    (author) => author.name.indexOf(name) !== -1
  );
  if (alreadyFetched.length > 0) {
    return alreadyFetched;
  }

  const fisk = authors.filter((author) => author.name.indexOf(name) !== -1);
  if (fisk.length > 0) {
    const wikidata = await getData(fisk[0].wikiId[0], fisk[0]);
    return wikidata;
  }
}

function writeEnriched() {
  //console.log(enrichedAuthors, "ENRICHED");
  const fs = require("fs");
  let data = JSON.stringify(enrichedAuthors);
  fs.writeFileSync(`enrichedAuthors.json`, data);
}

//});

async function getData(wikiId, author) {
  const data = await load(wikiId);
  //data = {'fisk': 'HEST'};
  //console.log(JSON.stringify(data, null, 4), 'DATA');
  const enriched = { ...author, ...data };
  enrichedAuthors.push(enriched);
  writeEnriched();

  return enriched;
  //console.log(JSON.stringify(enriched, null, 4), 'ENRICHED');
  //return data;
}

function construcQuery(wiki_data_id) {
  let query = `SELECT  ?IMDb_ID ?MUSICBRAINZ_ID ?VIAF_ID ?FACEBOOK ?IMAGE ?HOMEPAGE WHERE {
OPTIONAL {wd:${wiki_data_id} wdt:P345 ?IMDb_ID}.
OPTIONAL {wd:${wiki_data_id} wdt:P434 ?MUSICBRAINZ_ID}. 
OPTIONAL {wd:${wiki_data_id} wdt:P214 ?VIAF_ID}.
OPTIONAL {wd:${wiki_data_id} wdt:P2013 ?FACEBOOK}.
OPTIONAL {wd:${wiki_data_id} wdt:P18 ?IMAGE}.
OPTIONAL {wd:${wiki_data_id} wdt:P856 ?HOMEPAGE}}`;
  return query;
}

async function load(wiki_data_id) {
  const url = "https://query.wikidata.org/sparql?query=";
  const query = construcQuery(wiki_data_id);

  try {
    const response =
      /* await request.get(
           `${url}${query}&format=application%2Fsparql-results%2Bjson`
         )*/
      (
        await request
          .get(`https://query.wikidata.org/sparql?query=${query}&format=json`)
          .set("User-Agent", "node-superagent/1.3.0")
      ).body.results;
    return response;
  } catch (e) {
    console.log(e, "LOAD ERROR");
    throw e;
  }
}
