import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import * as workFragments from "@/lib/api/work.fragments";

import styles from "./Content.module.css";
import React, { useMemo } from "react";
import isEqual from "lodash/isEqual";
import { flattenMaterialType } from "@/lib/manifestationFactoryUtils";
import { useModal } from "@/components/_modal";
import { LinkArrow } from "@/components/_modal/pages/order/linkarrow/LinkArrow";
import { ManifestationParts } from "@/components/manifestationparts/ManifestationParts";

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function Content({
  className = "",
  manifestation = {},
  skeleton = false,
}) {
  const modal = useModal();

  if (!manifestation?.tableOfContents?.listOfContent?.length) {
    return null;
  }

  // Translate Context
  const context = { context: "content" };

  const numberToShow = 25;

  const morecontent = manifestation?.tableOfContents?.listOfContent?.map(
    (n, i) => {
      return {
        title: n?.content,
      };
    }
  );
  const modalOpen = () => {
    modal.push("manifestationContent", {
      pid: manifestation?.pid,
      showOrderTxt: false,
      singleManifestation: true,
      showmoreButton: false,
      parts: morecontent,
    });
  };

  return (
    <Section title={Translate({ ...context, label: "title" })}>
      <Row className={`${styles.content} ${className}`}>
        {skeleton && <Text skeleton={skeleton}></Text>}
        <Col xs={12} md={8}>
          <ManifestationParts
            parts={morecontent}
            showMoreButton={true}
            titlesOnly={false}
            numberToShow={numberToShow}
            modalOpen={modalOpen}
          />
        </Col>
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
  const manifestation = data?.work?.manifestations?.mostRelevant?.find(
    (manifestation) =>
      manifestation?.tableOfContents &&
      isEqual(flattenMaterialType(manifestation), type)
  );

  if (error) {
    return null;
  }
  if (isLoading) {
    return <ContentSkeleton {...props} />;
  }

  return <Content {...props} manifestation={manifestation} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.arrayOf(PropTypes.string),
  skeleton: PropTypes.bool,
};
