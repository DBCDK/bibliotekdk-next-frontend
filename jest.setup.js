jest.mock("get-browser-fingerprint", () => {
  return jest.fn(() => "mocked-fingerprint");
});
