import { compileLatex } from "./latex.service.js";
import { scoreAtsKeywords } from "./atsKeywordScorer.js";
import { detectHallucinations } from "./hallucinationGuard.js";
import { enforcePdfSize } from "./pdfGuard.js";

export async function generateResumePipeline({
  latex,
  resumeSource,
  jobDescription
}) {
  // 1. Hallucination detection
  detectHallucinations(latex, resumeSource);

  // 2. Compile LaTeX → PDF + ATS text
  const { id, pdfPath, atsText } = await compileLatex(latex);

  // 3. PDF guard (1-page, size limits)
  enforcePdfSize(pdfPath);

  // 4. ATS keyword scoring
  const atsScore = scoreAtsKeywords(
    atsText,
    jobDescription
  );

  return {
    id,
    pdfPath,
    atsScore
  };
}
