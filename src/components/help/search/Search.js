import PropTypes from "prop-types";

import Section from "@/components/base/section";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import Text from "@/components/base/text";

import styles from "./Search.module.css";

/**
 * Back to bibliotek.dk button
 *
 * @returns {component}
 */
function BackButton() {
  return (
    <div className={styles.back}>
      <Link href="/" border={{ bottom: { keepVisible: true } }}>
        <Text>{Translate({ context: "help", label: "back-to-bib" })}</Text>
      </Link>
    </div>
  );
}

/**
 * The FAQ React component
 *
 * @param {obj} props
 * @param {obj} props.className
 * @param {obj} props.data
 * See propTypes for specific props and types
 *
 * @returns {component}
 */
export default function Search(props) {
  return (
    <Section
      className={styles.search}
      title={<BackButton />}
      titleDivider={false}
      contentDivider={false}
    >
      <input placeholder="Søg i hjælp" />
    </Section>
  );
}

Search.propTypes = {
  className: PropTypes.string,
};
