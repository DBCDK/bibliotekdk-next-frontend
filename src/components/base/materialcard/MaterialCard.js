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

/**
 *
 * @param {function} propAndChildrenTemplate
 * @param propAndChildrenInput
 * @return {JSX.Element}
 */
export default function MaterialCard({
  propAndChildrenTemplate = templateForRelatedWorks,
  propAndChildrenInput,
}) {
  const renderProps = propAndChildrenTemplate?.(propAndChildrenInput);
  const { link_href, fullTitle, image_src, children } = renderProps;

  const animationStyle = [
    animations.underlineContainer,
    animations.top_line_false,
    animations.top_line_keep_false,
    animations.bottom_line_keep_false,
  ].join(" ");

  return (
    <Col
      as={Link}
      // Col props
      xs={11}
      sm={5}
      lg={4}
      // Link props
      href={link_href}
      className={`${styles.link_style} ${animationStyle}`}
      border={{ top: false, bottom: false }}
      data_display={"inline"}
    >
      <div className={`${styles.related_element}`}>
        <img
          src={image_src}
          className={`${styles.cover}`}
          title={fullTitle}
          alt={Translate({ context: "general", label: "frontpage" })}
        />
        <div className={styles.text}>{children}</div>
      </div>
    </Col>
  );
}
