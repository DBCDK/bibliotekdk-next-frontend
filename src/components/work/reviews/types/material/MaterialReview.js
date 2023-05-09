import PropTypes from "prop-types";
import Col from "react-bootstrap/Col";

import { cyKey } from "@/utils/trim";
import { encodeString, encodeTitleCreator } from "@/lib/utils";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Icon from "@/components/base/icon";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";

import { dateToShortDate, numericToISO } from "@/utils/datetimeConverter";

import styles from "./MaterialReview.module.css";

/**
 * replaces reference in content with a link to the manifestation
 * removes the \\ markup from the content where a title reference is missing from the manifestation list.
 */
export function contentParser({ content, manifestations }) {
  const chunks = [];

  if (manifestations?.length > 0) {
    manifestations
      .filter((manifestation) => !!manifestation)
      .forEach(({ ownerWork }, idx) => {
        const arr = content.split(ownerWork?.titles?.main);
        arr.forEach((chunk) => chunks.push(chunk));
        chunks.splice(idx + 1, 0, <LectorLink key={idx} work={ownerWork} />);
      });
  }

  /** the regexp is not supported by javascript - (lookbehind) - simply replace \ ... **/
  // No manifestation references was found, search and replace \\ notations with "" in paragraph content

  /*else {
    const regex = /(?<=\\)(.*?)(?=\\)/g;
    const match = content?.match(regex);
    const trimmed = content?.replace(`\\${match}\\`, `"${match}"`);

    chunks.push(trimmed);

  }*/

  chunks.push(content?.replaceAll("\\", ""));

  // add tailing dot space after each paragraph
  chunks.push(". ");

  return chunks;
}

/**
 * The Component function
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function MaterialReview({
  className = "",
  data = [],
  skeleton = false,
  onFocus = null,
  title = null,
  workId = null,
}) {
  // Translate Context
  const context = { context: "reviews" };

  // make an url for infomedia page
  const urlTxt = title && encodeString(title);
  const pid = data.pid;
  const url = pid && `/anmeldelse/${urlTxt}/${workId}/${pid}`;

  return (
    <Col
      xs={11}
      lg={12}
      className={`${styles.materialReview} ${className}`}
      data-cy={cyKey({ prefix: "review", name: "material" })}
    >
      <div className={styles.flex__container}>
        <div>
          <Title type="title5" skeleton={skeleton}>
            {data.recordCreationDate &&
              dateToShortDate(numericToISO(data.recordCreationDate))}
          </Title>
        </div>

        <div>
          <LectorReview
            data={data.review.reviewByLibrarians}
            skeleton={skeleton}
          />
        </div>

        <div className={styles.flex__information}>
          <div className={styles.link_container}>
            <div className={styles.type}>
              <Text type="text3" skeleton={skeleton} lines={1}>
                {Translate({
                  context: "general",
                  label: "lecturerStatement",
                })}
              </Text>
            </div>

            <div className={styles.url}>
              <Icon
                src="chevron.svg"
                size={{ w: 2, h: "auto" }}
                skeleton={skeleton}
                alt=""
              />
              <Link
                target="_self"
                onFocus={onFocus}
                href={url}
                disabled={!url}
                border={{ top: false, bottom: { keepVisible: true } }}
              >
                <Text type="text2" skeleton={skeleton} tag="span">
                  {Translate({
                    ...context,
                    label: "materialReviewLinkText",
                  })}
                </Text>
              </Link>
            </div>
          </div>

          <div className={styles.author}>
            <span>
              <Text type="text3" skeleton={skeleton} lines={1}>
                {Translate({ context: "general", label: "by" })}
              </Text>
              <Text type="text3" skeleton={skeleton} lines={1}>
                {data.creators?.map((c) => c.display).join(", ")}
              </Text>
            </span>
          </div>
        </div>
      </div>
    </Col>
  );
}

/**
 * Handle a Lector review. A review is one or more paragraphs (chapters). This
 * one handles paragraphs one by one - a paragraph may contain a link to a related
 * work.
 *
 * @param data
 * @param skeleton
 * @return {JSX.Element}
 */
function LectorReview({ data, skeleton }) {
  return (
    <Title
      type="title3"
      lines={{ xs: 5, lg: 3 }}
      clamp={true}
      skeleton={skeleton}
    >
      {data
        ?.map((paragraph) => paragraph)
        .filter(
          (paragraph) =>
            !paragraph.content?.startsWith("Materialevurdering") &&
            !paragraph.content?.startsWith("Indscannet version")
        )
        .map((paragraph, i) => {
          return (
            <span key={`paragraph-${i}`} className={styles.reviewTxt}>
              <Title type="title3" skeleton={skeleton} lines={1}>
                {contentParser(paragraph)}
              </Title>
            </span>
          );
        })}
    </Title>
  );
}

/**
 * Check if a paragraph holds a link to another work - if so parse as link
 * if not return a period (.)
 * @param work
 * @return {JSX.Element|string}
 */
function LectorLink({ work }) {
  if (!work) {
    return ". ";
  }

  // @TODO there may be more than one creator - for now simply grab the first
  // @TODO if more should be handled it should be done here: src/lib/utils::encodeTitleCreator
  const creator = work?.creators[0]?.display || "";
  const title = work?.titles?.main?.[0] || "";
  const title_crator = encodeTitleCreator(title, creator);

  const path = `/materiale/${title_crator}/${work?.workId}`;
  return <Link href={path}>{work?.titles?.main}</Link>;
}

/**
 * Function to return skeleton (Loading) version of the Component
 *
 * @param {obj} props
 *  See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export function MaterialReviewSkeleton(props) {
  const data = {
    pid: "Some pid",
    creators: [
      {
        display: "Some creator",
      },
    ],
    recordCreationDate: "20200512",
    review: {
      rating: null,
      reviewByLibrarians: [
        {
          content: "This is some content",
          heading: "The heading",
          type: "Some content type",
          manifestations: [],
        },
        {
          content: "This is Some book title and more content",
          heading: "The heading",
          type: "Some content type",
          manifestations: [
            {
              ownerWork: {
                workId: "some-work-id",
                titles: {
                  main: ["Some book title"],
                },
                creators: [
                  {
                    display: "Some creator",
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  };

  return (
    <MaterialReview
      {...props}
      data={data}
      className={`${props.className || ""} ${styles.skeleton}`}
      skeleton={true}
    />
  );
}

/**
 *  Default export function of the Component
 *
 * @param {obj} props
 * See propTypes for specific props and types
 *
 * @returns {JSX.Element}
 */
export default function Wrap(props) {
  const { error, isSkeleton } = props;

  if (isSkeleton) {
    return <MaterialReviewSkeleton />;
  }

  if (error) {
    return null;
  }

  return <MaterialReview {...props} />;
}

// PropTypes for component
Wrap.propTypes = {
  workId: PropTypes.string,
  type: PropTypes.string,
  skeleton: PropTypes.bool,
};
