import { useRouter } from "next/router";

import Translate from "@/components/base/translate";
import Text from "@/components/base/text/Text";
import styles from "./Disclaimer.module.css";

export default function Disclaimer({ data, className = "" }) {
  const router = useRouter();
  const { type: typeFromUrl } = router.query;

  const selectedDisplay = typeFromUrl ? String(typeFromUrl) : null;

  const divergentMaterialType = selectedDisplay
    ? data?.materialTypes?.find(
        (mt) => mt?.materialTypeSpecific?.display !== selectedDisplay
      )
    : null;

  const actualDisplay =
    divergentMaterialType?.materialTypeSpecific?.display || null;

  const hasDivergentType = !!selectedDisplay && !!actualDisplay;

  if (!hasDivergentType) {
    return null;
  }

  return (
    <div className={`${styles.disclaimer} ${className}`}>
      <Text type="text3" className={styles.text}>
        {Translate({
          context: "sample",
          label: "disclaimer-text",
          vars: [actualDisplay],
          renderAsHtml: true,
        })}
      </Text>
    </div>
  );
}
