/**
 * @file Template for showing a full manifestation
 */
import { Col, Row } from "react-bootstrap";
import React, { useMemo } from "react";

import Text from "@/components/base/text";
import Cover from "@/components/base/cover";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import { parseManifestation } from "@/lib/manifestationParser";
import styles from "./BibliographicData.module.css";
import { cyKey } from "@/utils/trim";
import LocalizationsLink from "@/components/work/overview/localizationslink/LocalizationsLink";
import { useModal } from "@/components/_modal";
import ReservationButton from "@/components/work/reservationbutton/ReservationButton";
import { openReferencesModal } from "@/components/work/utils";

/**
 * Column one of full view. Some links and a button.
 * @param manifestation
 * @param localizations
 * @param work
 * @returns {JSX.Element}
 * @constructor
 */
function ColumnOne({ work, workId, manifestation }) {
  const modal = useModal();

  return (
    <Col
      key={"col1" + manifestation.pid}
      xs={12}
      md={4}
      data-cy="bibliographic-column1"
      className={styles.fullmanifestation}
    >
      {manifestation.cover && (
        <Cover src={manifestation.cover.detail} size="thumbnail" />
      )}
      <div>
        <ReservationButton
          workId={workId}
          selectedPids={[manifestation?.pid]}
          singleManifestation={true}
          buttonType="secondary"
          size="small"
        />
      </div>
      <div className={styles.addilinks}>
        <div>
          <span>
            <LocalizationsLink
              workId={workId}
              selectedPids={[manifestation?.pid]}
            />
          </span>
        </div>
        <div>
          <Link
            dataCy="link-references"
            border={{ bottom: { keepVisible: true } }}
            onClick={() =>
              openReferencesModal(
                modal,
                [manifestation?.pid],
                work,
                manifestation
              )
            }
          >
            <Text type="text3" className={styles.linkstyle}>
              {Translate({
                context: "references",
                label: "label_references_title",
              })}
            </Text>
          </Link>
        </div>
      </div>
    </Col>
  );
}

/**
 * Get the data to parse; parse it into 3 columns
 * @param manifestation
 * @param work
 * @param localizations
 * @param workId
 * @returns {JSX.Element}
 * @constructor
 */
export default function ManifestationFull({ manifestation, work, workId }) {
  // Parse manifestation, we use the useMemo hook such that the manifestation
  // is not parsed on every rerender of the component
  const parsed = useMemo(() => {
    return parseManifestation(manifestation);
  }, [manifestation]);

  return (
    <Row>
      <ColumnOne work={work} workId={workId} manifestation={manifestation} />
      <Col xs={12} md>
        <div className={styles.container}>
          {parsed.map(({ label, value }) => {
            return (
              <div
                className={styles.item}
                key={label}
                data-cy={cyKey({ name: `${label}`, prefix: "edition-data" })}
              >
                <Text type="text4" lines={1}>
                  {label}
                </Text>
                <Text type="text3" lines={2} tag="span">
                  {value}
                </Text>
              </div>
            );
          })}
        </div>
      </Col>
    </Row>
  );
}
