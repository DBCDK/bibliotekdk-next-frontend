import { comparableYear } from "@/lib/utils";
import { manifestationMaterialTypeFactory } from "@/lib/manifestationFactoryUtils";

export function sortManifestations(manifestations) {
  const { manifestationsByType } =
    manifestationMaterialTypeFactory(manifestations);

  return Object.entries(manifestationsByType)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .flatMap((group) =>
      group[1].sort(
        (a, b) =>
          comparableYear(b?.edition?.publicationYear?.display) -
          comparableYear(a?.edition?.publicationYear?.display)
      )
    );
}
