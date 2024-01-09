/**
 * @file
 * This is a custom error page when login fails for some reason
 * This error is not caused by a user, but by some part in our system
 * (the frontend or by adgangsplatformen)
 */

import Header from "@/components/header/Header";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Translate from "@/components/base/translate/Translate";

export default function LoginError() {
  const errorMessage = Translate({
    context: "login",
    label: "system-error",
  });
  return (
    <>
      <Header />
      <Container fluid style={{ paddingTop: 50, paddingBottom: 280 }}>
        <Row>
          <Col xs={12} lg={{ offset: 3, span: 9 }}>
            <Title type="title2" tag="h1">
              Loginfejl
            </Title>
            <Text type="text3" style={{ paddingTop: 24, paddingBottom: 48 }}>
              {errorMessage}
            </Text>
          </Col>
        </Row>
      </Container>
    </>
  );
}
