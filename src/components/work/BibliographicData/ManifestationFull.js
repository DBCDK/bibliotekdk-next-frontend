/**
 * @file Template for showing a full manifestation
 */
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React, { useMemo, useState } from "react";
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
import { IconLink } from "@/components/base/iconlink/IconLink";
import CopyLink from "@/public/icons/copy_link.svg";
import CheckMarkBlue from "@/public/icons/checkmark_blue.svg";

/**
 * Column one of full view. Some links and a button.
 * @param workId
 * @param manifestation
 * @returns {JSX.Element}
 * @constructor
 */
function ColumnOne({ workId, manifestation }) {
  const modal = useModal();
  function permalinkToPid(hash) {
    return `/work/pid/${hash.slice(1)}`;
  }

  const [checkMarkActive, setCheckMarkActive] = useState(false);

  function onClickCopyLink(event) {
    event.preventDefault();
    setCheckMarkActive(true);
    setTimeout(() => setCheckMarkActive(false), 2000);
    navigator.clipboard.writeText(
      window.location.host + permalinkToPid(window.location.hash)
    );
  }

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
        <div className={styles.linkstyle}>
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
            <Text type="text3" tag="span">
              {Translate({
                context: "references",
                label: "label_references_title",
              })}
            </Text>
          </Link>
        </div>
        <IconLink
          className={styles.linkstyle}
          onClick={(event) => onClickCopyLink(event)}
          href={permalinkToPid(window.location.hash)}
          iconSrc={checkMarkActive ? CheckMarkBlue : CopyLink}
          iconPlacement={"right"}
          iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
          iconStyle={{ marginTop: "var(--pt05)" }}
        >
          Kopier link til udgave
        </IconLink>
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
