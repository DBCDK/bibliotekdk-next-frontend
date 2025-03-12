export function manifestationsByIssue(works) {
  /**
   * We want a map of issues like:
   * {"Årg. 43 (1962)": [manifestations]}
   */
  // console.log(works, "WORKS");
  const issueMap = {};

  works?.forEach((work) => {
    work?.manifestations?.all?.forEach((manifestation) => {
      const key = manifestation?.hostPublication?.issue;
      if (issueMap[key]) {
        issueMap[key].push(manifestation);
      } else {
        issueMap[key] = [manifestation];
      }
    });
  });

  return issueMap;
}
