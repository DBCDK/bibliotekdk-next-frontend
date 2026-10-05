import Bookmark from "@/components/base/bookmark/Bookmark";
import styles from "./BookmarkDropDown.module.css";
import Dropdown from "react-bootstrap/Dropdown";
import Text from "@/components/base/text/Text";

import React, { useEffect, useRef, useState } from "react";
import { cyKey } from "@/utils/trim";
import useBookmarks, {
  getBookmarkKey as getStoredBookmarkKey,
} from "@/components/hooks/useBookmarks";
import Translate from "@/components/base/translate";
import Icon from "@/components/base/icon/Icon";
import BookmarkMedium from "@/public/icons/bookmark_small.svg";
import {
  flattenMaterialType,
  formatMaterialTypesToCode,
  formatMaterialTypesToPresentation,
} from "@/lib/manifestationFactoryUtils";
import { createEditionText } from "../../details/utils/details.utils";
import cx from "classnames";
import isEmpty from "lodash/isEmpty";

export function getBookmarkKey(material) {
  return getStoredBookmarkKey({
    materialId: material.materialId,
    workId: material.materialId?.startsWith("work-of:")
      ? material.materialId
      : undefined,
    materialType: formatMaterialTypesToCode(material.materialTypes),
  });
}

export function BookMarkMaterialSelector({
  materialTypes,
  workId,
  materialId = workId, // A reference to the bookmark materialId - workId or pid
  size = { w: 7, h: 7 },
  className,
  title,
  singleManifestation,
  editions,
}) {
  const manifestations = editions;

  const {
    bookmarks: bookmarksBeforeFilterOnWorkId,
    setBookmark,
    isLoading,
    error,
    retry,
  } = useBookmarks({ workId });

  const bookmarks = isLoading
    ? []
    : bookmarksBeforeFilterOnWorkId
        ?.filter((bookmark) => bookmark.workId === workId)
        .filter((bookmark) =>
          singleManifestation
            ? bookmark.materialId === manifestations?.[0]?.pid
            : true
        );

  const [options, setOptions] = useState(materialTypes);

  const isOpen = useRef(false);

  useEffect(() => {
    if (isOpen.current) {
      // on't change options if dropdown is open. Wait for close event.
      return;
    }

    revalidateEditions();
  }, [JSON.stringify(bookmarks)]);

  const revalidateEditions = () => {
    const defaultOptions = [...materialTypes];

    if (singleManifestation) {
      setOptions([
        {
          editionDisplayText: formatMaterialTypesToPresentation(
            materialTypes?.[0]
          ),
          materialTypes: materialTypes?.[0],
          materialId: materialId,
        },
      ]);
      return;
    }

    const materialTypeEditions = defaultOptions.map((mat) => {
      return {
        editionDisplayText: formatMaterialTypesToPresentation(mat),
        materialTypes: mat,
        materialId: materialId,
      };
    });

    const addedEditions = bookmarks?.filter(
      (bookmark) =>
        bookmark.materialId !== bookmark.workId && bookmark.workId === workId
    );
    const specificEditions =
      addedEditions
        ?.map((addedEdition) => {
          const edition = manifestations?.find(
            (edi) => edi.pid === addedEdition.materialId
          );
          if (!edition) {
            return null;
          }

          return {
            editionDisplayText:
              formatMaterialTypesToPresentation(flattenMaterialType(edition)) +
              ", " +
              createEditionText(edition),
            pid: edition?.pid,
            ...edition,
            materialTypes: flattenMaterialType(edition),
            materialId: addedEdition.materialId,
          };
        })
        ?.filter((i) => !!i) || [];

    setOptions([...materialTypeEditions, ...specificEditions]);
  };

  const findBookmark = (material) => {
    const exact = bookmarks?.find(
      (bookmark) => getStoredBookmarkKey(bookmark) === getBookmarkKey(material)
    );
    if (exact) return exact;
    if (material.materialId !== workId) return undefined;
    return bookmarks?.find((bookmark) => {
      if (bookmark.materialId !== workId) return false;
      if (!bookmark.selection) {
        return (
          getBookmarkKey(material) ===
          getBookmarkKey({
            materialId: workId,
            materialTypes: materialTypes[0],
          })
        );
      }
      const field = bookmark.selection.materialTypes.general
        ? "general"
        : "specific";
      const codes = material.materialTypes.map(
        (type) => type[field === "general" ? "generalCode" : "specificCode"]
      );
      return bookmark.selection.materialTypes[field].every((code) =>
        codes.includes(code)
      );
    });
  };

  const onSelect = async (material, workId) => {
    if (isLoading || error) return;
    await setBookmark({
      key: findBookmark(material)?.key,
      materialId: material.materialId,
      workId,
      materialType: formatMaterialTypesToCode(material.materialTypes),
      title,
    });
  };

  const onDropdownToggle = (event) => {
    // Store open state in ref, so we can wait with updating options untill dropdown is closed
    isOpen.current = event;

    if (event === false) {
      // On close - Empty options and revalidate editions - effect subscribes to options changes
      revalidateEditions();
    }
  };

  if (error) {
    return (
      <Text type="text3">
        {Translate({ context: "receipt", label: "errorOccured" })}{" "}
        <button type="button" onClick={retry}>
          {Translate({ context: "general", label: "retry" })}
        </button>
      </Text>
    );
  }

  if (options.length === 1) {
    return (
      <Bookmark
        size={size}
        className={`${styles.bookmark} ${className}`}
        selected={!!findBookmark(options[0])}
        onClick={async (e) => {
          e.preventDefault();
          await onSelect(options[0], workId);
        }}
      />
    );
  }

  return (
    <Dropdown
      className={`${styles.dropdownwrap} ${className}`}
      align="end"
      autoClose="outside"
      onToggle={onDropdownToggle}
    >
      <Dropdown.Toggle
        as="div"
        data-cy={cyKey({ name: "material-selector", prefix: "bookmark" })}
        variant="success"
      >
        <Bookmark
          size={size}
          onClick={(e) => e.preventDefault()}
          selected={!isEmpty(bookmarks)}
          className={styles.bookmark}
        />
      </Dropdown.Toggle>
      <Dropdown.Menu
        className={styles.dropdownmenu}
        drop="up"
        data-cy={cyKey({
          name: "material-selector-dropdown",
          prefix: "bookmark",
        })}
      >
        {options.map((material, index) => {
          const activeItem = !!findBookmark(material);

          return (
            <Dropdown.Item
              data-cy={`bookmark-${material.editionDisplayText}-${index}`}
              key={`bookmark-${index}`}
              className={cx(styles.dropdownitem, {
                [styles.active]: !!activeItem,
              })}
              data-selected={activeItem ? "true" : "false"}
              onClick={async (e) => {
                e.preventDefault();
                await onSelect(material, workId);
              }}
            >
              <div className={styles.itemContainer}>
                <Text type="text3" className={styles.dropdownitemText}>
                  {material?.editionDisplayText}
                </Text>

                <Icon size={{ w: 3, h: 3 }}>
                  <BookmarkMedium />
                </Icon>
              </div>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BookMarkMaterialSelector;
