import Header from "@/components/header/Header";
import { useRouter } from "next/router";
import { fetchAll } from "@/lib/api/apiServerOnly";
import { AdvancedSearchHistory } from "@/components/search/advancedSearch/advancedSearchHistory/AdvancedSearchHistory";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
/**
 * Renders search history AdvancedSearch  
 */
export default function AdvancedSearchPage() {
  const router = useRouter();

  return (
    <main>
      <Header router={router} hideShadow={true} />

      <Container fluid>
        <Row>
          <Col md={{ offset: 3, span: 9 }} sm={12}>
            <AdvancedSearchHistory />
          </Col>
        </Row>
      </Container>
    </main>
  );
}

/**
 * We use getInitialProps to let Next.js
 * fetch the data server side
 *
 * https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
 */
AdvancedSearchPage.getInitialProps = (ctx) => {
  return fetchAll([], ctx);
};
