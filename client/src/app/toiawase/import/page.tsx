"use client";

import http from "@/lib/http";
import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

export default function ToiawasePage() {
  const [uploadSpinner, setUploadSpinner] = useState<boolean>(false);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  useEffect(() => {}, []);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setUploadSpinner(true);
    setUploadMessage("");

    try {
      http.post("/api/import_csv", formData).then((result) => {
        setUploadSpinner(false);
        setUploadMessage(result?.data?.message);
      });
    } catch (error) {
      setUploadSpinner(false);
      setUploadMessage("An error occurred during the upload.");
      console.error(error);
    }
  };

  // const handleExport = async () => {
  //   const exportParams =
  //     selectedIds.length > 0 ? `ids=${selectedIds.join(",")}` : searchParams;

  //   try {
  //     const response = await fetch(
  //       `http://localhost:3000/api/export?${exportParams}`,
  //       {
  //         method: "GET",
  //       }
  //     );

  //     if (response.ok) {
  //       const disposition = response.headers.get("Content-Disposition");
  //       let filename = "companies.csv";

  //       if (disposition && disposition.includes("filename=")) {
  //         const matches = disposition.match(/filename="?([^";]+)"?/);
  //         if (matches && matches[1]) {
  //           filename = matches[1];
  //         }
  //       }

  //       const blob = await response.blob();
  //       const downloadUrl = URL.createObjectURL(blob);

  //       const a = document.createElement("a");
  //       a.href = downloadUrl;
  //       a.download = filename;
  //       document.body.appendChild(a);
  //       a.click();
  //       a.remove();
  //     } else {
  //       console.error("Failed to export CSV:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error exporting CSV:", error);
  //   }
  // };

  return (
    <div className="bg-gray-100 p-4">
      {/* Company List */}
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        {/* CSV Upload Form */}
        <h2 className="text-2xl font-bold mb-4 mb-0">Import CSV</h2>
        <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md mb-6">
          <form
            id="csvForm"
            onSubmit={handleUpload}
            encType="multipart/form-data"
          >
            <input type="file" name="file" accept=".csv" className="mb-4" />
            <button
              disabled={uploadSpinner}
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Import CSV
              {uploadSpinner && <FaSpinner className="animate-spin mr-2" />}
            </button>
            {uploadSpinner && (
              <div className="mt-2">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                ></svg>
              </div>
            )}
            {uploadMessage && (
              <div className="mt-4 text-green-500">{uploadMessage}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
