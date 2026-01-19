import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { validateAtsText } from "../validator/atsTextValidator.js";

const TMP_DIR = path.join(process.cwd(), "tmp");

const FORBIDDEN_PACKAGES = [
  "marvosym",
  "fontspec",
  "fontawesome",
  "lastpage"
];

const LATEX_TIMEOUT = 15000;

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

/* -------------------- VALIDATIONS -------------------- */

function validateLatexPackages(latex) {
  for (const pkg of FORBIDDEN_PACKAGES) {
    const regex = new RegExp(
      `\\\\usepackage\\s*(\\[[^\\]]*\\])?\\{${pkg}\\}`,
      "i"
    );
    if (regex.test(latex)) {
      throw new Error(`Forbidden LaTeX package detected: ${pkg}`);
    }
  }
}

function validateLatexStructure(latex) {
  const trimmed = latex.trim();

  if (!trimmed.startsWith("\\documentclass")) {
    throw new Error("LaTeX must start with \\documentclass");
  }

  if (!trimmed.includes("\\begin{document}")) {
    throw new Error("Missing \\begin{document}");
  }

  if (!trimmed.endsWith("\\end{document}")) {
    throw new Error("LaTeX must end with \\end{document}");
  }
}

/* -------------------- PUBLIC API -------------------- */

export async function compileLatex(latex, aiFixFn = null) {
  let currentLatex = latex;
  let lastError = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      validateLatexPackages(currentLatex);
      validateLatexStructure(currentLatex);
      return await runLatexCompilation(currentLatex);
    } catch (err) {
      lastError = err;
      console.error(`LaTeX attempt ${attempt} failed →`, err.message);

      if (attempt === 1 && typeof aiFixFn === "function") {
        currentLatex = await aiFixFn(currentLatex, err.message);
      } else {
        throw lastError;
      }
    }
  }
}

/* -------------------- COMPILATION -------------------- */

function runLatexCompilation(latex) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const workDir = path.join(TMP_DIR, id);
    const pdfPath = path.join(workDir, "resume.pdf");

    fs.mkdirSync(workDir, { recursive: true });
    fs.writeFileSync(path.join(workDir, "resume.tex"), latex, "utf8");

    exec(
      "xelatex -interaction=nonstopmode resume.tex",
      { cwd: workDir, timeout: LATEX_TIMEOUT },
      (error, stdout, stderr) => {

        // ⚠️ DO NOT TRUST EXIT CODE — TRUST PDF
        if (!fs.existsSync(pdfPath)) {
          console.error("XeLaTeX STDOUT:\n", stdout);
          console.error("XeLaTeX STDERR:\n", stderr);
          return reject(new Error("PDF not generated"));
        }

        // Log warnings only
        if (stderr) {
          console.warn("XeLaTeX warnings:\n", stderr);
        }

        enforceSinglePage(workDir)
          .then(() => validateAtsText(pdfPath))
          .then((atsText) => resolve({ id, pdfPath, atsText }))
          .catch(reject);
      }
    );
  });
}

/* -------------------- PAGE COUNT -------------------- */

function enforceSinglePage(workDir) {
  return new Promise((resolve, reject) => {
    exec(
      "pdfinfo resume.pdf",
      { cwd: workDir, timeout: 5000 },
      (err, stdout) => {
        if (err) {
          return reject(new Error("pdfinfo not available or failed"));
        }

        const match = stdout.match(/Pages:\s+(\d+)/);
        const pages = match ? parseInt(match[1], 10) : 0;

        if (pages !== 1) {
          return reject(
            new Error(`Resume must be exactly 1 page (found ${pages})`)
          );
        }

        resolve();
      }
    );
  });
}
