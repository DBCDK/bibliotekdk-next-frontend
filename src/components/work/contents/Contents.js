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

  // Select target manifestation (pure responsibility)
  const targetManifestation = useMemo(() => {
    if (manifestations.length === 0) {
      return null;
    }

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
      manifestations.find((m) => m.pid === pid) ??
      manifestations.find(matchesType) ??
      manifestations[0]
    );
  }, [manifestations, pid, type]);

  // Extract raw contents and check if there are entries
  const { rawContents, hasEntries } = useMemo(() => {
    const rawContents = targetManifestation?.contents ?? [];
    const hasEntries = rawContents.some((c) => c.entries?.length);
    return { rawContents, hasEntries };
  }, [targetManifestation]);

  // Optional wrapping with custom root
  const contents = useMemo(() => {
    if (!hasEntries) {
      return [];
    }
    if (customRootHeader) {
      return [
        {
          heading: customRootHeader,
          entries: rawContents.flatMap((c) => c.entries),
        },
      ];
    }
    return rawContents;
  }, [customRootHeader, hasEntries, rawContents]);

  // Flatten structure for easy rendering
  const { flattened, count } = useMemo(() => {
    if (contents.length === 0) {
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
 * Renders creators and contributors as a comma-separated inline string.
 * Skips empty or missing values.
 */
function Creators({ creators, contributors }) {
  const parts = [
    creators?.persons?.map((p) => p.display).join(", "),
    creators?.corporations?.map((c) => c.display).join(", "),
    Array.isArray(contributors) ? contributors.join(", ") : contributors,
  ].filter(Boolean);

  if (parts.length === 0) return null;

  return <span className={styles.creators}>{parts.join(", ")}</span>;
}

/**
 * Renders a list of table of contents entries with hierarchical structure
 * Shows creators, contributors, and playing time information for each entry
 */
export function TableOfContentsEntries({
  flattened,
  count,
  className,
  showMoreLimit,
  workId,
  pid,
}) {
  const modal = useModal();

  const truncated = useMemo(() => {
    return showMoreLimit ? flattened?.slice(0, showMoreLimit) : flattened;
  }, [flattened, showMoreLimit]);

  if (!truncated || truncated.length === 0) {
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
          <Text type="text4" lines={1}>
            {entry.title}
          </Text>
          <Text type="text3" lines={1}>
            <Creators
              creators={entry.creators}
              contributors={entry.contributors}
            />
          </Text>
        </div>

        {entry.playingTime && (
          <Text type="text3" lines={1} className={styles.playingTime}>
            {entry.playingTime}
          </Text>
        )}
      </div>
    );
  };

  return (
    <div className={`${styles.tableOfContentsEntries} ${className}`}>
      <div className={styles.entriesList}>
        {truncated.map((entry, index) => (
          <ContentRow key={index} entry={entry} index={index} />
        ))}
      </div>

      {showMoreLimit && flattened.length > showMoreLimit && (
        <div className={styles.showMoreLink}>
          <LinkArrow
            iconPlacement="right"
            iconOrientation={180}
            border={{ bottom: { keepVisible: true }, top: false }}
            onClick={handleShowMore}
          >
            <Text type="text3" lines={1} tag="span">
              {Translate({
                context: "manifestation_content",
                label: "see_all",
              })}{" "}
              ({count})
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
      divider={{ content: false }}
    >
      <Row>
        <Col xs={12} md={9} className={styles.columnNoPaddingMobile}>
          <TableOfContentsEntries
            flattened={flattened}
            className={className}
            showMoreLimit={10}
            workId={workId}
            pid={pid}
            count={count}
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
  const { flattened, count, pid, isLoading, error } = useTablesOfContents({
    workId,
    type,
  });
  if (error || !flattened) {
    return null;
  }

  if (isLoading) {
    return <TablesOfContentsSkeleton />;
  }

  return (
    <TableOfContentsSection
      flattened={flattened}
      type={type}
      className={className}
      workId={workId}
      pid={pid}
      count={count}
    />
  );
}

export default TableOfContentsList;
