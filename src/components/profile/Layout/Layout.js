import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Title } from "@/components/base/title/Title";

/**
 * Layout to use in /profil subpages
 * Renders a side menu on left side and children on right side
 *
 * @returns {JSX.Element}
 */
export default function Layout({ title, children }) {
  return (
    <Container fluid>
      <Row>
        <Col md={3}>
          {/**replace with side menu: */}

          <div
            style={{ width: "100%", height: "300px", backgroundColor: "coral" }}
          />
        </Col>
        <Col lg={6} md={9}>
          <Title type="title3">{title}</Title>
          {children}
          {/**insert page content here */}
          <div
            style={{
              width: "100%",
              height: "300px",
              backgroundColor: "burlywood",
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}
