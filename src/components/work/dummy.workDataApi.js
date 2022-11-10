export function dummy_workDataApi({ workId }) {
  const response = {
    [workId]: {
      work: {
        manifestations: {
          all: [
            {
              accessTypes: { code: "ONLINE" },
              access: [{ loginRequired: true, __typename: "InfomediaService" }],
              materialTypes: [{ specific: "avisartikel" }],
            },
          ],
        },
        workTypes: ["LITERATURE"],
      },
    },
  };

  // WorkId or type was not found
  if (!workId) {
    return {};
  }

  return response[workId];
}
