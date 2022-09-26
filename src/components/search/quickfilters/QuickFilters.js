import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import useFilters from "@/components/hooks/useFilters";

import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Translate from "@/components/base/translate";

import styles from "./QuickFilters.module.css";
import React from "react";
import { FilterTypeEnum } from "@/lib/enums";

/**
 * The quick filters section
 *
 */
export function QuickFilters({ onFiltersClick }) {
  const { getCount: getFiltersCount } = useFilters();

  const countFilters = getFiltersCount([FilterTypeEnum.WORK_TYPE]).toString();

  return (
    <div className={styles.section}>
      <Container className={styles.fullwidth} fluid>
        <Row>
          <div className={styles.quickfilters}>
            <Col xs={{ span: 9, offset: 3 }}>
              <div>
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
