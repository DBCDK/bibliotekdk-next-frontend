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
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";

/**
 * LocalizationsBase is used as a base for {@link AgencyLocalizations}, {@link BranchLocalizations} and {@link BranchDetails}
 * @param children
 * @param {object} context
 * @param {string|null} subtitle
 * @param {Array.<string>} pids
 * @param {function} materialCardTemplate
 * @param {string|null} subheader
 * @param {string|null} query
 * @param {function} setQuery
 * @returns {JSX.Element}
 */
function LocalizationsBase({
  children,
  context,
  subtitle,
  pids = [],
  materialCardTemplate = (material) =>
    templateForLocalizations(material, context?.singleManifestation),
  subheader,
  query,
  setQuery,
}) {
  const { modal, singleManifestation } = context;

  const { data: manifestationsData } = useData(
    pids &&
      pids.length > 0 &&
      manifestationFragments.editionManifestations({
        pid: pids?.[0],
      })
  );
  const { flattenedGroupedSortedManifestations: manifestations } =
    manifestationMaterialTypeFactory(manifestationsData?.manifestations);

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

      <div>Singlemanifestation: {JSON.stringify(singleManifestation)}</div>

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
        <Text className={cx(styles.padding_inline, styles.subheader_text)}>
          {subheader}
        </Text>
      )}

      {query !== null && setQuery && (
        <div className={cx(styles.padding_inline, styles.search_bar)}>
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

/**
 * Compound subcomponent List for {@link LocalizationsBase} which contains the list of branches/agencies
 * @param children
 * @param {string} className
 * @returns {JSX.Element}
 */
export function List({ children, className }) {
  return (
    <ul
      style={{ listStyleType: "none" }}
      className={cx(styles.padding_inline, styles.agency_list, className)}
    >
      {children}
    </ul>
  );
}

/**
 * Compound subcomponent Information for {@link LocalizationsBase} which can contain additional information on branches/agencies
 * @param children
 * @param {string} className
 * @returns {JSX.Element}
 */
export function Information({ children, className }) {
  return (
    <div
      className={cx(styles.padding_inline, styles.branch_details, className)}
    >
      {children}
    </div>
  );
}

/**
 * Compound subcomponent HighlightedArea for {@link LocalizationsBase} which can contain highlighted areas that fills the entire width of the modal
 * @param children
 * @param {Object} style
 * @param {string} className
 * @returns {JSX.Element}
 */
export function HighlightedArea({
  children,
  style = {
    backgroundColor: "var(--feedback-yellow-warning-background)",
  },
  className,
}) {
  return (
    <div className={cx(styles.highlighted_area)} style={style}>
      <div
        className={cx(styles.padding_inline, styles.padding_block, className)}
      >
        {children}
      </div>
    </div>
  );
}

LocalizationsBase.List = List;
LocalizationsBase.Information = Information;
LocalizationsBase.HighlightedArea = HighlightedArea;

export default LocalizationsBase;
