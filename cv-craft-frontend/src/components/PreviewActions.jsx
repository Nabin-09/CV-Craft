export default function PreviewActions({ previewUrl, downloadUrl }) {
  return (
    <div className="flex gap-4 mt-6">
      <a
        href={previewUrl}
        target="_blank"
        className="px-4 py-2 border rounded"
      >
        Preview
      </a>

      <a
        href={downloadUrl}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Download
      </a>
    </div>
  );
}
