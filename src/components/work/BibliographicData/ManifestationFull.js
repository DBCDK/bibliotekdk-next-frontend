/**
 * @file Template for showing a full manifestation
 */
import { Col, Row } from "react-bootstrap";
import React, { useMemo } from "react";

import Text from "@/components/base/text";
import Cover from "@/components/base/cover";
import Link from "@/components/base/link";
import Button from "@/components/base/button";
import Translate from "@/components/base/translate";

import { parseManifestation } from "@/lib/manifestationParser";
import styles from "./BibliographicData.module.css";
import { cyKey } from "@/utils/trim";
import { LocalizationsLink } from "@/components/work/overview/localizationslink/LocalizationsLink";
import { useModal } from "@/components/_modal";
import useUser from "@/components/hooks/useUser";
import ReservationButton from "@/components/work/reservationbutton/ReservationButton";

/**
 * bibliotek.dk object url
 *
 * @param {string} pid
 *
 * @returns {string}
 */
function bibdkObjectUrl(pid) {
  return {
    pathname: "https://bibliotek.dk/linkme.php",
    query: `rec.id=${pid}`,
  };
}

/**
 * Column one of full view. Some links and a button.
 * @param manifestation
 * @returns {JSX.Element}
 * @constructor
 */
function ColumnOne({
  manifestation,
  worktypes,
  localizations,
  openOrderModal,
  opener,
  user,
}) {
  const worktype = worktypes && worktypes[0] ? worktypes[0] : "literature";

  let number_of_libraries = "63";

  /**
   * NOTES - params for reservationbutton
   * selectedMaterial={selectedMaterial}
   *                   user={user}
   *                   onOnlineAccess={onOnlineAccess}
   *                   login={login}
   *                   openOrderModal={openOrderModal}
   *                   workTypeTranslated={workTypeTranslated}
   *                   title={title}
   */
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
        <span>
          <LocalizationsLink
            opener={opener}
            localizations={{ count: localizations?.length || "0" }}
            materialType={manifestation.materialType}
          />
        </span>

        <div className={styles.reservationbutton}>
          <ReservationButton
            user={user}
            openOrderModal={openOrderModal}
            selectedMaterial={{
              manifestations: [manifestation],
              onlineAccess: [],
            }}
            singleManifestion={true}
          />
        </div>
      </div>
      {/* --- BETA-1 commented out .. link to bibliotek.dk, location (number of libraries), bookmark, basket
      <Text className={styles.locationtitle} type="text1" lines={1}>
        {Translate({
          context: "bibliographic-data",
          label: "locationtitle",
          vars: [
            Translate({ context: "workTypeDistinctForm", label: worktype }),
          ],
        })}
      </Text>
      <div>
        <Link
          children={
            <Text type="text3" lines={2}>
              {Translate({
                context: "bibliographic-data",
                label: "editionlink",
              })}
            </Text>
          }
          className={styles.column}
          href={bibdkObjectUrl(manifestation.pid)}
        />
      </div>

      <div>
        <Link
          children={
            <Text type="text3" lines={2}>
              {Translate({
                context: "bibliographic-data",
                label: "bookmark",
              })}
            </Text>
          }
          className={styles.column}
          href={{ pathname: "http://google.dk", query: {} }}
        />
      </div>
      <div>
        <Link
          children={
            <Text type="text3" lines={2}>
              {Translate({
                context: "bibliographic-data",
                label: "library-locations",
                vars: [number_of_libraries],
              })}
            </Text>
          }
          className={styles.column}
          href={{ pathname: "http://google.dk", query: {} }}
        />
      </div>


      <Button
        type={"secondary"}
        size={"small"}
        children={Translate({
          context: "overview",
          label: "addToCart",
        })}
      />
      */}
    </Col>
  );
}

/**
 * Get the data to parse; parse it into 3 columns
 * @param manifestation
 * @returns {JSX.Element}
 * @constructor
 */
export function ManifestationFull({
  manifestation,
  work,
  allLocalizations,
  opener,
  openOrderModal,
  user,
}) {
  const worktype = work.workTypes;
  // Parse manifestation, we use the useMemo hook such that the manifestation
  // is not parsed on every rerender of the component
  const parsed = useMemo(() => {
    return parseManifestation(manifestation);
  }, [manifestation]);

  // find localizations for this manifestation
  const manifestationLocalizationType =
    allLocalizations?.work?.materialTypes.find(
      (type) => type.materialType === manifestation.materialType
    );
  const manifestationLocalizations = [];
  manifestationLocalizationType?.localizations?.agencies?.map((agency) => {
    const maniholding = agency.holdingItems.find(
      (holding) => holding.localizationPid === manifestation.pid
    );
    if (maniholding) {
      manifestationLocalizations.push(maniholding);
    }
  });

  return (
    <Row>
      <ColumnOne
        manifestation={manifestation}
        worktypes={worktype}
        localizations={manifestationLocalizations}
        openOrderModal={openOrderModal}
        opener={opener}
        user={user}
        work={work}
      />
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

export default function wrap({ manifestation, work, workId, localizations }) {
  const modal = useModal();
  const openLocalizationsModal = () => {
    modal.push("localizations", {
      title: Translate({ context: "modal", label: "title-order" }),
      workId,
      materialType: manifestation.materialType,
      pids: [manifestation.pid],
    });
  };

  const openOrderModal = (pid) => {
    modal.push("order", {
      title: Translate({ context: "modal", label: "title-order" }),
      pid,
      workId,
      type: manifestation.materialType,
      orderType: "singleManifestation",
    });
  };

  const user = useUser();

  return (
    <ManifestationFull
      manifestation={manifestation}
      work={work}
      workId={workId}
      allLocalizations={localizations}
      opener={openLocalizationsModal}
      openOrderModal={openOrderModal}
      user={user}
    />
  );
}
