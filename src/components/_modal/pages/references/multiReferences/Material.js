import { filterForRelevantMaterialTypes } from "../../bookmarkOrder/multi-order/Material/Material";
import { templateImageToLeft } from "@/components/base/materialcard/templates/templates";
import MaterialCard from "@/components/base/materialcard/MaterialCard";
import isEmpty from "lodash/isEmpty";
import { accessFactory } from "@/lib/accessFactoryUtils";
import { BackgroundColorEnum } from "@/components/base/materialcard/materialCard.utils";
import ChoosePeriodicaCopyRow from "../../edition/choosePeriodicaCopyRow/ChoosePeriodicaCopyRow";
import ButtonRow from "./ButtonRow";

export default function Material({
  material,
  materialKey,
  materialKeyToMaterialTypes,
  modal,
  onActionClick,
}) {
  const materialType = materialKeyToMaterialTypes.find(
    (e) => e?.materialKey === material.key
  )?.materialType;

  const manifestationsCorrectMaterialType = filterForRelevantMaterialTypes(
    material.manifestations.mostRelevant,
    materialType
  );

  const manifestation = manifestationsCorrectMaterialType[0];

  const { isPeriodicaLikeArray } = accessFactory(
    manifestationsCorrectMaterialType
  );

  const isPeriodicaLike = isPeriodicaLikeArray?.find(
    (single) => single === true
  );

  const onEditionClick = () => {
    if (onActionClick) onActionClick(material, materialType, materialKey);
  };

  const children = isPeriodicaLike
    ? ChoosePeriodicaCopyRow({
        periodicaForm: {}, //TODO grab data from here and send to references
        modal,
        articleTypeTranslation: null,
      })
    : ButtonRow({ onClick: onEditionClick });
  const isDigitalCopy = false;
  const isDeliveredByDigitalArticleService = false;

  const materialCardTemplate = (material) =>
    templateImageToLeft({
      material,
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
      {manifestationsCorrectMaterialType &&
        !isEmpty(manifestationsCorrectMaterialType) && (
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
