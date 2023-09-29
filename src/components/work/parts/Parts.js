/**
 * @file - Parts.js
 * section in overview showing parts/content. Eg tracks of music or content of sheetmusic
 */

import Section from "@/components/base/section";
import Row from "react-bootstrap/Row";
import styles from "./Parts.module.css";
import Col from "react-bootstrap/Col";
import { ManifestationParts } from "@/components/manifestationparts/ManifestationParts";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import isEqual from "lodash/isEqual";
import { flattenMaterialType } from "@/lib/manifestationFactoryUtils";
import Translate from "@/components/base/translate";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import isEmpty from "lodash/isEmpty";
import Text from "@/components/base/text/Text";
import { useModal } from "@/components/_modal";

export function Parts({ parts, type, modalOpen }) {
  const subtitle = Translate({
    context: "details",
    label: "subtitle",
    vars: [type],
  });

  if (isEmpty(parts)) {
    return null;
  }

  // show at most 10 in overview
  const numberToShow = 10;

  return (
    <Section
      title={Translate({
        context: "bibliographic-data",
        label: "manifestationParts",
      })}
      subtitle={subtitle}
      divider={{ content: false }}
    >
      <Row>
        <Col xs={12} md={9}>
          <ManifestationParts
            parts={parts}
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

function PartsSkeleton() {
  return (
    <Section
      title={
        <Text type="text3" lines={2} skeleton={true}>
          ...
        </Text>
      }
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
    >
      <Row>
        <Col xs={6} md={3} className={styles.skeleton}>
          <Text
            type="text3"
            lines={6}
            skeleton={true}
            className={styles.skeleton}
          >
            ...
          </Text>
        </Col>
      </Row>
    </Section>
  );
}

export default function Wrap(props) {
  const modal = useModal();
  const { workId, type } = props;
  // we reuse workfragments.buttontxt - for better performence
  // get manifestations from workid
  const { data, isLoading, error } = useData(
    workFragments.buttonTxt({ workId })
  );
  const manifestations = data?.work?.manifestations?.mostRelevant;

  // find the selected materialType (manifestation), use first manifestation as fallback
  const manifestationByMaterialType =
    manifestations?.find((manifestation) => {
      return isEqual(flattenMaterialType(manifestation), type);
    }) || manifestations?.[0];

  // now get the manifestation parts
  const {
    data: manifestationData,
    isLoading: manifestationIsLoading,
    error: manifestattionError,
  } = useData(
    manifestationByMaterialType?.pid &&
      manifestationFragments.manifestationParts({
        pid: manifestationByMaterialType?.pid,
      })
  );

  if (error || !manifestationData || manifestattionError) {
    return null;
  }
  if (isLoading || manifestationIsLoading) {
    return <PartsSkeleton />;
  }

  const modalOpen = () => {
    modal.push("manifestationContent", {
      pid: manifestationByMaterialType?.pid,
      showOrderTxt: false,
      singleManifestation: true,
      showmoreButton: false,
    });
  };

  const parts = manifestationData?.manifestation?.manifestationParts?.parts;
  return <Parts parts={parts} type={type} modalOpen={modalOpen} />;
}
