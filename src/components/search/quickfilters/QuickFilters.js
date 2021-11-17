import PropTypes from "prop-types";
import { Container, Row, Col } from "react-bootstrap";

import useFilters from "@/components/hooks/useFilters";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import ViewSelector from "../viewselector";

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
}) {
  const { getQuery } = useFilters();

  const filters = getQuery();

  console.log("quick filters", filters);

  return (
    <Container fluid>
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

            <Link
              onClick={() => onFiltersClick()}
              border={{ bottom: { keepVisible: true } }}
            >
              <Text type="text3">
                {Translate({ context: "search", label: "showAllFilters" })}
              </Text>
            </Link>
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
