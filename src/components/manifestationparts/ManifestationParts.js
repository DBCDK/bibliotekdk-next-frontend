/**
 * @file - Manifestationparts.js
 * Show a list of manifestationParts - eg. tracks from music - contents of sheetmusic etc.
 * NOTICE
 * data input for this component is the 'parts' prop. It must be in the form :
 *  [title(string), creators[{display:string}] || creatorsFromDescription[string], playingTime(string)]
 * The title is always shown.
 * The titlesOnly prop tells whether to show more than title.
 * Remaining data is shown if present
 *
 */

import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import styles from "./ManifestationParts.module.css";
import Text from "@/components/base/text/Text";
import React from "react";
import isEmpty from "lodash/isEmpty";
import { useModal } from "@/components/_modal";
import { LinkArrow } from "@/components/_modal/pages/order/linkarrow/LinkArrow";

export function ManifestationParts({
  parts,
  titlesOnly = true,
  className,
  label,
  modalOpen,
  showMoreButton = true,
  numberToShow,
}) {
  if (isEmpty(parts)) {
    return null;
  }

  const partsToShow = (numberToShow && parts?.slice(0, numberToShow)) || parts;
  const showMore = showMoreButton && parts?.length > partsToShow?.length;

  // show some kind of contributors also
  // we take creators [{display:string}] array first if any - else we look in
  // creatorsFromDescription [string]
  // we need to transform orignal array into something parsable
  const displayarray = partsToShow.map(
    (part, index) =>
      part?.title && (
        <li key={`manifestationlist-${index}`}>
          <Text type="text3" lines={1} className={styles.partstitle}>
            {part.title}
            {!titlesOnly &&
              (!isEmpty(part.creators)
                ? "  -  " +
                  part.creators.map((creator) => creator.display).join(", ")
                : !isEmpty(part.creatorsFromDescription)
                ? "  -  " + part.creatorsFromDescription.join(", ")
                : "")}
          </Text>

          {!titlesOnly && part.playingTime && (
            <Text type="text3" lines={1} className={styles.nobreak}>
              {part.playingTime}
            </Text>
          )}
        </li>
      )
  );

  return (
    <div className={styles.manifestionlistContainer}>
      {label && (
        <Text type="text4" lines={1}>
          {label}
        </Text>
      )}
      <ul className={`${styles.manifestionlist} ${className}`}>
        {!isEmpty(displayarray) && displayarray}
      </ul>

      {showMore && (
        <>
          <span className={`${styles.arrowAndTxtContainer} ${className}`}>
            <div>
              <LinkArrow className={styles.arrowchanges}>
                <Text type="text3" lines={1} onClick={modalOpen}>
                  Se alle ({parts.length})
                </Text>
              </LinkArrow>
            </div>
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

  console.log(pid, "PID");

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
