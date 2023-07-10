import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useData } from "@/lib/api/api";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

import * as workFragments from "@/lib/api/work.fragments";

import styles from "./Content.module.css";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import { useModal } from "@/components/_modal";
import { ManifestationParts } from "@/components/manifestationparts/ManifestationParts";
import isEmpty from "lodash/isEmpty";

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
  // Translate Context
  const context = { context: "content" };
  const modal = useModal();
  const numberToShow = 10;

  const modalOpen = ({ parts }) => {
    modal.push("manifestationContent", {
      pid: manifestation?.pid,
      showOrderTxt: false,
      singleManifestation: true,
      showmoreButton: false,
      parts: parts,
    });
  };

  const moreContent = {
    listOfContent: manifestation?.tableOfContents?.listOfContent
      ?.map((n) => {
        return {
          title: n?.content,
        };
      })
      // we have arrays with empty content in data - TODO tell jedi team
      .filter((more) => !isEmpty(more.title)),
    content: manifestation?.tableOfContents?.content,
  };

  if (isEmpty(moreContent?.listOfContent) && isEmpty(moreContent?.content)) {
    return null;
  }

  return (
    <Section
      title={Translate({ ...context, label: "title" })}
      divider={{ content: false }}
    >
      <Row className={`${styles.content} ${className}`}>
        {skeleton && <Text skeleton={skeleton}></Text>}
        <Col xs={12} md={8}>
          {!isEmpty(moreContent?.listOfContent) ? (
            <ManifestationParts
              parts={moreContent?.listOfContent}
              showMoreButton={true}
              titlesOnly={false}
              numberToShow={numberToShow}
              modalOpen={() => modalOpen({ parts: moreContent?.listOfContent })}
            />
          ) : !isEmpty(moreContent?.content) ? (
            <div>{moreContent?.content}</div>
          ) : (
            <></>
          )}
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

  const { flattenGroupedSortedManifestationsByType } =
    manifestationMaterialTypeFactory(data?.work?.manifestations?.mostRelevant);

  // Find manifestation of the right type that contains tableOfContents
  const manifestations = flattenGroupedSortedManifestationsByType(type);

  const sortedManifestations =
    manifestations &&
    [...manifestations]?.sort(
      (a, b) =>
        -Number(!!a?.tableOfContents?.listOfContent) ||
        Number(!!b?.tableOfContents?.listOfContent) ||
        -Number(!!a?.tableOfContents?.content) ||
        Number(!!b?.tableOfContents?.content) ||
        0
    );

  const manifestation = sortedManifestations?.[0];

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
