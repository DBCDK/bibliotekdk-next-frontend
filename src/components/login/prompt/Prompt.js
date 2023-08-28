import PropTypes from "prop-types";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Translate from "@/components/base/translate";

import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Button from "@/components/base/button";
import Divider from "@/components/base/divider";
import Link from "@/components/base/link";

import styles from "./Prompt.module.css";
import { useState } from "react";
import IconButton from "@/components/base/iconButton";
import useUser from "@/components/hooks/useUser";

/**
 * Show a login prompt with a title and description
 *
 *
 * See propTypes for specific props and types
 *
 * @param {string} title
 * @param {string} description
 * @param {string} buttonText
 * @param {func} signIn
 * @returns {component}
 */
export default function LoginPrompt({
  title,
  description,
  description2,
  buttonText = Translate({ context: "header", label: "login" }),
  linkHref = null,
  signIn,
}) {
  const [showMore, setShowMore] = useState(false);
  const user = useUser();

  return (
    <Container className={styles.prompt} fluid>
      <Row>
        <Col xs={12} md={{ span: 10, offset: 1 }} lg={{ span: 6, offset: 3 }}>
          <Divider />
          <Title type="title4" tag="h3">
            {title}
          </Title>

          {linkHref && showMore && (
            <div>
              <Text type="text3">{description}</Text>
              <Text className={styles.inline} type="text3">
                {description2}{" "}
              </Text>

              <Link
                className={styles.inline}
                href={linkHref.href}
                target="_blank"
                border={{ top: false, bottom: true }}
                data_use_new_underline={false}
              >
                <Text className={styles.inline} type="text3">
                  {linkHref.text}
                </Text>
              </Link>
            </div>
          )}
          {user.isAuthenticated && (
            <div>
              <IconButton
                icon={showMore ? "arrowUp" : "arrowDown"}
                onClick={() => setShowMore(!showMore)}
                keepUnderline={true}
              >
                {Translate({
                  context: "articles",
                  label: "how-to-get-access",
                })}
              </IconButton>
            </div>
          )}
          <Button
            type="primary"
            size="large"
            onClick={signIn}
            dataCy="article-prompt-button-log-ind"
          >
            {buttonText}
          </Button>

          <Divider />
        </Col>
      </Row>
    </Container>
  );
}
LoginPrompt.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  signIn: PropTypes.func.isRequired,
};
