import { Row, Col } from "react-bootstrap";
import { useRouter } from "next/router";

import { openMobileSuggester } from "@/components/header/suggester/Suggester";
import Translate from "@/components/base/translate";
import FakeSearchInput from "@/components/header/suggester/FakeSearchInput";

import Section from "@/components/base/section";
import Text from "@/components/base/text";
import Icon from "@/components/base/icon";

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
export default function Searchbar({ query }) {
  const router = useRouter();

  return (
    <div className={styles.wrap}>
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
            <span
              className={styles.button}
              onClick={() => {
                if (router) {
                  router.push({
                    pathname: router.pathname,
                    query: { ...router.query, modal: "filter" },
                  });
                }
              }}
            >
              <Text type="text3" tabIndex="0">
                Filtrer
              </Text>
              <Icon size={2} src="chevron.svg" />
            </span>
          </Col>
        </Row>
      </Section>
    </div>
  );
}
