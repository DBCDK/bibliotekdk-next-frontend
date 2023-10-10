import isEmpty from "lodash/isEmpty";
import Translate from "@/components/base/translate";

export function getAudienceValues(audience, context = { context: "details" }) {
  return !isEmpty(audience?.ages)
    ? audience.ages
        .map((age) => {
          return Translate({
            ...context,
            label: "audience-age",
            vars: [age.display],
          });
        })
        .join(", ")
    : !isEmpty(audience?.generalAudience)
    ? audience?.generalAudience.join(", ")
    : !isEmpty(audience?.libraryRecommendation)
    ? audience?.libraryRecommendation.map((child) => child.display).join(", ")
    : !isEmpty(audience?.primaryTarget)
    ? audience?.primaryTarget.map((child) => child.display).join(", ")
    : null;
}
