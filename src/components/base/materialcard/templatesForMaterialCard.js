import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import { getWorkUrl } from "@/lib/utils";
import Text from "@/components/base/text";

export function templateForHeaderWorkCard(material) {
  const fullTitle = material?.titles?.full?.join(": ");
  const firstCreator = material?.creators?.[0]?.display;
  const { flatMaterialTypes } = manifestationMaterialTypeFactory([material]);
  const formattedMaterialTypes =
    formatMaterialTypesToPresentation(flatMaterialTypes);

  const edition = [
    material?.edition?.edition,
    material?.edition?.publicationYear?.display,
  ]
    .filter((el) => !isEmpty(el))
    .join(", ");

  return {
    link_href: getWorkUrl(fullTitle, firstCreator, material?.ownerWork?.workId),
    fullTitle: fullTitle,
    image_src: material.cover.detail,
    children: (
      <>
        <Text
          data_display={"inline"}
          clamp={true}
          type={"text4"}
          lines={2}
          title={fullTitle}
        >
          {fullTitle}
        </Text>
        <Text
          data_display={"inline"}
          clamp={true}
          type={"text3"}
          lines={2}
          title={firstCreator}
        >
          {firstCreator}
        </Text>
        <Text
          data_display={"inline"}
          clamp={true}
          type={"text3"}
          lines={1}
          title={formattedMaterialTypes}
        >
          {formattedMaterialTypes}
        </Text>
        <Text
          data_display={"inline"}
          clamp={true}
          type={"text3"}
          lines={1}
          title={edition}
        >
          {edition}
        </Text>
      </>
    ),
  };
}

export function templateForRelatedWorks(material) {
  const fullTitle = material?.titles?.full?.join(": ");
  const firstCreator = material?.creators?.[0]?.display;
  const formattedMaterialTypes = formatMaterialTypesToPresentation(
    material?.materialTypesArray
  );

  return {
    link_href: getWorkUrl(fullTitle, firstCreator, material?.workId),
    fullTitle: fullTitle,
    image_src: material?.cover?.detail,
    children: (
      <>
        <Text
          data_display={"inline"}
          clamp={true}
          type={"text4"}
          lines={2}
          title={fullTitle}
        >
          {fullTitle}
        </Text>
        <Text
          data_display={"inline"}
          clamp={true}
          type={"text3"}
          lines={2}
          title={firstCreator}
        >
          {firstCreator}
        </Text>
        <Text
          data_display={"inline"}
          clamp={true}
          type={"text3"}
          lines={1}
          title={formattedMaterialTypes}
        >
          {formattedMaterialTypes}
        </Text>
      </>
    ),
  };
}
