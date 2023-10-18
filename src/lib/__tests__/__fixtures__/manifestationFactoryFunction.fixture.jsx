export const twoSpecificMaterialType_Bog_Ebog = {
  materialTypes: [
    {
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
    },
    {
      materialTypeSpecific: { display: "e-bog", code: "EBOOK" },
      materialTypeGeneral: { display: "e-bøger", code: "EBOOKS" },
    },
  ],
};
export const oneSpecificMaterialType_Bog = {
  materialTypes: [
    {
      materialTypeSpecific: { display: "bog", code: "BOOK" },
      materialTypeGeneral: { display: "bøger", code: "BOOKS" },
    },
  ],
};
export const oneSpecificMaterialType_Ebog = {
  materialTypes: [
    {
      materialTypeSpecific: { display: "e-bog", code: "EBOOK" },
      materialTypeGeneral: { display: "e-bøger", code: "EBOOKS" },
    },
  ],
};

export const combinedMaterialType_GraphicNovel_Tegneserie = {
  materialTypes: [
    {
      materialTypeSpecific: { display: "graphic novel", code: "GRAPHIC_NOVEL" },
      materialTypeGeneral: { display: "tegneserier", code: "COMICS" },
    },
    {
      materialTypeSpecific: { display: "tegneserie", code: "COMIC" },
      materialTypeGeneral: { display: "tegneserier", code: "COMICS" },
    },
  ],
};

export const oneManifestation_bog_ebog = [
  { ...twoSpecificMaterialType_Bog_Ebog, pid: "1bog2ebog" },
];
export const oneManifestation_bog_ebog_v2 = [
  { ...twoSpecificMaterialType_Bog_Ebog, pid: "1bog2ebog_v2" },
];
export const oneManifestation_bog = [
  { ...oneSpecificMaterialType_Bog, pid: "1bog" },
];
export const oneManifestation_bog_v2 = [
  { ...oneSpecificMaterialType_Bog, pid: "1bog_v2" },
];
export const oneManifestation_ebog = [
  { ...oneSpecificMaterialType_Ebog, pid: "1ebog" },
];

export const twoManifestations_bog_ebog__bog = [
  ...oneManifestation_bog_ebog,
  ...oneManifestation_bog,
];

export const fiveManifestations_bog_ebog_x2__bog_x2__ebog_x1 = [
  ...oneManifestation_bog_ebog,
  ...oneManifestation_bog_ebog_v2,
  ...oneManifestation_bog,
  ...oneManifestation_ebog,
  ...oneManifestation_bog_v2,
];

export const grouped5Manifestations_bog_ebog_x2__bog_x2__ebog_x1 = {
  "bog,e-bog": [
    {
      ...twoSpecificMaterialType_Bog_Ebog,
      pid: "1bog2ebog",
      materialTypesArray: [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      materialTypesArraySpecificDisplay: ["bog", "e-bog"],
    },
    {
      ...twoSpecificMaterialType_Bog_Ebog,
      pid: "1bog2ebog_v2",
      materialTypesArray: [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      materialTypesArraySpecificDisplay: ["bog", "e-bog"],
    },
  ],
  bog: [
    {
      ...oneSpecificMaterialType_Bog,
      pid: "1bog",
      materialTypesArray: [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      materialTypesArraySpecificDisplay: ["bog"],
    },
    {
      ...oneSpecificMaterialType_Bog,
      pid: "1bog_v2",
      materialTypesArray: [
        {
          specificDisplay: "bog",
          specificCode: "BOOK",
          generalDisplay: "bøger",
          generalCode: "BOOKS",
        },
      ],
      materialTypesArraySpecificDisplay: ["bog"],
    },
  ],
  "e-bog": [
    {
      ...oneSpecificMaterialType_Ebog,
      pid: "1ebog",
      materialTypesArray: [
        {
          specificDisplay: "e-bog",
          specificCode: "EBOOK",
          generalDisplay: "e-bøger",
          generalCode: "EBOOKS",
        },
      ],
      materialTypesArraySpecificDisplay: ["e-bog"],
    },
  ],
};

export const manifestationFactoryFunctionFixture = [
  {
    pid: "800010-katalog:99121927869605763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog", code: "BOOK" },
        materialTypeGeneral: { display: "bøger", code: "BOOKS" },
      },
    ],
  },
];
