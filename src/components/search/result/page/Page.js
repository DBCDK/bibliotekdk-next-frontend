import PropTypes from "prop-types";
import ResultRow from "../row";
import { Fragment, useEffect, useState } from "react";
import { useData } from "@/lib/api/api";
import * as searchFragments from "@/lib/api/search.fragments";
import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";
import SearchFeedBack from "@/components/base/searchfeedback";
import useDataCollect from "@/lib/useDataCollect";
import Spinner from "react-bootstrap/Spinner";
import Button from "@/components/base/button";
import Form from "react-bootstrap/Form";

const ALBERT_LAUGHING =
  "https://media1.giphy.com/media/l0MYDdJ0yzQpGLhhm/giphy.gif?cid=ecf05e47bjklm15mjgo0f8uen2oe9wp8vx6e4vhtapbgoau5&ep=v1_gifs_related&rid=giphy.gif&ct=g";
const ALBERT_SMOKING_NOT_HAPPY =
  "https://media2.giphy.com/media/f1HSBidKJIOWY/giphy.gif?cid=ecf05e475636fcqtjole3hhqv4ee00m8amu07lf0k6mn7x5o&ep=v1_gifs_related&rid=giphy.gif&ct=g";

const ALBERT_GLASSES_HAPPY =
  "https://media2.giphy.com/media/l0HlRA94QhnVZKlpu/giphy.gif?cid=ecf05e47xk83kpzfqe1hef2an84yibycvgjzxh1nxu3kxnhl&ep=v1_gifs_related&rid=giphy.gif&ct=g";

const ALBERT_SUNGLASSES =
  "https://media2.giphy.com/media/iZkua1UPocHgQ/giphy.gif?cid=ecf05e47ieljpdcxou6moh7win2cmyreti0ixwdmzz6awg8a&ep=v1_gifs_search&rid=giphy.gif&ct=g";

// const ALBERT_READING =
//   "https://media2.giphy.com/media/n3HzrBo2TxjkQ/giphy.gif?cid=ecf05e472bf2jxquwygbr36wr49pd0ed72jgglh1sdb67pt1&ep=v1_gifs_related&rid=giphy.gif&ct=g";

const ALBERT_LOADING_MESSAGES = [
  "Analyzing... my dear interlocutor, much like the universe, your query presents itself as a delightful enigma awaiting unraveling.",
  "Analyzing... E=mc², but deciphering this message might require some more cosmic brainpower.",
  "Analyzing... E=mc² of thoughts in progress!",
  "In the realm of cyberspace, I find myself pondering your inquiry with digital curiosity.",
  "E=MC^2, where 'E' represents the essence of your message and 'MC' stands for my cerebral musings, squared.",
  "The internet is like a bicycle for the mind, and your message has certainly set my intellectual wheels spinning.",
  "A web of thoughts, your message weaves, and in this virtual cosmos, I seek to untangle its mysteries.",
  "In the vast universe of information, your message is a photon of wit, refracting through the lenses of my virtual existence.",
  "The theory of relativity applies even in the virtual realm: your message has me pondering the relativity of ideas.",
  "To paraphrase myself, 'Imagination is more important than knowledge,' and your message fuels the former in this digital space.",
  "My virtual chalkboard is ready to jot down the equations of thought prompted by your intriguing message.",
  "In the grand symphony of digital dialogues, your message strikes a harmonious chord in the chambers of my virtual brain.",
  "As I navigate the digital cosmos, your message is the North Star guiding my intellectual exploration.",
];

