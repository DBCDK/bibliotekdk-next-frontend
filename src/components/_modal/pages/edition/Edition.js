import styles from "./Edition.module.css";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import Tag from "@/components/base/forms/tag";
import { LinkArrow } from "@/components/_modal/pages/order/linkarrow/LinkArrow";
import Cover from "@/components/base/cover";
import { useModal } from "@/components/_modal";
import { useData } from "@/lib/api/api";
import * as workFragments from "@/lib/api/work.fragments";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import usePickupBranch from "@/components/hooks/usePickupBranch";
import { inferAccessTypes } from "@/components/_modal/pages/edition/utils";
import { memo, useMemo } from "react";

export function Edition_TempUsingAlfaApi({
  isLoading,
  work,
  singleManifestation = false,
  isArticle = false,
  isPeriodicaLike = false,
  availableAsDigitalCopy = false,
  isArticleRequest = false,
  context,
  material,
  showOrderTxt = true,
  modal = {},
}) {
  const { cover: workCover, creators: workCreators = [{ name: "..." }] } = work;

  const { creators = workCreators, cover = workCover, materialType } = material;

  return (
    <div className={styles.edition}>
      <div className={styles.left}>
        <div className={styles.title}>
          <Text type="text1" skeleton={isLoading} lines={1}>
            {work?.fullTitle}
          </Text>
        </div>
        <div className={styles.creators}>
          <Text type="text3" skeleton={isLoading} lines={1}>
            {creators.map((c, i) =>
              creators.length > i + 1 ? c.name + ", " : c.name
            )}
          </Text>
        </div>
        {singleManifestation && (
          <div>
            <Text
              type="text3"
              skeleton={isLoading}
              lines={1}
              dataCy="additional_edition_info"
            >
              {material.datePublished},&nbsp;
              {material.publisher && material.publisher.map((pub) => pub)}
              &nbsp;
              {material.edition && "," + material.edition}
            </Text>
          </div>
        )}
        <div className={styles.material}>
          {!isArticle &&
            !isPeriodicaLike &&
            !singleManifestation &&
            showOrderTxt && (
              <Link onClick={() => {}} disabled>
                <Text type="text3" skeleton={isLoading} lines={1} clamp>
                  {Translate({
                    context: "order",
                    label: "no-specific-edition",
                  })}
                </Text>
              </Link>
            )}
          {singleManifestation && showOrderTxt && (
            <Link onClick={() => {}} disabled>
              <Text type="text3" skeleton={isLoading} lines={1} clamp>
                {Translate({
                  context: "order",
                  label: "specific-edition",
                })}
              </Text>
            </Link>
          )}
          <div>
            <Tag tag="span" skeleton={isLoading}>
              {materialType}
            </Tag>
          </div>
        </div>
        {availableAsDigitalCopy ? (
          <div className={styles.articletype}>
            <Text type="text4">
              {Translate({
                context: "order",
                label: "will-order-digital-copy",
              })}
            </Text>
          </div>
        ) : isArticleRequest ? (
          <div className={styles.articletype}>
            <Text type="text4">
              {Translate({
                context: "general",
                label: "article",
              })}
            </Text>
          </div>
        ) : context?.periodicaForm ? (
          <div className={styles.articletype}>
            <Text type="text4">
              {Translate({
                context: "general",
                label: "volume",
              })}
            </Text>
          </div>
        ) : null}
        {context?.periodicaForm && (
          <div className={styles.periodicasummary}>
            {Object.entries(context?.periodicaForm).map(([key, value]) => (
              <Text type="text3" key={key}>
                {Translate({
                  context: "order-periodica",
                  label: `label-${key}`,
                })}
                : {value}
              </Text>
            ))}
          </div>
        )}
        {isPeriodicaLike && (
          <LinkArrow
            onClick={() => {
              modal.push("periodicaform", {
                periodicaForm: context?.periodicaForm,
              });
            }}
            disabled={false}
            className={`${styles.periodicaformlink} ${styles.link}`}
          >
            <Text type="text3">
              {Translate({
                context: "order-periodica",
                label: "title",
              })}
            </Text>
          </LinkArrow>
        )}
      </div>
      <div className={styles.right}>
        <Cover src={cover?.detail} size="thumbnail" skeleton={isLoading} />
      </div>
    </div>
  );
}

