import { useState } from "react";

import Tab from "react-bootstrap/Tab";

import useQ from "../hooks/useQ";

import Section from "../base/section";
import Tabs from "../base/tabs";

import SimpleSearch from "./simple";
import Col from "react-bootstrap/Col";

import translate from "@/components/base/translate";

import WorkTypeMenu from "@/components/search/advancedSearch/workTypeMenu/WorkTypeMenu";

import styles from "./Search.module.css";
import { useRouter } from "next/router";
import useBreakpoint from "../hooks/useBreakpoint";
import Related from "./related/Related";
import DidYouMean from "./didYouMean/DidYouMean";

export function Search({ onWorkTypeSelect }) {
  const [tab, setTab] = useState("simple");

  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);

  return (
    <Section
      className={`${styles.section}`}
      space={{
        top: isMobileSize ? "var(--pt2)" : true,
        bottom: isMobileSize ? "0px" : true,
      }}
      divider={false}
      backgroundColor="var(--concrete)"
      id="search-result-section"
      rightSideTitle={isMobileSize}
      title={
        <Col lg={{ offset: 10 }} sm={12}>
          <WorkTypeMenu
            className={styles.worktypes}
            onClick={onWorkTypeSelect}
          />
        </Col>
      }
      colSize={{ lg: { offset: 1, span: 7 } }}
    >
      <Tabs active={tab} onSelect={(k) => setTab(k)} className={styles.tabs}>
        <Tab
          eventKey="simple"
          title={translate({ context: "improved-search", label: "simple" })}
        >
          <Col className={styles.content}>
            <SimpleSearch />
            <Related />
            <DidYouMean />
          </Col>
        </Tab>
        <Tab
          eventKey="advanced"
          title={translate({ context: "improved-search", label: "advanced" })}
        >
          <Col className={styles.content}>Avanceret ...</Col>
        </Tab>
        <Tab
          eventKey="cql"
          title={translate({ context: "improved-search", label: "cql" })}
        >
          <Col className={styles.content}>CQL ...</Col>
        </Tab>
      </Tabs>
    </Section>
  );
}

export default function Wrap() {
  const { setQuery } = useQ();
  const router = useRouter();

  const handleOnWorkTypeSelect = (type) => {
    setQuery({
      query: {
        ...router.query,
        workTypes: [type === "all" ? null : type],
      },
      exclude: ["page"],
    });
  };

  return <Search onWorkTypeSelect={handleOnWorkTypeSelect} />;
}
