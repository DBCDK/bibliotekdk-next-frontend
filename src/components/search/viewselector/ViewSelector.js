import PropTypes from "prop-types";

import styles from "./ViewSelector.module.css";
import GridSvg from "@/public/icons/grid.svg";
import ListSvg from "@/public/icons/list.svg";

export const VIEWS = {
  LIST: "list",
  GRID: "grid",
};

const buttons = [
  { svg: <GridSvg />, view: VIEWS.GRID },
  { svg: <ListSvg />, view: VIEWS.LIST },
];

/**
 * The view selection menu
 *
 */
export default function ViewSelector({
  className = "",
  viewSelected = VIEWS.LIST,
  onViewSelect,
}) {
  return (
    <div className={`${styles.viewselector} ${className}`}>
      {buttons.map((button) => (
        <div
          className={`${styles.viewbutton} ${
            viewSelected === button.view ? styles.selected : ""
          }`}
          key={button.view}
          onClick={onViewSelect && (() => onViewSelect(button.view))}
          onKeyDown={(event) => {
            if (event.key === "Enter" && onViewSelect) {
              onViewSelect(button.view);
            }
          }}
          tabIndex="0"
          data-cy={`${button.view}-button`}
        >
          {button.svg}
        </div>
      ))}
    </div>
  );
}

ViewSelector.propTypes = {
  viewSelected: PropTypes.oneOf([VIEWS.LIST, VIEWS.GRID]),
  onViewSelect: PropTypes.func,
};
