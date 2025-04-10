import React, { useState } from "react";
import axios from "axios";

export default function MedicalReportUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    setPreview(URL.createObjectURL(uploaded));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // Step 1: Upload the report and get parsed text
      const formData = new FormData();
      formData.append("report", file);

      const uploadRes = await axios.post(
        "http://localhost:5000/api/upload/upload-report",
        formData
      );
      const structuredText = uploadRes.data.extractedText;

      // Step 2: Analyze the structured data
      const analyzeRes = await axios.post(
        "http://localhost:5000/api/analyze/analyze",
        {
          patientId: "fba276e9-6a42-4114-a0a9-bfe71a7966e6", // Static for demo
          extractedText: structuredText,
        }
      );

      setResult(analyzeRes.data.observations);
    } catch (err) {
      console.error(err);
      alert("Failed to process the report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Upload Medical Report</h1>

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileChange}
        className="mb-4 block w-full text-sm text-gray-500"
      />

      {preview && (
        <div className="mb-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 object-contain rounded-md border"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Processing..." : "Analyze Report"}
      </button>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            {result.map((test, idx) => (
              <div key={idx} className="border-b py-1 last:border-none">
                <p className="font-medium">{test.name}</p>
                <p className="text-sm">
                  Value: {test.value} {test.unit} —{" "}
                  <span className="font-semibold text-blue-600">
                    {test.risk}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
