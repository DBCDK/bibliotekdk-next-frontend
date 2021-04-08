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
function ColumnOne({ manifestation }) {
  let number_of_libraries = "63";
  return (
    <Col
      key={"col1" + manifestation.pid}
      xs={12}
      md={4}
      data-cy="bibliographic-column1"
      className={styles.fullmanifestation}
    >
      {manifestation.cover && (
        <Cover src={manifestation.cover.detail} size={["100px", "auto"]} />
      )}
      <Text className={styles.locationtitle} type="text1" lines={1}>
        {Translate({
          context: "bibliographic-data",
          label: "locationtitle",
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
    </Col>
  );
}

/**
 * Get the data to parse; parse it into 3 columns
 * @param manifestation
 * @returns {JSX.Element}
 * @constructor
 */
export function ManifestationFull({ manifestation }) {
  // Parse manifestation, we use the useMemo hook such that the manifestation
  // is not parsed on every rerender of the component
  const parsed = useMemo(() => {
    return parseManifestation(manifestation);
  }, [manifestation]);

  return (
    <React.Fragment>
      <ColumnOne manifestation={manifestation} />
      <Col xs={12} md>
        <div className={styles.container}>
          {parsed.map(({ label, value }) => {
            return (
              <div className={styles.item} key={label}>
                <Text type="text4" lines={1}>
                  {label}
                </Text>
                <Text type="text3" lines={2}>
                  {value}
                </Text>
              </div>
            );
          })}
        </div>
      </Col>
    </React.Fragment>
  );
}
