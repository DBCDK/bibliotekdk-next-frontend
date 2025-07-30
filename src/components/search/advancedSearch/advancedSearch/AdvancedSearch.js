import { useRouter } from "next/router";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import { convertStateToCql } from "@/components/search/advancedSearch/utils";
import useBreakpoint from "@/components/hooks/useBreakpoint";
import { useFacets } from "@/components/search/advancedSearch/useFacets";
import { useQuickFilters } from "@/components/search/advancedSearch/useQuickFilters";

import styles from "./AdvancedSearch.module.css";
import Translate from "@/components/base/translate/Translate";
import TextInputs from "../fieldInput/TextInputs";
import DropdownInputs from "@/components/search/advancedSearch/dropdownInputs/DropdownInputs";
import Button from "@/components/base/button";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { getHelpUrl } from "@/lib/utils";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

/**
 * Præsentationskomponent: kun UI
 */
function AdvancedSearch({ onSearch, onClear, isMobile }) {
  return (
    <div className={styles.background}>
      <Container fluid className={styles.container}>
        <Row>
          <Col sm={12}>
            <TextInputs handleSearch={onSearch} />
            <DropdownInputs />
          </Col>
        </Row>
        <Row className={styles.buttonRow}>
          <Col className={styles.button_group} sm={12}>
            <Button className={styles.button} size="medium" onClick={onSearch}>
              {Translate({
                context: "search",
                label: "advancedSearch_button",
              })}
            </Button>

            <Text type="text3">
              <Link
                dataCy="advanced-search-clear-search"
                border={{ bottom: { keepVisible: true } }}
                onClick={onClear}
              >
                {isMobile
                  ? Translate({
                      context: "search",
                      label: "mobile_clearSearch",
                    })
                  : Translate({
                      context: "search",
                      label: "clearSearch",
                    })}
              </Link>
            </Text>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

/**
 * Wrapper komponent: håndterer kontekst og logik
 */
export default function Wrap() {
  const router = useRouter();
  const isMobile = useBreakpoint() === "xs";

  const { resetFacets } = useFacets();
  const { resetQuickFilters } = useQuickFilters();

  const {
    inputFields,
    dropdownSearchIndices,
    setParsedCQL,
    stateToString,
    resetObjectState,
    workType,
    suggesterTid,
  } = useAdvancedSearchContext();

  const handleSearch = () => {
    resetFacets();
    resetQuickFilters();

    const query = {
      fieldSearch: stateToString,
      ...(suggesterTid?.length > 0 && { tid: suggesterTid }),
    };

    router.push({ pathname: "/avanceret", query });

    const cql = convertStateToCql({
      inputFields,
      dropdownSearchIndices,
      workType,
    });

    setParsedCQL(cql);
  };

  const handleClear = () => {
    resetObjectState();
    router.push({
      pathname: router.pathname,
      ...(router.query?.mode === "cql" && { query: { mode: "cql" } }),
    });
  };

  return (
    <AdvancedSearch
      onSearch={handleSearch}
      onClear={handleClear}
      isMobile={isMobile}
    />
  );
}
