/**
 * @file
 * The file for handling the materialType enums.
 * The order of the {@link MaterialTypeOrderEnum} is
 * based on the work of the User Experience Designer
 * and is subject for gradual change
 */

export const MaterialTypeEnum = Object.freeze({
  BOG: "bog",
  EBOG: "e-bog",
  "LYDBOG (NET)": "lydbog (net)",
  "LYDBOG (CD-MP3)": "lydbog (cd-mp3)",
  "LYDBOG (CD)": "Lydbog (cd)",
  "LYDBOG (BÅND)": "lydbog (bånd)",
});

/**
 * Used for the few places in the code where we need to check on MaterialTypeGeneral.
     This should be extended whenever we need to know new general MaterialTypes
 * @type {Readonly<{EBOOKS: {code: string, display: string}, AUDIO_BOOKS: {code: string, display: string}, BOOKS: {code: string, display: string}}>}
 */
export const MaterialTypeGeneralEnum = Object.freeze({
  BOOKS: { display: "bøger", code: "BOOKS" },
  EBOOKS: { display: "e-bøger", code: "EBOOKS" },
  AUDIO_BOOKS: { display: "lydbøger", code: "AUDIO_BOOKS" },
});

/* This */
export const MaterialTypeOrderEnum = Object.freeze({
  LITERATURE: {
    BOG: { display: "bog", code: "BOOK" },
    EBOG: { display: "e-bog", code: "EBOOK" },
    "LYDBOG (ONLINE)": {
      display: "lydbog (online)",
      code: "AUDIO_BOOK_ONLINE",
    },
    "LYDBOG (CD-MP3)": {
      display: "lydbog (cd-mp3)",
      code: "AUDIO_BOOK_CD_MP3",
    },
    "LYDBOG (CD)": { display: "lydbog (cd)", code: "AUDIO_BOOK_CD" },
    BILLEDBOG: { display: "billedbog", code: "PICTURE_BOOK" },
    "BILLEDBOG ONLINE": {
      display: "billedbog (online)",
      code: "PICTURE_BOOK_ONLINE",
    },
    "GRAPHIC NOVEL": { display: "graphic novel", code: "GRAPHIC_NOVEL" },
    TEGNESERIE: { display: "tegneserie", code: "COMIC" },
    "BOG STOR SKRIFT": { display: "bog stor skrift", code: "BOOK_LARGE_PRINT" },
  },
  MOVIE: {
    "FILM (ONLINE)": { display: "film (online)", code: "FILM_ONLINE" },
    "FILM (DVD)": { display: "film (dvd)", code: "FILM_DVD" },
    "FILM (BLU-RAY)": { display: "film (blu-ray)", code: "FILM_BLURAY" },
    "FILM (BLU-RAY 4K)": {
      display: "film (blu-ray 4K)",
      code: "FILM_BLURAY_4K",
    },
    "FILM (BLU-RAY 3D)": {
      display: "film (blu-ray 3D)",
      code: "FILM_BLURAY_3D",
    },
  },
  MUSIC: {
    "MUSIK (CD)": { display: "musik (cd)", code: "MUSIC_CD" },
    "MUSIC GRAMMOFONPLADE": {
      display: "musik (grammofonplade)",
      code: "MUSIC_GRAMOPHONE",
    },
  },
  SHEETMUSIC: {
    "NODE (ONLINE)": { display: "node (online)", code: "SHEET_MUSIC_ONLINE" },
    NODE: { display: "node", code: "SHEET_MUSIC" },
    "NODE (CD)": { display: "node (cd)", code: "SHEET_MUSIC_CD" },
  },
  GAME: {
    "PLAYSTATION 5": { display: "playstation 5", code: "PLAYSTATION_5" },
    "PLAYSTATION 4": { display: "playstation 4", code: "PLAYSTATION_4" },
    "PLAYSTATION 3": { display: "playstation 3", code: "PLAYSTATION_3" },
    PLAYSTATION: { display: "playstation", code: "PLAYSTATION" },
    "XBOX SERIES X": { display: "xbox series x", code: "XBOX_SERIES_X" },
    "XBOX ONE": { display: "xbox one", code: "XBOX_ONE" },
    "XBOX 360": { display: "xbox 360", code: "XBOX_360" },
    XBOX: { display: "xbox 360", code: "XBOX" },
    COMPUTERSPIL: { display: "computerspil", code: "COMPUTER_GAME" },
    "NINTENDO SWITCH": { display: "nintendo switch", code: "NINTENDO_SWITCH" },
    WII: { display: "wii", code: "WII" },
  },
});

export function prioritiseByWorkType(a, b, workTypes) {
  const indexA = workTypes.findIndex((workType) => a[0] === workType);
  const indexB = workTypes.findIndex((workType) => b[0] === workType);

  const indexAFilterNull = indexA === -1 ? workTypes.length : indexA;
  const indexBFilterNull = indexB === -1 ? workTypes.length : indexB;

  return indexAFilterNull - indexBFilterNull;
}

/**
 * Order for materialTypes
 * @param {Array.<string>} workTypes
 * @param {Object} materialTypeEnum
 * @returns {Array.<{display: SpecificDisplay, code: SpecificCode}>}
 */
export function getOrderedFlatMaterialTypes(
  workTypes = [],
  materialTypeEnum = MaterialTypeOrderEnum
) {
  return Object.entries(materialTypeEnum)
    .sort((a, b) => prioritiseByWorkType(a, b, workTypes))
    .flatMap((mat) => Object.values(mat[1]));
}
