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
import { getCoverImage } from "@/components/utils/getCoverImage";
import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import { AccessEnum } from "@/lib/enums";

export const Edition = memo(function Edition({
  isLoading,
  singleManifestation = false,
  coverImage = null,
  inferredAccessTypes = {},
  context,
  material,
  showOrderTxt = true,
  modal = {},
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
    material?.edition?.publicationYear?.display,
    material?.publisher,
    material?.edition?.edition,
  ]
    ?.flat()
    ?.join(", ");

  const articleTypeLabel =
    isDigitalCopy &&
    availableAsDigitalCopy &&
    context?.selectedAccesses?.[0]?.__typename !== AccessEnum.INTER_LIBRARY_LOAN
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
          src={coverImage?.detail || material?.cover?.detail}
          size="thumbnail"
          skeleton={
            (!coverImage?.detail || !material?.cover?.detail) && isLoading
          }
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
  const { workId, pids, orderPids: orderPidsBeforeFilter } = context;

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

  const { data: workData, isLoading: workIsLoading } = useData(
    workId && workFragments.editionWork({ workId: workId })
  );
  const work = useMemo(() => {
    return workData?.work;
  }, [workData?.work]);

  const { pickupBranch } = usePickupBranch(pids?.[0]);

  const inferredAccessTypes = inferAccessTypes(
    work,
    context?.periodicaForm,
    pickupBranch,
    manifestations
  );

  const coverImage = getCoverImage(manifestations);

  return (
    <Edition
      isLoading={
        workIsLoading || manifestationIsLoading || !manifestations?.[0]
      }
      singleManifestation={singleManifestation}
      coverImage={coverImage}
      inferredAccessTypes={inferredAccessTypes}
      context={context}
      material={manifestations?.[0]}
      showOrderTxt={showOrderTxt}
      modal={modal}
    />
  );
}
