import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import useFilters from "@/components/hooks/useFilters";

import Text from "@/components/base/text";
import Link, { LinkOnlyInternalAnimations } from "@/components/base/link";
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

  const countFilters = getFiltersCount([FilterTypeEnum.WORK_TYPES]).toString();

  return (
    <div className={styles.section}>
      <Container className={styles.fullwidth} fluid>
        <Row>
          <div className={styles.quickfilters}>
            <Col xs={{ span: 9, offset: 3 }}>
              <div>
                <div className={styles.links}>
                  <LinkOnlyInternalAnimations
                    tabIndex="-1"
                    onClick={() => onFiltersClick()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.keyCode === 13) {
                        onFiltersClick();
                      }
                    }}
                  >
                    <Text type="text3" className={styles.link_items}>
                      <Icon src="settings.svg" size={2} />
                      <Link
                        dataCy="view-all-filters"
                        onClick={(e) => e.preventDefault()}
                        border={{ bottom: { keepVisible: true } }}
                      >
                        {Translate({
                          context: "search",
                          label:
                            countFilters === "0"
                              ? "showAllFilters"
                              : "showAllFiltersCount",
                          vars: countFilters === "0" ? null : [countFilters],
                        })}
                      </Link>
                    </Text>
                  </LinkOnlyInternalAnimations>
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
