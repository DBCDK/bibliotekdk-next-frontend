import Translate from "@/components/base/translate";
import { AccessEnum } from "@/lib/enums";
import { formatMaterialTypesToPresentation } from "@/lib/manifestationFactoryUtils";

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
  [AccessEnum.PUBLIZON](props) {
    return templateProps?.propsForLocalLibrary?.(props);
  },
};

const templateProps = {
  propsForLocalLibrary(props) {
    const isLoggedIn = props?.isAuthenticated;
    const hasValidUrl = props?.agencyUrl;
    const onClick = () => props?.onLoginPrompt();

    const linkProps = !isLoggedIn
      ? { onClick }
      : { href: props?.agencyUrl, target: "_blank", disabled: !hasValidUrl };

    return {
      linkProps,
      linkText: Translate({
        context: "options",
        label: "local-link-title",
        vars: [formatMaterialTypesToPresentation(props?.materialTypesArray)],
      }),
      descriptionText: Translate({
        context: "options",
        label: "local-link-description",
      }),
    };
  },
  propsForOnline(props) {
    return {
      linkProps: { href: props?.url, target: "_blank" },
      linkText: Translate({
        context: "options",
        label: "online-link-title",
        vars: [
          formatMaterialTypesToPresentation(props?.materialTypesArray),
          props?.origin,
        ],
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
