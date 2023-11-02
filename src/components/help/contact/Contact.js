import ArticleSection from "@/components/article/section";

import styles from "./Contact.module.css";

/**
 * The Sections page React component
 *
 * @param {Object} props
 * See propTypes for specific props and types
 *
 * @returns {React.JSX.Element}
 */
export default function Contact() {
  return (
    <div className={styles.contact}>
      <ArticleSection
        title={false}
        matchTag="section 5"
        template="single"
        color="var(--jagged-ice)"
      />
    </div>
  );
}
