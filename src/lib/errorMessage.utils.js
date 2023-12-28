export function errorMessageForErrorInMaterialTypes(manifestation) {
  const materialType = manifestation?.materialTypes?.[0];
  const specificDisplay = materialType?.materialTypeSpecific?.display
    ? "\u{2705}"
    : "\u{274C}";
  const specificCode = materialType?.materialTypeSpecific?.code
    ? "\u{2705}"
    : "\u{274C}";
  const generalDisplay = materialType?.materialTypeGeneral?.display
    ? "\u{2705}"
    : "\u{274C}";
  const generalCode = materialType?.materialTypeGeneral?.code
    ? "\u{2705}"
    : "\u{274C}";

  return `--------------
| [BIBDK usage error]: 
|  manifestationFactoryUtils expects use of all materialType fields: 
|  ${specificDisplay}  materialTypeSpecific.display, 
|  ${specificCode}  materialTypeSpecific.code, 
|  ${generalDisplay}  materialTypeGeneral.display, 
|  ${generalCode}  materialTypeGeneral.code
| Maybe you didn't fetch all of these in your graphql fragment?
--------------
`;
}

// TODO call method print error type to console?
// What do we use materialTypeError if we only print this? debugging?
export function materialTypeError(manifestation, errorCount) {
  errorCount++;
  const firstTitleOrWorkIdOrPid =
    (manifestation?.ownerWork?.workId || manifestation?.pid || "") +
    "--" +
    (manifestation?.ownerWork?.titles?.main?.[0] ||
      manifestation?.ownerWork?.titles?.full?.[0] ||
      manifestation?.titles?.main?.[0] ||
      manifestation?.titles?.full?.[0] ||
      "");
  const materialType = manifestation?.materialTypes?.[0];
  if (
    errorCount < 2 &&
    manifestation?.materialTypes?.length > 0 &&
    !(
      materialType?.materialTypeSpecific?.display &&
      materialType?.materialTypeSpecific?.code &&
      materialType?.materialTypeGeneral?.display &&
      materialType?.materialTypeGeneral?.code
    )
  ) {
    console.group(
      `%cBIBDK ERROR: ${firstTitleOrWorkIdOrPid && firstTitleOrWorkIdOrPid}`,
      "color: var(--error-light_temp, #fff3f0); background-color: var(--error_temp, #ba4d57);"
    );
    console.error(`${errorMessageForErrorInMaterialTypes(manifestation)}`);
    console.error(manifestation);
    console.groupEnd();
  }
}
