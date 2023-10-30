import styles from "./LocalizationsBase.module.css";
import Top from "@/components/_modal/pages/base/top";
import cx from "classnames";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";
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
 * @param {Object} props
 * @param {React.ReactNode | null} props.children
 * @param {Object.<string, any>} props.context
 * @param {string=} props.subtitle
 * @param {Array.<string>=} props.pids
 * @param {function=} props.materialCardTemplate
 * @param {string=} props.subheader
 * @param {string=} props.query
 * @param {function=} props.setQuery
 * @returns {React.ReactElement | null}
 */
function LocalizationsBase({
  children,
  context,
  subtitle,
  pids = [],
  materialCardTemplate = (/** @type {Object} */ material) =>
    templateImageToLeft({
      material,
      singleManifestation: context?.singleManifestation,
    }),
  subheader,
  query,
  setQuery,
}) {
  const { modal } = context;

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
        document.getElementById("LocalizationsBase__search")?.focus();
      }, 300);
    }
  }, [modal?.isVisible]);

  return (
    <div className={styles.wrapper} key={JSON.stringify(modal)}>
      <Top
        modal={modal}
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

      {subheader && <Subheader>{subheader}</Subheader>}

      {query !== null && setQuery && (
        <div className={cx(styles.padding_inline, styles.search_bar)}>
          <Search
            dataCy="pickup-search-input"
            placeholder={Translate({
              context: "order",
              label: "pickup-input-placeholder",
            })}
            onChange={debounce(
              (/** @type {string} */ value) => setQuery(value),
              100
            )}
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
 * @param {Object} props
 * @param {React.ReactNode | null} props.children
 * @param {string=} props.className
 * @returns {React.ReactElement | null}
 */
export function List({ children, className = "" }) {
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
 * @param {Object} props
 * @param {React.ReactNode | null} props.children
 * @param {string=} props.className
 * @returns {React.ReactElement | null}
 */
export function Information({ children, className = "" }) {
  return (
    <div
      className={cx(styles.padding_inline, styles.branch_details, className)}
    >
      {children}
    </div>
  );
}

/**
 * Compound subcomponent Information for {@link LocalizationsBase} which can contain additional information on branches/agencies
 * @param {Object} props
 * @param {React.ReactNode | null} props.children
 * @param {string=} props.className
 * @returns {React.ReactElement | null}
 */
export function Subheader({ children, className = "" }) {
  return (
    <Text
      className={cx(styles.padding_inline, styles.subheader_text, className)}
    >
      {children}
    </Text>
  );
}

/**
 * Compound subcomponent HighlightedArea for {@link LocalizationsBase} which can contain
 *   highlighted areas that fill the entire width of the modal
 * @param {Object} props
 * @param {React.ReactNode | null} props.children
 * @param {Object=} props.style
 * @param {string=} props.className
 * @returns {React.ReactElement | null}
 */
export function HighlightedArea({
  children,
  style = {
    backgroundColor: "var(--feedback-yellow-warning-background)",
  },
  className = "",
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
LocalizationsBase.Subheader = Subheader;

export default LocalizationsBase;
