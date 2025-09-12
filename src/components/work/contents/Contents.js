/**
 * @file - Contents.js
 * Shows complete table of contents with hierarchical structure using manifestationContents API
 */

import React, { useMemo } from "react";
import Section from "@/components/base/section";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Text from "@/components/base/text/Text";
import Translate from "@/components/base/translate";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";

import styles from "./Contents.module.css";
import { useModal } from "@/components/_modal";
import { IconLink as LinkArrow } from "@/components/base/iconlink/IconLink";
import Accordion, { Item as AccordionItem } from "@/components/base/accordion";

/**
 * Fetches and flattens table of contents for a specific manifestation within a work.
 * Loads all manifestations for cache efficiency, but filters to the one matching `pid` or `type`.
 * Optionally wraps contents under a custom root heading.
 *
 * Returns a flattened list of entries for UI rendering, along with loading and error state.
 */
export function useTablesOfContents({ workId, pid, type, customRootHeader }) {
  const { data, isLoading, error } = useData(
    workFragments.workTableOfContents({ id: workId })
  );

  const manifestations = data?.work?.manifestations?.bestRepresentations ?? [];

  // Select target manifestation
  const targetManifestation = useMemo(() => {
    if (manifestations.length === 0) {
      return null;
    }
    const manifestationsWithContents = manifestations.filter((m) =>
      m.contents?.some((c) => c.entries?.length || c.raw)
    );

    const compareStringsDa = (a, b) =>
      String(a ?? "").localeCompare(String(b ?? ""), "da");

    const matchesType = (m) => {
      if (!type) {
        return false;
      }
      const expected = Array.isArray(type)
        ? type.sort(compareStringsDa).join(",")
        : type;
      const actual = m.materialTypes
        ?.map((mt) => mt.materialTypeSpecific?.display)
        ?.sort(compareStringsDa)
        ?.join(",");
      return actual === expected;
    };

    return (
      manifestationsWithContents.find((m) => m.pid === pid) ??
      manifestationsWithContents.find(matchesType) ??
      manifestationsWithContents[0]
    );
  }, [manifestations, pid, type]);

  const raw = useMemo(() => {
    return targetManifestation?.contents
      ?.flatMap((c) => c.raw)
      ?.join("\n")
      ?.trim();
  }, [targetManifestation]);

  // Optional wrapping with custom root
  const contents = useMemo(() => {
    const contentsWithEntries = targetManifestation?.contents.filter(
      (c) => c.entries?.length
    );
    if (!contentsWithEntries?.length) {
      return [];
    }
    if (customRootHeader && contentsWithEntries.length) {
      return [
        {
          heading: customRootHeader,
          entries: contentsWithEntries.flatMap((c) => c.entries),
        },
      ];
    }
    return contentsWithEntries;
  }, [customRootHeader, targetManifestation]);

  // Flatten structure for easy rendering
  const { flattened, count } = useMemo(() => {
    if (!contents.length) {
      return { flattened: null, count: null };
    }

    const flattenSource =
      contents.length > 1 || customRootHeader ? contents : contents[0].entries;

    return flattenContents(flattenSource);
  }, [contents, customRootHeader]);

  return {
    pid: targetManifestation?.pid ?? null,
    contents,
    flattened,
    raw: !flattened?.length ? raw : null,
    count,
    isLoading,
    error:
      error ||
      (!targetManifestation
        ? new Error("No matching manifestation found")
        : null),
  };
}

/**
 * Recursively flattens a nested contents tree into a flat array with visual level metadata.
 * Counts only entries with a display title (ignores headings like "Indhold").
 */
function flattenContents(entries, result = [], levels = []) {
  let count = 0;
  entries?.forEach((entry, index) => {
    const isLast = entries.length - 1 === index;
    result.push({
      title: entry.heading || entry.title?.display,
      creators: entry.creators,
      contributors: entry.contributors,
      playingTime: entry.playingTime,
      isLast,
      levels,
    });

    // Only count "real" chapteres/tracks
    // Not the "Contents" header
    if (entry.title?.display) {
      count++;
    }
    const children = entry.entries || entry.sublevel;
    if (children) {
      const newLevels = [...levels];
      if (isLast) {
        newLevels[newLevels.length - 1] = false;
      }
      newLevels.push(true);
      flattenContents(children, result, newLevels);
    }
  });

  return { flattened: result, count };
}

const VerticalLines = ({ levels, isLast }) => {
  return levels.map((showLine, index) => {
    if (!showLine) {
      return null;
    }
    const isRightMost = index === levels.length - 1;
    return (
      <div
        key={index}
        style={{
          position: "absolute",
          left: `calc(var(--base-padding) + var(--pt1) + ${index} * var(--pt3))`,
          top: 0,
          height: isRightMost && isLast ? "50%" : "100%",
          width: 1,
          backgroundColor: "var(--iron)",
        }}
      />
    );
  });
};

