// components/search/Search.jsx
import React, { useCallback } from "react";
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

/**
 * Tab shell component. Keeps the UI minimal and delegates logic to the hook.
 * (Markup og classNames er uændret, så dine styles forbliver som før.)
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
                  <CqlTextArea onCommit={onCQLCommit} />
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
 * Wrap-komponent: wiring til URL-sync.
 * - Mode afledes KUN fra path (ikke ?mode=)
 * - Tab-skift konverterer URL-structure til target mode
 * - WorkType ændrer kun workTypes og bevarer søgetermer
 * - Submit fra simple/advanced håndteres i hooken (ingen interpolation-fejl)
 */
export default function Wrap() {
  const { setQuery } = useQ(); // beholdt for kompatibilitet, hvis du bruger den andre steder
  const router = useRouter();

  const {
    mode,
    goToMode, // tab navigation med URL-normalisering
    setWorkType, // opdater kun workTypes i URL (bevar søgeparametre)
    handleSimpleCommit, // Simple submit → sæt q.all og baseline
    handleAdvancedCommit, // Advanced submit → sæt fieldSearch og evt. løft q.all
    handleCqlCommit, // CQL submit → sæt cql param
  } = useSearchSync({ router, setQuery });

  // Tabs: skift mode (URL bliver formateret rigtigt pr. mode)
  const handleModeChange = useCallback(
    (nextMode) => {
      goToMode(nextMode);
    },
    [goToMode]
  );

  // WorkType: rør kun workTypes
  const handleOnWorkTypeSelect = useCallback(
    (type) => {
      setWorkType(type);
    },
    [setWorkType]
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
