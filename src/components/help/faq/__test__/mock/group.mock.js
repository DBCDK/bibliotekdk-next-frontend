const data = {
  faq: {
    count: 4,
    entities: [
      {
        langcode: {
          value: "en",
        },
        nid: 30,
        title: "abc",
        promote: false,
        body: {
          value: "<p>This faq goes first in the group ...</p>",
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
        title: "ghi",
        promote: true,
        body: {
          value: "<p>This faq goes last in the group ...</p>",
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
          value: "en",
        },
        nid: 31,
        title: "def",
        promote: true,
        body: {
          value: "<p>This faq goes second in the group ...</p>",
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
        title: "def",
        promote: false,
        body: {
          value: "<p>This faq goes last in the group ...</p>",
        },
        fieldTags: [],
      },
      {
        langcode: {
          value: "da",
        },
        nid: 32,
        title: "abc",
        promote: false,
        body: {
          value: "<p>This faq goes first in the group ...</p>",
        },
        fieldTags: [],
      },
      {
        langcode: {
          value: "en",
        },
        nid: 31,
        title: "abc",
        promote: true,
        body: {
          value: "<p>This faq goes first in the group...</p>",
        },
        fieldTags: [
          {
            entity: {
              entityLabel: "Søgninger",
            },
          },
        ],
      },
    ],
  },
};

export default data;
