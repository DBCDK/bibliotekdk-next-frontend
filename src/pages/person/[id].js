/**
 * @file
 * This is the work landing page
 *
 * Next.js page docs are found here
 * https://nextjs.org/docs/basic-features/pages
 *
 * Note that dynamic routing (file based) is used on this page.
 * https://nextjs.org/docs/routing/dynamic-routes
 *
 * Path parameters on this page:
 *  - title_author: title and author concatenated
 *  - workId: The work id we use when fetching data
 *
 */

import { useRouter } from "next/router";

import Header from "@/components/header/Header";

import React, { useEffect, useMemo, useState } from "react";

import { useData } from "@/lib/api/api";
import Section from "@/components/base/section";

import WorkSlider from "@/components/base/slider/WorkSlider";
import Title from "@/components/base/title";
import { Col, Row } from "react-bootstrap";
import Text from "@/components/base/text";

function forfweb(id) {
  return {
    // delay: 250,
    query: `query ($subject: String!) {
        search(q: {subject: $subject}) {
          works(offset: 0, limit: 500) {
            id
            title
            cover {
              detail
            }
            workTypes
          }
        }
      }`,
    variables: {
      subject: id,
    },
    slowThreshold: 3000,
  };
}

function basic(id) {
  return {
    // delay: 250,
    query: `query ($creator: String!) {
        search(q: {creator_exact: $creator}, filters: {language: ["Dansk"]}) {
          hitcount
          works(offset: 0, limit: 500) {
            id
            title
            cover {
              detail
            }
            reviews {
              __typename
              ... on ReviewInfomedia {
                rating
                media
              }
              ... on ReviewExternalMedia {
                rating
              }
            }
            manifestations {
              datePublished
              creators {
                name
                functionSingular
              }
            }
            workTypes
            subjects {
              type
              value
            }
            creators {
              name
              functionSingular
            }
          }
        }
      }`,
    variables: {
      creator: id,
    },
    slowThreshold: 3000,
  };
}

const include = ["DBCS", "DBCF", "DBCM", null];
/**
 * Renders the WorkPage component
 */
