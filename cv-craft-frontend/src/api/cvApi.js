import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/cv",
  timeout: 20000 // XeLaTeX can take time
});

export const generateCV = (payload) =>
  API.post("/generate", payload);

export const previewCV = (cvId) =>
  `http://localhost:3000/api/cv/preview/${cvId}`;

export const downloadCV = (cvId) =>
  `http://localhost:3000/api/cv/download/${cvId}`;
