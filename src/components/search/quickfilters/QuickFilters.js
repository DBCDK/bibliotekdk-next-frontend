import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import useFilters from "@/components/hooks/useFilters";
import useQ from "@/components/hooks/useQ";

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
  onViewSelect,
  viewSelected,
  onSearchClick,
}) {
  const { getCount: getFiltersCount } = useFilters();
  const { getCount: getQCount } = useQ();

  const countFilters = getFiltersCount(["workType"]).toString();
  const countQ = getQCount(["all"]).toString();

  return (
    <div className={styles.section}>
      <Container className={styles.fullwidth}>
        <Row>
          <div className={styles.quickfilters}>
            <Col lg={{ offset: 3 }}>
              <div>
                {/* <ViewSelector
          className={styles.viewselector}
          onViewSelect={onViewSelect}
          viewSelected={viewSelected}
        /> */}

                {/*} <Text type="text2">
              {Translate({ context: "search", label: "filtersResultText" })}
            </Text>
*/}
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
                      </Text>
                    </Link>
                  </Link>
                </div>
              </div>
            </Col>
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default function Wrap(props) {
  return <QuickFilters {...props} />;
}

QuickFilters.propTypes = {
  viewSelected: PropTypes.string,
  onViewSelect: PropTypes.func,
};
