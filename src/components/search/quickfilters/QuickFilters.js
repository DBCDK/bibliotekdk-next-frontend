import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";

import styles from "./QuickFilters.module.css";

export function MoreOptionsLink({ countQ, onSearchClick, type }) {
  /*const onSearchClick = () => {
    alert("SEARCH");
  };*/

  return (
    <Link
      tabIndex="-1"
      className={styles.link}
      onClick={() => onSearchClick()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
          onSearchClick();
        }
      }}
      border={{ bottom: { keepVisible: true } }}
    >
      <span>
        <Icon src="search_blue.svg" size={2} />
      </span>

      <Text type="text3" tag="span">
        {Translate({
          context: "search",
          label:
            countQ === "0" ? "advancedSearchLink" : "advancedSearchLinkCount",
          vars: countQ === "0" ? null : [countQ],
        })}
      </Text>
    </Link>
  );
}

/**
 * The quick filters section
 *
 */
export function QuickFilters({
  modal,
  onFiltersClick,
  onViewSelect,
  viewSelected,
  onSearchClick,
}) {
  const { getCount: getFiltersCount } = useFilters();
  const { getCount: getQCount } = useQ();

  const countFilters = getFiltersCount(["workType"]).toString();
  const countQ = getQCount(["all"]).toString();

  return (
    <Container fluid className={styles.section}>
      <Row>
        <Col xs={12} lg={{ offset: 3 }}>
          <div className={styles.quickfilters}>
            {/* <ViewSelector
          className={styles.viewselector}
          onViewSelect={onViewSelect}
          viewSelected={viewSelected}
        /> */}

            <Text type="text2">
              {Translate({ context: "search", label: "filtersResultText" })}
              ZEBRA
            </Text>

            <div className={styles.links}>
              <Link
                tabIndex="-1"
                className={styles.link}
                onClick={() => onFiltersClick()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.keyCode === 13) {
                    onFiltersClick();
                  }
                }}
                border={false}
              >
                <Icon src="settings.svg" size={2} />
                <Link
                  dataCy="view-all-filters"
                  onClick={(e) => e.preventDefault()}
                  border={{ bottom: { keepVisible: true } }}
                >
                  <Text type="text3">
                    {Translate({
                      context: "search",
                      label:
                        countFilters === "0"
                          ? "showAllFilters"
                          : "showAllFiltersCount",
                      vars: countFilters === "0" ? null : [countFilters],
                    })}
                    FISKHEST
                  </Text>
                </Link>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default function Wrap(props) {
  return <QuickFilters {...props} />;
}

QuickFilters.propTypes = {
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
};
