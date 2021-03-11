import Icon from "@/components/base/icon";
import Link from "@/components/base/link";
import { cyKey } from "@/utils/trim";
import LogoSvg from "@/public/icons/logo.svg";
import styles from "../HelpTexts.module.css";

export function HelpTextHeader() {
  return (
    <div className={styles.helpheader}>
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
    </div>
  );
}
