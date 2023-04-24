/**
 * @file MaterialCard component
 * Takes template and input and outputs the result with expected CSS
 */
import styles from "./MaterialCard.module.css";
import Translate from "@/components/base/translate";
import animations from "@/components/base/animation/animations.module.css";
import Link from "@/components/base/link";
import Col from "react-bootstrap/Col";
import { templateForRelatedWorks } from "@/components/base/materialcard/templatesForMaterialCard";
import { forwardRef } from "react";

/**
 *
 * @param {function} propAndChildrenTemplate
 * @param propAndChildrenInput
 * @param {Object<string, any>}} colSizing
 * @return {JSX.Element}
 */
const MaterialCard = forwardRef(function MaterialCard(
  {
    propAndChildrenTemplate = templateForRelatedWorks,
    propAndChildrenInput,
    colSizing = { xs: 11, sm: 5, lg: 4 },
    onClick = null,
  },
  ref
) {
  const renderProps = propAndChildrenTemplate?.(propAndChildrenInput);
  const { link_href, fullTitle, image_src, children, workId } = renderProps;

  const animationStyle = [
    animations.underlineContainer,
    animations.top_line_false,
    animations.top_line_keep_false,
    animations.bottom_line_keep_false,
  ].join(" ");

  return (
    <Col
      // Col props
      {...colSizing}
      className={`${styles.col_flex}`}
    >
      <Link
        href={link_href}
        // Link props
        className={`${animationStyle} ${styles.link_style}`}
        border={{ top: false, bottom: false }}
        data_display={"inline"}
        onClick={onClick}
      >
        <div
          ref={ref}
          id={workId}
          className={`${styles.related_element} ${renderProps.relatedElementClassName}`}
        >
          <img
            src={image_src}
            className={`${styles.cover} ${renderProps.coverImageClassName}`}
            title={fullTitle}
            alt={Translate({ context: "general", label: "frontpage" })}
          />
          <div className={styles.text}>{children}</div>
        </div>
      </Link>
    </Col>
  );
});

export default MaterialCard;
