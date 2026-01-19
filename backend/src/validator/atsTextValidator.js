import { exec } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Validate that ATS can extract meaningful text
 */
export function validateAtsText(pdfPath) {
  return new Promise((resolve, reject) => {
    const workDir = path.dirname(pdfPath);
    const txtPath = path.join(workDir, "resume.txt");

    exec(
      `pdftotext resume.pdf resume.txt`,
      { cwd: workDir, timeout: 5000 },
      (err) => {
        if (err) {
          return reject(
            new Error("ATS text extraction failed (pdftotext)")
          );
        }

        if (!fs.existsSync(txtPath)) {
          return reject(new Error("ATS text file not generated"));
        }

        const text = fs.readFileSync(txtPath, "utf8").trim();

        if (text.length < 300) {
          return reject(
            new Error("Extracted ATS text too short (possible font or layout issue)")
          );
        }

        if (looksCorrupted(text)) {
          return reject(
            new Error("ATS text appears corrupted or non-readable")
          );
        }

        resolve(text);
      }
    );
  });
}

/**
 * Heuristic checks for garbage ATS output
 */
function looksCorrupted(text) {
  const nonAsciiRatio =
    text.replace(/[\x00-\x7F]/g, "").length / text.length;

  if (nonAsciiRatio > 0.15) return true;

  if (!text.match(/[A-Za-z]{3,}/)) return true;

  return false;
}
