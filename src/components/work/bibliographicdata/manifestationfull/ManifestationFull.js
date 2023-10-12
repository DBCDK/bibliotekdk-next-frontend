/**
 * @file Template for showing a full manifestation
 */
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import React, { useId, useMemo, useState } from "react";
import animations from "css/animations";
import styles from "./ManifestationFull.module.css";

import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Cover from "@/components/base/cover";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import { parseManifestation } from "@/lib/manifestationParser";
import { cyKey } from "@/utils/trim";
import LocalizationsLink from "@/components/work/overview/localizationslink/LocalizationsLink";
import { useModal } from "@/components/_modal";
import ReservationButtonWrapper from "@/components/work/reservationbutton/ReservationButton";
import { openReferencesModal } from "@/components/work/utils";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import ManifestationParts from "@/components/manifestationparts/ManifestationParts";
import AlternativeOptions from "@/components/work/overview/alternatives/Alternatives";
import { IconLink } from "@/components/base/iconlink/IconLink";
import CopyLink from "@/public/icons/copy_link.svg";
import CheckMarkBlue from "@/public/icons/checkmark_blue.svg";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import cx from "classnames";
import BookMarkDropDown from "@/components/work/overview/bookmarkDropdown/BookmarkDropdown";

/**
 * Column one of full view. Some links and a button.
 * @param workId
 * @param manifestation
 * @returns {React.JSX.Element}
 */
function ColumnOne({ workId, manifestation }) {
  const modal = useModal();
  const copyLinkId = useId();
  function permalinkToPid(hash) {
    return `/work/pid/${hash.slice(1)}`;
  }

  const [checkMarkActive, setCheckMarkActive] = useState(false);

  const tooltip = (
    <Tooltip id={copyLinkId}>
      {checkMarkActive
        ? Translate({
            context: "bibliographic-data",
            label: "link_copied",
          })
        : Translate({
            context: "bibliographic-data",
            label: "copy_link",
          })}
    </Tooltip>
  );

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
        <Cover
          className={styles.cover}
          src={manifestation?.cover?.detail}
          size="thumbnail"
        />
      )}

      <div className={styles.reservationwrapper}>
        <div className={styles.button}>
          <ReservationButtonWrapper
            workId={workId}
            selectedPids={[manifestation?.pid]}
            singleManifestation={true}
            buttonType="secondary"
            size="small"
          />
        </div>
        <BookMarkDropDown
          workId={workId}
          materialId={manifestation.pid}
          materialTypes={[[manifestation?.materialTypes?.[0]?.specific]]}
          size={{ w: 4, h: 4 }}
          title={manifestation?.titles?.sort}
        />
      </div>

      <div className={cx(styles.alternativeoptions)}>
        <AlternativeOptions
          workId={workId}
          selectedPids={[manifestation?.pid]}
        />
      </div>

      <div className={styles.localizations_link}>
        <LocalizationsLink
          selectedPids={[manifestation?.pid]}
          singleManifestation={true}
        />
      </div>

      <div className={styles.reference_downloads}>
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

      <div className={styles.copy_link}>
        <OverlayTrigger
          overlay={tooltip}
          placement="right"
          delayShow={300}
          delayHide={150}
        >
          <div style={{ width: "fit-content" }}>
            <IconLink
              className={styles.copy_link}
              onClick={(event) => onClickCopyLink(event)}
              href={permalinkToPid(window.location.hash)}
              iconSrc={checkMarkActive ? CheckMarkBlue : CopyLink}
              iconPlacement={"right"}
              iconAnimation={[animations["h-elastic"], animations["f-elastic"]]}
            >
              {Translate({
                context: "bibliographic-data",
                label: "copy_link_to_edition",
              })}
            </IconLink>
          </div>
        </OverlayTrigger>
      </div>
    </Col>
  );
}

/**
 * Get the data to parse; parse it into 3 columns
 * @param workId
 * @param pid
 * @param hasBeenSeen
 * @returns {React.JSX.Element}
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
    <Row key={data?.manifestation?.pid}>
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
                <Title type="text4" tag="h4" lines={1}>
                  {label}
                </Title>
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