const HorizontalLine = ({ levels }) => {
  if (levels.length === 0) {
    return null;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: `calc(var(--base-padding) + var(--pt1) + ${
          levels.length - 1
        } * var(--pt3))`,
        top: "50%",
        width: "var(--pt1)",
        height: 1,
        backgroundColor: "var(--iron)",
      }}
    />
  );
};

const Creators = ({ creators, mergedTextProps }) => {
  const parts = [
    creators?.persons?.map((p) => p.display).join(", "),
    creators?.corporations?.map((c) => c.display).join(", "),
  ].filter(Boolean);

  if (parts.length === 0) {
    return null;
  }

  return (
    <Text lines={1} {...mergedTextProps?.creators} className={styles.creators}>
      {parts.join(", ")}
    </Text>
  );
};

function ContentRow({
  entry,
  index,
  style = {},
  entryClassName,
  mergedTextProps,
  disableBackground,
}) {
  const level = entry.levels.length;
  const isEven = index % 2 === 0;
  const playingTime = entry.playingTime;

  return (
    <div
      className={`${styles.entryItem} ${entryClassName} ${
        disableBackground
          ? ""
          : isEven
          ? styles.darkBackground
          : styles.lightBackground
      }`}
      style={{
        position: "relative",
        paddingLeft: `calc(var(--base-padding) + ${level} * var(--pt3))`,
        ...style,
      }}
    >
      <VerticalLines levels={entry.levels} isLast={entry.isLast} />
      <HorizontalLine levels={entry.levels} />

      <div className={styles.mainContent}>
        <div
          className={`${styles.titleWrapper} ${
            !entry.creators ? styles.titleWrapperFullWidth : ""
          }`}
        >
          <Text lines={1} {...mergedTextProps.title}>
            {entry.title}
            {entry.contributors && (
              <Text tag="span" className={styles.contributors}>
                (
                {Array.isArray(entry.contributors)
                  ? `${entry.contributors.join(", ")}`
                  : `${entry.contributors}`}
                )
              </Text>
            )}
          </Text>
        </div>
        {entry.creators && (
          <div className={styles.creators}>
            <Creators
              creators={entry.creators}
              mergedTextProps={mergedTextProps}
            />
          </div>
        )}
      </div>
      {playingTime && (
        <div className={styles.playingTime}>
          <Text {...mergedTextProps.playingTime} lines={1}>
            {playingTime}
          </Text>
        </div>
      )}
    </div>
  );
}

const NonExpandableItem = ({ children, accordionHasExpandableItems }) => {
  return (
    <div
      className={accordionHasExpandableItems ? styles.nonExpandableItem : ""}
    >
      {children}
    </div>
  );
};
/**
 * Renders a list of table of contents entries with hierarchical structure
 * Shows creators, contributors, and playing time information for each entry
 */
