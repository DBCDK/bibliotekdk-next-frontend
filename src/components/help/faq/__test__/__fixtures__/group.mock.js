const data = {
  bibliotekdkCms: {
    faqs: [
      {
        documentId: "doc-30",
        title: "abc",
        promoted: false,
        body: "<p>This faq goes first in the group ...</p>",
        categories: [{ name: "Bestillinger" }],
      },
      {
        documentId: "doc-31a",
        title: "ghi",
        promoted: true,
        body: "<p>This faq goes last in the group ...</p>",
        categories: [{ name: "Søgninger" }],
      },
      {
        documentId: "doc-31b",
        title: "def",
        promoted: true,
        body: "<p>This faq goes second in the group ...</p>",
        categories: [{ name: "Søgninger" }],
      },
      {
        documentId: "doc-32a",
        title: "def",
        promoted: false,
        body: "<p>This faq goes last in the group ...</p>",
        categories: null,
      },
      {
        documentId: "doc-32b",
        title: "abc",
        promoted: false,
        body: "<p>This faq goes first in the group ...</p>",
        categories: null,
      },
      {
        documentId: "doc-31c",
        title: "abc",
        promoted: true,
        body: "<p>This faq goes first in the group...</p>",
        categories: [{ name: "Søgninger" }],
      },
    ],
  },
};

export default data;
