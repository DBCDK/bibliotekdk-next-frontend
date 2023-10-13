/**
 * @file ReviewContent handles the content for LectorReviewPage
 */

import Section from "@/components/base/section";
import styles from "./ReviewContent.module.css";
import Col from "react-bootstrap/Col";
import Title from "@/components/base/title";
import Text from "@/components/base/text";
import Translate from "@/components/base/translate";
import { getWorkUrl } from "@/lib/utils";
import BodyParser from "@/components/base/bodyparser";
import * as PropTypes from "prop-types";

/**
 * substituteContentSubstitute handles the subtitution of
 * pids in review parts into their respective titles and turns them into links
 * using the {@link BodyParser}.
 * In the cases where references are written '\reference\' we write replace \ with "
 * to indicate a named reference.
 * @param single
 * @returns {React.JSX.Element}
 */
function substituteContentSubstitute(single) {
  const replacers = single.manifestations?.map((manifestation) => {
    return {
      pid: manifestation?.pid,
      firstCreator: manifestation?.creators?.[0]?.display,
      fullTitle: manifestation?.titles?.full?.join(": "),
      workId: manifestation?.ownerWork?.workId,
      link: getWorkUrl(
        manifestation?.titles?.full?.join(": "),
        manifestation?.creators,
        manifestation?.ownerWork?.workId
      ),
    };
  });

  let placeholder = single.contentSubstitute;

  replacers.forEach((replacer) => {
    placeholder = placeholder.replace(
      `[${replacer.pid}]`,
      `<a href=${replacer.link}>${replacer.fullTitle}</a>`
    );
  });

  return <BodyParser body={placeholder.replaceAll("\\", '"')} Tag={"p"} />;
}

/**
 * ReviewContent handles the actual content within the {@link reviewByLibrarians}.
 * This includes ABSTRACT, DESCRIPTION, SIMILAR_MATERIALS, etc.
 * @param lectorReviews
 * @returns {React.JSX.Element}
 */
export function ReviewContent({ lectorReviews }) {
  return (
    <Section
      space={false}
      title={null}
      divider={false}
      className={styles.padding_bottom_pt8}
    >
      <Col
        xs={12}
        md={{ span: 10, offset: 1 }}
        lg={{ span: 6, offset: 3 }}
        className={`${styles.content}`}
      >
        {lectorReviews?.map((single, index) => {
          if (["ABSTRACT", "AUDIENCE"].includes(single.type)) {
            return (
              <Title
                key={JSON.stringify(single) + index}
                tag={"div"}
                type="title5"
              >
                {single.content.replaceAll("\\", '"')}
              </Title>
            );
          }

          return (
            <div
              key={JSON.stringify(single) + index}
              className={styles.content_section}
            >
              <Text type={"text1"}>
                {Translate({
                  context: "reviews",
                  label: single.type.toLowerCase(),
                })}
              </Text>
              <Text tag={"div"} type={"text2"}>
                {substituteContentSubstitute(single)}
              </Text>
            </div>
          );
        })}
      </Col>
    </Section>
  );
}
ReviewContent.propTypes = {
  lectorReviews: PropTypes.arrayOf(PropTypes.object),
};
