import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import useFilters from "@/components/hooks/useFilters";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";

import styles from "./QuickFilters.module.css";

/**
 * The quick filters section
 *
 */
export function QuickFilters({
  modal,
  onFiltersClick,
  onSearchClick,
  onViewSelect,
  viewSelected,
}) {
  const { getCount } = useFilters();

  const count = getCount(["workType"]).toString();

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
            </Text>

            <div className={styles.links}>
              <Link
                tabIndex="-1"
                dataCy="advanced-search"
                className={styles.link}
                onClick={() => onSearchClick()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.keyCode === 13) {
                    onSearchClick();
                  }
                }}
                border={false}
              >
                <Icon src="search_blue.svg" size={2} />
                <Link
                  onClick={(e) => e.preventDefault()}
                  border={{ bottom: { keepVisible: true } }}
                >
                  <Text type="text3">
                    {Translate({
                      context: "search",
                      label: "advancedSearchLink",
                    })}
                  </Text>
                </Link>
              </Link>

              <Link
                tabIndex="-1"
                dataCy="view-all-filters"
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
                  onClick={(e) => e.preventDefault()}
                  border={{ bottom: { keepVisible: true } }}
                >
                  <Text type="text3">
                    {Translate({
                      context: "search",
                      label:
                        count === "0"
                          ? "showAllFilters"
                          : "showAllFiltersCount",
                      vars: count === "0" ? null : [count],
                    })}
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
