import fs from "fs";
import path from "path";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";

const TMP_DIR = path.join(process.cwd(), "tmp");

if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR);
}

export function compileLatex(latex) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const workDir = path.join(TMP_DIR, id);
    fs.mkdirSync(workDir);

    const texPath = path.join(workDir, "resume.tex");
    fs.writeFileSync(texPath, latex);

    const command = `xelatex -interaction=nonstopmode resume.tex`;

    exec(command, { cwd: workDir }, (error, stdout, stderr) => {
      if (error) {
        console.error("LaTeX Error:", stdout);
        return reject(new Error("LaTeX compilation failed"));
      }

      const pdfPath = path.join(workDir, "resume.pdf");
      if (!fs.existsSync(pdfPath)) {
        return reject(new Error("PDF not generated"));
      }

      resolve({ id, pdfPath });
    });
  });
}
