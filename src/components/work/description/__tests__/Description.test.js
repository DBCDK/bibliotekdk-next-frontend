import { parseCreatorsForInterview } from "../Description";

function creator(display, functionCode) {
  return {
    display,
    roles: [{ functionCode }],
  };
}

describe("parseCreatorsForInterview", () => {
  it("formats an interview with both parties", () => {
    const creators = [
      creator("Niels Vium", "ive"),
      creator("Karoline Kjær Hansen", "ivr"),
    ];

    expect(parseCreatorsForInterview(creators)).toBe(
      "Interview med Niels Vium af Karoline Kjær Hansen"
    );
  });

  it("formats an interview with only interviewers", () => {
    const creators = [creator("Karen Løth Larsen", "ivr")];

    expect(parseCreatorsForInterview(creators)).toBe(
      "Interview lavet af Karen Løth Larsen"
    );
  });

  it("formats an interview with only interviewees", () => {
    const creators = [creator("Niels Vium", "ive")];

    expect(parseCreatorsForInterview(creators)).toBe(
      "Interview med Niels Vium"
    );
  });

  it("separates multiple creators with commas and og", () => {
    const creators = [
      creator("Interviewede 1", "ive"),
      creator("Interviewede 2", "ive"),
      creator("Interviewede 3", "ive"),
      creator("Interviewer 1", "ivr"),
      creator("Interviewer 2", "ivr"),
      creator("Interviewer 3", "ivr"),
    ];

    expect(parseCreatorsForInterview(creators)).toBe(
      "Interview med Interviewede 1, Interviewede 2 og Interviewede 3 af Interviewer 1, Interviewer 2 og Interviewer 3"
    );
  });
});
