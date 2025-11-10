import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import { getHelpUrl } from "@/lib/utils";

import styles from "./HelpBtn.module.css";
import useBreakpoint from "@/components/hooks/useBreakpoint";

export default function HelpBtn({ className = "" }) {
  const breakpoint = useBreakpoint();
  const isMobileSize = ["xs", "sm", "md"].includes(breakpoint);

  return (
    <Link
      href={getHelpUrl("soegning-baade-enkel-og-avanceret", "179")}
      className={`${styles.help} ${className}`}
      border={{ bottom: { keepVisible: true } }}
      target="_blank"
    >
      <Text type="text3" tag="span">
        {Translate({
          context: "search",
          label: isMobileSize ? "mobile_helpAndGuidance" : "helpAndGuidance",
        })}
      </Text>
    </Link>
  );
}
