import { motion } from "framer-motion";

export default function AtsScore({ ats }) {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="mt-6"
    >
      <h2 className="text-xl font-semibold">
        ATS Score: {ats.score}%
      </h2>

      <div className="w-full bg-gray-200 h-3 rounded mt-2">
        <div
          className="bg-green-500 h-3 rounded"
          style={{ width: `${ats.score}%` }}
        />
      </div>

      {ats.missingKeywords.length > 0 && (
        <div className="mt-4">
          <p className="font-medium">Missing Keywords:</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {ats.missingKeywords.map((kw) => (
              <span
                key={kw}
                className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
