import {
  formatMaterialTypesToPresentation,
  manifestationMaterialTypeFactory,
} from "@/lib/manifestationFactoryUtils";
import isEmpty from "lodash/isEmpty";
import { getWorkUrl } from "@/lib/utils";
import Text from "@/components/base/text";

export function templateForHeaderWorkCard(input) {
  const fullTitle = input?.titles?.full?.join(": ");
  const firstCreator = input?.creators?.[0]?.display;
  const { flatMaterialTypes } = manifestationMaterialTypeFactory([input]);
  const formattedMaterialTypes =
    formatMaterialTypesToPresentation(flatMaterialTypes);

  const edition = [
    input?.edition?.edition,
    input?.edition?.publicationYear?.display,
  ]
    .filter((el) => !isEmpty(el))
    .join(", ");

  return {
    link_href: getWorkUrl(fullTitle, firstCreator, input?.ownerWork?.workId),
    fullTitle: fullTitle,
    image_src: input.cover.detail,
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

export function templateForRelatedWorks(input) {
  const fullTitle = input?.titles?.full?.join(": ");
  const firstCreator = input?.creators?.[0]?.display;
  const formattedMaterialTypes = formatMaterialTypesToPresentation(
    input?.materialTypesArray
  );

  return {
    link_href: getWorkUrl(fullTitle, firstCreator, input?.workId),
    fullTitle: fullTitle,
    image_src: input?.cover?.detail,
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
