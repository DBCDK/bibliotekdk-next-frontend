/**
 * @file MaterialCard component
 * Takes template and input and outputs the result with expected CSS
 */
import styles from "./MaterialCard.module.css";
import Translate from "@/components/base/translate";
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
    colSizing = { xs: 10, sm: 5, lg: 4 },
    onClick = null,
  },
  ref
) {
  const renderProps = propAndChildrenTemplate?.(propAndChildrenInput);
  const {
    link_href,
    fullTitle,
    image_src,
    children,
    workId,
    elementContainerClassName,
    relatedElementClassName,
    coverImageClassName,
  } = renderProps;

  return (
    <Col
      // Col props
      {...colSizing}
      className={`${styles.col_flex} ${elementContainerClassName}`}
    >
      <Link
        href={link_href}
        // Link props
        className={`${styles.link_style}`}
        border={{ top: false, bottom: true }}
        onClick={onClick}
        dataCy={`materialCard-${fullTitle}`}
      >
        <div
          ref={ref}
          id={workId}
          className={`${styles.related_element} ${relatedElementClassName}`}
        >
          <img
            src={image_src}
            className={`${styles.cover} ${coverImageClassName}`}
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
