// utils/selectPublizonSample.js

// Udvidbart map: valgt display → alternative materialTypeSpecific.display
export const SPECIFIC_FALLBACKS = {
  bog: ["e-bog"],
  punktskrift: ["lydbog (online)"],
};

const hasPublizonSample = (m) =>
  m?.access?.some((a) => a?.__typename === "Publizon" && a?.sample);

export function selectPublizonSample(manifestations = [], selectedDisplay) {
  if (!manifestations.length) return null;

  const findFirst = (list) => list?.find?.(hasPublizonSample) || null;

  // Hvis der ikke er valgt type i URL:
  // → bare første manifestation med Publizon-sample
  if (!selectedDisplay) {
    return findFirst(manifestations);
  }

  const display = String(selectedDisplay);

  // 1) Manifestationer med den *valgte* materialTypeSpecific.display
  const selected = manifestations.filter((m) =>
    m?.materialTypes?.some(
      (mt) => mt?.materialTypeSpecific?.display === display
    )
  );

  // 2) Manifestationer med mapped display (fx "bog" → "e-bog")
  const mappedDisplays = SPECIFIC_FALLBACKS[display] || [];
  const mapped =
    mappedDisplays.length > 0
      ? manifestations.filter((m) =>
          m?.materialTypes?.some((mt) =>
            mappedDisplays.includes(mt?.materialTypeSpecific?.display)
          )
        )
      : [];

  // 3) Manifestationer med samme materialTypeGeneral som den valgte
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

  // VIGTIGT:
  // - EBOOKS vil kun ende i "sameGeneral" → altså kun andre EBOOKS
  // - ingen global fallback, så vi hopper ikke over i andre generaltyper
  return (
    findFirst(selected) || findFirst(mapped) || findFirst(sameGeneral) || null
  );
}
