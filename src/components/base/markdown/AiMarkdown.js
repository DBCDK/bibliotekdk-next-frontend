import React, { useEffect, useMemo, useRef, useState } from "react";
import Markdown from "react-markdown";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import styles from "./AiMarkdown.module.css";
import Expand from "@/components/base/animation/expand/Expand";
import { useGlobalState } from "@/components/hooks/useGlobalState";

export default function AiMarkdown({
  creatorId,
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
  const [inlineMaxHeight, setInlineMaxHeight] = useState(
    expanded ? "none" : `${previewHeight}px`
  );

  //Override disclaimer until we get the text right
  disclaimer =
    "Tektsen er automatisk genereret ud fra bibliotekernes materialevurderinger. Indholdet kan indeholde fejl.";
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
            return <Text type="text4" tag="strong" {...props} />;
          },
          p(props) {
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
                  type="text3"
                  tag="p"
                  {...props}
                />
              );
            };
            return <Fadable />;
          },

          a(props) {
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
  }, [text]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    if (expanded) {
      // Expand: from current height to scrollHeight
      const start = el.getBoundingClientRect().height;
      setInlineMaxHeight(`${start}px`);
      requestAnimationFrame(() => {
        setInlineMaxHeight(`${el.scrollHeight}px`);
      });
    } else {
      // Collapse: from scrollHeight to previewHeight
      const start = el.scrollHeight;
      setInlineMaxHeight(`${start}px`);
      requestAnimationFrame(() => {
        setInlineMaxHeight(`${previewHeight}px`);
      });
    }
  }, [expanded]);
  return (
    <div className={`${styles.root} ${styles.container} ${className || ""}`}>
      <div
        ref={contentRef}
        className={`${styles.content} ${!expanded ? styles.collapsed : ""}`}
        style={{ maxHeight: inlineMaxHeight }}
        onTransitionEnd={(e) => {
          if (e.target !== contentRef.current) return;
          if (expanded) {
            setInlineMaxHeight("none");
          }
        }}
      >
        {markdown}
        {!expanded && (
          <button className={styles.toggle} onClick={() => setExpanded(true)}>
            <Expand open={false} size={3} src="smallplus.svg" />
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
