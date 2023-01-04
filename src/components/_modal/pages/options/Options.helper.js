import Translate from "@/components/base/translate";
import { AccessEnum } from "@/lib/enums";

export const getTemplateProps = {
  [AccessEnum.ACCESS_URL](props) {
    return templateProps?.propsForOnline?.(props);
  },
  [AccessEnum.INFOMEDIA_SERVICE](props) {
    return templateProps?.propsForInfomedia?.(props);
  },
  [AccessEnum.DIGITAL_ARTICLE_SERVICE](props) {
    return templateProps?.propsForOnlineOrderLink?.(props);
  },
  [AccessEnum.EREOL](props) {
    return templateProps?.propsForOnline?.(props);
  },
  [AccessEnum.INTER_LIBRARY_LOAN](props) {
    return templateProps?.propsForPhysicalOrderLink?.(props);
  },
};

const templateProps = {
  propsForOnline(props) {
    return {
      linkProps: { href: props?.url, target: "_blank" },
      linkText: Translate({
        context: "options",
        label: "online-link-title",
        vars: [props?.materialTypesArray?.join("/"), props?.origin],
      }),
      descriptionText: Translate({
        context: "options",
        label: "online-link-description",
        vars: [props?.origin],
      }),
    };
  },
  propsForInfomedia(props) {
    return {
      linkProps: { href: props?.url, target: "_self" },
      linkText: Translate({
        context: "options",
        label: "infomedia-link-title",
      }),
      descriptionText: Translate({
        context: "options",
        label: "infomedia-link-description",
        vars: ["infomedia"],
      }),
    };
  },
  propsForOnlineOrderLink(props) {
    return {
      linkProps: {
        onClick: () => {
          props?.onOrder();
        },
      },
      linkText: Translate({
        context: "options",
        label: "digital-copy-link-title",
      }),
      descriptionText: Translate({
        context: "options",
        label: "digital-copy-link-description",
      }),
    };
  },
  propsForPhysicalOrderLink(props) {
    return {
      linkProps: {
        onClick: () => {
          props?.onOrder();
        },
      },
      linkText: Translate({
        context: "options",
        label: "order-physical-copy",
      }),
      descriptionText: Translate({
        context: "options",
        label: "order-physical-copy-description",
      }),
    };
  },
};

// quickfix dfi is not a 'real' url - @TODO do a proper fix
export function specialSort(a, b) {
  // fjernleje should be on top
  if (b.url && b.url.indexOf("dfi.dk") !== -1) {
    return -1;
  } else if (a.url && a.url.indexOf("dfi.dk") !== -1) {
    return 1;
  }
  return 0;
}
