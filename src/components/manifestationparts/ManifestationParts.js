/**
 * @file - Manifestationparts.js
 * Show a list of manifestationParts - eg. tracks from music - contents of sheetmusic etc.
 */

import { useData } from "@/lib/api/api";
import { manifestationParts } from "@/lib/api/manifestation.fragments";
import styles from "./ManifestationParts.module.css";
import Text from "@/components/base/text/Text";
import Button from "@/components/base/button";
import React from "react";
import Translate from "@/components/base/translate";
import isEmpty from "lodash/isEmpty";
import { useModal } from "@/components/_modal";

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
        <Button
          type="secondary"
          size="small"
          className={styles.manifestionPartsButton}
          onClick={() => modalOpen()}
        >
          {Translate({
            context: "bibliographic-data",
            label: "manifestationPartsButton",
          })}
        </Button>
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
    pid && manifestationParts({ pid: pid })
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
