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
import {
  usePickupBranchId,
  useShowAlreadyOrdered,
} from "@/components/hooks/order";
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
import HasBeenOrderedRow from "./hasbeenOrderedRow/HasBeenOrderedRow";
import useLoanerInfo from "@/components/hooks/user/useLoanerInfo";
import { useBranchInfo } from "@/components/hooks/useBranchInfo";
import { useManifestationAccess } from "@/components/hooks/useManifestationAccess";
import { useOrderService, usePeriodicaForm } from "@/components/hooks/order";

/**
 * Shows grey box with text if no manifestation is found.
 * @returns {React.JSX.Element} - Returns a React JSX element.
 */
const NoManifestationFound = () => {
  return (
    <Text className={styles.edition} type="text2" lines={1}>
      {Translate({
        context: "order",
        label: "work-not-found",
      })}
    </Text>
  );
};

export function Edition({
  isLoading,
  singleManifestation = false,
  coverImage = null,
  inferredAccessTypes = {},
  manifestation,
  showOrderTxt = true,
  modal = {},
  showChangeManifestation = true,
  articleTypeTranslation,
  periodicaForm,
}) {
  const { isArticle, isPeriodicaLike } = inferredAccessTypes;
  if (!manifestation) {
    return <NoManifestationFound />;
  }

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
  pids: orderPidsBeforeFilter,
  singleManifestation = false,
  showOrderTxt = true,
  showChangeManifestation,
  isMaterialCard = false,
}) {
  const modal = useModal();
  const { setAcceptedAlreadyOrdered, showAlreadyOrderedWarning } =
    useShowAlreadyOrdered({ pids: orderPidsBeforeFilter });

  const { loanerInfo, isLoading: isLoadingUserInfo } = useLoanerInfo();
  // TODO what about periodicaform?

  const { periodicaForm } = usePeriodicaForm();

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
  const manifestations = manifestationsData?.manifestations;
  const { branchId } = usePickupBranchId();
  const pickupBranch = useBranchInfo({ branchId });

  const { service } = useOrderService({ pids: orderPids });
  const { access, hasDigitalCopy } = useManifestationAccess({
    pids: orderPids,
  });
  const isDeliveredByDigitalArticleService = service === "DIGITAL_ARTICLE";

  const inferredAccessTypes = inferAccessTypes(
    periodicaForm,
    pickupBranch,
    manifestations,
    loanerInfo
  );
  const { isPeriodicaLike, isDigitalCopy, isArticleRequest } =
    inferredAccessTypes;
  const coverImage = getCoverImage(manifestations);

  const articleTypeTranslation = translateArticleType({
    isDigitalCopy: hasDigitalCopy,
    availableAsDigitalCopy: isDeliveredByDigitalArticleService,
    selectedAccesses: access,
    isArticleRequest,
    hasPeriodicaForm: !!periodicaForm,
  });

  if (isMaterialCard) {
    const { flattenedGroupedSortedManifestations } =
      manifestationMaterialTypeFactory(manifestations);
    const firstManifestation = flattenedGroupedSortedManifestations?.[0];

    if (!firstManifestation) {
      return <NoManifestationFound />;
    }

    const children = [];

    if (isPeriodicaLike) {
      children.push(
        <ChoosePeriodicaCopyRow
          singleOrderPeriodicaForm={periodicaForm}
          modal={modal}
          articleTypeTranslation={articleTypeTranslation}
        />
      );
    }

    if (showAlreadyOrderedWarning && !isPeriodicaLike) {
      //TODO currently we only check for non-periodica orders
      children.push(
        <HasBeenOrderedRow
          orderDate={new Date()}
          removeOrder={() => modal.clear()}
          acceptOrder={() => {
            setAcceptedAlreadyOrdered(true), modal.update({});
          }}
        />
      );
    }

    const materialCardTemplate = (material) =>
      templateImageToLeft({
        material,
        singleManifestation,
        children,
        isPeriodicaLike,
        isDigitalCopy,
        isDeliveredByDigitalArticleService,
        manifestationIsLoading,
        isLoading: manifestationIsLoading,
      });

    return (
      <div>
        {flattenedGroupedSortedManifestations &&
          !isEmpty(flattenedGroupedSortedManifestations) && (
            <MaterialCard
              key={JSON.stringify("matcard+", firstManifestation)}
              propAndChildrenTemplate={materialCardTemplate}
              propAndChildrenInput={firstManifestation}
            />
          )}
      </div>
    );
  }

  return (
    <Edition
      isLoading={isLoadingUserInfo || manifestationIsLoading}
      singleManifestation={singleManifestation}
      coverImage={coverImage}
      inferredAccessTypes={inferredAccessTypes}
      manifestation={manifestations?.[0]}
      showOrderTxt={showOrderTxt}
      modal={modal}
      showChangeManifestation={showChangeManifestation}
      articleTypeTranslation={articleTypeTranslation}
      periodicaForm={periodicaForm}
    />
  );
}
