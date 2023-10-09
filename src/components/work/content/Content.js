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
import { getFirstMatch } from "@/lib/utils";

/**
 * The Component function
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
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
        {skeleton && <Text skeleton={skeleton} lines={3} />}
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
            <Text type="text2">{moreContent?.content}</Text>
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
 * @param {Object} props
 *  See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
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
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.ReactElement | null}
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
    [...manifestations]
      ?.filter((el) => !isEmpty(el?.tableOfContents))
      ?.sort((a, b) =>
        getFirstMatch(true, 0, [
          [!isEmpty(a?.tableOfContents?.listOfContent), -1],
          [!isEmpty(b?.tableOfContents?.listOfContent), 1],
          [!isEmpty(a?.tableOfContents?.content), -1],
          [!isEmpty(b?.tableOfContents?.content), 1],
        ])
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
