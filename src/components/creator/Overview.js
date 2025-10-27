import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./Overview.module.css";
import { ApiEnums, useData } from "@/lib/api/api";
import { creatorOverview } from "@/lib/api/creator.fragments";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate/Translate";
import Cover from "@/components/base/cover/Cover";
import Icon from "@/components/base/icon";
import AiMarkdown from "@/components/base/markdown/AiMarkdown";

/**
 * Displays the creator overview with breadcrumbs, name, occupation,
 * awards, generated summary and image.
 */
export function Overview({
  className = "",
  creatorId,
  creatorData,
  isLoading,
}) {
  const tmpDisclaimer =
    "Teksten er automatisk genereret ud fra bibliotekernes materialevurderinger og kan indeholde fejl.";
  return (
    <section className={`${styles.background} ${className}`}>
      <Container fluid>
        <Row className={styles.overview}>
          <Col xs={12} xl={3} className={styles.breadcrumbs}>
            <Text type="text3" tag="p" lines={1} skeleton={isLoading}>
              {Translate({ context: "general", label: "authors" })} /{" "}
              {creatorId}
            </Text>
          </Col>
          <Col
            xs={{ span: 12, order: 2 }}
            md={{ span: 7, order: 1 }}
            xl={{ span: 5, order: 1 }}
          >
            <Title type="title2" tag="h1" lines={1} skeleton={isLoading}>
              {creatorData?.display || creatorId}
            </Title>
            <Text
              type="text3"
              tag="p"
              className={styles.occupation}
              lines={1}
              skeleton={isLoading}
            >
              {creatorData?.wikidata?.occupation?.join(", ") || ""}
            </Text>
            {isLoading && (
              <Text
                type="text3"
                tag="p"
                className={styles.occupation}
                lines={4}
                skeleton={isLoading}
              >
                ...
              </Text>
            )}
            {creatorData?.wikidata?.awards?.length > 0 && (
              <div className={styles.awards}>
                <Icon size={{ w: 3, h: 3 }} src="award.svg" alt="" />
                <Text type="text3" tag="p" className={styles.award}>
                  {creatorData?.wikidata?.awards?.join(", ")}
                </Text>
              </div>
            )}
            {creatorData?.generated?.summary?.text && (
              <AiMarkdown
                creatorId={creatorId}
                text={creatorData?.generated?.summary?.text}
                urlTransform={(href) => `/materiale/title/${href}`}
                disclaimer={tmpDisclaimer}
              />
            )}
          </Col>
          <Col
            xs={{ span: 12, order: 1 }}
            md={{ span: 5, order: 2 }}
            xl={{ span: 4, order: 2 }}
            className={styles.imageCol}
          >
            <Cover
              src={creatorData?.wikidata?.image?.url}
              alt={creatorData?.display}
              skeleton={isLoading}
            />
            {creatorData?.wikidata?.image?.attributionText && (
              <Text
                type="text5"
                tag="p"
                className={styles.attribution}
                lines={2}
                clamp
              >
                {creatorData?.wikidata?.image?.attributionText}
              </Text>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default function Wrap({ creatorId }) {
  // This is temporary solution to get the viafid.
  // Will be available directly from fbi-api soon
  const { data: viafData, isLoading: isViafLoading } = useData({
    // delay: 1000,
    apiUrl: ApiEnums.FBI_API,
    query: `query creatorViafId($name: String!) {
  search(q: {creator: $name}) {
    works(offset: 0, limit: 1) {
      creators {
        display
        viafid
      }
    }
  }
}`,
    variables: { name: creatorId },
  });
  const viafid = viafData?.search?.works?.[0]?.creators?.find(
    (creator) => creator.display === creatorId
  )?.viafid;
  const { data: creatorData, isLoading: isCreatorLoading } = useData(
    viafid && creatorOverview({ viafid })
  );
  return (
    <Overview
      creatorId={creatorId}
      creatorData={creatorData?.creatorByViafid}
      isLoading={isViafLoading || isCreatorLoading}
    />
  );
}
