import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import useQ from "../hooks/useQ";
import useBreakpoint from "../hooks/useBreakpoint";

import Tabs from "../base/tabs";
import SimpleSearch from "./simple";
import Related from "./related/Related";
import DidYouMean from "./didYouMean/DidYouMean";
import AdvancedSearch from "./advancedSearch/advancedSearch/AdvancedSearch";
import CqlTextArea from "./advancedSearch/cqlTextArea/CqlTextArea";
import WorkTypeMenu from "@/components/search/advancedSearch/workTypeMenu/WorkTypeMenu";

import translate from "@/components/base/translate";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import IconButton from "../base/iconButton";
import { getHelpUrl } from "@/lib/utils";

import styles from "./Search.module.css";

export function Search({ onWorkTypeSelect, mode, onTabChange }) {
  const [tab, setTab] = useState(mode || "simpel");
  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);

  const isSimple = tab === "simpel";

  // Sync tab when URL mode changes
  useEffect(() => {
    if (mode && mode !== tab) {
      setTab(mode);
    }
  }, [mode]);

  return (
    <div className={styles.background}>
      <Container fluid>
        <Row as="section" className={styles.section}>
          <Col sm={12} lg={{ span: 2 }} className={styles.select}>
            {!isSimple && (
              <WorkTypeMenu
                className={styles.worktypes}
                onClick={onWorkTypeSelect}
              />
            )}
          </Col>

          <Col sm={12} lg={{ offset: 1, span: 7 }}>
            <Tabs
              active={tab}
              onSelect={(nextTab) => {
                if (nextTab !== tab) {
                  setTab(nextTab);
                  onTabChange(nextTab);
                }
              }}
              className={styles.tabs}
            >
              <Tab
                eventKey="simpel"
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
                eventKey="avanceret"
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
                title={translate({
                  context: "improved-search",
                  label: "cql",
                })}
              >
                <Col className={styles.content} lg={12} xs={12}>
                  <CqlTextArea />
                </Col>
              </Tab>
            </Tabs>
          </Col>

          <Col className={styles.links} sm={12} lg={{ span: 2 }}>
            <IconButton
              icon="arrowrightblue"
              keepUnderline={true}
              iconSize={1}
              onClick={() => {}}
              href="/avanceret/soegehistorik"
              border={{
                top: false,
                bottom: {
                  keepVisible: true,
                },
              }}
            >
              <Text type="text4" tag="span">
                {Translate({
                  context: "search",
                  label: "searchHistory",
                })}
              </Text>
            </IconButton>

            <Link
              href={getHelpUrl("soegning-baade-enkel-og-avanceret", "179")}
              border={{ bottom: { keepVisible: true } }}
              target="_blank"
            >
              <Text type="text5" tag="span">
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
  const { mode } = router.query;

  // Gemmer pr. tab: { simpel: {...}, avanceret: {...}, cql: {...} }
  const savedQueriesRef = useRef({});

  // På initial load: hvis vi lander med query på et mode, så husk dem som udgangspunkt
  useEffect(() => {
    if (!mode) return;
    const { mode: _m, ...rest } = router.query;
    // Gem kun noget, hvis der faktisk er parametre
    if (Object.keys(rest || {}).length > 0) {
      savedQueriesRef.current[mode] = rest;
    }
  }, [mode]);

  const handleOnWorkTypeSelect = (type) => {
    setQuery({
      query: {
        ...router.query,
        workTypes: [type === "all" ? null : type],
      },
      exclude: ["page"],
    });
  };

  const handleModeChange = (newMode) => {
    const currentMode = router.query.mode;
    const { mode: _drop, ...currentQuery } = router.query;

    // 1) Gem nuværende tabs params (uden mode)
    //    Kun hvis der faktisk var noget at gemme
    if (Object.keys(currentQuery).length > 0) {
      savedQueriesRef.current[currentMode] = currentQuery;
    } else {
      // Hvis der ikke er noget, ryd evt. tidligere gemt
      delete savedQueriesRef.current[currentMode];
    }

    // 2) Find evt. gemte params for newMode
    const nextQuery = savedQueriesRef.current[newMode];

    // 3) Skift route. Hvis vi har gemte params for newMode -> sæt dem i URL.
    //    Hvis ikke -> hold URL "ren" (kun /find/<newMode>).
    router.push(
      {
        pathname: `/find/${newMode}`,
        query: nextQuery || undefined,
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <Search
      mode={mode}
      onTabChange={handleModeChange}
      onWorkTypeSelect={handleOnWorkTypeSelect}
    />
  );
}
