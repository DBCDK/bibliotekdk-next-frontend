import Translate from "@/components/base/translate";

export function openLocalizationsModal(modal, pids, workId, materialType) {
  modal.push("localizations", {
    title: Translate({ context: "modal", label: "title-order" }),
    pids: pids,
    workId: workId,
    materialType: materialType,
  });
}

export function openOrderModal(
  modal,
  workId,
  singleManifestation,
  manifestation
) {
  modal.push("order", {
    title: Translate({ context: "modal", label: "title-order" }),
    pid: manifestation.pid,
    workId: workId,
    type: manifestation.materialTypes.specific,
    ...(singleManifestation && { orderType: "singleManifestation" }),
  });
}

export function openReferencesModal(modal, pids, workId, work, manifestation) {
  modal.push("references", {
    title: Translate({
      context: "references",
      label: "label_references_title",
    }),
    pids: pids,
    workId: workId,
    manifestation: manifestation,
  });
}

export function onOnlineAccess(url, target = "_blank") {
  window.open(url, target);
}
