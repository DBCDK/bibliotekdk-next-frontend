/**
 * @file Template for showing a full manifestation
 */
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React, { useMemo } from "react";
import cx from "classnames";
import animations from "@/components/base/animation/animations.module.css";

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
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import ManifestationParts from "@/components/manifestationparts/ManifestationParts";
import AlternativeOptions from "@/components/work/overview/alternatives/Alternatives";
import Icon from "@/components/base/icon";

/**
 * Column one of full view. Some links and a button.
 * @param workId
 * @param manifestation
 * @returns {JSX.Element}
 * @constructor
 */
function ColumnOne({ workId, manifestation }) {
  const modal = useModal();

  return (
    <Col
      key={"col1" + manifestation?.pid}
      xs={12}
      md={4}
      data-cy="bibliographic-column1"
      className={styles.fullmanifestation}
    >
      {manifestation?.cover?.detail && (
        <Cover src={manifestation?.cover?.detail} size="thumbnail" />
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

      <div className={styles.alternativeoptions}>
        <AlternativeOptions
          workId={workId}
          selectedPids={[manifestation?.pid]}
        />
      </div>

      <div className={styles.addilinks}>
        <div>
          <span>
            <LocalizationsLink selectedPids={[manifestation?.pid]} />
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
                workId,
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
        <Link
          border={false}
          className={cx(
            styles.copy_link,
            animations["h-elastic"],
            animations["f-elastic"]
          )}
        >
          <Icon
            size={{ w: 2, h: 2 }}
            src={"copy_link.svg"}
            className={styles.icon}
          />
          <Link
            border={{ bottom: { keepVisible: true } }}
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
          >
            <Text type="text3" className={styles.linkstyle}>
              Kopier link til udgave
            </Text>
          </Link>
        </Link>
      </div>
    </Col>
  );
}

/**
 * Get the data to parse; parse it into 3 columns
 * @param workId
 * @param pid
 * @param hasBeenSeen
 * @returns {JSX.Element}
 * @constructor
 */
export default function ManifestationFull({ workId, pid, hasBeenSeen }) {
  const { data } = useData(
    hasBeenSeen &&
      pid &&
      manifestationFragments.manifestationFullManifestation({ pid: pid })
  );

  const parsed = useMemo(() => {
    return parseManifestation(data?.manifestation);
  }, [data?.manifestation]);

  if (!data?.manifestation || !data?.manifestation?.pid) {
    return <></>;
  }

  return (
    <Row>
      <ColumnOne workId={workId} manifestation={data?.manifestation} />
      <Col xs={12} md>
        <div className={styles.container}>
          {parsed?.map(({ label, value }) => {
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
          <ManifestationParts
            pid={data?.manifestation?.pid}
            titlesOnly={true}
            className={styles.manifestationPartsList}
            numberToShow={3}
            label={Translate({
              context: "bibliographic-data",
              label: "manifestationParts",
            })}
          />
        </div>
      </Col>
    </Row>
  );
}
