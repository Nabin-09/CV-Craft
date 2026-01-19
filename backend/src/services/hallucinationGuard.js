export function detectHallucinations(resumeLatex, sourceResume) {
  const latexText = resumeLatex
    .replace(/\\[a-zA-Z]+\{.*?\}/g, " ")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .toLowerCase();

  const sourceText = sourceResume.toLowerCase();

  const suspicious = [];

  const patterns = [
    /\b(phd|doctorate)\b/,
    /\b(ex-google|ex-meta|ex-amazon)\b/,
    /\b(10\+ years|15\+ years)\b/
  ];

  for (const p of patterns) {
    if (p.test(latexText) && !p.test(sourceText)) {
      suspicious.push(p.source);
    }
  }

  if (suspicious.length > 0) {
    throw new Error(
      "Possible hallucinated claims detected"
    );
  }
}
