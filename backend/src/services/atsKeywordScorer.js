const STOP_WORDS = new Set([
  "and","or","the","a","an","with","to","for","of","in","on","by",
  "is","are","as","at","from","this","that"
]);

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
}

export function scoreAtsKeywords(resumeText, jobDescription) {
  const resumeWords = new Set(normalize(resumeText));
  const jdWords = new Set(normalize(jobDescription));

  let matched = 0;
  const missing = [];

  for (const word of jdWords) {
    if (resumeWords.has(word)) matched++;
    else missing.push(word);
  }

  const score = jdWords.size === 0
    ? 0
    : Math.round((matched / jdWords.size) * 100);

  return {
    score,
    matched,
    total: jdWords.size,
    missingKeywords: missing.slice(0, 20) // cap for UI
  };
}
