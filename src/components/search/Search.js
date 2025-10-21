// components/search/Search.jsx
import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/router";

import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import useQ from "../hooks/useQ";
import useBreakpoint from "../hooks/useBreakpoint";
import { MODE, MODE_PATH, useSearchSync } from "../hooks/useSearchSync";

import Tabs from "../base/tabs";
import SimpleSearch from "./simple";
import AdvancedSearch from "./advancedSearch/advancedSearch/AdvancedSearch";
import CqlTextArea from "./advancedSearch/cqlTextArea/CqlTextArea";
import WorkTypeMenu from "@/components/search/advancedSearch/workTypeMenu/WorkTypeMenu";

import Translate from "@/components/base/translate";

import styles from "./Search.module.css";
import HelpBtn from "./help";
import IndexesBtn from "./indexes";

/**
 * Tab shell component. Keeps the UI minimal and delegates logic to the hook.
 * All comments are in English for consistency and tooling (SonarQube, ESLint).
 */
export function Search({
  onWorkTypeSelect,
  mode,
  onTabChange,
  onSimpleCommit,
  onAdvancedCommit,
}) {
  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);
  const activeTab = mode || MODE.SIMPLE;
  const includeWorkTypeMenu = [MODE.ADVANCED].includes(activeTab);
  const isHistory = activeTab === MODE.HISTORY;
  const paddingBottomClass = !isHistory ? styles.paddingBottom : "";

  console.log("activeTab", activeTab);

  return (
    <div className={styles.background}>
      <Container fluid>
        <Row as="section" className={`${styles.section} ${paddingBottomClass}`}>
          <Col sm={12} lg={{ span: 2 }} className={styles.select}>
            {includeWorkTypeMenu && !isMobileSize && (
              <WorkTypeMenu
                className={styles.worktypes}
                onClick={onWorkTypeSelect}
              />
            )}
          </Col>

          <Col sm={12} lg={{ offset: 1, span: 7 }}>
            <Tabs
              active={activeTab}
              onSelect={(nextTab) => {
                console.log("nextTab", nextTab);

                if (nextTab && nextTab !== activeTab) onTabChange(nextTab);
              }}
              className={styles.tabs}
            >
              <Tab
                eventKey={MODE.SIMPLE}
                title={Translate({
                  context: "improved-search",
                  label: "simple",
                })}
              >
                <Col className={styles.content}>
                  {isMobileSize && (
                    <WorkTypeMenu
                      className={styles.workTypesMenu}
                      onClick={onWorkTypeSelect}
                    />
                  )}
                  {/* Call onSimpleCommit(text) on submit inside SimpleSearch */}
                  <SimpleSearch onCommit={onSimpleCommit} />
                </Col>
              </Tab>

              <Tab
                eventKey={MODE.ADVANCED}
                title={Translate({
                  context: "improved-search",
                  label: "advanced",
                })}
              >
                <Col className={styles.content}>
                  {isMobileSize && (
                    <WorkTypeMenu
                      className={styles.workTypesMenu}
                      onClick={onWorkTypeSelect}
                    />
                  )}
                  {/* Call onAdvancedCommit(fieldSearchString) on submit inside AdvancedSearch */}
                  <AdvancedSearch onCommit={onAdvancedCommit} />
                </Col>
              </Tab>

              <Tab
                eventKey={MODE.CQL}
                title={Translate({
                  context: "improved-search",
                  label: isMobileSize ? "cql" : "cql-desktop",
                })}
              >
                <Col className={styles.content} lg={12} xs={12}>
                  <CqlTextArea />
                </Col>
              </Tab>

              <Tab
                eventKey={MODE.HISTORY}
                title={Translate({
                  context: "improved-search",
                  label: "history",
                })}
              />
            </Tabs>
          </Col>

          <Col className={styles.links} sm={12} lg={{ span: 2 }}>
            {!isHistory && (
              <div>
                <IndexesBtn className={styles.indexes} />
                <HelpBtn className={styles.help} />
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

/**
 * Wrap component: wires tab navigation and commit handlers via the hook.
 * No auto-normalization on tab switch; values persist until submit.
 */
export default function Wrap() {
  const { setQuery } = useQ();
  const router = useRouter();

  // Derive mode from the current path first; fallback to query; default to SIMPLE.
  const mode = useMemo(() => {
    const path = router.asPath || router.pathname || "";
    if (path.includes("/find/historik")) return MODE.HISTORY;
    if (path.includes("/find/avanceret")) return MODE.ADVANCED;
    if (path.includes("/find/cql")) return MODE.CQL;
    const q = typeof router.query.mode === "string" ? router.query.mode : null;
    return q && Object.values(MODE).includes(q) ? q : MODE.SIMPLE;
  }, [router.asPath, router.pathname, router.query.mode]);

  const { handleSimpleCommit, handleAdvancedCommit } = useSearchSync({
    router,
    setQuery,
  });

  // Keep navigation as a memoized callback to avoid needless re-renders.
  const handleModeChange = useCallback(
    (nextMode) => {
      const path = MODE_PATH[nextMode] || `/find/${nextMode}`;
      router
        .push({ pathname: path, query: router.query }, undefined, {
          shallow: true,
        })
        .catch(() => {
          // Fail-safe: avoid unhandled promise rejections; log if needed.
        });
    },
    [router]
  );

  const handleOnWorkTypeSelect = useCallback(
    (type) => {
      setQuery({
        query: {
          ...router.query,
          workTypes: [type === "all" ? null : type],
        },
        exclude: ["page"],
      });
    },
    [router.query, setQuery]
  );

  return (
    <Search
      mode={mode}
      onTabChange={handleModeChange}
      onWorkTypeSelect={handleOnWorkTypeSelect}
      onSimpleCommit={handleSimpleCommit}
      onAdvancedCommit={handleAdvancedCommit}
    />
  );
}
