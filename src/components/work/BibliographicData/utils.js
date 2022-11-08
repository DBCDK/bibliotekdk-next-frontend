import { comparableYear, flattenWord, indexInArray } from "@/lib/utils";
import groupBy from "lodash/groupBy";

export const prettyAndOrderedMaterialTypesEnum = Object.freeze({
  [flattenWord("Bog")]: "Bog",
  [flattenWord("E-bog")]: "E-bog",
  [flattenWord("Lydbog (net)")]: "Lydbog (net)",
  [flattenWord("Lydbog (cd-mp3)")]: "Lydbog (cd-mp3)",
  [flattenWord("Lydbog (cd)")]: "Lydbog (cd)",
  [flattenWord("Lydbog (bånd)")]: "Lydbog (bånd)",
});

export function sortManifestations(manifestations) {
  // materialType type priority list (for books only)
  const groupOrder = Object.keys(prettyAndOrderedMaterialTypesEnum);

  return Object.entries(groupBy(manifestations, "materialTypes[0].specific"))
    .sort(
      (a, b) => indexInArray(groupOrder, a[0]) - indexInArray(groupOrder, b[0])
    )
    .flatMap((group) =>
      group[1].sort(
        (a, b) =>
          comparableYear(b?.edition?.publicationYear?.display) -
          comparableYear(a?.edition?.publicationYear?.display)
      )
    );
}
