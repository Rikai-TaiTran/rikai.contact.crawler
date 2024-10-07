"use client";

import Pagination from "@/components/Pagination";
import { useState, useEffect } from "react";

export default function LeadsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadSpinner, setUploadSpinner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<companyType[]>([]);
  const [error, setError] = useState(null);
  const pageSize = 100;

  const totalPages = Math.ceil(total / pageSize);

  interface companyType {
    id: number;
    name: string;
    address: string;
    website: string;
    foundedDate: string;
    founded: string;
    members: string;
    created_date: string;
    source: string;
  }

  useEffect(() => {
    loadCompanies(currentPage, searchParams);
  }, [currentPage, searchParams]);

  const handleUpload = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    setUploadSpinner(true);
    setUploadMessage("");

    try {
      const response = await fetch("http://localhost:3000/api/import", {
        method: "POST",
        body: formData,
      });

      const message = await response.text();
      setUploadSpinner(false);
      setUploadMessage(message);
    } catch (error) {
      setUploadSpinner(false);
      setUploadMessage("An error occurred during the upload.");
      console.error(error);
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      loadCompanies(page, searchParams);
      setCurrentPage(page);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = new URLSearchParams(formData).toString();

    setSearchParams(searchQuery);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm mới
    // Gọi hàm loadCompanies
  };

  const handleExport = async () => {
    const exportParams =
      selectedIds.length > 0 ? `ids=${selectedIds.join(",")}` : searchParams;

    try {
      const response = await fetch(
        `http://localhost:3000/api/export?${exportParams}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const disposition = response.headers.get("Content-Disposition");
        let filename = "companies.csv";

        if (disposition && disposition.includes("filename=")) {
          const matches = disposition.match(/filename="?([^";]+)"?/);
          if (matches && matches[1]) {
            filename = matches[1];
          }
        }

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        console.error("Failed to export CSV:", response.statusText);
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const loadCompanies = (currentPage: number, searchParams: string) => {
    setLoading(true);
    fetch(
      `http://localhost:3000/api/companies?page=${currentPage}&${searchParams}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setCompanies(data.data);
        setTotal(data?.total);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  };

  const toggleSelectCompany = (id: number) => {
    setSelectedIds((prevSelectedIds) =>
      prevSelectedIds.includes(id)
        ? prevSelectedIds.filter((selectedId) => selectedId !== id)
        : [...prevSelectedIds, id]
    );
  };

  return (
    <div className="bg-gray-100 p-4">
      {/* CSV Upload Form */}
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md mb-6">
        <form
          id="csvForm"
          onSubmit={handleUpload}
          encType="multipart/form-data"
        >
          <input type="file" name="file" accept=".csv" className="mb-4" />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Import CSV
          </button>
          {uploadSpinner && (
            <div className="mt-2">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
              >
                {/* SVG content */}
              </svg>
            </div>
          )}
          {uploadMessage && (
            <div className="mt-4 text-green-500">{uploadMessage}</div>
          )}
        </form>
      </div>

      {/* Company List */}
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Company List</h2>
        {/* Search Form */}
        <form
          id="searchForm"
          className="mb-4 flex gap-2"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            name="search"
            placeholder="Search by company name..."
            className="p-2 border border-gray-300 rounded w-1/4"
          />
          <input
            type="date"
            name="startDate"
            className="p-2 border border-gray-300 rounded w-1/4"
          />
          <input
            type="date"
            name="endDate"
            className="p-2 border border-gray-300 rounded w-1/4"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Search
          </button>
          <button
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleExport}
          >
            Export CSV
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="border border-gray-300 px-4 py-2">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      const allIds = companies.map((company) => company.id);
                      setSelectedIds(e.target.checked ? allIds : []);
                    }}
                    id="checkAll"
                    className="w-4 h-4"
                  />
                </th>
                <th className="border border-gray-300 px-4 py-2">
                  Company Name
                </th>
                <th className="border border-gray-300 px-4 py-2">Website</th>
                <th className="border border-gray-300 px-4 py-2">Address</th>
                <th className="border border-gray-300 px-4 py-2">
                  Founded date
                </th>
                <th className="border border-gray-300 px-4 py-2">CEO</th>
                <th className="border border-gray-300 px-4 py-2">Source</th>
                <th className="border border-gray-300 px-4 py-2">
                  Created Date
                </th>
              </tr>
            </thead>
            <tbody id="companyList">
              {companies.map((company) => (
                <tr key={company.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    <input
                      type="checkbox"
                      className="companyCheckbox w-4 h-4"
                      checked={selectedIds.includes(company.id)}
                      onChange={() => toggleSelectCompany(company.id)}
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {company.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <a
                      href="${company.website}"
                      target="_blank"
                      className="text-blue-500"
                    >
                      {company.website}
                    </a>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {company.address}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {company.foundedDate}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {company.founded}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {company.source}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {company.created_date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          goToPage={goToPage}
          totalPages={totalPages}
          initialPage={currentPage}
        />
      </div>
    </div>
  );
}
