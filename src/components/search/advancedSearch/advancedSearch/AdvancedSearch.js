// components/search/advancedSearch/advancedSearch/AdvancedSearch.jsx
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
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import HelpBtn from "../../help";

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

            <HelpBtn className={styles.help} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

/**
 * Wrapper komponent: håndterer kontekst og logik
 */
export default function Wrap({ onCommit = () => {} }) {
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
    fieldSearchFromUrl,
  } = useAdvancedSearchContext();

  const handleSearch = () => {
    const urlToString = JSON.stringify(fieldSearchFromUrl);

    if (stateToString !== urlToString) {
      resetFacets();
      resetQuickFilters();

      onCommit(stateToString, { tid: suggesterTid });

      const cql = convertStateToCql({
        inputFields,
        dropdownSearchIndices,
        workType,
      });
      setParsedCQL(cql);
    }
  };

  const handleClear = () => {
    // Nulstil avanceret state (felter, dropdowns, worktype, cql-preview)
    resetObjectState();

    // Behold din nuværende “clear”-navigation – eller flyt den ind i hooken senere
    router.push({
      pathname: router.pathname,
      ...(router.query?.mode === "avanceret" && {
        query: { mode: "avanceret" },
      }),
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
