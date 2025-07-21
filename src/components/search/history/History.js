import { Col, Row } from "react-bootstrap";

import useHistory from "@/components/hooks/useHistory";
import Text from "@/components/base/text";
import Link from "@/components/base/link";

import styles from "./History.module.css";

export function History({ items, onSelect = () => {} }) {
  return (
    <Row>
      <Col xs={12}>
        <Text type="text1">Seneste Søgninger</Text>
      </Col>
      {items.map((item, index) => (
        <Col xs={12} key={index}>
          <Link onClick={onSelect} className={styles.item}>
            <Text type="text2">{item.term}</Text>
          </Link>
        </Col>
      ))}
    </Row>
  );
}

export default function Wrap() {
  const [history, setHistory, clearHistory] = useHistory();

  console.log("History => items", history);

  return <History items={history} onSelect={() => {}} />;
}
