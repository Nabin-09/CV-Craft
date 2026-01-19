import fs from "fs";

const MAX_PDF_SIZE = 1.5 * 1024 * 1024; // 1.5MB

export function enforcePdfSize(pdfPath) {
  const size = fs.statSync(pdfPath).size;

  if (size > MAX_PDF_SIZE) {
    throw new Error("PDF exceeds ATS size limit");
  }
}
