/* eslint-disable css-modules/no-unused-class */
import Cover from "@/components/base/cover";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Checkbox from "@/components/base/forms/checkbox";
import ConditionalWrapper from "@/components/base/conditionalwrapper";
import Link from "@/components/base/link";
import cx from "classnames";
import IconButton from "@/components/base/iconButton";
import Translate from "@/components/base/translate";
import { getWorkUrlForProfile } from "../../utils";
import sharedStyles from "../MaterialRow.module.css";
import { useMemo } from "react";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";
import ReservationButton from "@/components/work/reservationbutton/ReservationButton";

/**
 *
 * @param {Object} props
 * @param props.pid: used for edition specific bookmarks - null if it's a workId bookmark
 * @param props.workId: workId for workId bookmarks
 * @param props.materialType used for ordering a workId bookmark
 * @param props.onBookmarkDelete
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
    () => flatPidsByType([materialType.toLowerCase().replace(" / ", ",")]),
    [materialType]
  );

  return (
    <div className={sharedStyles.dynamicColumnHorizontal}>
      <div className={sharedStyles.bookmarkOrderButtonContainer}>
        <ReservationButton
          workId={workId}
          selectedPids={!!pid ? [pid] : selectedPids}
          singleManifestation={!!pid ? true : false}
          buttonType="primary"
          size="small"
          selectedMaterialType={materialType}
          shortText
        />
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

const MaterialRowBookmark = ({
  materialId,
  isSelected,
  image,
  dataCy,
  title,
  creator,
  materialType,
  workId,
  pid,
  edition,
  onBookmarkDelete,
  allManifestations,
  onSelect,
  hasCheckbox,
}) => {
  const onCheckboxClick = (e) => {
    if (
      e.target instanceof HTMLHeadingElement ||
      e.target instanceof HTMLButtonElement ||
      e.target.getAttribute("data-control") === "ICON-BUTTON"
    ) {
      /* Element clicked is an actionable element, return */
      return;
    }
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <article
      key={"article" + materialId}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex="0"
      aria-labelledby="chk1-label"
      data-id={materialId}
      onClick={onCheckboxClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onCheckboxClick(e);
        }
      }}
      className={cx(
        sharedStyles.materialRow,
        sharedStyles.materialRow_wrapper,
        sharedStyles.materialRow_withFlexCheckbox
      )}
      data-cy={dataCy}
    >
      {hasCheckbox && (
        <div className={sharedStyles.checkboxContainer}>
          <Checkbox
            checked={isSelected}
            id={`material-row-${materialId}`}
            ariaLabelledBy={`material-title-${materialId}`}
            ariaLabel={title}
            tabIndex="-1"
            readOnly
          />
        </div>
      )}

      <div className={sharedStyles.materialInfo}>
        {!!image && (
          <div className={sharedStyles.imageContainer}>
            <Cover src={image} size="fill-width" />
          </div>
        )}
        <div className={sharedStyles.textContainer}>
          <ConditionalWrapper
            condition={!!title && !!materialId}
            wrapper={(children) => (
              <Link
                border={{
                  top: false,
                  bottom: {
                    keepVisible: true,
                  },
                }}
                href={getWorkUrlForProfile({
                  workId,
                  pid,
                  materialId,
                  materialType,
                  scrollToEdition: true,
                })}
                className={sharedStyles.blackUnderline}
              >
                {children}
              </Link>
            )}
          >
            {title ? (
              <Title type="text1" tag="h3" id={`material-title-${materialId}`}>
                {title}
              </Title>
            ) : (
              <Text type="text2">
                {Translate({ context: "profile", label: "unknowMaterial" })}
              </Text>
            )}
          </ConditionalWrapper>

          {creator && (
            <Text type="text2" dataCy="creator">
              {creator}
            </Text>
          )}
          {materialType && (
            <Text
              type="text3"
              className={cx(
                sharedStyles.uppercase,
                sharedStyles.bookmarkMaterial
              )}
              dataCy="materialtype-and-creationyear"
            >
              {materialType}
              {edition && <span>{edition}</span>}
            </Text>
          )}
        </div>
      </div>
      <div>
        <BookmarkColumn
          workId={workId}
          pid={pid}
          materialType={materialType}
          onBookmarkDelete={onBookmarkDelete}
          allManifestations={allManifestations}
        />
      </div>
    </article>
  );
};

export default MaterialRowBookmark;
