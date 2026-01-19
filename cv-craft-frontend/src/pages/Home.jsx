import { useState } from "react";
import { generateCV, previewCV, downloadCV } from "../api/cvApi";
import ResumeForm from "../components/ResumeForm";
import AtsScore from "../components/AtsScore";
import PreviewActions from "../components/PreviewActions";
import Loader from "../components/Loader";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

const handleGenerate = async (data) => {
  setLoading(true);
  setError("");
  setResult(null);

  try {
    const res = await generateCV(data);
    setResult(res.data);
  } catch (err) {
    setError(
      err.response?.data?.error ||
      "Backend unreachable"
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">CV-Craft</h1>

        <ResumeForm onSubmit={handleGenerate} disabled={loading} />

        {loading && <Loader />}

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        {result && (
          <>
            <AtsScore ats={result.atsScore} />
            <PreviewActions
              previewUrl={previewCV(result.cvId)}
              downloadUrl={downloadCV(result.cvId)}
            />
          </>
        )}
      </div>
    </div>
  );
}
