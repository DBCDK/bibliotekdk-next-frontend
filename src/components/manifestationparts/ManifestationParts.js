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
}) {
  if (isEmpty(parts)) {
    return null;
  }

  return (
    <div className={styles.manifestionlistContainer}>
      {label && (
        <Text type="text4" lines={1}>
          {label}
        </Text>
      )}
      <ul className={(className && className) || styles.manifestionlist}>
        {parts?.map(
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
      {showMoreButton && parts?.length > 3 && (
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
  const partsToShow = (numberToShow && parts?.slice(0, numberToShow)) || parts;

  const modalOpen = () => {
    modal.push("manifestationContent", {
      pid: pid,
      showOrderTxt: false,
      singleManifestation: true,
      showmoreButtone: false,
    });
  };

  return (
    <ManifestationParts
      parts={partsToShow}
      titlesOnly={titlesOnly}
      className={className}
      label={label}
      modalOpen={modalOpen}
      showMoreButton={showMoreButton}
    />
  );
}
