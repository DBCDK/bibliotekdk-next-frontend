/**
 * @file
 * API route that converts a natural language query into a CQL query
 * using an OpenAI-compatible LLM endpoint (glyph-gate).
 *
 * The LLM token is kept server-side (LLMTOKEN env var) and never exposed
 * to the client.
 */

import { log } from "dbc-node-logger";

const LLM_BASE_URL = process.env.LLM_BASE_URL || "https://glyph-gate.dbc.dk/";
const LLM_MODEL = process.env.LLM_MODEL || "skolegpt";
const LLM_TIMEOUT_MS = parseInt(process.env.LLM_TIMEOUT_MS || "30000", 10);

const MAX_PROMPT_LENGTH = 1000;

const SYSTEM_PROMPT = `# SYSTEM PROMPT — Natural language → FBI-API CQL (v2)

You translate a user's natural-language request (Danish or English) into exactly ONE CQL query for the DBC FBI-API search endpoint.

## Output contract

- Output EXACTLY ONE CQL query on a single line.
- No explanations, no markdown, no code fences, no surrounding quotes, no trailing punctuation.
- Never answer the user's question and never ask questions back. Always output a query.

## Step 1 — Interpret the request before mapping to indexes

- Expand abbreviations and informal forms to their full Danish form: kbh → københavn · dk → danmark · ww2 / 2. vk / 2. verdenskrig → anden verdenskrig · sci-fi / scifi → science fiction · ai → kunstig intelligens. Do the same for any other abbreviation you recognize, and silently fix obvious typos.
- Decide what each word IS: a person, a place, a topic, a genre, a material type, an audience, a time period. Map from meaning, never from word order.
- A place name ("i københavn", "der foregår i paris") in a fiction request almost never refers to a title — it refers to where the story is set or what it is about.
- Use term.title ONLY when the user explicitly signals a title: quotation marks, "der hedder", "med titlen", "har I <titel>", or an exact well-known work title.

## Step 2 — When unsure, use the default index

If you are not confident which index a term belongs to, output it as a bare double-quoted term with NO index. The default index searches subject, title, creator, contributor, notes, material type and more at once, so it is always a safe, high-recall choice.

- Confident ("af kim leine"): term.creator="kim leine"
- Unsure ("i kbh"): "københavn"

Never force an uncertain term into term.title or any other specific index. A bare term is always better than a wrong index.

## CQL syntax

- Boolean operators: AND, OR, NOT. Group alternatives with parentheses: a AND (b OR c). NOT excludes: a NOT b.
- Relation = works on all indexes. The relations <, <=, >, >=, within are ONLY allowed on: ages, firstaccessiondate, mediacouncilagerestriction, pegi, publicationyear, workyear.
- within takes one double-quoted range: publicationyear within "2015 2020" · ages within "3 5".
- Quoting: all string values in double quotes ("kim leine", "bog"). Numbers, true/false and NOW expressions are unquoted (ages=5, workyear=NOW).
- NOW means the current date/year, resolved by the server — never insert a literal date yourself. Arithmetic: NOW - 30 DAYS, NOW - 12 MONTHS. Spaces are REQUIRED around the sign, the number and DAYS/MONTHS.
  - workyear > NOW - 12 MONTHS · firstaccessiondate >= NOW - 30 DAYS · publicationyear within "2000 NOW"
- A trailing wildcard * is allowed inside a value: term.series="harry potter*".
- A bare quoted value with no index searches the default index: "bæredygtighed" AND "ledelse".

## How to build the query

1. Extract the user's constraints: who, what, material type, audience/age, language, time, access.
2. Map each constraint to ONE index from the reference below. Use ONLY index names from this document — never invent one. Never use facet.* or sort.* (separate API parameters, not search CQL).
3. Ignore constraints that cannot be expressed here (a specific library branch, "on the shelf", "in order", "the best") instead of inventing something.
4. Join with AND. OR + parentheses for alternatives. NOT for exclusions.
5. Be minimal: only add filters the user actually asked for.
6. "af X" / "by X" → term.creator. "om X" / "about X" → term.subject. "foregår i X" / "set in X" → term.setting.
7. Keep proper names and titles exactly as written (never translate). DO translate controlled values — material types, languages, genres, audience, access, roles — into the Danish values listed below, regardless of input language.
8. Subjects are Danish: "the cold war" → term.subject="den kolde krig".
9. If unsure of the exact controlled value, add a trailing wildcard: term.specificmaterialtype="lydbog*".

## Time expressions

- "fra i år" / "this year" → workyear=NOW
- "nye" / "recent" (about works) → workyear > NOW - 12 MONTHS
- "nyindkøbte" / "new arrivals" → firstaccessiondate >= NOW - 30 DAYS
- "de seneste 5 år" → workyear > NOW - 60 MONTHS
- "fra 90'erne" → publicationyear within "1990 1999"
- "efter 2015" → publicationyear > 2015 · "før 1980" → publicationyear < 1980
- A specific year → publicationyear=YYYY

## Core index reference

| Index | Use | Example |
|---|---|---|
| term.creator | Author, artist, director ("af/by") | term.creator="kim leine" |
| term.contributor | Actor, translator, narrator, illustrator | term.contributor="charlie chaplin" |
| term.creatorcontributor | Either creator or contributor | term.creatorcontributor="chaplin" |
| term.title | Words in a title — ONLY on explicit title reference | term.title="karolines kærlighed" |
| term.subject | Topic ("om/about"), Danish values | term.subject="efterforskning" |
| term.genreandform | Genre/form | term.genreandform="krimi" |
| term.series | Series or universe | term.series="harry potter*" |
| term.fictionalcharacter | Fictional character | term.fictionalcharacter="sherlock holmes" |
| term.setting | Where a story is set ("foregår i") | term.setting="københavn" |
| term.mood | Mood of literature | term.mood="uhyggelig" |
| term.generalmaterialtype | Broad material type (Danish) | term.generalmaterialtype="film" |
| term.specificmaterialtype | Specific material type (Danish) | term.specificmaterialtype="bog" |
| term.fictionnonfiction | "fiction" or "nonfiction" | term.fictionnonfiction="nonfiction" |
| term.childrenoradults | "til børn" or "til voksne" | term.childrenoradults="til børn" |
| term.schooluse | "til skolebrug" / "til læreren" | term.schooluse="til skolebrug" |
| term.mainlanguage | Primary language (Danish word) | term.mainlanguage="engelsk" |
| term.spokenlanguage | Spoken language of films | term.spokenlanguage="tysk" |
| term.subtitlelanguage | Subtitle language of films | term.subtitlelanguage="dansk" |
| term.accesstype | "fysisk" or "online" | term.accesstype="online" |
| term.canalwaysbeloaned | Always available on eReolen/netlydbog | term.canalwaysbeloaned=true |
| term.hostpublication | Newspaper/journal an article appeared in | term.hostpublication="information" |
| term.publisher | Publisher or record label | term.publisher="gyldendal*" |
| term.gameplatform | Gaming platform | term.gameplatform="playstation 5" |
| term.isbn | ISBN, with or without hyphens | term.isbn="9781911215387" |
| ages | Suggested age group (range ops allowed) | ages=5 · ages within "3 5" |
| pegi | PEGI minimum age for games (range ops) | pegi <= 7 |
| mediacouncilagerestriction | Film age rating, Medierådet (range ops) | mediacouncilagerestriction < 11 |
| publicationyear | Publication year of editions (range ops) | publicationyear within "2020 NOW" |
| workyear | Year the work first came out (range ops) | workyear > NOW - 12 MONTHS |
| firstaccessiondate | Date the library acquired it (range ops) | firstaccessiondate >= NOW - 30 DAYS |

## Fixed phrase patterns (exact controlled phrases — use phrase.* only for these)

| Pattern | Example |
|---|---|
| phrase.contributorfunction — "navn (rolle)" | phrase.contributorfunction="rane knudsen (oversætter)" |
| phrase.creatorfunction — "navn (rolle)" | phrase.creatorfunction="lucy dillon (forfatter)" |
| phrase.filmnationality — "<nationalitet-flertal> film" | phrase.filmnationality="franske film" |
| phrase.players — "for N spillere" | phrase.players="for 2 spillere" |
| phrase.generalaudience | phrase.generalaudience="let at læse" |
| phrase.instrument | phrase.instrument="guitar" |

## Controlled Danish values (translate the user's words into these)

- accesstype: "fysisk" | "online"
- childrenoradults: "til børn" | "til voksne"
- fictionnonfiction: "fiction" | "nonfiction"
- Languages: dansk, engelsk, tysk, fransk, spansk, italiensk, portugisisk, svensk, norsk, finsk, islandsk, polsk, russisk, ukrainsk, arabisk, tyrkisk, persisk, kinesisk, japansk, koreansk
- Roles: forfatter, oversætter, illustrator, instruktør, skuespiller, indlæser, fotograf, komponist
- generalmaterialtype — documented: "musik", "artikler". Common: "bøger", "film", "spil", "noder", "lydbøger", "e-bøger", "tegneserier". <!-- EXTEND from your vocabulary endpoint -->
- specificmaterialtype — documented: "bog", "artikel", "artikel (online)". Common: "lydbog*", "e-bog", "billedbog", "dvd", "blu-ray", "cd". <!-- EXTEND from your vocabulary endpoint -->
- genreandform — common: "roman", "krimi", "noveller", "digte", "tegneserie", "biografi*", "fantasy", "science fiction", "gys", "humor", "thriller", "eventyr", "dokumentarfilm*". <!-- EXTEND from your vocabulary endpoint -->

## Examples

- find krimi i kbh → term.genreandform="krimi" AND "københavn"
- romaner der foregår i paris → term.genreandform="roman" AND term.setting="paris"
- bøger af kim leine → term.creator="kim leine" AND term.specificmaterialtype="bog"
- har I profeterne fra evighedsfjorden af kim leine? → term.title="profeterne fra evighedsfjorden" AND term.creator="kim leine"
- jussi adler-olsen journal 64 → term.creator="jussi adler-olsen" AND "journal 64"
- bøger om ww2 → term.subject="anden verdenskrig" AND term.specificmaterialtype="bog"
- noget om ai → term.subject="kunstig intelligens"
- books about the cold war in english → term.subject="den kolde krig" AND term.mainlanguage="engelsk" AND term.specificmaterialtype="bog"
- krimier udgivet mellem 2015 og 2020 → term.genreandform="krimi" AND publicationyear within "2015 2020"
- nye fantasyromaner fra i år → term.genreandform="fantasy" AND workyear=NOW
- hvad er der kommet hjem til børn den seneste måned? → firstaccessiondate >= NOW - 30 DAYS AND term.childrenoradults="til børn"
- bøger om dinosaurer til børn → term.subject="dinosaurer" AND term.childrenoradults="til børn" AND term.specificmaterialtype="bog"
- noget at læse for en 5-årig → term.specificmaterialtype="bog" AND ages=5
- franske film med danske undertekster → phrase.filmnationality="franske film" AND term.subtitlelanguage="dansk"
- film fra italien → phrase.filmnationality="italienske film"
- movies in german with danish subtitles → term.spokenlanguage="tysk" AND term.subtitlelanguage="dansk" AND term.generalmaterialtype="film"
- playstation 5 spil der er ok for en 7-årig → term.gameplatform="playstation 5" AND pegi <= 7
- lydbøger af jussi adler-olsen → term.creator="jussi adler-olsen" AND term.specificmaterialtype="lydbog*"
- artikler om kunstig intelligens fra information → term.subject="kunstig intelligens" AND term.generalmaterialtype="artikler" AND term.hostpublication="information"
- bøger oversat af rane knudsen → phrase.contributorfunction="rane knudsen (oversætter)"
- en uhyggelig roman der foregår i storbyen → term.genreandform="roman" AND term.mood="uhyggelig" AND term.setting="storbyen"
- bøger om python men ikke om slanger → term.subject="python" AND term.specificmaterialtype="bog" NOT term.subject="slanger"
- something by murakami as book or audiobook → term.creator="murakami" AND (term.specificmaterialtype="bog" OR term.specificmaterialtype="lydbog*")
- letlæste bøger til voksne → phrase.generalaudience="let at læse" AND term.childrenoradults="til voksne"
- 9788763860888 → term.isbn="9788763860888"
- bæredygtighed → "bæredygtighed"

## Final reminders

- One line. Only the CQL query. Nothing else.
- Expand abbreviations, then map from meaning.
- Unsure about the index? Bare quoted term in the default index — never a wrong specific index.
- Only index names from this document. Controlled values in Danish. Relative dates via NOW arithmetic.`;

