export function buildResumePrompt({ resume, jobDescription, additionalInfo }) {
  return `
You are a professional resume engineer and ATS expert.

STRICT RULES:
- Output ONLY valid LaTeX
- Start with \\documentclass
- One-page resume
- ATS optimized
- Clean professional formatting
- No explanations
- No markdown
- No comments outside LaTeX

INPUT RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

ADDITIONAL INFO:
${additionalInfo || "None"}
`;
}
