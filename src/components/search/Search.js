import { useState } from "react";

import Tab from "react-bootstrap/Tab";

import useQ from "../hooks/useQ";

import Section from "../base/section";
import Tabs from "../base/tabs";

import SimpleSearch from "./simple";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import translate from "@/components/base/translate";

import WorkTypeMenu from "@/components/search/advancedSearch/workTypeMenu/WorkTypeMenu";

import styles from "./Search.module.css";
import { useRouter } from "next/router";
import useBreakpoint from "../hooks/useBreakpoint";
import Related from "./related/Related";
import DidYouMean from "./didYouMean/DidYouMean";
import AdvancedSearch from "./advancedSearch/advancedSearch/AdvancedSearch";

import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { getHelpUrl } from "@/lib/utils";
import Translate from "@/components/base/translate";

import { CqlTextArea } from "./advancedSearch/cqlTextArea/CqlTextArea";

export function Search({ onWorkTypeSelect }) {
  const [tab, setTab] = useState("advanced");

  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);

  return (
    <div className={styles.background}>
      <Container fluid>
        <Row as="section" className={`${styles.section}`}>
          <Col sm={12} lg={{ span: 2 }} className={styles.select}>
            <WorkTypeMenu
              className={styles.worktypes}
              onClick={onWorkTypeSelect}
            />
          </Col>

          <Col sm={12} lg={{ offset: 1, span: 7 }}>
            <Tabs
              active={tab}
              onSelect={(k) => setTab(k)}
              className={styles.tabs}
            >
              <Tab
                eventKey="simple"
                title={translate({
                  context: "improved-search",
                  label: "simple",
                })}
              >
                <Col className={styles.content}>
                  <SimpleSearch />
                  <Related />
                  <DidYouMean />
                </Col>
              </Tab>
              <Tab
                eventKey="advanced"
                title={translate({
                  context: "improved-search",
                  label: "advanced",
                })}
              >
                <Col className={styles.content}>
                  <AdvancedSearch />
                </Col>
              </Tab>
              <Tab
                eventKey="cql"
                title={translate({ context: "improved-search", label: "cql" })}
              >
                <Col className={styles.content} lg={12} xs={12}>
                  <CqlTextArea />
                </Col>
              </Tab>
            </Tabs>
          </Col>

          <Col className={styles.links} sm={12} lg={{ span: 2 }}>
            <Link
              onClick={() => {}}
              href="/avanceret/soegehistorik"
              border={{
                top: false,
                bottom: {
                  keepVisible: true,
                },
              }}
            >
              <Text type="text3" tag="span">
                {Translate({
                  context: "search",
                  label: "searchHistory",
                })}
              </Text>
            </Link>
            <Link
              href={getHelpUrl("soegning-baade-enkel-og-avanceret", "179")}
              border={{ bottom: { keepVisible: true } }}
              target="_blank"
            >
              <Text type="text3" tag="span">
                {Translate({
                  context: "search",
                  label: isMobileSize
                    ? "mobile_helpAndGuidance"
                    : "helpAndGuidance",
                })}
              </Text>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
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
