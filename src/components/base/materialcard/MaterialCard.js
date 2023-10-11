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
 * @typedef {(number|string|undefined)} OptionalColSize
 */

const MaterialCard = forwardRef(
  /**
   *
   * @param {function=} propAndChildrenTemplate
   * @param propAndChildrenInput
   * @param {{ xs: OptionalColSize, sm: OptionalColSize, lg: OptionalColSize}=} colSizing
   * @param {function=} onClick
   * @param {React.MutableRefObject<any>} ref
   * @return {JSX.Element}
   */
  function MaterialCard(
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
      textClassName,
      coverImageClassName,
    } = renderProps;

    return (
      <Col
        // Col props
        {...colSizing}
        className={cx(elementContainerClassName)}
        as="article"
      >
        <Link
          href={link_href}
          // Link props
          className={cx(styles.link_style)}
          border={!link_href ? false : { top: false, bottom: true }}
          onClick={onClick}
          disabled={!link_href && !onClick}
        >
          <div ref={ref} id={workId} className={cx(relatedElementClassName)}>
            <img
              src={image_src}
              className={cx(coverImageClassName)}
              title={fullTitle}
              alt={Translate({ context: "general", label: "frontpage" })}
            />
            <div className={cx(textClassName)}>{children}</div>
          </div>
        </Link>
      </Col>
    );
  }
);

export default MaterialCard;
