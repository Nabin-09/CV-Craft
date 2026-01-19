import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div
      className="mt-4 text-gray-600"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
    >
      Generating ATS-optimized resume…
    </motion.div>
  );
}
