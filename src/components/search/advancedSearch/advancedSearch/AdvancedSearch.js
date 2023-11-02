import Title from "@/components/base/title";
import styles from "./AdvancedSearch.module.css";
import Translate from "@/components/base/translate/Translate";
import TextInputs from "../fieldInput/TextInputs";
import { CqlTextArea } from "@/components/search/advancedSearch/cqlTextArea/CqlTextArea";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

/**
 * Contains advanced search fields
 * @returns {React.JSX.Element}
 */

export default function AdvancedSearch() {
  const router = useRouter();
  const { cql } = router.query;
  const workType = "all";
  const [showCqlEditor, setShowCqlEditor] = useState(false);

  useEffect(() => {
    //show CQL editor if there is a cql param in the url
    setShowCqlEditor(!!cql);
  }, []);

  return (
    <div className={styles.background}>
      <Container fluid className={styles.container}>
        <Row className={styles.topContainer}>
          <Col>
            <Title type="title3" className={styles.title}>
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
              <CqlTextArea />
            ) : (
              <TextInputs workType={workType} />
            )}
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}
