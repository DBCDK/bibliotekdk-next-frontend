import styles from "./Logo.module.css";
import { cyKey } from "@/utils/trim";
import Icon from "@/components/base/icon/Icon";
import LogoSvg from "@/public/icons/testsvg.svg";
import Link from "@/components/base/link";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import React from "react";
import { Title } from "@/components/base/title/Title";

function newlineInText(text) {
  return text.split("\n").map((str) => <span>{str}</span>);
}
export function Logo() {
  return (
    <div className={styles.wrapper}>
      <Link
        className={styles.logoWrap}
        border={false}
        href="/"
        dataCy={cyKey({
          name: "logo",
        })}
      >
        <Icon className={styles.logo} size={{ w: 5, h: 5 }}>
          <LogoSvg />
        </Icon>
        <Text type="Text4" className={styles.logotxt} tag="span">
          {newlineInText("Bibliotek\ndk")}
        </Text>
      </Link>
    </div>
  );
}
