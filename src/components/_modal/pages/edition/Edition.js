import styles from "./Edition.module.css";
import Text from "@/components/base/text";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import Tag from "@/components/base/forms/tag";
import { LinkArrow } from "@/components/_modal/pages/order/linkarrow/LinkArrow";
import Cover from "@/components/base/cover";
import { useModal } from "@/components/_modal";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import usePickupBranch from "@/components/hooks/usePickupBranch";
import { inferAccessTypes } from "@/components/_modal/pages/edition/utils";
import { useMemo } from "react";
import { getCoverImage } from "@/components/utils/getCoverImage";
import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import { AccessEnum } from "@/lib/enums";

export function Edition({
  isLoading,
  singleManifestation = false,
  coverImage = null,
  inferredAccessTypes = {},
  context,
  manifestation,
  showOrderTxt = true,
  modal = {},
  showChangeManifestation = true,
}) {
  const { periodicaForm } = context;
  const {
    isArticle,
    isPeriodicaLike,
    isArticleRequest,
    isDigitalCopy,
    availableAsDigitalCopy,
  } = inferredAccessTypes;

  const { flatMaterialTypes } = manifestationMaterialTypeFactory([
    manifestation,
  ]);

  const materialType = flatMaterialTypes?.[0];

  const materialPresentation = [
    manifestation?.edition?.publicationYear?.display,
    manifestation?.publisher,
    manifestation?.edition?.edition,
  ]
    ?.flat()
    ?.join(", ");

  const articleTypeTranslation =
    isDigitalCopy &&
    availableAsDigitalCopy &&
    context?.selectedAccesses?.[0]?.__typename !== AccessEnum.INTER_LIBRARY_LOAN
      ? {
          context: "order",
          label: "will-order-digital-copy",
        }
      : isArticleRequest
      ? {
          context: "general",
          label: "article",
        }
      : periodicaForm
      ? {
          context: "general",
          label: "volume",
        }
      : null;

  const specificEdition =
    showOrderTxt && !singleManifestation && !isArticle && !isPeriodicaLike
      ? "no-specific-edition"
      : showOrderTxt && singleManifestation
      ? "specific-edition"
      : null;

  const titles = manifestation?.titles?.full;

  return (
    <div className={styles.edition}>
      <div className={styles.left}>
        <div className={styles.title}>
          <Text
            type="text1"
            skeleton={!manifestation?.titles?.full && isLoading}
            lines={1}
          >
            {titles.map((title, index) => (
              <>
                {title} {index < titles.length - 1 && <br />}
              </>
            ))}
          </Text>
        </div>
        <div className={styles.creators}>
          <Text
            type="text3"
            skeleton={!manifestation?.creators && isLoading}
            lines={1}
          >
            {manifestation?.creators
              ?.map((creator) => creator?.display)
              .join(", ")}
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
                skeleton={(!specificEdition && isLoading) || !specificEdition}
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
              {formatMaterialTypesToPresentation(materialType)}
            </Tag>
          </div>
        </div>
        {articleTypeTranslation ? (
          <div className={styles.articletype}>
            <Text type="text4">{Translate(articleTypeTranslation)}</Text>
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
        {isPeriodicaLike && showChangeManifestation && (
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
          src={coverImage?.detail || manifestation?.cover?.detail}
          size="thumbnail"
          skeleton={
            (!coverImage?.detail || !manifestation?.cover?.detail) && isLoading
          }
        />
      </div>
    </div>
  );
}

export default function Wrap({
  context,
  singleManifestation = false,
  showOrderTxt = true,
  showChangeManifestation,
}) {
  const modal = useModal();
  const { orderPids: orderPidsBeforeFilter } = context;

  const orderPids = useMemo(() => {
    return orderPidsBeforeFilter?.filter(
      (pid) => pid !== null && typeof pid !== "undefined"
    );
  }, [orderPidsBeforeFilter]);

  const { data: manifestationsData, isLoading: manifestationIsLoading } =
    useData(
      orderPids?.length > 0 &&
        manifestationFragments.editionManifestations({
          pid: orderPids,
        })
    );
  const manifestations = useMemo(() => {
    return manifestationsData?.manifestations;
  }, [manifestationsData?.manifestations]);

  const { pickupBranch } = usePickupBranch(orderPids?.[0]);

  const inferredAccessTypes = inferAccessTypes(
    context?.periodicaForm,
    pickupBranch,
    manifestations
  );

  const coverImage = getCoverImage(manifestations);

  return (
    <Edition
      isLoading={manifestationIsLoading || !manifestations?.[0]}
      singleManifestation={singleManifestation}
      coverImage={coverImage}
      inferredAccessTypes={inferredAccessTypes}
      context={context}
      manifestation={manifestations?.[0]}
      showOrderTxt={showOrderTxt}
      modal={modal}
      showChangeManifestation={showChangeManifestation}
    />
  );
}
