import Translate from "@/components/base/translate";

export function expandtranslations(workType) {
  return {
    // Get workType specific labels if set, else fallback to a general text
    labelTitle: Translate({
      context: "search",
      label: workType ? `label-${workType}-title` : `label-title`,
    }),
    labelCreator: Translate({
      context: "search",
      label: workType ? `label-${workType}-creator` : `label-creator`,
    }),
    labelSubject: Translate({
      context: "search",
      label: workType ? `label-${workType}-subject` : `label-subject`,
    }),
    placeholderTitle: Translate({
      context: "search",
      label: workType ? `label-${workType}-title` : `label-title`,
    }),
    placeholderCreator: Translate({
      context: "search",
      label: workType ? `label-${workType}-creator` : `label-creator`,
    }),
    placeholderSubject: Translate({
      context: "search",
      label: workType ? `label-${workType}-subject` : `label-subject`,
    }),
  };
}
