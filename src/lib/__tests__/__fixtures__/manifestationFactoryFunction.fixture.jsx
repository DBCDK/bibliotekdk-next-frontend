export const twoSpecificMaterialType_Bog_Ebog = {
  materialTypes: [
    { materialTypeSpecific: { display: "bog" } },
    { materialTypeSpecific: { display: "ebog" } },
  ],
};
export const oneSpecificMaterialType_Bog = {
  materialTypes: [{ materialTypeSpecific: { display: "bog" } }],
};
export const oneSpecificMaterialType_Ebog = {
  materialTypes: [{ materialTypeSpecific: { display: "ebog" } }],
};

export const combinedMaterialType_GraphicNovel_Tegneserie = {
  materialTypes: [
    {
      materialTypeSpecific: { display: "graphic novel" },
    },
    {
      materialTypeSpecific: { display: "tegneserie" },
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
  "bog,ebog": [
    {
      ...twoSpecificMaterialType_Bog_Ebog,
      pid: "1bog2ebog",
      materialTypesArray: ["bog", "ebog"],
    },
    {
      ...twoSpecificMaterialType_Bog_Ebog,
      pid: "1bog2ebog_v2",
      materialTypesArray: ["bog", "ebog"],
    },
  ],
  bog: [
    {
      ...oneSpecificMaterialType_Bog,
      pid: "1bog",
      materialTypesArray: ["bog"],
    },
    {
      ...oneSpecificMaterialType_Bog,
      pid: "1bog_v2",
      materialTypesArray: ["bog"],
    },
  ],
  ebog: [
    {
      ...oneSpecificMaterialType_Ebog,
      pid: "1ebog",
      materialTypesArray: ["ebog"],
    },
  ],
};

export const manifestationFactoryFunctionFixture = [
  {
    pid: "800010-katalog:99121927869605763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99121958774705763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99121965799405763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99121990289305763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122020792605763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122031697405763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122041472705763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122066805205763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122085555705763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122097900805763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122136012005763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122160496305763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122195528105763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122211212305763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122218481805763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122223913405763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122241315805763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122241499305763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122299591805763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122336294105763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122368097905763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122445117305763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122474588605763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122507185805763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122507215205763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122528721905763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122540145105763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122552438905763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122553708605763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122582581705763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122623646005763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122680129805763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122719138105763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122732646505763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122750236905763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122760982005763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122772718805763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122776420905763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122798903205763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122803162405763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122832036905763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122873393905763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122881921505763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122908064605763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122933373105763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122936842105763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122936995705763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122937055305763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122957410205763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "800010-katalog:99122958912205763",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "820030-katalog:514235",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "830060-katalog:991000282869703861",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "830690-katalog:25525558",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:00955892",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:01121820",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:01121847",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:01121863",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:02772116",
    materialTypes: [
      {
        materialTypeSpecific: { display: "dias" },
      },
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
    ],
  },
  {
    pid: "870970-basis:03330680",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
    ],
  },
  {
    pid: "870970-basis:04224566",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:05134226",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:05216621",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:05839165",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:06113559",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:06328598",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:06570704",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:06641342",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:06961797",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:06998577",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:07092989",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:08177473",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:20336390",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
    ],
  },
  {
    pid: "870970-basis:20847301",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:20993863",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:21043788",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:21471488",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:22888641",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:22913174",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:22913190",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lyd (cd)" },
      },
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:23195690",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:23387212",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:23780631",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:25246667",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:25421914",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
    ],
  },
  {
    pid: "870970-basis:25425340",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lyd (cd)" },
      },
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:25425383",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (bånd)" },
      },
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:25454928",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:25464605",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:25509749",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:25525558",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:25551109",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:25661362",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lyd (cd)" },
      },
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:25683706",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:25733347",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:25988019",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:26092876",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:26564131",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog (net)" },
      },
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:27934366",
    materialTypes: [
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:28089341",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:28162456",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:28533349",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (net)" },
      },
    ],
  },
  {
    pid: "870970-basis:29536538",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog (net)" },
      },
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:38563092",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (net)" },
      },
    ],
  },
  {
    pid: "870970-basis:38827685",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:40142835",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:41860618",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:46361741",
    materialTypes: [
      {
        materialTypeSpecific: { display: "lydbog (net)" },
      },
    ],
  },
  {
    pid: "870970-basis:49160542",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:50593924",
    materialTypes: [
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:50599582",
    materialTypes: [
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:52091306",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:52686776",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:53322166",
    materialTypes: [
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:53600905",
    materialTypes: [
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:53709486",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:53774245",
    materialTypes: [
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:54031645",
    materialTypes: [
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:54082916",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:54141386",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "870970-basis:54257775",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "870970-basis:54681291",
    materialTypes: [
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "870970-basis:54956797",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog (net)" },
      },
      {
        materialTypeSpecific: { display: "ebog" },
      },
    ],
  },
  {
    pid: "911116-katalog:05839165",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "911116-katalog:25683706",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "911116-katalog:28162456",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
  {
    pid: "911116-katalog:38827685",
    materialTypes: [
      {
        materialTypeSpecific: { display: "bog" },
      },
    ],
  },
  {
    pid: "911116-katalog:52686776",
    materialTypes: [
      {
        materialTypeSpecific: { display: "billedbog" },
      },
    ],
  },
];