export function TableOfContentsEntries({
  flattened,
  raw,
  count,
  className,
  showMoreLimit,
  workId,
  pid,
  textProps = {},
  enableAccordion = true,
}) {
  // Default text props
  const defaultTextProps = {
    raw: { type: "text2" },
    creators: { type: "text3" },
    playingTime: { type: "text3" },
    showMore: { type: "text3" },
    title: { type: "text4" },
  };

  // Merge default text props with custom text props
  const mergedTextProps = { ...defaultTextProps, ...textProps };

  const modal = useModal();

  // Parent groups (only grouped by outermost level)
  const grouped = useMemo(() => {
    if (!flattened) {
      return [];
    }
    if (!enableAccordion) {
      return flattened?.map((entry) => ({ ...entry, children: [] }));
    }
    const groups = [];
    let current;
    flattened.forEach((entry) => {
      if (entry.levels.length === 0 || !current) {
        current = { ...entry, children: [] };
        groups.push(current);
        return;
      }

      current.children.push(entry);
    });
    return groups;
  }, [flattened]);

  const truncated = useMemo(() => {
    return showMoreLimit ? grouped?.slice(0, showMoreLimit) : grouped;
  }, [grouped, showMoreLimit]);

  const truncatedRaw = useMemo(() => {
    if (!showMoreLimit) {
      return raw;
    }
    return raw?.slice(0, showMoreLimit * 40);
  }, [raw, showMoreLimit]);

  const isTruncated =
    truncated?.length < grouped?.length || truncatedRaw?.length < raw?.length;

  if (!truncated?.length && !raw?.length) {
    return null;
  }

  const hasExpandableItems =
    enableAccordion && grouped.some((entry) => entry.children.length > 0);

  const handleShowMore = () => {
    modal.push("manifestationContent", {
      workId,
      pid,
      showOrderTxt: false,
      singleManifestation: true,
      showmoreButton: false,
    });
  };

  return (
    <div className={`${styles.tableOfContentsEntries} ${className}`}>
      {!raw && truncated?.length && (
        <div className={styles.entriesList}>
          <Accordion>
            {truncated.map((entry, index) => {
              if (entry.children.length === 0 || !enableAccordion) {
                return (
                  <NonExpandableItem
                    key={index}
                    accordionHasExpandableItems={hasExpandableItems}
                  >
                    <ContentRow
                      entry={entry}
                      index={index}
                      disableBackground={hasExpandableItems}
                      entryClassName={styles.parentEntry}
                      mergedTextProps={mergedTextProps}
                    />
                    {entry.children.map((entry, index) => (
                      <ContentRow
                        key={entry.title}
                        entry={entry}
                        index={index}
                        entryClassName={styles.childEntry}
                        mergedTextProps={mergedTextProps}
                      />
                    ))}
                  </NonExpandableItem>
                );
              }

              return (
                <AccordionItem
                  title={
                    <ContentRow
                      key={entry.title}
                      entry={entry}
                      index={0}
                      entryClassName={styles.parentEntry}
                      mergedTextProps={mergedTextProps}
                      disableBackground={true}
                    />
                  }
                  key={index}
                  eventKey={index}
                  contentStyle={{ padding: "0" }}
                  iconSize={3}
                  headerStyle={{
                    paddingTop: "0",
                    paddingBottom: "0",
                    minHeight: "38px",
                  }}
                  headerWrapperClassName={styles.headerWrapper}
                >
                  {entry.children.map((entry, index) => (
                    <ContentRow
                      key={entry.title}
                      entry={entry}
                      index={index}
                      entryClassName={styles.childEntry}
                      mergedTextProps={mergedTextProps}
                    />
                  ))}
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}
      {truncatedRaw && (
        <Text {...mergedTextProps.raw}>
          {truncatedRaw} {isTruncated ? "..." : ""}
        </Text>
      )}

      {showMoreLimit && isTruncated && (
        <div
          className={
            truncatedRaw ? styles.showMoreLinkRaw : styles.showMoreLink
          }
        >
          <LinkArrow
            iconPlacement="right"
            iconOrientation={180}
            border={{ bottom: { keepVisible: true }, top: false }}
            onClick={handleShowMore}
          >
            <Text lines={1} tag="span" {...mergedTextProps.showMore}>
              {Translate({
                context: "manifestation_content",
                label: "see_all",
              })}{" "}
              {count > 0 && <span>({count})</span>}
            </Text>
          </LinkArrow>
        </div>
      )}
    </div>
  );
}

/**
 * Renders a complete table of contents section with title and subtitle
 * Displays the content entries in a structured layout
 */
function TableOfContentsSection({
  flattened,
  raw,
  type,
  className,
  workId,
  pid,
  count,
  enableAccordion = true,
}) {
  return (
    <Section
      title={Translate({ context: "content", label: "title" })}
      subtitle={Translate({
        context: "details",
        label: "subtitle",
        vars: [type],
      })}
      divider={{ content: !!raw }}
    >
      <Row>
        <Col xs={12} xl={9} className={raw ? "" : styles.columnNoPaddingMobile}>
          <TableOfContentsEntries
            flattened={flattened}
            className={className}
            showMoreLimit={10}
            workId={workId}
            pid={pid}
            count={count}
            raw={raw}
            enableAccordion={enableAccordion}
          />
        </Col>
      </Row>
    </Section>
  );
}

function TablesOfContentsSkeleton() {
  return (
    <Section
      title={
        <Text type="text3" lines={2} skeleton={true}>
          ...
        </Text>
      }
      space={{ top: "var(--pt8)", bottom: "var(--pt4)" }}
    >
      <Row>
        <Col xs={6} md={3} className={styles.skeleton}>
          <Text
            type="text3"
            lines={6}
            skeleton={true}
            className={styles.skeleton}
          >
            ...
          </Text>
        </Col>
      </Row>
    </Section>
  );
}

/**
 * Renders table of contents with data fetching from a single manifestation
 * Handles loading states and error conditions automatically
 */
export function TableOfContentsList(props) {
  const { workId, type, className, enableAccordion = true } = props;
  const tableOfContents = useTablesOfContents({
    workId,
    type,
  });
  if (
    tableOfContents.error ||
    (!tableOfContents.flattened && !tableOfContents.raw)
  ) {
    return null;
  }

  if (tableOfContents.isLoading) {
    return <TablesOfContentsSkeleton />;
  }

  return (
    <TableOfContentsSection
      {...tableOfContents}
      type={type}
      className={className}
      workId={workId}
      enableAccordion={enableAccordion}
    />
  );
}

export default TableOfContentsList;
