import { useState } from "react";

import Tab from "react-bootstrap/Tab";

import useQ from "../hooks/useQ";

import Section from "../base/section";
import Tabs from "../base/tabs";
import Text from "../base/text";

import SimpleSearch from "./simple";
import Col from "react-bootstrap/Col";
import Link from "../base/link";
import Divider from "../base/divider";

import WorkTypeMenu from "@/components/search/advancedSearch/workTypeMenu/WorkTypeMenu";

import styles from "./Search.module.css";

export function Search() {
  const [tab, setTab] = useState("simple");

  return (
    <Section
      className={`${styles.section}`}
      divider={false}
      backgroundColor="var(--concrete)"
      id="search-result-section"
      title={
        <Col lg={{ offset: 10 }} sm={12}>
          <WorkTypeMenu className={styles.worktypes} />
        </Col>
      }
      colSize={{ lg: { offset: 1, span: 7 } }}
    >
      <Tabs active={tab} onSelect={(k) => setTab(k)} className={styles.tabs}>
        <Tab eventKey="simple" title="Søg">
          <Col className={styles.content}>
            <SimpleSearch />
          </Col>
        </Tab>
        <Tab eventKey="advanced" title="Avanceret">
          <Col className={styles.content}>Avanceret ...</Col>
        </Tab>
        <Tab eventKey="cql" title="CQL-søgning">
          <Col className={styles.content}>CQL ...</Col>
        </Tab>
      </Tabs>
    </Section>
  );
}

export default function Wrap() {
  const { q } = useQ();

  return <Search q={q} />;
}