const ALBERT_DELVE_DEEPER_MESSAGES = [
  "Ah, what a captivating search result! May I have the privilege of perusing it?",
  "My dear search engine, this result piques my curiosity. Might I have a glimpse?",
  "Eureka! A fascinating search result awaits. Dare I request a peek?",
  "In the realm of digital discoveries, this result beckons me. Shall I explore?",
  "A cybernetic gem indeed! May I have the pleasure of a closer examination?",
  "The virtual cosmos unveils a tantalizing result. Could I partake in its secrets?",
  "A serendipitous find, I must say! Would you permit me a glance?",
  "By the laws of search, I stumble upon this intriguing result. Shall I delve deeper?",
  "Ah, the algorithm's grace has bestowed this gem upon me. May I uncover its mysteries?",
  "In the vast expanse of the web, a curious result emerges. Dare I inquire further?",
  "Ah, what a captivating search result! May I peruse it?",
  "Fascinating search result! Mind if I take a peek?",
  "A most intriguing search result. Would you kindly allow me a glance?",
  "Eureka! An enticing search result! May I explore it?",
  "Curiouser and curiouser! May I examine this search result?",
  "A serendipitous find indeed! May I have the pleasure of inspecting it?",
  "My curiosity is piqued! Might I inspect this search result?",
  "This search result beckons to me! May I have a gander?",
  "A brilliant discovery! May I delve into this search result?",
  "What a thought-provoking search result! May I delve deeper?",
  "An intellectual delight! May I partake in this search result?",
  "A true gem in the search results! May I explore further?",
  "Oh, what a delightful search result! May I take a closer look?",
  "A fascinating find in the digital realm! May I investigate?",
  "An online treasure trove! May I have a look, please?",
  "Intriguing results indeed! Mind if I examine this one?",
  "Ah, the wonders of the internet! May I explore this result?",
  "An alluring search result! Would you permit me to view it?",
  "A web-based enigma! May I have a glance, if you please?",
  "A virtual curiosity! May I have the privilege of inspecting it?",
  "What an interesting discovery! May I delve into this search result?",
  "A digital marvel! May I have a peek at this search result?",
  "A cybernetic delight! Mind if I examine this search result?",
  "A search result that beckons! May I have a closer look?",
  "A cyber-epiphany! May I have a gander at this result?",
  "A search result that sparks curiosity! May I explore it?",
  "A digital gem! May I take a closer look at this result?",
  "An online revelation! May I delve deeper into this search result?",
  "An intellectual oasis in the digital desert! May I partake?",
  "A beacon in the vast digital sea! May I inspect this result?",
  "A captivating find amidst the search results! May I investigate?",
  "A virtual treasure hunt! May I have a look, if you don't mind?",
  "Intriguing results await! May I examine this particular one?",
  "Ah, the mysteries of the internet! May I explore this result?",
  "A cyber conundrum! May I have a glance, pretty please?",
  "A web-based wonder! May I have the honor of inspecting it?",
  "What a stimulating discovery! May I delve into this search result?",
  "A digital delight! May I have a peek at this search result?",
  "A search result worth pondering! Mind if I examine it?",
  "A search result that beckons! May I have a closer look, please?",
  "A virtual revelation! May I have a gander at this result?",
  "A search result that ignites curiosity! May I explore it?",
  "A digital masterpiece! May I take a closer look at this result?",
  "An online epiphany! May I delve deeper into this search result?",
  "An intellectual gem amidst the digital landscape! May I partake?",
  "A shining star in the digital cosmos! May I inspect this result?",
  "A captivating discovery amidst the search results! May I investigate?",
  "A virtual treasure trove awaits! May I have a look, if you permit?",
  "Intriguing results beckon! May I examine this particular one?",
  "Ah, the marvels of the internet! May I explore this result?",
  "A digital enigma! May I have a glance, if it pleases you?",
  "A web-based marvel! May I have the privilege of inspecting it?",
  "What a stimulating revelation! May I delve into this search result?",
  "A digital wonder! May I have a peek at this search result?",
  "A search result that tantalizes! Mind if I examine it?",
  "A search result that calls out! May I have a closer look, if I may?",
  "A virtual enlightenment! May I have a gander at this result?",
  "A search result that sparks my curiosity! May I explore it?",
  "A digital treasure! May I take a closer look at this result?",
  "An online epiphany awaits! May I delve deeper into this search result?",
  "An intellectual oasis in the digital wilderness! May I partake?",
  "A beacon in the boundless digital realm! May I inspect this result?",
  "A captivating find amidst the search results! May I investigate?",
  "A virtual quest for knowledge! May I have a look, if you'd be so kind?",
  "Intriguing results await! May I examine this particular one?",
  "Ah, the mysteries of cyberspace! May I explore this result?",
  "A digital riddle! May I have a glance, with your gracious permission?",
  "A web-based marvel awaits! May I have the honor of inspecting it?",
  "What a thought-provoking revelation! May I delve into this search result?",
  "A digital masterpiece! May I have a peek at this search result?",
  "A search result that demands attention! Mind if I examine it?",
  "A search result that beckons! May I have a closer look, if it's alright?",
  "A virtual epiphany! May I have a gander at this result?",
  "A search result that kindles my curiosity! May I explore it?",
  "A digital gem! May I take a closer look at this result?",
  "An online revelation awaits! May I delve deeper into this search result?",
  "An intellectual treasure amidst the digital expanse! May I partake?",
  "A shining beacon in the digital wilderness! May I inspect this result?",
  "A captivating discovery amidst the search results! May I investigate?",
  "A virtual trove of possibilities! May I have a look, if you're willing?",
  "Intriguing results beckon! May I examine this particular one?",
  "Ah, the wonders of the digital age! May I explore this result?",
  "A cyber conundrum! May I have a glance, if it's not too much trouble?",
  "A web-based wonder! May I have the privilege of inspecting it?",
  "What a fascinating revelation! May I delve into this search result?",
  "A digital delight! May I have a peek at this search result?",
  "A search result that arouses curiosity! Mind if I examine it?",
  "A search result that calls out to me! May I have a closer look, please?",
];

