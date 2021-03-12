import { Container, Row, Col } from "react-bootstrap";

import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Icon from "@/components/base/icon";
import Text from "@/components/base/text";
import Language from "@/components/base/language";

import LogoSvg from "@/public/icons/logo_help.svg";

import { cyKey } from "@/utils/trim";

import styles from "./Header.module.css";

/**
 * The custom Header for help page
 *
 * @returns {component}
 */
export default function Header() {
  return (
    <Container as="header" className={styles.header} fluid>
      <Row>
        <Col xs={2}>
          <Link
            className={styles.logoWrap}
            border={false}
            href="/"
            dataCy={cyKey({
              name: "logo",
              prefix: "header-help",
            })}
          >
            <Icon className={styles.logo} size={{ w: "auto", h: 6 }}>
              <LogoSvg />
            </Icon>
          </Link>
        </Col>
        <Col className={styles.right}>
          <span>
            <Link href="/hjaelp" className={styles.ask}>
              <Text type="text2">
                {Translate({ context: "help", label: "header-button-ask" })}
              </Text>
              <Icon size={2} src="bubble.svg" />
            </Link>
            <Language>
              <Link>
                <Text type="text2">
                  {Translate({ context: "language", label: "eng-dan" })}
                </Text>
              </Link>
            </Language>
          </span>
        </Col>
      </Row>
    </Container>
  );
}
