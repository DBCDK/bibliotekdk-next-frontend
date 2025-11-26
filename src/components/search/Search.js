// components/search/Search.jsx
import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/router";

import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import useQ from "../hooks/useQ";
import useBreakpoint from "../hooks/useBreakpoint";
import { useSearchSync } from "../hooks/useSearchSync";
import { MODE } from "../utils/searchSyncCore";

import Tabs from "../base/tabs";
import SimpleSearch from "./simple";
import AdvancedSearch from "./advancedSearch/advancedSearch/AdvancedSearch";
import CqlTextArea from "./advancedSearch/cqlTextArea/CqlTextArea";
import WorkTypeMenu from "@/components/search/advancedSearch/workTypeMenu/WorkTypeMenu";

import Translate from "@/components/base/translate";
import styles from "./Search.module.css";
import HelpBtn from "./help";
import IndexesBtn from "./indexes";

import { useFacets } from "./advancedSearch/useFacets";
import { useQuickFilters } from "./advancedSearch/useQuickFilters";

let hasEverFocusedTabs = false;

/**
 * Tab shell component. Keeps the UI minimal and delegates logic to the hook.
 * (Markup and classNames are unchanged, so your styles remain as before.)
 */
export function Search({
  onWorkTypeSelect,
  mode,
  onTabChange,
  onSimpleCommit,
  onAdvancedCommit,
  onCQLCommit,
}) {
  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);
  const activeTab = mode || MODE.SIMPLE;
  const includeWorkTypeMenu = [MODE.ADVANCED].includes(activeTab);
  const isHistory = activeTab === MODE.HISTORY;
  const paddingBottomClass = !isHistory ? styles.paddingBottom : "";

  return (
    <div className={styles.background}>
      <Container fluid>
        <Row as="section" className={`${styles.section} ${paddingBottomClass}`}>
          <Col sm={12} lg={{ span: 2 }} className={styles.select}>
            {includeWorkTypeMenu && !isMobileSize && (
              <WorkTypeMenu onClick={onWorkTypeSelect} />
            )}
          </Col>

          <Col sm={12} lg={{ offset: 1, span: 9 }}>
            <Tabs
              active={activeTab}
              onSelect={(nextTab) => {
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
                <Row className={styles.tabRow}>
                  <Col sm={12} lg={{ span: 9 }} className={styles.content}>
                    {/* Call onSimpleCommit(text) on submit inside SimpleSearch */}
                    <SimpleSearch onCommit={onSimpleCommit} />
                  </Col>
                  <Col className={styles.links} sm={12} lg={{ span: 3 }}>
                    {!isHistory && (
                      <div>
                        <IndexesBtn className={styles.indexes} />
                        <HelpBtn className={styles.help} />
                      </div>
                    )}
                  </Col>
                </Row>
              </Tab>

              <Tab
                eventKey={MODE.ADVANCED}
                title={Translate({
                  context: "improved-search",
                  label: "advanced",
                })}
              >
                <Row className={styles.tabRow}>
                  <Col sm={12} lg={{ span: 9 }} className={styles.content}>
                    {isMobileSize && (
                      <WorkTypeMenu
                        className={styles.workTypesMobile}
                        onClick={onWorkTypeSelect}
                      />
                    )}
                    <AdvancedSearch onCommit={onAdvancedCommit} />
                  </Col>
                  <Col className={styles.links} sm={12} lg={{ span: 3 }}>
                    {!isHistory && (
                      <div>
                        <IndexesBtn className={styles.indexes} />
                        <HelpBtn className={styles.help} />
                      </div>
                    )}
                  </Col>
                </Row>
              </Tab>

              <Tab
                eventKey={MODE.CQL}
                title={Translate({
                  context: "improved-search",
                  label: isMobileSize ? "cql" : "cql-desktop",
                })}
              >
                <Row className={styles.tabRow}>
                  <Col sm={12} lg={{ span: 9 }} className={styles.content}>
                    <CqlTextArea onCommit={onCQLCommit} />
                  </Col>
                  <Col className={styles.links} sm={12} lg={{ span: 3 }}>
                    {!isHistory && (
                      <div>
                        <IndexesBtn className={styles.indexes} />
                        <HelpBtn className={styles.help} />
                      </div>
                    )}
                  </Col>
                </Row>
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
        </Row>
      </Container>
    </div>
  );
}

/**
 * Wrap component: wiring for URL sync.
 * - Mode is derived ONLY from the path (not from ?mode=)
 * - Tab changes convert URL structure to the target mode
 * - WorkType only changes workTypes and preserves search terms
 * - Submit from simple/advanced is handled in the hook (no interpolation errors)
 */
export default function Wrap() {
  const { setQuery } = useQ();
  const router = useRouter();

  const {
    mode,
    goToMode,
    setWorkType,
    handleSimpleCommit,
    handleAdvancedCommit,
    handleCqlCommit,
  } = useSearchSync({ router, setQuery });

  const { resetFacets } = useFacets();
  const { resetQuickFilters } = useQuickFilters();

  const handleModeChange = useCallback(
    (nextMode) => {
      goToMode(nextMode);
    },
    [goToMode]
  );

  useEffect(() => {
    const TABS_SELECTOR = ".tabs-tabs";
    const ACTIVE_TAB_SELECTOR = `${TABS_SELECTOR} button[role="tab"][aria-selected="true"]`;

    // Skip the very first run (initial page load before any tab interaction)
    if (!hasEverFocusedTabs) {
      hasEverFocusedTabs = true;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const activeTabButton = document.querySelector(ACTIVE_TAB_SELECTOR);

      if (activeTabButton instanceof HTMLElement) {
        activeTabButton.focus();
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [mode]);

  const handleOnWorkTypeSelect = useCallback(
    (type) => {
      // reset local facets and quickfilters
      resetFacets();
      resetQuickFilters();

      // Update workType via useSearchSync
      setWorkType(type);
    },
    [resetFacets, resetQuickFilters, setWorkType]
  );

  return (
    <Search
      mode={mode}
      onTabChange={handleModeChange}
      onWorkTypeSelect={handleOnWorkTypeSelect}
      onSimpleCommit={handleSimpleCommit}
      onAdvancedCommit={handleAdvancedCommit}
      onCQLCommit={handleCqlCommit}
    />
  );
}
