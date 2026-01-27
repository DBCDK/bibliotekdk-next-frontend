export const SPECIFIC_FALLBACKS = {
  bog: ["e-bog"],
  billedbog: ["e-bog"],
  punktskrift: ["lydbog (online)"],
};

const hasPublizonSample = (m) =>
  m?.access?.some((a) => a?.__typename === "Publizon" && a?.sample);

export function selectPublizonSample(manifestations = [], selectedDisplay) {
  if (!manifestations.length) return null;

  const findFirst = (list) => list?.find?.(hasPublizonSample) || null;

  if (!selectedDisplay) {
    return findFirst(manifestations);
  }

  const display = String(selectedDisplay);
  const selected = manifestations.filter((m) =>
    m?.materialTypes?.some(
      (mt) => mt?.materialTypeSpecific?.display === display
    )
  );

  const mappedDisplays = SPECIFIC_FALLBACKS[display] || [];
  const mapped =
    mappedDisplays.length > 0
      ? manifestations.filter((m) =>
          m?.materialTypes?.some((mt) =>
            mappedDisplays.includes(mt?.materialTypeSpecific?.display)
          )
        )
      : [];

  const generalCodes = new Set();
  selected.forEach((m) =>
    m?.materialTypes?.forEach((mt) => {
      if (mt?.materialTypeGeneral?.code) {
        generalCodes.add(mt.materialTypeGeneral.code);
      }
    })
  );

  const sameGeneral =
    generalCodes.size > 0
      ? manifestations.filter((m) =>
          m?.materialTypes?.some((mt) =>
            generalCodes.has(mt?.materialTypeGeneral?.code)
          )
        )
      : [];

  return (
    findFirst(selected) || findFirst(mapped) || findFirst(sameGeneral) || null
  );
}
