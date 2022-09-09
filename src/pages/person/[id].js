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

import React, { useMemo } from "react";

import { useData } from "@/lib/api/api";
import Section from "@/components/base/section";

import WorkSlider from "@/components/base/slider/WorkSlider";

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
      <div>
        <strong>Navn:</strong> {id}
      </div>

      <div>
        <strong>Forfatter rating:</strong>{" "}
        {Math.round(creatorRating?.rating * 10)}/10 - antal anmeldte værker{" "}
        {creatorRating?.count}
      </div>

      {forfwebArticle?.cover?.detail && (
        <img src={forfwebArticle?.cover?.detail} />
      )}

      <div style={{ marginTop: 12 }}>
        <strong>Roller:</strong>{" "}
        {rolesSummary &&
          Object.entries(rolesSummary).map(([role, works]) => {
            return (
              <div key={role}>
                {role} - {works.length}
              </div>
            );
          })}
      </div>
      <div>
        <div style={{ marginTop: 12 }}>
          <strong>Top:</strong>
        </div>
        {topWorks &&
          topWorks.map((work) => {
            return (
              <div key={work.id}>
                {work.title} - {Math.round(work.avgRating * 10)}/10 - Antal
                anmeldelser med rating: {work.reviewsWithRating.length}
              </div>
            );
          })}
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
        <div style={{ marginTop: 12 }}>
          <strong>Seneste bøger:</strong>
        </div>
        {newestWorks &&
          newestWorks
            .filter((work) => work.workTypes?.includes("literature"))
            .slice(0, 10)
            .map((work) => {
              return (
                <div key={work.id}>
                  {work.title} - {work.workYear} - {work.workTypes.join(", ")}
                </div>
              );
            })}
        z{" "}
      </div>

      <div>
        <div style={{ marginTop: 12 }}>
          <strong>Seneste:</strong>
        </div>
        {newestWorks &&
          newestWorks.slice(0, 20).map((work) => {
            return (
              <div key={work.id}>
                {work.title} - {work.workYear} - {work.workTypes.join(", ")}
              </div>
            );
          })}
      </div>

      <div>
        <div style={{ marginTop: 12 }}>
          <strong>Ofte brugte emner:</strong>
        </div>
        {subjectToWorks &&
          subjectToWorks.slice(0, 10).map((subject) => {
            return (
              <div key={subject.subject}>
                {subject.subject} - {subject.works.length}
              </div>
            );
          })}
      </div>
    </React.Fragment>
  );
}
