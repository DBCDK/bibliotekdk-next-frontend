/**
 * @file
 * A simple promotional banner with image, title, button and URL.
 * Used as a frontpage section to link to external or internal pages
 * without the overhead of a full article.
 */

import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";

import Image from "@/components/base/image";
import Title from "@/components/base/title";
import Button from "@/components/base/button";
import Section from "@/components/base/section";
import Link, { LinkOnlyInternalAnimations } from "@/components/base/link";

import styles from "./LinkCard.module.css";

/**
 * Determines whether a URL is external (starts with http/https).
 */
function isExternalUrl(url) {
  return /^https?:\/\//.test(url);
}

export default function LinkCard({ title, buttonText, url, image }) {
  const target = isExternalUrl(url) ? "_blank" : "_self";

  return (
    <Section title={false} divider={{ content: false }}>
      <Col
        as={LinkOnlyInternalAnimations}
        href={url}
        target={target}
        xs={12}
        lg={{ span: 10, offset: 1 }}
        className={styles.content}
      >
        <div className={styles.text}>
          <Title tag="h3" type="title3">
            <Link className={styles.title}>{title}</Link>
          </Title>
          <Link a={false} target={target}>
            <Button type="secondary" size="medium" className={styles.button}>
              {buttonText}
            </Button>
          </Link>
        </div>

        {image?.url && (
          <div className={styles.imageWrapper}>
            <Image
              src={image.url}
              alt={image.alternativeText || ""}
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
      </Col>
    </Section>
  );
}

LinkCard.propTypes = {
  title: PropTypes.string.isRequired,
  buttonText: PropTypes.string,
  url: PropTypes.string.isRequired,
  image: PropTypes.shape({
    url: PropTypes.string,
    alternativeText: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
};
