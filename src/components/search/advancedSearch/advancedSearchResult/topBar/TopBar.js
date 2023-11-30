import { useAdvancedSearchContext } from "@/components/search/advancedSearch/advancedSearchContext";
import styles from "./TopBar.module.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";

export default function TopBar({}) {
  const { setShowPopover, parsedCQL } = useAdvancedSearchContext();

  return (
    <div className={styles.container}>
      <Container fluid>
        <Row>
          <Col xs={12} lg={2}>
            <Text type="text4">
              {Translate({ context: "search", label: "yourSearch" })}
            </Text>
          </Col>
          <Col xs={12} lg={{ offset: 1, span: true }}>
            {parsedCQL}
          </Col>

          <Col xs={12} lg={2}>
            <Link
              onClick={() => {
                setShowPopover(true);
              }}
              border={{
                top: false,
                bottom: {
                  keepVisible: true,
                },
              }}
            >
              <Text type="text3" tag="span">
                {Translate({ context: "search", label: "editSearch" })}
              </Text>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
