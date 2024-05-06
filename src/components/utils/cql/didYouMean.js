/**
 * Measure Levenshtein distance between two strings
 * With some extra normalization and startsWith, includes
 *
 * Partly provided by ChatGPT
 */
function normalizedLevenshteinDistance(s, t) {
  const lenS = s.length,
    lenT = t.length;
  const maxLen = Math.max(lenS, lenT);
  if (maxLen === 0) return 0; // Hvis begge strenge er tomme, er afstanden 0

  if (t.startsWith(s)) {
    return 0.1;
  }
  if (t.includes(s)) {
    return 0.2;
  }

  const matrix = Array.from({ length: lenS + 1 }, () => Array(lenT + 1));
  for (let i = 0; i <= lenS; i++) matrix[i][0] = i;
  for (let j = 0; j <= lenT; j++) matrix[0][j] = j;

  for (let i = 1; i <= lenS; i++) {
    for (let j = 1; j <= lenT; j++) {
      const cost = s[i - 1] === t[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // sletning
        matrix[i][j - 1] + 1, // indsættelse
        matrix[i - 1][j - 1] + cost // erstatning
      );
    }
  }

  return matrix[lenS][lenT] / maxLen; // Returner den normaliserede Levenshtein-afstand
}

/**
 * Find similar strings in an array of strings
 */
export function didYouMean(str, strCollection = []) {
  if (strCollection instanceof Set) {
    strCollection = Array.from(strCollection);
  }
  const lowercased = str.toLowerCase();
  const res = strCollection.map((str2) => ({
    value: str2,
    score: normalizedLevenshteinDistance(lowercased, str2.toLowerCase()),
  }));

  res.sort((a, b) => a.score - b.score);
  return res.filter((entry) => entry.score < 0.5).slice(0, 5);
}
