import { ResumeDraft } from "../../models/resumeDraft.model";
import { Resume } from "../../models/resume.model";
import { buildResumePrompt } from "./resume.prompt";
import { callLLM } from "../../config/llm";

export const generateResume = async (userId: string) => {
  const draft = await ResumeDraft.findOne({ userId });
  if (!draft) throw new Error("DRAFT_NOT_FOUND");

  const prompt = buildResumePrompt(draft);

  let output;
  let attempts = 0;
  const maxAttempts = 2; // Rule: Retry once on malformed JSON

  while (attempts < maxAttempts) {
    try {
      const llmRawResponse = await callLLM(prompt);
      // DeepSeek-R1 sometimes wraps JSON in thought tags; JSON mode handles this.
      output = typeof llmRawResponse === "string" ? JSON.parse(llmRawResponse) : llmRawResponse;
      break; 
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) throw new Error("LLM_ERROR");
      console.warn(`DeepSeek attempt ${attempts} failed, retrying...`);
    }
  }

  // Create document in MongoDB
  return await Resume.create({
    userId,
    sourceDraftId: draft._id,
    atsResume: output
  });
};