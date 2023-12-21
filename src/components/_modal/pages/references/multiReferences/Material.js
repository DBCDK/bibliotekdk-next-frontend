import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import isEmpty from "lodash/isEmpty";
import { accessFactory } from "@/lib/accessFactoryUtils";
import { BackgroundColorEnum } from "@/components/base/materialcard/materialCard.utils";
import ButtonRow from "./ButtonRow";
import { constructMaterialType } from "@/components/profile/bookmarks/Page";
import { flattenMaterialType } from "@/lib/manifestationFactoryUtils";

export default function Material({
  material,
  materialKey,
  onActionClick,
  onDeleteClick: onParentDeleteClick,
  hideDelete,
}) {
  const manifestations = material?.manifestations;
  const materialType = constructMaterialType(
    manifestations?.[0]?.materialTypes
  );
  const materialTypesArray = flattenMaterialType(manifestations?.[0]);
  const manifestation = manifestations?.[0];
  const { isPeriodicaLikeArray } = accessFactory(manifestations);
  const isPeriodicaLike = isPeriodicaLikeArray?.find(
    (single) => single === true
  );

  const onEditionClick = () => {
    if (onActionClick) onActionClick(material, materialType, materialKey);
  };

  const onDeleteClick = () => {
    if (onParentDeleteClick) onParentDeleteClick(materialKey);
  };

  const children = ButtonRow({
    onClick: onEditionClick,
    onDeleteClick,
    hideDelete: hideDelete,
  });
  const isDigitalCopy = false;
  const isDeliveredByDigitalArticleService = false;

  const materialCardTemplate = (material) =>
    templateImageToLeft({
      material: { ...material, materialTypesArray: materialTypesArray },
      singleManifestation: false,
      children,
      isPeriodicaLike,
      isDigitalCopy,
      isDeliveredByDigitalArticleService,
      backgroundColor: BackgroundColorEnum.YELLOW,
      hideEditionText: true,
    });
  return (
    <>
      {manifestations && !isEmpty(manifestations) && (
        <MaterialCard
          key={JSON.stringify("matcard+", manifestation)}
          propAndChildrenTemplate={materialCardTemplate}
          propAndChildrenInput={manifestation}
          colSizing={{ xs: 12 }}
        />
      )}
    </>
  );
}
