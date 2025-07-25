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

    const matchesType = (m) => {
      if (!type) {
        return false;
      }
      const expected = Array.isArray(type) ? type.sort().join(",") : type;
      const actual = m.materialTypes
        ?.map((mt) => mt.materialTypeSpecific?.display)
        ?.sort()
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
    return targetManifestation?.contents?.flatMap((c) => c.raw)?.join("\n");
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
    raw,
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
      const { count: subCount } = flattenContents(children, result, newLevels);
      count += subCount;
    }
  });

  return { flattened: result, count };
}

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

  const truncated = useMemo(() => {
    return showMoreLimit ? flattened?.slice(0, showMoreLimit) : flattened;
  }, [flattened, showMoreLimit]);

  const truncatedRaw = useMemo(() => {
    if (!showMoreLimit) {
      return raw;
    }
    return raw?.slice(0, showMoreLimit * 40);
  }, [raw, showMoreLimit]);

  const isTruncated =
    truncated?.length < flattened?.length || truncatedRaw?.length < raw?.length;

  if (!truncated?.length && !raw?.length) {
    return null;
  }

  const handleShowMore = () => {
    modal.push("manifestationContent", {
      workId,
      pid,
      showOrderTxt: false,
      singleManifestation: true,
      showmoreButton: false,
    });
  };

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

  const Creators = ({ creators, contributors }) => {
    const parts = [
      creators?.persons?.map((p) => p.display).join(", "),
      creators?.corporations?.map((c) => c.display).join(", "),
      Array.isArray(contributors) ? contributors.join(", ") : contributors,
    ].filter(Boolean);

    if (parts.length === 0) {
      return null;
    }

    return (
      <Text lines={1} {...mergedTextProps.creators} className={styles.creators}>
        {parts.join(", ")}
      </Text>
    );
  };

  const ContentRow = ({ entry, index }) => {
    const level = entry.levels.length;
    const isEven = index % 2 === 0;

    return (
      <div
        className={`${styles.entryItem} ${
          isEven ? styles.lightBackground : styles.darkBackground
        }`}
        style={{
          position: "relative",
          paddingLeft: `calc(var(--base-padding) + ${level} * var(--pt3))`,
        }}
      >
        <VerticalLines levels={entry.levels} isLast={entry.isLast} />
        <HorizontalLine levels={entry.levels} />

        <div className={styles.title}>
          <Text lines={1} {...mergedTextProps.title}>
            {entry.title}
          </Text>
          <Text lines={1} {...mergedTextProps.creators}>
            <Creators
              creators={entry.creators}
              contributors={entry.contributors}
            />
          </Text>
        </div>

        {entry.playingTime && (
          <Text
            {...mergedTextProps.playingTime}
            lines={1}
            className={styles.playingTime}
          >
            {entry.playingTime}
          </Text>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.tableOfContentsEntries} ${className}`}>
      {truncated?.length && (
        <div className={styles.entriesList}>
          {truncated.map((entry, index) => (
            <ContentRow key={index} entry={entry} index={index} />
          ))}
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
              {count && <span>({count})</span>}
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
        <Col xs={12} md={9} className={raw ? "" : styles.columnNoPaddingMobile}>
          <TableOfContentsEntries
            flattened={flattened}
            className={className}
            showMoreLimit={10}
            workId={workId}
            pid={pid}
            count={count}
            raw={raw}
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
  const { workId, type, className } = props;
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
    />
  );
}

export default TableOfContentsList;
