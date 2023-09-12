import PropTypes from "prop-types";
import { useState } from "react";
import debounce from "lodash/debounce";
import Search from "@/components/base/forms/search";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate";
import Top from "../base/top";
// eslint-disable-next-line css-modules/no-unused-class
import styles from "./Pickup.module.css";
import useUser from "@/components/hooks/useUser";
import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import PickupSelection from "./PickupSelection";
import Button from "@/components/base/button/Button";
import Collapse from "react-bootstrap/Collapse";

/**
 * Make pickup branches selectable with Radio buttons
 *
 * @param {object} data
 * @param selected
 * @param {boolean} isVisible
 * @param {function} onChange
 * @param {boolean} isLoading
 * @param {JSX} includeArrows
 * @param updateLoanerInfo
 * @param context
 * @param modal
 */
export function Pickup(props) {
  const { branchesFromLogin, branchesFromSearch } = { ...props };
  const [showMoreLibraries, setShowMoreLibraries] = useState(false);

  //devide in order possible && not possible
  //find login bibliotek

  return branchesFromSearch ? (
    <PickupSelection {...props} includeArrows={true} />
  ) : (
    <>
      <PickupSelection {...props} data={branchesFromLogin[0]} />
      {showMoreLibraries &&
        branchesFromLogin.map((agency, idx) => (
          <div key={agency.agencyId}>
            <div>{agency.result[0].name}</div>
            <PickupSelection key={agency.id} {...props} data={agency} />
          </div>
        ))}
      {branchesFromLogin.length > 1 && (
        <Button
          type="secondary"
          size={"large"}
          dataCy={"button-order-overview-loading"}
          onClick={() => {
            setShowMoreLibraries((val) => !val);
          }}
        >
          {Translate({
            context: "profile",
            label: showMoreLibraries ? "showLess" : "showMore",
          })}
        </Button>
      )}
    </>
  );
}

Pickup.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  selected: PropTypes.object,
  onChange: PropTypes.func,
};

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Wrap(props) {
  const { initial } = props.context;
  const { label, mode = LOGIN_MODE.PLAIN_LOGIN } = { ...props };
  const isMobile = useBreakpoint() === "xs";

  const [query, setQuery] = useState("");
  console.log("QUERY ", query);

  const { updateLoanerInfo } = useUser();

  const { data, isLoading } = useData(
    libraryFragments.search({ q: query || "" })
  );

  const dummyData = {
    hitcount: 10,
    result: [
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a bracndh name" },
      { name: "This is some branch name" },
      { name: "This is some other branch name" },
      { name: "This is also a branch name" },
      { name: "A branch name" },
      { name: "Also a bracndh name" },
    ],
  };

  const nonEmptyQuery = !!query;

  const branchesFromLogin = initial?.agencies;
  const branchesFromSearch = nonEmptyQuery ? data?.branches : undefined;

  return (
    <div className={`${styles.pickup}`}>
      <Top title={label} />
      <div className={styles.search}>
        <Title type="title4" className={styles.title} tag="h2">
          {Translate({
            context: "order",
            label:
              mode === LOGIN_MODE.ORDER_PHYSICAL
                ? "pickup-search-title"
                : "pickup-search-title-2",
          })}
        </Title>
        <Text type="text3">
          {Translate({
            context: "order",
            label: "pickup-search-description",
          })}
        </Text>
        <Search
          dataCy="pickup-search-input"
          placeholder={Translate({
            context: isMobile ? "login" : "order",
            label: isMobile ? "search-for-library" : "pickup-input-placeholder",
          })}
          className={styles.input}
          onChange={debounce((q) => setQuery(q), 100)}
        />
      </div>
      <Pickup
        {...props}
        updateLoanerInfo={(info) => {
          updateLoanerInfo(info);
        }}
        isLoading={isLoading}
        data={isLoading ? dummyData : data?.branches}
        branchesFromLogin={branchesFromLogin}
        branchesFromSearch={branchesFromSearch}
        includeArrows={nonEmptyQuery}
      />
    </div>
  );
}

// PropTypes for component
Wrap.propTypes = {
  onChange: PropTypes.func,
  skeleton: PropTypes.bool,
};
