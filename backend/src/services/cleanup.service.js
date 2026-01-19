import fs from "fs";
import path from "path";

const TMP_DIR = path.join(process.cwd(), "tmp");
const MAX_AGE = 1000 * 60 * 30; // 30 minutes

export function cleanupOldFiles() {
  if (!fs.existsSync(TMP_DIR)) return;

  const now = Date.now();

  fs.readdirSync(TMP_DIR).forEach(dir => {
    const fullPath = path.join(TMP_DIR, dir);
    const stats = fs.statSync(fullPath);

    if (now - stats.mtimeMs > MAX_AGE) {
      fs.rmSync(fullPath, { recursive: true, force: true });
    }
  });
}
