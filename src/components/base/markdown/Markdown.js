import React from "react";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import Image from "@/components/base/image";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import styles from "./Markdown.module.css";
import remarkGfm from "remark-gfm";

const normalizeMarkdown = (str) => {
  return str.trim().replace(/(^|\n)(\d+)\./g, "$1$2\\.");
};

function MarkdownImage({ src, alt = "", title, ...props }) {
  const imageProps = { ...props };
  delete imageProps.node;

  return (
    <figure>
      <Image
        {...imageProps}
        src={src}
        alt={alt}
        title={title || ""}
        width={1400}
        height={788}
        className={styles.markdownImage}
      />
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

function MarkdownLink({ href, children }) {
  const isExternal = href.startsWith("http://") || href.startsWith("https://");

  return (
    <Link
      border={{ bottom: { keepVisible: true } }}
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  );
}

export const markdownComponents = {
  h1: (props) => <Title type="title6" tag="h1" {...props} />,
  h2: (props) => <Title type="title6" tag="h2" {...props} />,
  h3: (props) => <Title type="title6" tag="h3" {...props} />,
  h4: (props) => <Title type="title6" tag="h4" {...props} />,
  h5: (props) => <Title type="title6" tag="h5" {...props} />,
  h6: (props) => <Title type="title6" tag="h6" {...props} />,
  p: MarkdownParagraph,
  li: (props) => <Text type="text2" tag="li" {...props} />,
  strong: (props) => <Text type="text2" tag="strong" {...props} />,
  em: (props) => <Text type="text2" tag="em" {...props} />,
  img: MarkdownImage,
  a: MarkdownLink,
  table: (props) => <table className={styles.table} {...props} />,
  th: (props) => <th className={styles.th} {...props} />,
  td: (props) => <td className={styles.td} {...props} />,
};

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
        remarkPlugins={[remarkGfm]}
        components={{ ...markdownComponents, ...(components || {}) }}
        {...rest}
      >
        {normalizeMarkdown(content)}
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
