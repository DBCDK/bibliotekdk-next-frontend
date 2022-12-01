import PropTypes from "prop-types";
import { Row, Col } from "react-bootstrap";
import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import * as workFragments from "@/lib/api/work.fragments";

import styles from "./Content.module.css";
import { useMemo } from "react";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Content({ className = "", data = {}, skeleton = false }) {
  if (!data?.tableOfContents?.listOfContent?.length) {
    return null;
  }
  // Translate Context
  const context = { context: "content" };

  return (
    <Section title={Translate({ ...context, label: "title" })}>
      <Row className={`${styles.content} ${className}`}>
        {data?.tableOfContents?.listOfContent?.map((n, i) => {
          return (
            <Col key={n.content + i} xs={12}>
              <Text type="text3" skeleton={skeleton} lines={8}>
                {n.content}
              </Text>
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
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function ContentSkeleton(props) {
  return (
    <Content
      {...props}
      data={{ tableOfContents: { listOfContent: ["..."] } }}
      className={`${props.className} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  const { workId, type } = props;

  const { data, isLoading, error } = useData(
    workFragments.tableOfContents({ workId })
  );

  // Find manifestation of the right type that contains tableOfContents
  const manifestation = useMemo(() => {
    return data?.work?.manifestations?.all?.find(
      (manifestation) =>
        manifestation?.tableOfContents &&
        manifestation?.materialTypes.find(
          (t) => t?.specific?.toLowerCase() === type.toLowerCase()
        )
    );
  }, [data]);

  if (error) {
    return null;
  }
  if (isLoading) {
    return <ContentSkeleton {...props} />;
  }

  return <Content {...props} data={manifestation} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  skeleton: PropTypes.bool,
};
