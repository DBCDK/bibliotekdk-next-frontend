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
   * @param {Object} props - The props object for MaterialCard.
   * @param {function} props.propAndChildrenTemplate - A function to define prop and children rendering.
   * @param {Object} props.propAndChildrenInput - Input for propAndChildrenTemplate function.
   * @param {function} props.onClick - A callback function to handle click events.
   * @param {React.MutableRefObject<any>} props.ref - A React ref object.
   * @param {{ xs: OptionalColSize, sm: OptionalColSize, lg: OptionalColSize }} props.colSizing - An object specifying column sizing options.
   * @param {boolean} [props.imageLeft] indicates that image should be on the left side of the card
   * @returns {React.JSX.Element} - Returns a React JSX element.
   */
  function MaterialCard(
    {
      propAndChildrenTemplate = templateForRelatedWorks,
      propAndChildrenInput,
      colSizing = { xs: 10, sm: 5, lg: 4 },
      onClick = null,
      rootProps,
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
      imageLeft,
    } = renderProps;

    if (imageLeft) {
      return (
        <Col
          // Col props
          {...colSizing}
          className={cx(elementContainerClassName, styles.container)}
          as="article"
          {...rootProps}
        >
          <Col ref={ref} id={workId} className={cx(relatedElementClassName)}>
            <Col xs={3} className={styles.image}>
              <img
                src={image_src}
                className={cx(coverImageClassName)}
                title={fullTitle}
                alt={Translate({ context: "general", label: "frontpage" })}
              />
            </Col>

            <Col xs={9} className={cx(textClassName, styles.textInformation)}>
              {children}
            </Col>
          </Col>
        </Col>
      );
    }

    return (
      <Col
        // Col props
        {...colSizing}
        className={cx(elementContainerClassName)}
        as="article"
        {...rootProps}
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
