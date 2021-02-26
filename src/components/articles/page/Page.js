import Section from "@/components/base/section";
import Articles from "@/components/articles";

import Translate from "@/components/base/translate";

import styles from "./Page.module.css";

/**
 * The Articles page React component
 *
 * @returns {component}
 */
export default function Page() {
  return (
    <main>
      <Section
        className={styles.articles}
        title={Translate({ context: "articles", label: "section-title" })}
        contentDivider={false}
      >
        <Articles />
      </Section>
    </main>
  );
}
