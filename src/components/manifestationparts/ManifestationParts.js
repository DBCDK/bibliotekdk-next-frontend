/**
 * @file - Manifestationparts.js
 * Show a list of manifestationParts - eg. tracks from music - contents of sheetmusic etc.
 */

import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import styles from "./ManifestationParts.module.css";
import Text from "@/components/base/text/Text";
import React from "react";
import isEmpty from "lodash/isEmpty";
import { useModal } from "@/components/_modal";
import { ArrowRight } from "@/components/base/arrow/ArrowRight";

export function ManifestationParts({
  parts,
  titlesOnly = true,
  className,
  label,
  modalOpen,
  showMoreButton = true,
  numberToShow = 5,
}) {
  if (isEmpty(parts)) {
    return null;
  }

  const partsToShow = (numberToShow && parts?.slice(0, numberToShow)) || parts;

  const showMore = showMoreButton && parts > partsToShow;

  return (
    <div className={styles.manifestionlistContainer}>
      {label && (
        <Text type="text4" lines={1}>
          {label}
        </Text>
      )}

      <ul className={(className && className) || styles.manifestionlist}>
        {partsToShow?.map(
          (part) =>
            part && (
              <li>
                <Text type="text3" lines={1}>
                  {part.title}
                </Text>
                {part.playingTime && !titlesOnly && (
                  <Text type="text3" lines={1}>
                    {part.playingTime}
                  </Text>
                )}
              </li>
            )
        )}
      </ul>
      {showMore && (
        <>
          <span className={styles.arrowAndTxtContainer}>
            <div className={styles.arrowContainer}>
              <ArrowRight
                onClick={modalOpen}
                disabled={false}
                style={{ position: "inherit" }}
              />
            </div>

            <Text
              type="text3"
              lines={1}
              className={styles.showMore}
              onClick={modalOpen}
            >
              Vis mere
            </Text>
          </span>
        </>
      )}
    </div>
  );
}

export default function Wrap({
  pid,
  numberToShow,
  titlesOnly = false,
  className,
  label,
  showMoreButton = true,
}) {
  const { data, isLoading, error } = useData(
    pid && manifestationFragments.manifestationParts({ pid: pid })
  );

  const modal = useModal();

  if (error || !data) {
    return null;
  }
  if (isLoading) {
    return null;
  }

  const parts = data?.manifestation?.manifestationParts?.parts;

  // Open a modal
  const modalOpen = () => {
    alert("fisk");
    modal.push("manifestationContent", {
      pid: pid,
      showOrderTxt: false,
      singleManifestation: true,
      showmoreButton: false,
    });
  };

  return (
    <ManifestationParts
      parts={parts}
      titlesOnly={titlesOnly}
      className={className}
      label={label}
      modalOpen={modalOpen}
      showMoreButton={showMoreButton}
      numberToShow={numberToShow}
    />
  );
}
