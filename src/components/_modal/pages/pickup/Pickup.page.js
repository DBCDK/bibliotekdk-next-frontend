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
import { useData } from "@/lib/api/api";
import * as libraryFragments from "@/lib/api/library.fragments";
import { LOGIN_MODE } from "@/components/_modal/pages/login/utils";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import PickupSelection from "./PickupSelection";
import Link from "@/components/base/link";
import Collapse from "react-bootstrap/Collapse";
import Icon from "@/components/base/icon";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";

/**
 * Make pickup branches selectable with Radio buttons
 *
 * @param {Object} data
 * @param selected
 * @param {boolean} isVisible
 * @param {function} onChange
 * @param {boolean} isLoading
 * @param {boolean} nonEmptyQuery
 * @param updateLoanerInfo
 * @param context
 * @param modal
 */
export function Pickup(props) {
  const { branchesFromLogin, branchesFromSearch, nonEmptyQuery } = { ...props };
  const [expandedAgency, setExpandedAgency] = useState(-1);
  const userHasMultipleAgencies = branchesFromLogin?.length > 1;

  console.log("PICKUP PROPS", props);

  return branchesFromSearch ? (
    <PickupSelection {...props} includeArrows={nonEmptyQuery} />
  ) : (
    <>
      {branchesFromLogin?.length > 0 && !nonEmptyQuery && (
        <div>
          {userHasMultipleAgencies && (
            <Title type="text3" className={styles.showPickupTitle}>
              {Translate({
                context: "order",
                label: "show-pickup-branch",
              })}
            </Title>
          )}

          {branchesFromLogin.map((agency, idx) => (
            <div
              key={agency?.result?.[0]?.agencyId}
              className={styles.pickupSelectionWrapper}
            >
              {userHasMultipleAgencies ? (
                <>
                  <Link
                    aria-controls={`agency-${agency.id}`}
                    aria-expanded={expandedAgency === idx}
                    className={styles.agencySelectionLink}
                    onClick={() => {
                      expandedAgency === idx
                        ? setExpandedAgency(-1)
                        : setExpandedAgency(idx);
                    }}
                    border={{ top: false, bottom: { keepVisible: true } }}
                    dataCy={
                      "show-branches-for-" + agency?.result?.[0]?.agencyId
                    }
                    ariaLabel="open agency localizations"
                  >
                    <Text tag={"span"} type="text3">
                      {[agency.result?.[0]?.agencyName]}
                    </Text>
                    <Icon
                      size={{ w: "2", h: "auto" }}
                      src="arrowDown.svg"
                      className={styles.chevron}
                      alt=""
                    />
                  </Link>

                  <Collapse in={expandedAgency === idx}>
                    <div className={styles.collapseWrapper}>
                      <PickupSelection
                        id={`agency-${agency.id}`}
                        key={agency.id}
                        {...props}
                        data={agency}
                        includeArrows={true}
                      />
                    </div>
                  </Collapse>
                </>
              ) : (
                <div className={styles.collapseWrapper}>
                  <PickupSelection
                    key={agency.id}
                    {...props}
                    data={agency}
                    includeArrows={true}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

Pickup.propTypes = {
  data: PropTypes.object,
  className: PropTypes.string,
  onClose: PropTypes.func,
  selected: PropTypes.object,
  onChange: PropTypes.func,
};

/**
 *  Default export function of the Component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Wrap(props) {
  const { initial, orders } = props.context;
  const { label, mode = LOGIN_MODE.PLAIN_LOGIN } = { ...props };
  const isMobile = useBreakpoint() === "xs";

  const [query, setQuery] = useState("");

  const { updateLoanerInfo } = useLoanerInfo();

  const { data, isLoading } = useData(
    libraryFragments.search({ q: query || "", limit: 50 })
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
        nonEmptyQuery={nonEmptyQuery}
      />
    </div>
  );
}

// PropTypes for component
Wrap.propTypes = {
  onChange: PropTypes.func,
  skeleton: PropTypes.bool,
};
