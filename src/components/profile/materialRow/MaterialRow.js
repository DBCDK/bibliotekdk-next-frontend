/* eslint-disable css-modules/no-unused-class */
import Text from "@/components/base/text";
import styles from "./MaterialRow.module.css";
import PropTypes from "prop-types";
import Icon from "@/components/base/icon";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import Translate from "@/components/base/translate";
import SkeletonMaterialRow from "./skeleton/Skeleton";
import MaterialRowLoan from "./versions/MaterialRowLoan";
import MaterialRowDebt from "./versions/MaterialRowDebt";
import MaterialRowBookmark from "./versions/MaterialRowBookmark";
import MaterialRowReservation from "./versions/MaterialRowReservation";
import cx from "classnames";

/* Use as section header to describe the content of the columns */
export const MaterialHeaderRow = ({ column1, column2, column3, className }) => {
  return (
    <div className={`${styles.materialHeaderRow} ${className}`}>
      <div>
        <Text type="text3">{column1}</Text>
      </div>
      <div>
        <Text type="text3">{column2}</Text>
      </div>
      <div>
        <Text type="text3">{column3}</Text>
      </div>
      <div />
    </div>
  );
};

/**
 * Use for checkbox functionality
 * @param parentRef of parent html element, which contains your group of material rows
 * @returns the 'data-id' of the material row (id from component parameter)
 */
export const getCheckedElements = (parentRef) => {
  const elements = [].slice.call(parentRef.current.children);
  return elements
    .filter((element) => element.ariaChecked === "true")
    .map((element) => element.getAttribute("data-id"));
};

/**
 * shows a span with text and a checkmark icon
 * @param {string} textType
 * @returns
 */
export const TextWithCheckMark = ({ text, textType = "text2", style }) => {
  const label = text
    ? text
    : Translate({ context: "profile", label: "renewed" });
  return (
    <span className={cx(styles.renewedWrapper, style)}>
      <Text type={textType}>{label}</Text>
      <Icon
        size={{ w: 3, h: "auto" }}
        src={"checkmark_blue.svg"}
        alt=""
        className={styles.renewedIcon}
      />
    </span>
  );
};

const MaterialRow = ({ id: materialId, skeleton, type, ...props }) => {
  const breakpoint = useBreakpoint();
  const isMobileSize =
    breakpoint === "xs" || breakpoint === "sm" || breakpoint === "md";
  if (skeleton) {
    return (
      <SkeletonMaterialRow version={isMobileSize ? "mobile" : "desktop"} />
    );
  }

  switch (type) {
    case "ORDER":
      return (
        <MaterialRowReservation
          materialId={materialId}
          isMobileSize={isMobileSize}
          {...props}
        />
      );
    case "LOAN":
      return (
        <MaterialRowLoan
          materialId={materialId}
          isMobileSize={isMobileSize}
          {...props}
        />
      );
    case "DEBT":
      return (
        <MaterialRowDebt
          materialId={materialId}
          isMobileSize={isMobileSize}
          {...props}
        />
      );
    case "BOOKMARK":
      return (
        <MaterialRowBookmark
          materialId={materialId}
          isMobileSize={isMobileSize}
          {...props}
          materialType={props.materialType} //TODO 2214 do i need this?
        />
      );
  }
};

/**
 * @TODO Pack props in type packages, or something more clean
 */

MaterialRow.propTypes = {
  id: PropTypes.string.isRequired, //materialId
  title: PropTypes.string,
  image: PropTypes.string,
  creator: PropTypes.string,
  materialType: PropTypes.string,
  edition: PropTypes.string,
  creationYear: PropTypes.string,
  library: PropTypes.string,
  hasCheckbox: PropTypes.bool,
  status: PropTypes.oneOf(["NONE", "GREEN", "RED"]),
  workId: PropTypes.string,
  type: PropTypes.oneOf(["DEBT", "LOAN", "ORDER", "BOOKMARK"]),
  holdQueuePosition: PropTypes.string,
  pickUpExpiryDate: PropTypes.string,
  dueDate: PropTypes.string,
  amount: PropTypes.string,
  currency: PropTypes.string,
  agencyId: PropTypes.string,
  removedOrderId: PropTypes.string,
  setRemovedOrderId: PropTypes.func,
  onBookmarkDelete: PropTypes.func,
  allManifestations: PropTypes.any,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
  skeleton: PropTypes.bool,
};

export default MaterialRow;