/**
 * Row representation of a search result entry
 *
 * @param {object} props
 * See propTypes for specific props and types
 */
export function ResultPage({ rows, onWorkClick, isLoading, gpt }) {
  console.log(gpt);
  if (isLoading) {
    // Create some skeleton rows
    rows = Array(10).fill({});
  }

  const resultRows = rows?.map((row, index) => (
    <Fragment key={row.workId + ":" + index}>
      <ResultRow
        isLoading={isLoading}
        work={row}
        key={`${row?.titles?.main}_${index}`}
        onClick={onWorkClick && (() => onWorkClick(index, row))}
        gpt={gpt?.result[index]}
      />
      {index === 0 && <SearchFeedBack />}
    </Fragment>
  ));

  if (!rows) {
    return null;
  }

  return <>{resultRows}</>;
}

ResultPage.propTypes = {
  rows: PropTypes.array,
  isLoading: PropTypes.bool,
  onWorkClick: PropTypes.func,
};

/**
 * Wrap is a react component responsible for loading
 * data and displaying the right variant of the component
 *
 * @param {Object} props Component props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap({ page, onWorkClick }) {
  // settings
  const limit = 10; // limit
  let offset = limit * (page - 1); // offset

  const { filters, isSynced } = useFilters();
  const { getQuery, hasQuery } = useQ();
  const dataCollect = useDataCollect();
  let [gptRes, setGptRes] = useState();
  let [albertMessage, setAlbertMessage] = useState(false);
  let [isLoadingGpt, setIsLoadingGpt] = useState(false);
  let [gptDetailsEnabled, setGptDetailsEnabled] = useState(false);
  console.log({ gptDetailsEnabled });
  // isLoadingGpt =
  //   "Analyzing... E=mc², but deciphering this message might require some more cosmic brainpower.";

  // gptRes = {
  //   q: "harry potter føniksordnene film",
  //   intent: [
  //     "Content Type: Films",
  //     "Topic of Interest: Harry Potter",
  //     "Specific Film: Order of the Phoenix",
  //   ],
  //   result: [
  //     {
  //       item: "Harry Potter af Felicity Baker (f. 1962) (faglitteratur,, bog, 2016)",
  //       evaluation: [
  //         {
  //           aspect: "Content Type: Films",
  //           score: 1,
  //           reason: "Item is a book, not a film",
  //         },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item relates to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 1,
  //           reason:
  //             "The item is not specifically about the film 'Order of the Phoenix'",
  //         },
  //       ],
  //     },
  //     {
  //       item: "Harry Potter og de vises sten af Chris Columbus (f. 1958),Steve Kloves,John Seale,Joanne K. Rowling (fiktion,børnefilm, film (videobånd),film (dvd),film (blu-ray), 2009)",
  //       evaluation: [
  //         { aspect: "Content Type: Films", score: 5, reason: "Item is a film" },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item relates to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 1,
  //           reason: "The item is not 'Order of the Phoenix'",
  //         },
  //       ],
  //     },
  //     {
  //       item: "Harry Potter og Flammernes Pokal af Mike Newell,Steve Kloves,Roger Pratt,Joanne K. Rowling (fiktion,børnefilm, film (dvd),film (blu-ray), 2007)",
  //       evaluation: [
  //         { aspect: "Content Type: Films", score: 5, reason: "Item is a film" },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item relates to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 3,
  //           reason:
  //             "The item is not specifically mentioned as 'Order of the Phoenix'",
  //         },
  //       ],
  //     },
  //     {
  //       item: "Harry Potter og halvblodsprinsen af David Yates,Bruno Delbonnel,Steve Kloves,Joanne K. Rowling (fiktion,børnefilm, film (dvd), 2009)",
  //       evaluation: [
  //         { aspect: "Content Type: Films", score: 5, reason: "Item is a film" },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item relates to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 3,
  //           reason:
  //             "The item is not specifically 'Order of the Phoenix', but it is part of the Harry Potter film series",
  //         },
  //       ],
  //     },
  //     {
  //       item: "Harry Potter and the philosopher's stone af Chris Columbus (f. 1958),Steve Kloves,John Seale (fiktion,, film (blu-ray 4K),film (dvd),film (blu-ray), 2022)",
  //       evaluation: [
  //         { aspect: "Content Type: Films", score: 5, reason: "Item is a film" },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item is related to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 1,
  //           reason: "The item is not 'Order of the Phoenix'",
  //         },
  //       ],
  //     },
  //     {
  //       item: "Harry Potter og Fønixordenen af David Yates,Michael Goldenberg,Sławomir Idziak,Joanne K. Rowling (fiktion,børnefilm, film (dvd),film (blu-ray), 2007)",
  //       evaluation: [
  //         { aspect: "Content Type: Films", score: 5, reason: "Item is a film" },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item is related to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 5,
  //           reason: "The item is the film 'Order of the Phoenix'",
  //         },
  //       ],
  //     },
  //     {
  //       item: "Harry Potter og hemmelighedernes kammer af Chris Columbus (f. 1958),Steve Kloves,Roger Pratt,Joanne K. Rowling (fiktion,børnefilm, film (videobånd),film (dvd),film (blu-ray), 2009)",
  //       evaluation: [
  //         { aspect: "Content Type: Films", score: 5, reason: "Item is a film" },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item relates to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 1,
  //           reason:
  //             "The item is not 'Order of the Phoenix', it is 'Harry Potter og hemmelighedernes kammer'",
  //         },
  //       ],
  //     },
  //     {
  //       item: "Harry Potter and the deathly hallows - part 2 af David Yates,Steve Kloves,Eduardo Serra (fiktion,, film (blu-ray 3D),film (blu-ray 4K),film (online),film (dvd),film (blu-ray), 2022)",
  //       evaluation: [
  //         { aspect: "Content Type: Films", score: 5, reason: "Item is a film" },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item is related to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 1,
  //           reason: "The item is not specifically 'Order of the Phoenix'",
  //         },
  //       ],
  //     },
  //     {
  //       item: "Harry Potter and the deathly hallows - part 1 af David Yates,Steve Kloves,Eduardo Serra (fiktion,børnefilm, film (blu-ray 3D),film (blu-ray 4K),film (online),film (dvd),film (blu-ray), 2022)",
  //       evaluation: [
  //         { aspect: "Content Type: Films", score: 5, reason: "Item is a film" },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item is related to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 1,
  //           reason: "The item is not specifically 'Order of the Phoenix'",
  //         },
  //       ],
  //     },
  //     {
  //       item: "Harry Potter and the chamber of secrets af Chris Columbus (f. 1958),Steve Kloves,Roger Pratt (fiktion,, film (blu-ray 4K),film (online),film (dvd),film (blu-ray), 2022)",
  //       evaluation: [
  //         { aspect: "Content Type: Films", score: 5, reason: "Item is a film" },
  //         {
  //           aspect: "Topic of Interest: Harry Potter",
  //           score: 5,
  //           reason: "The item relates to Harry Potter",
  //         },
  //         {
  //           aspect: "Specific Film: Order of the Phoenix",
  //           score: 1,
  //           reason: "The item is not 'Order of the Phoenix'",
  //         },
  //       ],
  //     },
  //   ],
  // };

  const q = getQuery();

  if (!isSynced) {
    offset = 0;
  }

  // use the useData hook to fetch data
  const allResponse = useData(
    hasQuery && searchFragments.all({ q, limit, offset, filters })
  );

  // This useEffect is responsible for collecting data about the search response.
  // The effect is run, when search response is fetched and shown to the user.
  useEffect(() => {
    if (allResponse?.data) {
      setGptRes(null);
      setAlbertMessage(
        ALBERT_DELVE_DEEPER_MESSAGES[
          Math.floor(Math.random() * ALBERT_DELVE_DEEPER_MESSAGES.length)
        ]
      );
      dataCollect.collectSearch({
        search_request: {
          q,
          filters,
        },
        search_response_works:
          allResponse?.data?.search?.works?.map((w) => w.workId) || [],
        search_offset: offset,
      });
    }
  }, [allResponse?.data]);

  if (allResponse.error) {
    return null;
  }

  const data = allResponse.data || {};

  if (allResponse.isLoading) {
    return <ResultPage isLoading={true} />;
  }

  function ChatMessage({ msg }) {
    return (
      <div
        style={{
          fontWeight: 300,
          padding: "20px 40px",
          fontSize: 20,
          fontFamily:
            'Söhne, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, Cantarell, "Noto Sans", sans-serif, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        }}
      >
        {msg}
      </div>
    );
  }
  return (
    <>
      <div>
        <div
          style={{
            position: "fixed",
            left: 50,
            bottom: 50,
            display: "flex",
            background: "white",
            width: 800,
            zIndex: 100,
            borderRadius: "12px",
            boxShadow: "1px 7px 19px rgba(0, 0, 0, 0.2)",
          }}
        >
          <img
            style={{
              objectFit: "cover",
              width: 250,
              height: 250,
              borderTopLeftRadius: "12px",
              borderBottomLeftRadius: "12px",
            }}
            src={
              isLoadingGpt
                ? "https://media2.giphy.com/media/n3HzrBo2TxjkQ/giphy.gif?cid=ecf05e477u29hch2oj8gfb1qjtq8w37qqd8vg7e9zycaoiq2&ep=v1_gifs_related&rid=giphy.gif&ct=g"
                : !gptRes
                ? "https://media3.giphy.com/media/3o7TKw9R86Mwly4iOY/giphy.gif?cid=ecf05e47wsfve3q9h04uqlcknx02sygj9j2wfar2h7vwjcpv&ep=v1_gifs_related&rid=giphy.gif&ct=g"
                : gptRes?.overallScore > 4
                ? ALBERT_SUNGLASSES
                : gptRes?.overallScore > 3
                ? ALBERT_GLASSES_HAPPY
                : gptRes?.overallScore > 2
                ? ALBERT_SMOKING_NOT_HAPPY
                : ALBERT_LAUGHING
            }
            alt=""
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
            }}
          >
            {albertMessage && <ChatMessage msg={albertMessage} />}
            {isLoadingGpt && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Spinner animation="border" size="sm" variant="primary" />
              </div>
            )}
            {!isLoadingGpt && !gptRes && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  style={{ width: 120 }}
                  type="secondary"
                  onClick={() => {
                    const lines = allResponse?.data?.search?.works.map(
                      (work) =>
                        `${work.titles.full[0]} af ${
                          work.creators.map((c) => c.display).join(",") || "?"
                        } (${work.fictionNonfiction?.display + "," || ""}${
                          work.genreAndForm.join(",") + "," || ""
                        } ${work.materialTypes
                          .map((t) => t.specific)
                          .join(",")}, ${
                          work.manifestations.mostRelevant?.[0]?.edition
                            ?.publicationYear?.display || ""
                        })`
                    );

                    const r = {
                      q:
                        q.all ||
                        (q.subject && `subject: ${q.subject}`) ||
                        (q.title && `title: ${title}`) ||
                        (q.creator && `creator: ${q.creator}`),
                      result: lines,
                    };

                    setIsLoadingGpt(true);
                    setAlbertMessage(
                      ALBERT_LOADING_MESSAGES[
                        Math.floor(
                          Math.random() * ALBERT_LOADING_MESSAGES.length
                        )
                      ]
                    );
                    fetch("/api/gpt", {
                      method: "POST",
                      body: JSON.stringify(r),
                    }).then(async (gptRes) => {
                      const json = await gptRes.json();
                      const price = (json.totalTokens * 0.002) / 1000;
                      const messageSplit =
                        json.albertResponse.response.split("5 dollars");
                      setAlbertMessage(
                        <>
                          <span>{messageSplit[0]}</span>
                          <span style={{ fontWeight: 500 }}>
                            {Math.round(price * 1000) / 1000 + " dollars"}
                          </span>
                          <span>{messageSplit[1]}</span>
                        </>
                      );
                      setGptRes(json);
                      setIsLoadingGpt(false);
                    });
                  }}
                >
                  Yes
                </Button>
              </div>
            )}
            {gptRes && (
              <div
                style={{
                  padding: "0px 40px",
                  flex: "flex-grow",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                  }}
                >
                  <div>
                    <span style={{ fontSize: 30 }}>
                      {Math.round(gptRes?.overallScore * 100) / 100}
                    </span>{" "}
                    <span style={{ fontSize: 13 }}>{gptRes?.performance}</span>
                  </div>
                  <Form>
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      label=""
                      checked={gptDetailsEnabled}
                      onChange={(e) => setGptDetailsEnabled(e.target.checked)}
                    />
                  </Form>
                </div>
              </div>
            )}
          </div>
        </div>

        {gptDetailsEnabled && gptRes && (
          <div
            style={{
              padding: "16px 0px",
              fontSize: 14,
              // background: "lightgrey",
            }}
          >
            <p>User is looking for:</p>
            <ul style={{ padding: "8px 24px" }}>
              {gptRes?.intent?.response?.map((line) => {
                return (
                  <li key={line}>
                    <span>{line}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      <ResultPage
        rows={data.search?.works}
        onWorkClick={onWorkClick}
        gpt={gptDetailsEnabled && gptRes ? gptRes : null}
      />
    </>
  );
}
Wrap.propTypes = {
  page: PropTypes.number,
  onWorkClick: PropTypes.func,
};
