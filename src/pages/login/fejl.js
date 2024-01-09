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

export default function LoginError() {
  return (
    <>
      <Header />
      <Container fluid style={{ paddingTop: 100 }}>
        <Row>
          <Col xs={12} lg={{ offset: 3 }}>
            <Title type="title2" tag="h1">
              Loginfejl
            </Title>
            <Text type="text3">Den gik ikke</Text>
          </Col>
        </Row>
      </Container>
    </>
  );
}
