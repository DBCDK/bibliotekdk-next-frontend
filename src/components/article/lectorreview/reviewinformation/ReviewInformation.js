/**
 * @file ReviewInformation handles the information section for LectorReviewPage
 */

import Section from "@/components/base/section";
import Col from "react-bootstrap/Col";
import styles from "./ReviewInformation.module.css";
import Text from "@/components/base/text";
import { dateToShortDate, numericToISO } from "@/utils/datetimeConverter";
import Translate from "@/components/base/translate";
import Link from "@/components/base/link";
import * as PropTypes from "prop-types";

/**
 * ReviewInformation renders the date, reviewCreators, and Print option
 * of the {@link LectorReviewPage}
 * @param creationDate
 * @param reviewCreators
 * @param onClick
 * @returns {React.JSX.Element}
 */
export function ReviewInformation({
  creationDate,
  reviewCreators,
  onClick = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.print();
    }
  },
}) {
  return (
    <Section
      // Section
      space={false}
      title={null}
      divider={false}
    >
      <Col
        xs={12}
        md={{ span: 10, offset: 1 }}
        lg={{ span: 6, offset: 3 }}
        className={`${styles.info}`}
      >
        <Text className={styles.info__date}>
          {creationDate && dateToShortDate(numericToISO(creationDate))}
        </Text>
        <Text className={styles.info__lector}>
          {Translate({ context: "general", label: "lecturerStatement" })}
          {" " + Translate({ context: "general", label: "by" })}
          {" " + reviewCreators}
        </Text>
        <Link
          className={styles.info__print}
          dataCy="article-print"
          tag="span"
          border={{ bottom: { keepVisible: true } }}
          onClick={onClick}
        >
          <Text type="text3">
            {Translate({ context: "articles", label: "printButton" })}
          </Text>
        </Link>
      </Col>
    </Section>
  );
}

ReviewInformation.propTypes = {
  creationDate: PropTypes.string,
  reviewCreators: PropTypes.string,
  onClick: PropTypes.func,
};
