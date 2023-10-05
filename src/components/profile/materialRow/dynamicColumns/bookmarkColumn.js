import ReservationButtonWrapper from "@/components/work/reservationbutton/ReservationButton";
import styles from "../MaterialRow.module.css";
import IconButton from "@/components/base/iconButton";
import Translate from "@/components/base/translate";
import { useMemo } from "react";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";

/**
 *
 * @param pid: used for edition specific bookmarks - null if it's a workId bookmark
 * @param workId: workId for workId bookmarks
 * @param materialType used for ordering a workId bookmark
 * @param onBookmarkDelete
 * @returns
 */
const BookmarkColumn = ({
  pid,
  workId,
  materialType,
  onBookmarkDelete,
  allManifestations,
}) => {
  const { flatPidsByType } = useMemo(() => {
    return manifestationMaterialTypeFactory(allManifestations);
  }, [workId, allManifestations]);
  const selectedPids = useMemo(
    () => flatPidsByType(materialType.toLowerCase()),
    [workId]
  );

  return (
    <div className={styles.dynamicColumnHorizontal}>
      <div className={styles.bookmarkOrderButtonContainer}>
        {!!pid ? (
          <ReservationButtonWrapper
            workId={workId}
            selectedPids={[pid]}
            singleManifestation={true}
            buttonType="primary"
            size="small"
          />
        ) : (
          <ReservationButtonWrapper
            workId={workId}
            selectedPids={selectedPids}
            singleManifestation={false}
            buttonType="primary"
            size="small"
          />
        )}
      </div>

      <IconButton onClick={onBookmarkDelete}>
        {Translate({
          context: "bookmark",
          label: "remove",
        })}
      </IconButton>
    </div>
  );
};

/**
 * Proptypes
 */

export default BookmarkColumn;
