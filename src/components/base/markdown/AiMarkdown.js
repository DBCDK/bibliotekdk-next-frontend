import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Markdown from "react-markdown";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import styles from "./AiMarkdown.module.css";
import Expand from "@/components/base/animation/expand/Expand";
import { useGlobalState } from "@/components/hooks/useGlobalState";

/**
 * Renders AI-generated markdown with progressive paragraph fade-in
 * and expandable/collapsible content.
 */
export default function AiMarkdown({
  creatorId,
  fadeIn = true,
  text = "",
  disclaimer,
  urlTransform,
  className = "",
  previewHeight = 174,
}) {
  let i = 0;
  const [expanded, setExpanded] = useGlobalState({
    key: `long_summary_${creatorId}`,
    initial: false,
  });

  const contentRef = useRef(null);
  const [canToggle, setCanToggle] = useState(false);
  const [inlineMaxHeight, setInlineMaxHeight] = useState(
    expanded ? "none" : `${previewHeight}px`
  );
  const hasCheckedHeight = useRef(false);
  const lastTextRef = useRef(text);
  const justAutoExpanded = useRef(false);
  const disableLinks = canToggle && !expanded;

  // Reset check when text changes
  useEffect(() => {
    if (lastTextRef.current !== text) {
      hasCheckedHeight.current = false;
      justAutoExpanded.current = false;
      lastTextRef.current = text;
    }
  }, [text]);

  // Check if content is shorter than previewHeight before first paint to avoid flickering
  useLayoutEffect(() => {
    if (hasCheckedHeight.current) return;

    const el = contentRef.current;
    if (!el) return;

    // Temporarily remove maxHeight to measure full height
    const originalMaxHeight = el.style.maxHeight;
    el.style.maxHeight = "none";
    const scrollHeight = el.scrollHeight;
    el.style.maxHeight = originalMaxHeight;

    if (scrollHeight <= previewHeight) {
      setCanToggle(false);
      setExpanded(true);
      setInlineMaxHeight("none");
      justAutoExpanded.current = true;
    } else {
      setCanToggle(true);
    }
    hasCheckedHeight.current = true;
  }, [text, previewHeight, expanded]);

  useEffect(() => {
    if (!expanded) {
      setInlineMaxHeight(`${previewHeight}px`);
    }
  }, [previewHeight, expanded]);

  const markdown = useMemo(() => {
    return (
      <Markdown
        urlTransform={urlTransform}
        components={{
          strong(props) {
            return <Text type="text1" tag="strong" {...props} />;
          },
          p(props) {
            if (!fadeIn) {
              return <Text type="text2" tag="p" {...props} />;
            }
            const Fadable = () => {
              const [show, setShow] = useState(false);
              useEffect(() => {
                setTimeout(() => {
                  setShow(true);
                }, i++ * 50);
              }, []);
              return (
                <Text
                  className={show ? styles.show : styles.hidden}
                  type="text2"
                  tag="p"
                  {...props}
                />
              );
            };
            return <Fadable />;
          },

          a(props) {
            if (disableLinks) {
              return <Text type="text2" tag="strong" {...props} />;
            }
            return (
              <Link
                border={{ bottom: { keepVisible: true } }}
                href={props.href}
              >
                {props.children}
              </Link>
            );
          },
        }}
      >
        {text}
      </Markdown>
    );
  }, [text, fadeIn, disableLinks]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    // Skip animation only if we just auto-expanded due to short content
    if (justAutoExpanded.current && expanded) {
      justAutoExpanded.current = false;
      return;
    }

    if (expanded) {
      // Expand: from current height to scrollHeight
      const start = el.getBoundingClientRect().height;
      setInlineMaxHeight(`${start}px`);
      requestAnimationFrame(() => {
        setInlineMaxHeight(`${el.scrollHeight}px`);
      });
    } else {
      // Collapse: from scrollHeight to previewHeight
      // Ensure we have a concrete height before animating
      const currentHeight = el.getBoundingClientRect().height;
      const start = currentHeight > 0 ? currentHeight : el.scrollHeight;
      setInlineMaxHeight(`${start}px`);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setInlineMaxHeight(`${previewHeight}px`);
        });
      });
    }
  }, [expanded, previewHeight]);
  return (
    <div className={`${styles.root} ${styles.container} ${className || ""}`}>
      <div
        ref={contentRef}
        className={`${styles.content} ${!expanded ? styles.collapsed : ""} ${
          !fadeIn ? styles.noFade : ""
        }`}
        style={{ maxHeight: inlineMaxHeight }}
        onTransitionEnd={(e) => {
          if (e.target !== contentRef.current) return;
          if (expanded) {
            setInlineMaxHeight("none");
          }
        }}
      >
        {markdown}
        {canToggle && (
          <button
            className={styles.toggle}
            onClick={() => setExpanded(!expanded)}
          >
            <Expand open={expanded} size={3} src="smallplus.svg" />
          </button>
        )}
      </div>

      {disclaimer && (
        <Text type="text5" tag="p" className={styles.disclaimer}>
          {disclaimer}
        </Text>
      )}
    </div>
  );
}
