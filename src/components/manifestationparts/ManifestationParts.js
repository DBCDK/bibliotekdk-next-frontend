/**
 * @file - Manifestationparts.js
 * Show a list of manifestationParts - eg. tracks from music - contents of sheetmusic etc.
 * Is also used to show content of litterature (tableOfContents)
 *
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
// import { LinkArrow } from "@/components/_modal/pages/order/linkarrow/LinkArrow";
import { IconLink as LinkArrow } from "@/components/base/iconlink/IconLink";
import Translate from "@/components/base/translate";
import cx from "classnames";

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

  // we want contributorsFromDescription AND creatorsFromDescription in the same string
  const creatorsAndContributorsDisplay = (part) => {
    const fromDescriptionArray = [
      ...(part?.contributorsFromDescription
        ? part?.contributorsFromDescription
        : []),
      ...(part?.creatorsFromDescription ? part?.creatorsFromDescription : []),
    ];

    const fromDescription = fromDescriptionArray?.join(", ");

    return !isEmpty(fromDescription) ? (
      <span className={styles.contributors}>({fromDescription})</span>
    ) : null;
  };
  const creatorsDisplay = (part) => {
    const creatorsString = part?.creators
      ?.map((creator) => creator?.display)
      .join(", ");
    return !isEmpty(creatorsString) ? <span>{creatorsString}</span> : null;
  };

  // show some kind of contributors also
  // we take creators [{display:string}] array first if any - else we look in
  // creatorsFromDescription [string]
  // we need to transform orignal array into something parsable
  const displayarray = partsToShow.map(
    (part, index) =>
      part?.title && (
        <li key={`manifestationlist-${index}`}>
          <Text type="text3" lines={1}>
            {part.title}
            {creatorsAndContributorsDisplay(part) &&
              creatorsAndContributorsDisplay(part)}
          </Text>
          <Text type="text3" lines={1}>
            {!titlesOnly && creatorsDisplay(part) && creatorsDisplay(part)}
          </Text>
          {!titlesOnly && (
            <Text type="text3" lines={1}>
              {part?.playingTime || ""}
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
        <LinkArrow
          iconPlacement="right"
          iconOrientation={180}
          border={{ bottom: { keepVisible: true }, top: false }}
          className={cx(styles.arrowchanges, className)}
          onClick={modalOpen}
        >
          <Text type="text3" lines={1} tag="span">
            {Translate({
              context: "manifestation_content",
              label: "see_all",
            })}{" "}
            ({parts.length})
          </Text>
        </LinkArrow>
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
  parts = [],
}) {
  const { data, isLoading, error } = useData(
    pid && manifestationFragments.manifestationParts({ pid: pid })
  );

  const modal = useModal();

  if (error || (!data && isEmpty(parts))) {
    return null;
  }
  if (isLoading) {
    // @TODO -> skeleton
    return null;
  }
  // if we have manifestation parts from usedata hook we use them before data given in props.
  // TODO .. is that correct ?
  const manifestationparts =
    data?.manifestation?.manifestationParts?.parts || parts;

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
      parts={manifestationparts}
      titlesOnly={titlesOnly}
      className={className}
      label={label}
      modalOpen={modalOpen}
      showMoreButton={showMoreButton}
      numberToShow={numberToShow}
    />
  );
}
