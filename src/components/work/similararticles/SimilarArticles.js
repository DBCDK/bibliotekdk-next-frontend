import PropTypes from "prop-types";

import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";

import { PeriodicaIssuByWork } from "@/lib/api/periodica.fragments";
import { Col, Row } from "react-bootstrap";
import Card from "@/components/base/card";
import { useMemo } from "react";

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function SimilarArticles({ periodicaTitle, works }) {
  const sorted = useMemo(() => {
    if (works) {
      return [...works].sort(
        (a, b) =>
          new Date(b.latestPublicationDate) - new Date(a.latestPublicationDate)
      );
    }
  }, [works]);
  const title = Translate({
    context: "similararticles",
    label: "title",
    vars: [periodicaTitle],
  });

  return (
    <Section
      title={title}
      sectionTag="div" // Section sat in parent
    >
      <Row>
        {sorted?.slice?.(0, 3)?.map((work) => {
          return (
            <Col key={work?.workId} xs={12} sm={6} md={4}>
              <Card
                workId={work?.workId}
                creators={work?.creators}
                cover={work?.manifestations?.mostRelevant?.[0]?.cover}
                title={work?.titles?.full?.[0]}
                subTitle={`${work?.manifestations?.mostRelevant?.[0]?.hostPublication?.issue}`}
                coverLeft={true}
                fixedWidth={false}
                small={true}
              />
            </Col>
          );
        })}
      </Row>
    </Section>
  );
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export function SimilarArticlesSkeleton(props) {
  const data = [];

  return (
    <SimilarArticles
      {...props}
      data={data}
      className={`${props.className}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  const { workId } = props;

  const { data, isLoading, error } = useData(
    PeriodicaIssuByWork({ id: workId })
  );

  if (isLoading) {
    return <SimilarArticlesSkeleton />;
  }

  if (error) {
    return null;
  }

  if (!data?.work?.periodicaInfo?.similarArticles?.length) {
    return null;
  }

  return (
    <SimilarArticles
      periodicaTitle={data?.work?.periodicaInfo?.parent?.titles?.main}
      className={props.className}
      skeleton={false}
      works={data?.work?.periodicaInfo?.similarArticles?.map(
        (entry) => entry.work
      )}
    />
  );
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
