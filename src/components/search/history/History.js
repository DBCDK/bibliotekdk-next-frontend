import { useRouter } from "next/router";
import { Col, Row } from "react-bootstrap";

import useHistory from "@/components/hooks/useHistory";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import styles from "./History.module.css";

// items limit
const LIMIT = 5;

// History-komponent
export function History({ items, onSelect = () => {} }) {
  items = items.filter(({ term }) => term && term !== "").slice(0, LIMIT);

  return (
    <Row>
      <Col xs={12}>
        <Text type="text1">Seneste Søgninger</Text>
      </Col>
      {items.map((item, index) => (
        <Col xs={12} key={index}>
          <Link onClick={() => onSelect(item.term)} className={styles.item}>
            <Text type="text2">{item.term}</Text>
          </Link>
        </Col>
      ))}
    </Row>
  );
}

// Wrapper-komponent der håndterer navigation
export default function Wrap() {
  const [history] = useHistory();
  const router = useRouter();

  const handleSelect = (term) => {
    const params = new URLSearchParams(router.query);
    params.set("q.all", term);
    router.push(`/find?${params.toString()}`);
  };

  return <History items={history} onSelect={handleSelect} />;
}
