import Title from "@/components/base/title";
import styles from "./AdvancedSearch.module.css";
import Translate from "@/components/base/translate/Translate";
import TextInputs from "../fieldInput/TextInputs";
import { CqlTextArea } from "@/components/search/advancedSearch/cqlTextArea/CqlTextArea";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "@/components/base/link";
import Text from "@/components/base/text";

/**
 * Contains advanced search fields
 * @returns {React.JSX.Element}
 */

export default function AdvancedSearch() {
  const router = useRouter();
  const { cql } = router.query;
  const workType = "all";
  const [showCqlEditor, setShowCqlEditor] = useState(false);

  useEffect(() => {
    //show CQL editor if there is a cql param in the url
    setShowCqlEditor(!!cql);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <Title type="title3" className={styles.title}>
          {Translate({ context: "search", label: "advancedSearch" })}
        </Title>
        <div>
          <Link
            onClick={() => {
              setShowCqlEditor(!showCqlEditor);
            }}
            border={{
              top: false,
              bottom: {
                keepVisible: true,
              },
            }}
          >
            <Text type="text3" tag="span">
              {Translate({
                context: "search",
                label: showCqlEditor ? "showInputFields" : "editInCqlEditor",
              })}
            </Text>
          </Link>
        </div>
      </div>

      {showCqlEditor ? <CqlTextArea /> : <TextInputs workType={workType} />}
    </div>
  );
}
