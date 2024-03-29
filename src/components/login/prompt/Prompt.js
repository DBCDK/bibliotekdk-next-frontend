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
import InfoDropdown from "@/components/base/infoDropdown/InfoDropdown";
import useAuthentication from "@/components/hooks/user/useAuthentication";

/**
 * Show a login prompt with a title and description
 *
 *
 * See propTypes for specific props and types
 *
 * @param {string} title
 * @param {string} description
 * @param {string} buttonText
 * @param {function} signIn
 * @param {boolean} isAuthenticated
 * @returns {React.JSX.Element}
 */
export default function LoginPrompt({
  title,
  description,
  description2,
  buttonText = Translate({ context: "header", label: "login" }),
  linkHref = null,
  signIn,
}) {
  const { isAuthenticated } = useAuthentication();

  return (
    <Container className={styles.prompt} fluid>
      <Row>
        <Col xs={12} md={{ span: 10, offset: 1 }} lg={{ span: 6, offset: 3 }}>
          <Divider />
          <Title type="title4" tag="h3">
            {title}
          </Title>
          {!isAuthenticated && (
            <>
              <Text type="text3" className={styles.description}>
                {description}
              </Text>
              <Button
                type="primary"
                size="large"
                onClick={signIn}
                dataCy="article-prompt-button-log-ind"
                className={styles.signInButton}
              >
                {buttonText}
              </Button>
            </>
          )}
          {isAuthenticated && linkHref && (
            <InfoDropdown
              label="show-more"
              buttonText={Translate({
                context: "articles",
                label: "how-to-get-access",
              })}
            >
              <>
                <Text type="text3" className={styles.description}>
                  {description}
                </Text>
                <Text className={styles.inline} type="text3">
                  {description2}{" "}
                </Text>

                <Link
                  className={`${styles.inline} ${styles.link}`}
                  href={linkHref.href}
                  target="_blank"
                  border={{ top: false, bottom: { keepVisible: true } }}
                  data_use_new_underline={false}
                >
                  <Text className={styles.inline} type="text3">
                    {linkHref.text}
                  </Text>
                </Link>
              </>
            </InfoDropdown>
          )}

          <Divider className={styles.devider} />
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
