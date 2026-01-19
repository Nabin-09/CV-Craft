import axios from "axios";
import { buildResumePrompt } from "../utils/promptBuilder.js";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function generateCV(data) {
  const prompt = buildResumePrompt(data);

  const response = await axios.post(
    GROQ_URL,
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const output = response.data.choices[0].message.content;

  if (!output.trim().startsWith("\\documentclass")) {
    throw new Error("Model did not return valid LaTeX");
  }

  return output;
}
