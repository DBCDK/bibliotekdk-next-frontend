import { Container, Row, Col } from "react-bootstrap";

import { openMobileSuggester } from "@/components/header/suggester/Suggester";
import Translate from "@/components/base/translate";
import FakeSearchInput from "@/components/header/suggester/FakeSearchInput";

import Section from "@/components/base/section";
import Text from "@/components/base/text";

import styles from "./Searchbar.module.css";

/**
 * A Fake Search Input Field
 * It looks like an input field, but its just styled that way
 * It acts like a button to open the mobile suggester modal
 *
 *
 * @param {obj} props
 * @param {string} props.className
 *
 * @returns {component}
 */
export default function Searchbar({ query, className }) {
  console.log("query", query);

  return (
    <Section
      title={false}
      bgColor={"var(--concrete)"}
      className={styles.section}
    >
      <Row>
        <Col xs={12}>
          <FakeSearchInput query={query} />
        </Col>
        <Col xs={12} className={styles.filter}>
          <Text
            type="text3"
            tabIndex="0"
            onClick={() => {}}
            className={styles.button}
          >
            Filtrer
          </Text>
        </Col>
      </Row>
    </Section>
  );
}
