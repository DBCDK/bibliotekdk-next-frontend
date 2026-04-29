import React from "react";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import styles from "./Markdown.module.css";

/**
 * Normalize newlines to ensure consistent spacing between paragraphs
 */
const normalizeNewlines = (str) => str.replace(/\n/g, "  \n");

function MarkdownImage({ src, alt = "", title, ...props }) {
  const imageProps = { ...props };
  delete imageProps.node;

  return (
    <figure>
      <img src={src} alt={alt} title={title || ""} {...imageProps} />
      {title && <figcaption>{title}</figcaption>}
    </figure>
  );
}

function MarkdownParagraph({ children, ...props }) {
  const contentChildren = React.Children.toArray(children).filter(
    (child) => !(typeof child === "string" && child.trim() === "")
  );
  const containsOnlyImage =
    contentChildren.length === 1 &&
    React.isValidElement(contentChildren[0]) &&
    contentChildren[0].type === MarkdownImage;

  if (containsOnlyImage) {
    return children;
  }

  return (
    <Text type="text2" tag="p" {...props}>
      {children}
    </Text>
  );
}

export const markdownComponents = {
  h1: (props) => <Title type="title3" tag="h1" {...props} />,
  h2: (props) => <Title type="title4" tag="h2" {...props} />,
  h3: (props) => <Title type="title5" tag="h3" {...props} />,
  p: MarkdownParagraph,
  li: (props) => <Text type="text2" tag="li" {...props} />,
  strong: (props) => <Text type="text1" tag="strong" {...props} />,
  img: MarkdownImage,
  a: (props) => (
    <Link border={{ bottom: { keepVisible: true } }} href={props.href}>
      {props.children}
    </Link>
  ),
};

/**
 * Renders markdown using a shared set of components so that headings,
 * paragraphs, lists, links, etc. match the design system across the app.
 *
 * @param {Object} props
 * @param {string} props.children The markdown string to render
 * @param {Object} [props.components] Optional overrides merged on top of the defaults
 * @param {boolean} [props.skeleton] When true, renders a skeleton placeholder instead of the markdown
 * @param {number} [props.lines] Number of skeleton lines to render
 * @returns {React.ReactElement|null}
 */
export default function Markdown({
  children,
  body,
  components,
  className = "",
  dataCy,
  skeleton = false,
  lines = 10,
  ...rest
}) {
  const content = body ?? children;

  if (skeleton) {
    return <Text type="text2" skeleton={true} lines={lines} />;
  }

  if (!content) {
    return null;
  }

  return (
    <div className={`${styles.markdown} ${className}`} data-cy={dataCy}>
      <ReactMarkdown
        components={{ ...markdownComponents, ...(components || {}) }}
        {...rest}
      >
        {normalizeNewlines(content)}
      </ReactMarkdown>
    </div>
  );
}

Markdown.propTypes = {
  children: PropTypes.string,
  body: PropTypes.string,
  components: PropTypes.object,
  className: PropTypes.string,
  dataCy: PropTypes.string,
  skeleton: PropTypes.bool,
  lines: PropTypes.number,
};
