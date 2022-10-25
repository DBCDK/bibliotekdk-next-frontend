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
import { LocalizationsLink } from "@/components/work/overview/localizationslink/LocalizationsLink";
import { useModal } from "@/components/_modal";
import useUser from "@/components/hooks/useUser";
import { OrderButton_TempUsingAlfaApi } from "@/components/work/reservationbutton/ReservationButton";
import { useData } from "@/lib/api/api";
import * as localizationsFragments from "@/lib/api/localizations.fragments";

/**
 * Column one of full view. Some links and a button.
 * @param manifestation
 * @param localizations
 * @param localizationsLoading
 * @param openOrderModal
 * @param opener
 * @param user
 * @param work
 * @returns {JSX.Element}
 * @constructor
 */
function ColumnOne({
  manifestation,
  localizations,
  localizationsLoading,
  openOrderModal,
  opener,
  user,
  work,
}) {
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
        <OrderButton_TempUsingAlfaApi
          user={user}
          openOrderModal={openOrderModal}
          selectedMaterial={{
            manifestations: [manifestation],
            onlineAccess: [],
          }}
          singleManifestion={true}
          type="secondary"
          size="small"
        />
      </div>
      <div className={styles.addilinks}>
        <div>
          <span>
            <LocalizationsLink
              opener={opener}
              localizations={localizations?.localizations}
              isLoading={localizationsLoading}
              materialType={manifestation.materialType}
            />
          </span>
        </div>
        <div>
          <Link
            dataCy="link-references"
            border={{ bottom: { keepVisible: true } }}
            onClick={() =>
              modal.push("references", {
                title: Translate({
                  context: "references",
                  label: "label_references_title",
                }),
                pids: [manifestation.pid],
                work: work,
                manifestation: manifestation,
              })
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
 * @param localizationsLoading
 * @param opener
 * @param openOrderModal
 * @param user
 * @returns {JSX.Element}
 * @constructor
 */
export function ManifestationFull({
  manifestation,
  work,
  localizations,
  localizationsLoading,
  opener,
  openOrderModal,
  user,
}) {
  // Parse manifestation, we use the useMemo hook such that the manifestation
  // is not parsed on every rerender of the component
  const parsed = useMemo(() => {
    return parseManifestation(manifestation);
  }, [manifestation]);

  return (
    <Row>
      <ColumnOne
        manifestation={manifestation}
        localizations={localizations}
        localizationsLoading={localizationsLoading}
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

export default function Wrap({ manifestation, work, workId }) {
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

  const pids = [manifestation.pid];

  const { data: localizations, isLoading: localizationsLoading } = useData(
    localizationsFragments.localizationsQuery({ pids })
  );

  const user = useUser();

  return (
    <ManifestationFull
      manifestation={manifestation}
      work={work}
      workId={workId}
      localizations={localizations}
      localizationsLoading={localizationsLoading}
      opener={openLocalizationsModal}
      openOrderModal={openOrderModal}
      user={user}
    />
  );
}
