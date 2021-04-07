const data = {
  faq: {
    count: 4,
    entities: [
      {
        langcode: {
          value: "en",
        },
        nid: 30,
        title: "def",
        promote: false,
        body: {
          value: "<p>This faq goes next ...</p>",
        },
        fieldTags: [
          {
            entity: {
              entityLabel: "Bestillinger",
            },
          },
        ],
      },
      {
        langcode: {
          value: "en",
        },
        nid: 31,
        title: "abc",
        promote: true,
        body: {
          value: "<p>This faq goes first ...</p>",
        },
        fieldTags: [
          {
            entity: {
              entityLabel: "Søgninger",
            },
          },
        ],
      },
      {
        langcode: {
          value: "da",
        },
        nid: 32,
        title: "jkl",
        promote: false,
        body: {
          value: "<p>This faq goes last ...</p>",
        },
        fieldTags: [],
      },
      {
        langcode: {
          value: "en",
        },
        nid: 38,
        title: "ghi",
        promote: false,
        body: {
          value: "<p>This faq goes third</p>",
        },
        fieldTags: [],
      },
    ],
  },
};

export default data;
