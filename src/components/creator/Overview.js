import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./Overview.module.css";
import { useData } from "@/lib/api/api";
import { creatorOverview } from "@/lib/api/creator.fragments";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Translate from "@/components/base/translate/Translate";
import Cover from "@/components/base/cover/Cover";
import Icon from "@/components/base/icon";
import AiMarkdown from "@/components/base/markdown/AiMarkdown";

export function useCreatorOverview(creatorId) {
  const { data, isLoading } = useData(creatorOverview({ display: creatorId }));

  const image =
    (data?.wikidata?.image?.medium && {
      url: data?.wikidata?.image?.medium,
      attributionText: data?.wikidata?.image?.attributionText,
    }) ||
    (data?.forfatterwebSearch?.works?.[0]?.manifestations?.bestRepresentation
      ?.cover?.large?.url && {
      url: data?.forfatterwebSearch?.works?.[0]?.manifestations
        ?.bestRepresentation?.cover?.large?.url,
      attributionText: "Forfatterweb",
    });

  return {
    data: data && {
      ...(data?.creatorByDisplay || {}),
      numWorks: data?.exists?.hitcount,
      image,
    },
    isLoading: isLoading,
  };
}
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
  const summaryText =
    creatorData?.generated?.summary?.text ||
    creatorData?.generated?.dataSummary?.text;
  return (
    <section className={`${styles.background} ${className}`}>
      <Container fluid>
        <Row className={styles.overview}>
          <Col xs={12} xl={3} className={styles.breadcrumbs}>
            <Text type="text3" tag="p" lines={1}>
              {Translate({ context: "creator", label: "creator-breadcrumb" })} /{" "}
              {creatorId}
            </Text>
          </Col>
          <Col
            xs={{ span: 12, order: 2 }}
            md={{ span: 7, order: 1 }}
            xl={{ span: 5, order: 1 }}
          >
            <Title type="title2" tag="h1" lines={1}>
              {creatorData?.display || creatorId}
            </Title>
            <Text
              type="text3"
              tag="p"
              className={styles.occupation}
              lines={1}
              skeleton={isLoading && !creatorData?.wikidata?.occupation}
            >
              {creatorData?.wikidata?.occupation?.join(", ") || ""}
            </Text>
            {isLoading && !summaryText && (
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
            {summaryText && (
              <AiMarkdown
                creatorId={creatorId}
                text={summaryText}
                urlTransform={(href) => `/materiale/title/${href}`}
                fadeIn={false}
                // disclaimer={tmpDisclaimer}
              />
            )}
          </Col>
          <Col
            xs={{ span: 12, order: 1 }}
            md={{ span: 5, order: 2 }}
            xl={{ span: 4, order: 2 }}
            className={styles.imageCol}
          >
            {isLoading && !creatorData?.image?.url && (
              <>
                <Cover
                  src={creatorData?.image?.url}
                  alt={creatorData?.display}
                  skeleton={isLoading && !creatorData?.image?.url}
                />
                {creatorData?.image?.attributionText && (
                  <Text
                    type="text5"
                    tag="p"
                    className={styles.attribution}
                    lines={2}
                    clamp
                  >
                    {creatorData?.image?.attributionText}
                  </Text>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default function Wrap({ creatorId }) {
  const { data: creatorData, isLoading: isCreatorLoading } =
    useCreatorOverview(creatorId);

  return (
    <Overview
      creatorId={creatorId}
      creatorData={creatorData}
      isLoading={isCreatorLoading}
    />
  );
}
