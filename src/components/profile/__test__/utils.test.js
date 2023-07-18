import { handleMutationUpdates } from "../utils";

const loansAndOrdersMutation = {
  data: null,
  error: null,
  loading: false,
};

describe("handleMutationUpdates", () => {
  it("renewal succeded", () => {
    const actual = handleMutationUpdates(
      true,
      loansAndOrdersMutation,
      (setHasError = jest.fn()),
      (setRenewed = jest.fn()),
      (setRenewedDueDateString = jest.fn())
    );
    const expected = {
      success: true,
      error: false,
      loading: false,
    };
    expect(actual).toEqual(expected);
  });

  it("renewal failed in fbi-api", () => {});
  it("renewal failed in frontend", () => {});
});