export default function Page() {
  const router = useRouter();
  const { id } = router.query;

  const [wikiImage, setWikiImage] = useState(null);
  useEffect(() => {
    fetch(`http://localhost:3000/api/find?name=${id}`)
      .then((results) => results.json())
      .then((data) => {
        const { wikiData } = data;
        wikiData &&
          wikiData?.bindings &&
          wikiData?.bindings[0] &&
          wikiData?.bindings[0]?.IMAGE?.value &&
          setWikiImage(wikiData?.bindings[0]?.IMAGE?.value);
      });
  }, [id]);

  const { data } = useData(id && basic(id));
  const { data: forfwebData } = useData(id && forfweb(id));

  const forfwebArticle = useMemo(() => {
    return forfwebData?.search?.works?.filter((w) =>
      w?.id?.includes("forfweb")
    )?.[0];
  }, [data]);

  const workRatings = useMemo(() => {
    return data?.search?.works
      ?.filter((w) => w)
      .map((w) => {
        const reviewsWithRating = w.reviews
          .filter((review) => review.rating)
          .map((review) => {
            const split = review.rating.split("/");
            return split[0] / split[1];
          });
        const withYear = w.manifestations
          .map((m) => m.datePublished)
          .filter((datePublished) => datePublished?.length === 4);

        const roles = {};

        w.manifestations.forEach((m) =>
          m.creators.forEach((creator) => {
            if (creator.name === id) {
              roles[creator.functionSingular] = 1;
            }
          })
        );

        return {
          ...w,
          roles: Object.keys(roles).filter((r) => r),
          reviewsWithRating: w.reviews.filter((review) => review.rating),
          avgRating:
            reviewsWithRating.length > 0
              ? reviewsWithRating.reduce((a, b) => a + b) /
                reviewsWithRating.length
              : 0,

          workYear: withYear.length > 0 ? Math.min(...withYear) : null,
          subjects: w.subjects.filter((s) => include.includes(s.type)),
        };
      });
  }, [data]);

  const rolesSummary = useMemo(() => {
    if (!workRatings) {
      return;
    }
    const roles = {};
    workRatings.forEach((w) => {
      w.roles.forEach((role) => {
        if (!roles[role]) {
          roles[role] = [];
        }
        roles[role].push(w);
      });
    });

    return roles;
  }, [workRatings]);

  const creatorRating = useMemo(() => {
    if (!workRatings) {
      return;
    }
    const ratings = workRatings?.map((w) => w.avgRating).filter((r) => r);
    return ratings.length > 0
      ? {
          rating: ratings.reduce((a, b) => a + b) / ratings.length,
          count: ratings.length,
        }
      : 0;
  }, [workRatings]);

  const topWorks = useMemo(() => {
    if (!workRatings) {
      return;
    }
    const worksWithRating = workRatings?.filter((w) => w.avgRating);
    worksWithRating.sort((a, b) => b.avgRating - a.avgRating);

    return worksWithRating.slice(0, 10);
  }, [workRatings]);

  const newestWorks = useMemo(() => {
    if (!workRatings) {
      return;
    }
    const worksWithYear = workRatings?.filter((w) => w.workYear);
    worksWithYear.sort((a, b) => b.workYear - a.workYear);

    return worksWithYear;
  }, [workRatings]);

  const subjectToWorks = useMemo(() => {
    if (!workRatings) {
      return;
    }
    const counts = {};
    workRatings.forEach((work) => {
      work.subjects.forEach((subject) => {
        if (!counts[subject.value]) {
          counts[subject.value] = [];
        }
        counts[subject.value].push(work);
      });
    });
    const res = Object.entries(counts).map(([name, works]) => {
      return { subject: name, works };
    });

    res.sort((a, b) => b.works.length - a.works.length);
    return res;
  }, [workRatings]);

  console.log({
    workRatings,
    creatorRating,
    topWorks,
    newestWorks,
    rolesSummary,
    afb: newestWorks?.map((w) => ({
      workYear: w.workYear,
      workType: w.workTypes,
    })),
    subjectToWorks,
    forfwebArticle,
  });

  return (
    <React.Fragment>
      <Header router={router} />
      <div style={{ background: "#f2f2f2", padding: "48px 0" }}>
        {topWorks?.length && (
          <Section title=" " titleDivider={null} contentDivider={null}>
            <Row>
              <Col xs={7}>
                <Title type="title3">{id}</Title>
                <Text type="text2" style={{ marginTop: 8 }}>
                  Har en score på {Math.round(creatorRating?.rating * 10)}/10 på
                  baggrund af {creatorRating?.count} anmeldelser
                </Text>
                {subjectToWorks && (
                  <Text type="text3" style={{ marginTop: 20 }}>
                    Kredser om emnerne{" "}
                    {subjectToWorks.slice(0, 10).map((subject, idx) => {
                      return (
                        <span key={subject.subject}>
                          <strong>{subject.subject}</strong> (
                          {subject.works.length})
                          {idx < Math.min(subjectToWorks.length, 10) - 1
                            ? ", "
                            : ""}
                        </span>
                      );
                    })}
                  </Text>
                )}
                {rolesSummary && (
                  <Text type="text3" style={{ marginTop: 20 }}>
                    Optræder som{" "}
                    {Object.entries(rolesSummary).map(([role, works], idx) => {
                      return (
                        <span key={role}>
                          <strong>{role}</strong> ({works.length})
                          {idx < Object.entries(rolesSummary).length - 1
                            ? ", "
                            : ""}
                        </span>
                      );
                    })}
                  </Text>
                )}
              </Col>
              <Col xs={2}>
                {(wikiImage || forfwebArticle?.cover?.detail) && (
                  <img
                    style={{ width: "100%" }}
                    src={forfwebArticle?.cover?.detail || wikiImage}
                  />
                )}

                {forfwebArticle?.cover?.detail ? (
                  <span>Fra forfatterweb</span>
                ) : wikiImage ? (
                  <span>Fra wikimedia.org</span>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </Section>
        )}
      </div>

      <div>
        {topWorks && (
          <Section
            title="Anmeldernes favoritter"
            titleDivider={null}
            contentDivider={null}
            topSpace={true}
          >
            {topWorks.map((work) => {
              return (
                <div key={work.id} style={{ marginBottom: 8 }}>
                  <div>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          height: 50,
                          width: 30,
                          marginRight: 16,
                          background: "grey",
                        }}
                      >
                        {work?.cover?.detail && (
                          <img
                            src={work.cover.detail}
                            style={{
                              height: 50,
                              width: 30,
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <Text tag="span" type="text1">
                          {work.title}
                        </Text>
                        <Text tag="span" type="text3">
                          <span
                            style={{
                              paddingRight: 8,
                              fontWeight: 400,
                              fontSize: 12,
                            }}
                          >
                            {Math.round(work.avgRating * 10)}/10
                          </span>
                          Baseret på {work.reviewsWithRating.length}{" "}
                          {work.reviewsWithRating.length === 1
                            ? "anmeldelse"
                            : "anmeldelser"}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Section>
        )}
      </div>
      <div>
        {topWorks?.length && (
          <Section
            title={"Anmeldernes favoritter"}
            topSpace={true}
            contentDivider={null}
          >
            <WorkSlider works={topWorks} />
          </Section>
        )}
      </div>

      <div>
        {newestWorks && (
          <Section title="Bibliografi" topSpace={true}>
            {newestWorks.map((work) => {
              const role = work.creators.find((creator) => creator.name === id);
              return (
                <div key={work.id} style={{ marginBottom: 8 }}>
                  <div>
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          height: 50,
                          width: 30,
                          marginRight: 16,
                          background: "grey",
                        }}
                      >
                        {work?.cover?.detail && (
                          <img
                            src={work.cover.detail}
                            style={{
                              height: 50,
                              width: 30,
                              objectFit: "cover",
                            }}
                          />
                        )}
                      </div>
                      <div>
                        <Text tag="span" type="text1">
                          {work.title}
                        </Text>
                        <Text tag="span" type="text3">
                          {work.workYear} {work.workTypes}{" "}
                          <strong>{work.roles?.join(", ")}</strong>
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Section>
        )}
      </div>
    </React.Fragment>
  );
}
