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
import {
  formatMaterialTypesToPresentation,
  formatMaterialTypesToUrl,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import ReservationButtonWrapper from "@/components/work/reservationbutton/ReservationButton";
import { TextWithCheckMark } from "../MaterialRow";
import styles from "../MaterialRow.module.css";

/**
 *
 * @param {Object} props
 * @param props.pid  used for edition specific bookmarks - null if it's a workId bookmark
 * @param props.workId  workId for workId bookmarks
 * @param props.flatMaterialTypes used for ordering a workId bookmark
 * @param props.onBookmarkDelete
 * @returns
 */
const BookmarkColumn = ({
  pid,
  workId,
  flatMaterialTypes,
  onBookmarkDelete,
  relevantManifestations,
  showFailedAtCreation,
  showSuccessfullyOrdered,
  handleOrderFinished,
  bookmarkKey,
}) => {
  // If there is a pid we have singleManifestation
  const singleManifestation = !!pid;

  const selectedPids = useMemo(
    () => relevantManifestations?.map((manifestation) => manifestation.pid),
    [flatMaterialTypes, relevantManifestations]
  );

  return (
    <div className={sharedStyles.dynamicColumnHorizontal}>
      <div className={sharedStyles.bookmarkOrderButtonContainer}>
        {showSuccessfullyOrdered ? (
          <TextWithCheckMark
            text={Translate({
              context: "bookmark-order",
              label: "multiorder-ordered",
            })}
            textType="text3"
            style={sharedStyles.bookmarkOrderedIcon}
          />
        ) : (
          <ReservationButtonWrapper
            workId={workId}
            selectedPids={selectedPids}
            singleManifestation={singleManifestation}
            buttonType="primary"
            size="small"
            shortText
            handleOrderFinished={handleOrderFinished}
            bookmarkKey={bookmarkKey}
          />
        )}
        {showFailedAtCreation && (
          <Text type="text3" className={styles.bookmarkOrderFailed}>
            {Translate({
              context: "bookmark-order",
              label: "multiorder-error-ordering",
            })}
          </Text>
        )}
      </div>
      <IconButton
        onClick={onBookmarkDelete}
        className={cx({ [styles.bookmarkRemoveButton]: showFailedAtCreation })}
      >
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
  titles,
  creator,
  creators,
  workId,
  pid,
  edition,
  onBookmarkDelete,
  allManifestations,
  onSelect,
  hasCheckbox,
  showSuccessfullyOrdered = false,
  showFailedAtCreation = false,
  handleOrderFinished,
  bookmarkKey,
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

  const { flatMaterialTypes } = manifestationMaterialTypeFactory([
    allManifestations?.[0],
  ]);

  return (
    <article
      key={"article" + materialId}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex="0"
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
                  workId: workId,
                  pid: pid,
                  materialTypeAsUrl: formatMaterialTypesToUrl(
                    flatMaterialTypes?.[0]
                  ),
                  titles: titles,
                  creators: creators,
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
          {flatMaterialTypes && (
            <Text
              type="text3"
              className={cx(
                sharedStyles.uppercase,
                sharedStyles.bookmarkMaterial
              )}
              dataCy="materialtype-and-creationyear"
            >
              {formatMaterialTypesToPresentation(flatMaterialTypes?.[0])}
              {edition && <span>{edition}</span>}
            </Text>
          )}
        </div>
      </div>
      <div>
        <BookmarkColumn
          workId={workId}
          bookmarkKey={bookmarkKey}
          pid={pid}
          flatMaterialTypes={flatMaterialTypes}
          onBookmarkDelete={onBookmarkDelete}
          relevantManifestations={allManifestations}
          showFailedAtCreation={showFailedAtCreation}
          showSuccessfullyOrdered={showSuccessfullyOrdered}
          handleOrderFinished={handleOrderFinished}
        />
      </div>
    </article>
  );
};

export default MaterialRowBookmark;
