import styles from "./LocalizationsBase.module.css";
import Top from "@/components/_modal/pages/base/top";
import cx from "classnames";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateForLocalizations } from "@/components/base/materialcard/templates/templates";
import Search from "@/components/base/forms/search";
import Translate from "@/components/base/translate";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import { useEffect } from "react";

/**
 * Localizations Base is used in AgencyLocalizations and BranchLocalizations
 * @param children
 * @param {object} modal
 * @param {object} context
 * @param {string} subtitle
 * @param {Array.<object>} manifestations
 * @param {function} materialCardTemplate
 * @param {string} subheader
 * @param {string} query
 * @param {function} setQuery
 * @param {Array.<object>} defaultLibraries
 * @param {Array.<object>} librariesBeforeCheck
 * @returns {JSX.Element}
 */
function LocalizationsBase({
  children,
  context,
  subtitle = null,
  manifestations = [],
  materialCardTemplate = templateForLocalizations,
  subheader = null,
  query = null,
  setQuery = null,
  defaultLibraries = null,
  libraries: librariesBeforeCheck,
}) {
  // Find ud af hvordan defaultLibraries kan inkorporeres.
  //  Skal nok gøres inde i hook
  const libraries = !query ? librariesBeforeCheck : librariesBeforeCheck;

  const { modal } = context;

  useEffect(() => {
    if (modal?.isVisible) {
      setTimeout(() => {
        document.getElementById("LocalizationsBase__search").focus();
      }, 300);
    }
  }, [modal?.isVisible]);

  return (
    <div className={styles.wrapper} key={JSON.stringify(modal)}>
      <Top
        title={context?.title}
        className={{
          top: cx(styles.padding_inline, styles.top),
        }}
      />

      {subtitle && (
        <Title className={cx(styles.padding_inline)} type="title5" tag={"h3"}>
          {subtitle}
        </Title>
      )}

      <div>
        {manifestations &&
          !isEmpty(manifestations) &&
          manifestations?.map((manifestation) => (
            <MaterialCard
              key={JSON.stringify("matcard+", manifestation)}
              propAndChildrenTemplate={materialCardTemplate}
              propAndChildrenInput={manifestation}
              colSizing={{ xs: 12 }}
            />
          ))}
      </div>

      {subheader && (
        <Text className={cx(styles.padding_inline)}>{subheader}</Text>
      )}

      {query !== null && setQuery && (
        <div className={styles.padding_inline}>
          <Search
            dataCy="pickup-search-input"
            placeholder={Translate({
              context: "order",
              label: "pickup-input-placeholder",
            })}
            onChange={debounce((value) => setQuery(value), 100)}
            id="LocalizationsBase__search"
          />
        </div>
      )}

      {children}
    </div>
  );
}

export function List({ children }) {
  return (
    <ul
      style={{
        listStyleType: "none",
        // margin: "24px",
      }}
      className={cx(styles.padding_inline, styles.agency_list)}
    >
      {children}
    </ul>
  );
}

export function Information({ children }) {
  return (
    <div className={cx(styles.padding_inline, styles.opening_hours)}>
      {children}
    </div>
  );
}

LocalizationsBase.List = List;
LocalizationsBase.Information = Information;

export default LocalizationsBase;
