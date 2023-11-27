/**
 * @file MaterialCard component
 * Takes template and input and outputs the result with expected CSS
 */
import styles from "./MaterialCard.module.css";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Col from "react-bootstrap/Col";
import { templateForRelatedWorks } from "@/components/base/materialcard/templates/templates";
import { forwardRef, useState } from "react";
import cx from "classnames";

function calculateBorder(link_href, border) {
  if (!link_href) {
    return false;
  }
  return border || { top: false, bottom: true };
}

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
      ImageOverlay,
      children,
      workId,
      elementContainerClassName,
      relatedElementClassName,
      textClassName,
      imageContainerStyle,
      coverImageClassName,
      linkClassName,
      imageLeft,
      border,
    } = renderProps;

    const [loaded, setLoaded] = useState(false);

    if (imageLeft) {
      const ManifestationLink = ({ children }) => {
        return (
          <Link
            href={link_href}
            border={{ top: false, bottom: { keepVisible: false } }}
          >
            {children}
          </Link>
        );
      };
      const Tag = link_href ? ManifestationLink : "div";
      return (
        <div
          className={cx(styles.article, elementContainerClassName)}
          as="article"
          {...rootProps}
        >
          <Tag
            className={cx(styles.container, {
              [styles.base_link_style]: !!link_href,
              [styles.link_style_colors]: !!link_href,
            })}
          >
            <div ref={ref} id={workId} className={cx(relatedElementClassName)}>
              <div className={cx(styles.image, imageContainerStyle)}>
                <img
                  src={image_src}
                  className={cx(coverImageClassName)}
                  title={fullTitle}
                  alt={Translate({ context: "general", label: "frontpage" })}
                />
              </div>

              <div className={cx(textClassName, styles.textInformation)}>
                {children}
              </div>
            </div>
          </Tag>
        </div>
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
          className={cx(styles.base_link_style, {
            [styles.link_style_colors]: !linkClassName,
            [linkClassName]: linkClassName,
          })}
          border={calculateBorder(link_href, border)}
          onClick={onClick}
          disabled={!link_href && !onClick}
        >
          <div ref={ref} id={workId} className={cx(relatedElementClassName)}>
            <img
              src={image_src}
              className={cx(coverImageClassName, {
                [styles.cover_image_skeleton]: !loaded,
              })}
              onLoad={() => setLoaded(true)}
              title={fullTitle}
              alt=""
            />
            {ImageOverlay && <ImageOverlay />}

            <div className={cx(textClassName)}>{children}</div>
          </div>
        </Link>
      </Col>
    );
  }
);

export default MaterialCard;
