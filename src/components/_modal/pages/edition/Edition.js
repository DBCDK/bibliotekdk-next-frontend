import styles from "./Edition.module.css";
import Text from "@/components/base/text";
import Title from "@/components/base/title";
import Link from "@/components/base/link";
import Translate from "@/components/base/translate";
import Tag from "@/components/base/forms/tag";
import Cover from "@/components/base/cover";
import { useModal } from "@/components/_modal";
import { useData } from "@/lib/api/api";
import * as manifestationFragments from "@/lib/api/manifestation.fragments";
import usePickupBranch from "@/components/hooks/usePickupBranch";
import {
  inferAccessTypes,
  translateArticleType,
} from "@/components/_modal/pages/edition/utils";
import { useMemo } from "react";
import { getCoverImage } from "@/components/utils/getCoverImage";
import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import { IconLink } from "@/components/base/iconlink/IconLink";
import ChevronRight from "@/public/icons/chevron_right.svg";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";
import ChoosePeriodicaCopyRow from "./choosePeriodicaCopyRow/ChoosePeriodicaCopyRow.js";
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
  articleTypeTranslation,
}) {
  const { periodicaForm } = context;
  const { isArticle, isPeriodicaLike } = inferredAccessTypes;

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
    .filter((pre) => !isEmpty(pre))
    ?.join(", ");

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
          {titles?.map((title, index) => (
            <Title
              tag="h3"
              type="text1"
              skeleton={!manifestation?.titles?.full && isLoading}
              lines={1}
              key={title + "-" + index}
            >
              {title} {index < titles?.length - 1 && <br />}
            </Title>
          ))}
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
              className={styles.editiontxt}
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
          {specificEdition && showOrderTxt ? (
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
            <Tag
              tag="span"
              skeleton={!materialType && isLoading}
              disabled
              opaqueText
            >
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
          <div>
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
          <IconLink
            onClick={() => {
              modal.push("periodicaform", {
                periodicaForm: periodicaForm,
              });
            }}
            className={styles.periodicaformlink}
            border={{ bottom: true, top: false }}
            tag={"button"}
            iconSrc={ChevronRight}
            iconPlacement={"right"}
          >
            {Translate({
              context: "order-periodica",
              label: "title",
            })}
          </IconLink>
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

//TODO Edition bliver brugt 3 steder, skal den kun skiftes her?
export default function Wrap({
  context,
  singleManifestation = false,
  showOrderTxt = true,
  showChangeManifestation,
  isMaterialCard = false,
}) {
  const modal = useModal();
  let { orderPids: orderPidsBeforeFilter, periodicaForm } = context;

  if (!Array.isArray(orderPidsBeforeFilter)) {
    orderPidsBeforeFilter = [orderPidsBeforeFilter];
  }

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

  const { pickupBranch } = usePickupBranch(
    orderPids && !isEmpty(orderPids) && { pids: orderPids }
  );

  const inferredAccessTypes = inferAccessTypes(
    periodicaForm,
    pickupBranch,
    manifestations
  );
  const {
    isPeriodicaLike,
    isDigitalCopy,
    availableAsDigitalCopy,
    isArticleRequest,
  } = inferredAccessTypes;
  const coverImage = getCoverImage(manifestations);

  const articleTypeTranslation = translateArticleType({
    isDigitalCopy,
    availableAsDigitalCopy,
    selectedAccesses: context?.selectedAccesses,
    isArticleRequest,
    hasPeriodicaForm: !!periodicaForm,
  });

  if (isMaterialCard) {
    const { flattenedGroupedSortedManifestations } =
      manifestationMaterialTypeFactory(manifestations);
    const firstManifestation = flattenedGroupedSortedManifestations?.[0];

    const children = isPeriodicaLike ? (
      <ChoosePeriodicaCopyRow
        singleOrderPeriodicaForm={periodicaForm}
        modal={modal}
        articleTypeTranslation={articleTypeTranslation}
      />
    ) : null;

    const isDeliveredByDigitalArticleService =
      isDigitalCopy &&
      availableAsDigitalCopy &&
      context?.selectedAccesses?.[0]?.__typename !==
        AccessEnum.INTER_LIBRARY_LOAN;

    const materialCardTemplate = (/** @type {Object} */ material) =>
      templateImageToLeft({
        material,
        singleManifestation,
        children,
        isPeriodicaLike,
        isDigitalCopy,
        isDeliveredByDigitalArticleService,
      });

    return (
      <div>
        {flattenedGroupedSortedManifestations &&
          !isEmpty(flattenedGroupedSortedManifestations) && (
            <MaterialCard
              key={JSON.stringify("matcard+", firstManifestation)}
              propAndChildrenTemplate={materialCardTemplate}
              propAndChildrenInput={firstManifestation}
              colSizing={{ xs: 12 }}
            />
          )}
      </div>
    );
  }

  return (
    <Edition
      isLoading={manifestationIsLoading || !manifestations?.[0]}
      singleManifestation={singleManifestation}
      coverImage={coverImage}
      inferredAccessTypes={inferredAccessTypes}
      context={context}
      manifestation={manifestations?.[0]}
      showOrderTxt={context?.showOrderTxt || showOrderTxt}
      modal={modal}
      showChangeManifestation={showChangeManifestation}
      articleTypeTranslation={articleTypeTranslation}
    />
  );
}
