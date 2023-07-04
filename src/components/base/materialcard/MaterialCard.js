/**
 * @file MaterialCard component
 * Takes template and input and outputs the result with expected CSS
 */
import styles from "./MaterialCard.module.css";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Col from "react-bootstrap/Col";
import { templateForRelatedWorks } from "@/components/base/materialcard/templates/templates";
import { forwardRef } from "react";
import cx from "classnames";

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
      className={cx(elementContainerClassName)}
    >
      <Link
        href={link_href}
        // Link props
        className={cx(styles.link_style)}
        border={{ top: false, bottom: true }}
        onClick={onClick}
      >
        <div ref={ref} id={workId} className={cx(relatedElementClassName)}>
          <img
            src={image_src}
            className={cx(coverImageClassName)}
            title={fullTitle}
            alt={Translate({ context: "general", label: "frontpage" })}
          />
          <div className={cx(styles.text)}>{children}</div>
        </div>
      </Link>
    </Col>
  );
});

export default MaterialCard;
