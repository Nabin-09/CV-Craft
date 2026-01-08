import axios from "axios";

interface OllamaResponse {
  response: string;
}

export const callLLM = async (prompt: string) => {
  const res = await axios.post<OllamaResponse>("http://localhost:11434/api/generate", {
    model: "deepseek-r1:1.5b",
    prompt,
    stream: false,
    format: "json" 
  });

  return res.data.response;
};