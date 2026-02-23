import Translate from "@/components/base/translate/Translate";
import Top from "../../base/top/Top";
import LinksList from "../LinksList";
import { usePopulateBookmarks } from "@/components/hooks/useBookmarks";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./MultiReferences.module.css";
import Text from "@/components/base/text";
import cx from "classnames";
import { useModal } from "@/components/_modal/Modal";
import Material from "./Material";
import { useEffect, useMemo, useState } from "react";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";
import Checkbox from "@/components/base/forms/checkbox";
import {
  getMaterialTypeForPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import { splitList } from "./utils";

export const CONTEXT = "multiReferences";
// When many work-bookmarks need an edition choice, offer "auto-select newest".
const CHECKBOX_TRESHHOLD = 20;

const SingleReference = ({ bookmarkInList }) => {
  const { data: materials, isLoading } = usePopulateBookmarks(bookmarkInList);
  const material = materials[0];
  const materialType = getMaterialTypeForPresentation(
    material?.manifestations?.[0]?.materialTypes,
  );

  if (isLoading) return null;

  const materialCardTemplate = () =>
    templateImageToLeft({
      /**
       * If chosenPid, we override what we can with the manifestation data,
       * to get precise image and edition text etc
       */

      material: {
        ...material?.manifestations?.[0],
        materialType: materialType,
      },
      singleManifestation: true,
      isPeriodicaLike: false, //we have filtered out periodicalike materials
      //isDigitalArticle doesnt matter, since we always show edition
    });

  return (
    <MaterialCard
      propAndChildrenTemplate={materialCardTemplate}
      colSizing={{ xs: 12 }}
    />
  );
};

/**
 * Find the bookmarked items that require user action before we can export references.
 *
 * This happens when the user has bookmarked one or more *works* (materialId starts with `"work-of"`),
 * since a work-level bookmark does not point to a concrete manifestation pid.
 *
 * We therefore must:
 * - populate the work with its relevant manifestations
 * - auto-select if there is only one valid manifestation
 * - otherwise let the user pick an edition (pid) before enabling export links
 */
function useMultiReferences({ materials, modal }) {
  // First we need to find the work-level bookmarks
  const workBookmarks = useMemo(() => {
    const raw = materials.filter((material) =>
      material.materialId.startsWith("work-of"),
    );

    // De-dupe to avoid inflated counts/URLs if upstream sends duplicates.
    const seen = new Set();
    return raw.filter((b) => {
      const k =
        b?.key ??
        b?.bookmarkId ??
        `${b?.workId ?? ""}:${b?.materialId ?? ""}:${b?.materialType ?? ""}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [materials]);

  console.log("workBookmarks", workBookmarks);

  // Then we populate the work-level bookmarks with their relevant manifestations
  const { data: populatedBookmarks, isLoading } =
    usePopulateBookmarks(workBookmarks);

  // Store the user's selections per work `key`.
  const [selectionByKey, setSelectionByKey] = useState({});

  // Reset the selections when the modal is closed
  useEffect(() => {
    if (modal.isVisible === false) {
      setSelectionByKey({});
    }
  }, [modal.isVisible]);

  // Then we split the populated bookmarks into periodica and non-periodica bookmarks
  const {
    periodicaManifestations,
    nonPeriodicaManifestations: nonPeriodicaBookmarks,
  } = useMemo(() => splitList(populatedBookmarks), [populatedBookmarks]);

  // Apply the user's selections to the non-periodica bookmarks
  const workBookmarksWithSelectionState = useMemo(() => {
    return nonPeriodicaBookmarks.map((item) => {
      const selection = selectionByKey[item.key];
      if (!selection) return item;

      return {
        ...item,
        chosenPid: selection?.chosenPid ?? item.chosenPid,
        newestPid: selection?.newestPid ?? item.newestPid,
        toFilter: selection?.toFilter ?? item.toFilter,
      };
    });
  }, [nonPeriodicaBookmarks, selectionByKey]);

  // Then we find the work-level bookmarks that require user action
  const missingActionMaterials = useMemo(
    () =>
      workBookmarksWithSelectionState.filter(
        (mat) => !mat.chosenPid && !mat.toFilter,
      ),
    [workBookmarksWithSelectionState],
  );

  // We only show the auto checkbox if there are more than 20 work-level bookmarks that require user action
  const isAutoCheckboxSelected =
    missingActionMaterials.length > CHECKBOX_TRESHHOLD;

  // Manifestation-level inputs already have concrete pids.
  const manifestationReferenceCount = useMemo(
    () => materials.filter((m) => !m.materialId.startsWith("work-of")).length,
    [materials],
  );
  // Work-level inputs are included unless the user removed them.
  const workReferenceCount = useMemo(
    () => workBookmarksWithSelectionState.filter((b) => !b.toFilter).length,
    [workBookmarksWithSelectionState],
  );
  // Total count shown in the modal title.
  const referenceCount = manifestationReferenceCount + workReferenceCount;

  // Modal header title.
  const title =
    referenceCount === 1
      ? Translate({ context: CONTEXT, label: "get-reference" })
      : Translate({
          context: CONTEXT,
          label: "get-references",
          vars: [referenceCount],
        });

  // Message about remaining items that need an edition choice.
  const missingEditionText =
    referenceCount === 1
      ? Translate({ context: CONTEXT, label: "missing-edition-singular" })
      : Translate({
          context: CONTEXT,
          label: "missing-edition",
          vars: [missingActionMaterials.length],
        });

  // Periodica can’t be exported; shown as an info list.
  const periodicaFiltered = periodicaManifestations;
  // Special-case message when everything is unsupported.
  const isOnlyPeriodica = periodicaFiltered.length === materials.length;

  // Items still missing an auto-selected pid.
  const withNewestPidsSelected = useMemo(
    () => missingActionMaterials.filter((mat) => !mat.newestPid),
    [missingActionMaterials],
  );

  // Export links are disabled until all included work-bookmarks have a pid.
  const disableLinks = withNewestPidsSelected.length > 0 || isOnlyPeriodica;
  // Used to branch UI: show edition choices while export is disabled.
  const hasMissingReferences = disableLinks && !isLoading;
  // Compact UI when a single item is fully resolved.
  const isSingleReference =
    materials.length === 1 &&
    !hasMissingReferences &&
    periodicaFiltered.length !== 1;

  // Pids used by export links (manifestation pids + chosen/auto pids for work-bookmarks).
  const pidsForLinks = useMemo(() => {
    const materialPids = materials
      .filter((material) => !material.materialId.startsWith("work-of"))
      .map((material) => material.materialId);

    return [
      ...materialPids,
      ...workBookmarksWithSelectionState
        .filter((mat) => !mat.toFilter)
        .map((mat) => mat.chosenPid || mat.newestPid)
        .filter((pid) => !!pid),
    ];
  }, [materials, workBookmarksWithSelectionState]);

  // Persist user-picked edition pid for a work-bookmark.
  const onEditionPick = (pid, materialKey) => {
    modal.prev();
    setSelectionByKey((prev) => ({
      ...prev,
      [materialKey]: {
        ...prev[materialKey],
        chosenPid: pid,
        newestPid: undefined,
        toFilter: false,
      },
    }));
  };

  // Open edition picker for a work-bookmark.
  const onActionClick = (material, materialType, materialKey) => {
    modal.push("editionPicker", {
      material,
      materialType,
      onEditionPick,
      materialKey,
    });
  };

  // Remove a work-bookmark from export.
  const onDeleteClick = (key) => {
    setSelectionByKey((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        toFilter: true,
      },
    }));
  };

  // Toggle: auto-select newest pid for all unresolved work-bookmarks.
  const onAutoAll = (enabled) => {
    if (enabled) {
      setSelectionByKey((prev) => {
        const next = { ...prev };
        missingActionMaterials.forEach((item) => {
          const manifestationsForMaterialType = item?.manifestations;
          const { flattenedGroupedSortedManifestations } =
            manifestationMaterialTypeFactory(manifestationsForMaterialType);
          const pidToSelect = flattenedGroupedSortedManifestations?.[0]?.pid;
          if (!pidToSelect) return;

          next[item.key] = {
            ...next[item.key],
            newestPid: pidToSelect,
          };
        });
        return next;
      });
    } else {
      setSelectionByKey((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          if (!("newestPid" in (next[key] || {}))) return;
          const { newestPid: _newestPid, ...rest } = next[key] || {};
          if (Object.keys(rest).length === 0) {
            delete next[key];
          } else {
            next[key] = rest;
          }
        });
        return next;
      });
    }
  };

  const hasAutoCheckbox = isAutoCheckboxSelected;

  return {
    title,
    missingEditionText,
    periodicaFiltered,
    missingActionMaterials,
    isSingleReference,
    hasAutoCheckbox,
    hasMissingReferences,
    isOnlyPeriodica,
    isAutoCheckboxSelected,
    disableLinks,
    pidsForLinks,
    onActionClick,
    onDeleteClick,
    onAutoAll,
  };
}

/**
 * Modal that shows a collection of references that are missing edition
 * @returns {React.JSX.Element}
 */
export default function MultiReferences({ context }) {
  const { materials } = context;
  const modal = useModal();
  const {
    title,
    missingEditionText,
    periodicaFiltered,
    missingActionMaterials,
    isSingleReference,
    hasAutoCheckbox,
    hasMissingReferences,
    isOnlyPeriodica,
    isAutoCheckboxSelected,
    disableLinks,
    pidsForLinks,
    onActionClick,
    onDeleteClick,
    onAutoAll,
  } = useMultiReferences({ materials, modal });
  return (
    <div>
      <Top
        title={title}
        className={{
          top: cx(styles.container, styles.top),
        }}
      />

      {periodicaFiltered.length > 0 && (
        <div className={styles.periodicaMessage}>
          <Text type="text1" className={styles.periodicaMessageTitle}>
            <Translate context="multiReferences" label="periodicaMessage" />
          </Text>
          <ul className={styles.periodicaList}>
            {periodicaFiltered.map((item) => (
              <li className={styles.periodicaListItem} key={item.pid}>
                <Text type="text1">{item.titles?.full?.[0]}</Text>
                <Text type="text2" className={styles.periodicaMatType}>
                  {item.materialTypes?.[0]?.materialTypeSpecific?.display}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isSingleReference && <SingleReference bookmarkInList={materials} />}

      {hasAutoCheckbox && (
        <div className={styles.autoCheckbox}>
          <Text type="text1">
            <Translate
              context={CONTEXT}
              label="missing-materials-too-many"
              vars={[missingActionMaterials.length]}
            />
          </Text>
          <div className={styles.checkboxRow}>
            <Checkbox className={styles.checkbox} onChange={onAutoAll} />
            <Text type="text2">
              <Translate context={CONTEXT} label="choose-automatically" />
            </Text>
          </div>
        </div>
      )}

      {hasMissingReferences && !hasAutoCheckbox && (
        <>
          <Text
            type="text3"
            className={cx(styles.missingEditionText, styles.container)}
          >
            {missingEditionText}
          </Text>
          {missingActionMaterials.map((material) => (
            <Material
              key={material.key}
              materialKey={material.key}
              material={material}
              onActionClick={onActionClick}
              onDeleteClick={onDeleteClick}
              hideDelete={materials.length === 1}
            />
          ))}
        </>
      )}

      <div
        className={cx(styles.container, {
          [styles.exportButtonsMobile]: !hasMissingReferences,
          [styles.paddingExportButtons]:
            isAutoCheckboxSelected ||
            isSingleReference ||
            (!hasMissingReferences &&
              periodicaFiltered.length > 0 &&
              !isOnlyPeriodica),
        })}
      >
        {hasMissingReferences && !isAutoCheckboxSelected && (
          <Text type="text3" className={styles.chooseEditionText}>
            {Translate({
              context: CONTEXT,
              label: "choose-edition",
            })}
          </Text>
        )}
        {isOnlyPeriodica && (
          <Text type="text3" className={styles.chooseEditionText}>
            {Translate({
              context: CONTEXT,
              label: "material-not-supported",
            })}
          </Text>
        )}
        <LinksList pids={pidsForLinks} disabled={disableLinks} />
      </div>

      {hasAutoCheckbox && (
        <div className={styles.infoMessage}>
          <Text type="text1" tag="span">
            <Translate context={CONTEXT} label="info-label-bold" />
          </Text>
          <Text type="text2" tag="span">
            <Translate context={CONTEXT} label="info-label" />
          </Text>
        </div>
      )}
    </div>
  );
}