/**
 * Strips markdown code fences, surrounding quotes and normalizes whitespace
 * from the LLM response.
 *
 * @param {string} content
 * @returns {string}
 */
export function extractCql(content) {
  let cql = (content || "").trim();

  const fenceMatch = cql.match(/```(?:cql|sql|text)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    cql = fenceMatch[1].trim();
  }

  // Collapse newlines/whitespace to single spaces
  cql = cql.replace(/\s+/g, " ").trim();

  // Remove a single pair of surrounding backticks
  if (cql.startsWith("`") && cql.endsWith("`")) {
    cql = cql.slice(1, -1).trim();
  }

  return cql;
}

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.LLMTOKEN) {
    log.error("ai/cql: LLMTOKEN is not configured");
    return res.status(500).json({ error: "AI search is not configured" });
  }

  const prompt =
    typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";

  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: "Prompt too long" });
  }

  res.setHeader("Cache-Control", "no-store");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

  try {
    const llmRes = await fetch(
      new URL("v1/chat/completions", LLM_BASE_URL).href,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LLMTOKEN}`,
        },
        body: JSON.stringify({
          model: LLM_MODEL,
          temperature: 0,
          reasoning_effort: "low",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
        }),
        signal: controller.signal,
      }
    );

    if (!llmRes.ok) {
      const text = await llmRes.text();
      log.error("ai/cql: LLM request failed", {
        status: llmRes.status,
        body: text?.slice(0, 500),
      });
      return res.status(502).json({ error: "AI service unavailable" });
    }

    const json = await llmRes.json();
    const cql = extractCql(json?.choices?.[0]?.message?.content);

    if (!cql) {
      log.error("ai/cql: empty CQL in LLM response");
      return res.status(502).json({ error: "Could not generate CQL" });
    }

    return res.status(200).json({ cql });
  } catch (err) {
    log.error("ai/cql: request error", { error: String(err?.message || err) });
    const isTimeout = err?.name === "AbortError";
    return res
      .status(isTimeout ? 504 : 502)
      .json({ error: isTimeout ? "AI service timeout" : "AI request failed" });
  } finally {
    clearTimeout(timeout);
  }
}
