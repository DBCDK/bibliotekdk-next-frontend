import Icon from "@/components/base/icon";
import styles from "@/components/header/Header.module.css";
import { Col, Container, Row } from "react-bootstrap";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import LogoSvg from "@/public/icons/logo.svg";
import React from "react";

export function HelpTextHeader() {
  return (
    // logo
    <Link
      className={styles.logoWrap}
      border={false}
      href="/"
      dataCy={cyKey({
        name: "logo",
        prefix: "header",
      })}
    >
      <Icon className={styles.logo} size={{ w: 15, h: "auto" }}>
        <LogoSvg />
      </Icon>
    </Link>
    // end logo
  );
}
