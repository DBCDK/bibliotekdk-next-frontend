import Title from "@/components/base/title";
import styles from "./AdvancedSearch.module.css";
import Translate from "@/components/base/translate/Translate";
import TextInputs from "../fieldInput/TextInputs";
import { CqlTextArea } from "@/components/search/advancedSearch/cqlTextArea/CqlTextArea";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Button from "@/components/base/button";
import isEmpty from "lodash/isEmpty";
import { AdvancedSearchHistory } from "@/components/search/advancedSearch/advancedSearchHistory/AdvancedSearchHistory";
import DropdownInputs from "@/components/search/advancedSearch/dropdownInputs/DropdownInputs";
import { convertStateToCql } from "@/components/search/advancedSearch/utils";

/**
 * Contains advanced search fields
 * @returns {React.JSX.Element}
 */

export default function AdvancedSearch() {
  const router = useRouter();

  const {
    inputFields,
    dropdownSearchIndices,
    resetObjectState,
    parsedCQL,
    setParsedCQL,
    cqlFromUrl,
    setShowPopover,
    stateToString,
  } = useAdvancedSearchContext();

  const [showCqlEditor, setShowCqlEditor] = useState(!isEmpty(cqlFromUrl));
  const textAreaRef = useRef(null);
  const {
    query: { cql },
  } = router;

  useEffect(() => {
    setShowCqlEditor(!!cql);
  }, [cql]);

  //add raw cql query in url if showCqlEditor. Add state to url if fieldInputs
  const doAdvancedSearch = () => {
    if (showCqlEditor) {
      //do cql text search
      const cql = textAreaRef.current.value;

      if (isEmpty(cql)) {
        textAreaRef.current.focus();
      }

      if (parsedCQL === cql) {
        const query = { fieldSearch: stateToString };
        router.push({ pathname: "/avanceret", query });
      } else {
        resetObjectState();
        const query = { cql: cql };
        router.push({ pathname: "/avanceret", query });
      }
    } else {
      const query = { fieldSearch: stateToString };
      router.push({ pathname: "/avanceret", query });
      //save in state
      const cql = convertStateToCql({ inputFields, dropdownSearchIndices });
      setParsedCQL(cql);
    }
    setShowPopover(false);
  };

  //TODO: For debugging purposes. Remove when unneeded
  console.log("Resulting cql after search (with added line breaks)", parsedCQL);

  return (
    <div className={styles.background}>
      <Container fluid className={styles.container}>
        <Row className={styles.topContainer}>
          <Col>
            <Title type="title3">
              {Translate({ context: "search", label: "advancedSearch" })}
            </Title>
          </Col>
          <Col>
            <div className={styles.right}>
              <Link
                onClick={() => {
                  setShowCqlEditor(!showCqlEditor);
                }}
                border={{
                  top: false,
                  bottom: {
                    keepVisible: true,
                  },
                }}
              >
                <Text type="text3" tag="span">
                  {Translate({
                    context: "search",
                    label: showCqlEditor
                      ? "showInputFields"
                      : "editInCqlEditor",
                  })}
                </Text>
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            {showCqlEditor ? (
              <CqlTextArea
                textAreaRef={textAreaRef}
                doAdvancedSearch={doAdvancedSearch}
              />
            ) : (
              <>
                <TextInputs doAdvancedSearch={doAdvancedSearch} />
                <DropdownInputs />
              </>
            )}
          </Col>
          <Col>
            <AdvancedSearchHistory type={showCqlEditor ? "cql" : "fields"} />
          </Col>
        </Row>
        <Row className={styles.buttonRow}>
          <Col className={styles.button_group}>
            <Button className={styles.button} onClick={doAdvancedSearch}>
              {Translate({ context: "header", label: "search" })}
            </Button>
            <Link
              border={{ bottom: { keepVisible: true } }}
              onClick={() => {
                resetObjectState();
                router.push({ pathname: router.pathname });
              }}
            >
              Ryd søgning
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