export const Edition = memo(function Edition({
  isLoading,
  singleManifestation = false,
  isArticle = false,
  isPeriodicaLike = false,
  availableAsDigitalCopy = false,
  isArticleRequest = false,
  context,
  material,
  showOrderTxt = true,
  modal = {},
}) {
  const { periodicaForm } = context;

  const materialType = material?.materialTypes?.[0]?.specific;

  const materialPresentation = [
    material?.edition?.publicationYear?.display,
    material?.publisher,
    material?.edition?.edition,
  ]
    ?.flat()
    ?.join(", ");

  const articleTypeLabel = availableAsDigitalCopy
    ? "will-order-digital-copy"
    : isArticleRequest
    ? "article"
    : periodicaForm
    ? "volume"
    : null;

  const specificEdition =
    showOrderTxt && !singleManifestation && !isArticle && !isPeriodicaLike
      ? "no-specific-edition"
      : showOrderTxt && singleManifestation
      ? "specific-edition"
      : null;

  return (
    <div className={styles.edition}>
      <div className={styles.left}>
        <div className={styles.title}>
          <Text
            type="text1"
            skeleton={!material?.titles?.full && isLoading}
            lines={1}
          >
            {material?.titles?.full}
          </Text>
        </div>
        <div className={styles.creators}>
          <Text
            type="text3"
            skeleton={!material?.creators && isLoading}
            lines={1}
          >
            {material?.creators?.map((c, i) =>
              material?.creators?.length > i + 1 ? c.display + ", " : c.display
            )}
          </Text>
        </div>
        {singleManifestation && (
          <div>
            <Text
              type="text3"
              skeleton={!materialPresentation && isLoading}
              lines={1}
              dataCy="additional_edition_info"
            >
              {materialPresentation}
            </Text>
          </div>
        )}
        <div className={styles.material}>
          {specificEdition ? (
            <Link onClick={() => {}} disabled>
              <Text
                type="text3"
                skeleton={!specificEdition && isLoading}
                lines={1}
                clamp
              >
                {Translate({
                  context: "order",
                  label: specificEdition,
                })}
              </Text>
            </Link>
          ) : null}
          <div>
            <Tag tag="span" skeleton={!materialType && isLoading}>
              {materialType?.[0].toUpperCase() + materialType?.slice(1)}
            </Tag>
          </div>
        </div>
        {articleTypeLabel ? (
          <div className={styles.articletype}>
            <Text type="text4">
              {Translate({
                context: "order",
                label: articleTypeLabel,
              })}
            </Text>
          </div>
        ) : null}
        {periodicaForm && (
          <div className={styles.periodicasummary}>
            {Object.entries(periodicaForm).map(([key, value]) => (
              <Text type="text3" key={key}>
                {Translate({
                  context: "order-periodica",
                  label: `label-${key}`,
                })}
                : {value}
              </Text>
            ))}
          </div>
        )}
        {isPeriodicaLike && (
          <LinkArrow
            onClick={() => {
              modal.push("periodicaform", {
                periodicaForm: periodicaForm,
              });
            }}
            disabled={false}
            className={styles.periodicaformlink}
          >
            <Text type="text3">
              {Translate({
                context: "order-periodica",
                label: "title",
              })}
            </Text>
          </LinkArrow>
        )}
      </div>
      <div className={styles.right}>
        <Cover
          src={material?.cover?.thumbnail}
          size="thumbnail"
          skeleton={!material?.cover?.thumbnail && isLoading}
        />
      </div>
    </div>
  );
});

export default function Wrap({
  context,
  singleManifestation = false,
  showOrderTxt = true,
}) {
  const modal = useModal();
  const { workId, pids } = context;

  const { data: manifestationsData, isLoading: manifestationIsLoading } =
    useData(
      pids?.length > 0 &&
        manifestationFragments.editionManifestations({
          pid: pids,
        })
    );
  const manifestations = useMemo(() => {
    return manifestationsData?.manifestations;
  }, [manifestationsData?.manifestations]);

  const { data: workData, isLoading: workIsLoading } = useData(
    workId && workFragments.editionWork({ workId: workId })
  );
  const work = useMemo(() => {
    return workData?.work;
  }, [workData?.work]);

  const { initialPickupBranch } = usePickupBranch(pids[0]);

  const {
    isArticle,
    isPeriodicaLike,
    isArticleRequest,
    availableAsDigitalCopy,
  } = inferAccessTypes(work, context, manifestations, initialPickupBranch);

  return (
    <Edition
      isLoading={
        workIsLoading || manifestationIsLoading || !manifestations?.[0]
      }
      singleManifestation={singleManifestation}
      isArticle={isArticle}
      isPeriodicaLike={isPeriodicaLike}
      availableAsDigitalCopy={availableAsDigitalCopy}
      isArticleRequest={isArticleRequest}
      context={context}
      material={manifestations?.[0]}
      showOrderTxt={showOrderTxt}
      modal={modal}
    />
  );
}
