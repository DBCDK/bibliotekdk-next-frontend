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
import { converStateToCql } from "@/components/search/advancedSearch/utils";
import { isEmpty } from "lodash";
/**
 * Contains advanced search fields
 * @returns {React.JSX.Element}
 */

export default function AdvancedSearch() {
  const router = useRouter();
  const { cql } = router.query;
  const workType = "all";
  const [showCqlEditor, setShowCqlEditor] = useState(false);
  const textAreaRef = useRef(null);

  //Coming soon: convert inputFields and dropDowns to cql
  const { dropDowns, inputFields } = useAdvancedSearchContext();

  useEffect(() => {
    //show CQL editor if there is a cql param in the url
    setShowCqlEditor(!!cql);
  }, []);

  const doAdvancedSearch = () => {
    if (showCqlEditor) {
      //do cql text search
      const cql = textAreaRef.current.value;

      if (isEmpty(cql)) {
        textAreaRef.current.focus();
      }

      const query = { cql: cql };
      router.push({ pathname: router.pathname, query });
    } else {
      //  convert fields to cql then do search
      const stateTocql = converStateToCql(inputFields);
      console.log("stateTocql", stateTocql);
    }
  };

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
              <CqlTextArea textAreaRef={textAreaRef} />
            ) : (
              <>
                <TextInputs workType={workType} />
              </>
            )}
          </Col>
          <Col></Col>
        </Row>
        <Row className={styles.buttonRow}>
          <Col>
            <Button className={styles.button} onClick={doAdvancedSearch}>
              søg
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
