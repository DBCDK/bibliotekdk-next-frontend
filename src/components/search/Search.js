import React, { useEffect } from "react";
import { useRouter } from "next/router";

import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import useQ from "../hooks/useQ";
import useBreakpoint from "../hooks/useBreakpoint";

import Tabs from "../base/tabs";
import SimpleSearch from "./simple";
import AdvancedSearch from "./advancedSearch/advancedSearch/AdvancedSearch";
import CqlTextArea from "./advancedSearch/cqlTextArea/CqlTextArea";
import WorkTypeMenu from "@/components/search/advancedSearch/workTypeMenu/WorkTypeMenu";

import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import { getHelpUrl } from "@/lib/utils";
import styles from "./Search.module.css";
import HelpBtn from "./help";

// -----------------------------
// Centralized mode + URL helpers
// -----------------------------
const MODE = {
  SIMPEL: "simpel",
  AVANCERET: "avanceret",
  CQL: "cql",
  HISTORY: "history",
};

const MODE_RULES = {
  [MODE.SIMPEL]: {
    // Keep simple URLs tidy
    allow: ["q.all", "workTypes", "tid"],
    clean: toSimple,
    path: "/find/simpel",
  },
  [MODE.AVANCERET]: {
    allow: ["fieldSearch", "workTypes", "tid"],
    clean: toAdvanced,
    path: "/find/avanceret",
  },
  [MODE.CQL]: {
    // CQL uses the exact same URL shape as advanced
    allow: ["fieldSearch", "workTypes", "tid"],
    clean: toAdvanced,
    path: "/find/cql",
  },
  [MODE.HISTORY]: {
    allow: [],
    path: "/find/historik/seneste",
  },
};

function extractAllFromFieldSearch(fieldSearch) {
  try {
    const obj =
      typeof fieldSearch === "string" ? JSON.parse(fieldSearch) : fieldSearch;
    const field = obj?.inputFields?.[0];
    if (field?.searchIndex === "term.default") {
      return field.value || "";
    }
    return ""; // ignorer alt andet
  } catch {
    return "";
  }
}

function buildFieldSearchFromAll(all) {
  if (!all) return undefined;
  return JSON.stringify({
    inputFields: [
      {
        value: all,
        prefixLogicalOperator: null,
        searchIndex: "term.default",
      },
    ],
  });
}

function isEmptyVal(v) {
  if (v == null) return true;
  if (Array.isArray(v)) return v.length === 0;
  return `${v}`.trim() === "";
}

function pickAllowed(query, allow = []) {
  const next = {};
  for (const k of allow) {
    if (k in query && !isEmptyVal(query[k])) next[k] = query[k];
  }
  return next;
}

function toSimple(query) {
  // If q.all is missing but fieldSearch exists → lift first value
  const all = query["q.all"] || extractAllFromFieldSearch(query.fieldSearch);
  const base = { ...query, "q.all": all };
  const picked = pickAllowed(base, MODE_RULES[MODE.SIMPEL].allow);
  if (isEmptyVal(picked["q.all"])) delete picked["q.all"]; // keep url clean
  return picked;
}

function toAdvanced(query) {
  // If fieldSearch is missing but q.all exists → build minimal fieldSearch
  const fs = query.fieldSearch || buildFieldSearchFromAll(query["q.all"]);
  const base = { ...query, fieldSearch: fs };
  const picked = pickAllowed(base, MODE_RULES[MODE.AVANCERET].allow);
  if (isEmptyVal(picked.fieldSearch)) delete picked.fieldSearch;
  return picked;
}

/**
 * Normalize current query to a target mode and navigate.
 * replace=true when auto-normalizing (so Back/Forward feels natural)
 */
function navigateToMode(
  router,
  targetMode,
  { replace = false, normalize = true } = {}
) {
  const nav = replace ? router.replace : router.push;
  const rules = MODE_RULES[targetMode];
  const cleaned = normalize ? rules?.clean?.(router.query || {}) : {};
  return nav(
    {
      pathname: rules?.path || `/find/${targetMode}`,
      query: cleaned && Object.keys(cleaned).length ? cleaned : undefined,
    },
    undefined,
    { shallow: true }
  );
}

// -----------------------------
// UI Components
// -----------------------------
export function Search({ onWorkTypeSelect, mode, onTabChange }) {
  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);
  const activeTab = mode || MODE.SIMPEL;
  const includeWorkTypeMenu = [MODE.AVANCERET].includes(activeTab);

  const isHistory = activeTab === MODE.HISTORY;

  const paddingBottomClass = !isHistory ? styles.paddingBottom : "";

  return (
    <div className={`${styles.background}`}>
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
                eventKey={MODE.SIMPEL}
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
                  <SimpleSearch />
                </Col>
              </Tab>

              <Tab
                eventKey={MODE.AVANCERET}
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
                  <AdvancedSearch />
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
              ></Tab>
            </Tabs>
          </Col>

          <Col className={styles.links} sm={12} lg={{ span: 2 }}>
            {!isHistory && (
              <div>
                <HelpBtn className={styles.help} />
              </div>
            )}
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
    // Centralized navigation + normalization
    navigateToMode(router, newMode, { replace: false, normalize: true });
  };

  // On mount & when mode changes, normalize current URL for that mode
  useEffect(() => {
    if (!router.isReady) return;
    const currentMode = typeof mode === "string" ? mode : MODE.SIMPEL;
    if (!MODE_RULES[currentMode]) return;

    const normalized = MODE_RULES[currentMode].clean(router.query || {});
    const pickedCurrent = pickAllowed(
      router.query || {},
      MODE_RULES[currentMode].allow
    );

    const alreadyClean =
      JSON.stringify(pickedCurrent) === JSON.stringify(normalized);
    if (!alreadyClean) {
      navigateToMode(router, currentMode, { replace: true, normalize: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, mode]);

  return (
    <Search
      mode={mode || MODE.HISTORY}
      onTabChange={handleModeChange}
      onWorkTypeSelect={handleOnWorkTypeSelect}
    />
  );
}
