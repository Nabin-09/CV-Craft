import { useState } from "react";
import { motion } from "framer-motion";

export default function ResumeForm({ onSubmit, disabled }) {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();

  onSubmit({
    resume,
    jobDescription,
    additionalInfo
  });
};


  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <textarea
        placeholder="Paste your resume"
        className="w-full h-32 p-3 border rounded"
        required
        onChange={(e) => setResume(e.target.value)}
      />

      <textarea
        placeholder="Paste job description"
        className="w-full h-32 p-3 border rounded"
        required
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <textarea
        placeholder="Additional preferences (optional)"
        className="w-full h-20 p-3 border rounded"
        onChange={(e) => setAdditionalInfo(e.target.value)}
      />

      <button
        disabled={disabled}
        className="bg-black text-white px-6 py-2 rounded disabled:opacity-50"
      >
        Generate CV
      </button>
    </motion.form>
  );
}
