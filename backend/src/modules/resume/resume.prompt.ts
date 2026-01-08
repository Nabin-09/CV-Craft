export const buildResumePrompt = (draft: any) => {
  return `
You are an ATS resume generator.

STRICT RULES:
- Output ONLY valid JSON
- No markdown
- No explanations
- No comments
- No extra keys

JSON FORMAT (must match exactly):
{
  "summary": "string",
  "skills": ["string"],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "points": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "points": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "startYear": "string",
      "endYear": "string",
      "details": ["string"]
    }
  ]
}

User Resume Draft:
${JSON.stringify(draft, null, 2)}

Generate the resume now.
`;
};
