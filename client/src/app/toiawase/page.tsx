"use client";

import Pagination from "@/components/Pagination";
import http from "@/lib/http";
import formatToISO from "@/utils/formatTime";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";
import { CiImport } from "react-icons/ci";

export default function ToiawasePage() {
  interface SearchForm {
    createdDateFrom: string;
    createdDateTo: string;
    isBlackList: string;
    crawlSource: string;
  }
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [searchForm, setSearchForm] = useState<SearchForm>({
    createdDateFrom: "",
    createdDateTo: "",
    isBlackList: "",
    crawlSource: "",
  });
  const [searchParams, setSearchParams] = useState<string>("");
  const [toiawases, setToiawases] = useState<toiawaseType[]>([]);
  const pageSize = 20;
  const router = useRouter();

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    fetchToiawases(currentPage, searchParams);
  }, [currentPage, searchParams]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchToiawases(page, searchParams);
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    // Update search criteria based on the changed field
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    const updatedSearchForm = {
      ...searchForm,
      [name]: value,
    };
    const queryString = new URLSearchParams(updatedSearchForm).toString();
    setSearchParams(queryString);
    setCurrentPage(1);
    fetchToiawases(currentPage, queryString);
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

  const fetchToiawases = (currentPage: number, searchParams: string) => {
    http
      .get(`/api/toiawase?page=${currentPage}&${searchParams}`)
      .then((response) => {
        setToiawases(response?.data?.data);
        setTotal(response?.data?.pagination?.totalRecords);
      })
      .catch((err: string) => {
        console.log(err);
      });
  };

  return (
    <div className="bg-gray-100 p-4">
      {/* Company List */}
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between mb-3 items-start">
          <h2 className="text-2xl font-bold mb-4 mb-0">Toiawase list</h2>
          <div className="flex gap-3">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => router.push("/toiawase/add")}
            >
              <CiCirclePlus size={20} className="inline" />
              Add Toiawase
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => router.push("/toiawase/import")}
            >
              <CiImport size={20} className="inline" />
              Import CSV
            </button>
          </div>
        </div>
        {/* Search Form */}
        <div className="flex gap-3 mb-5">
          <div className="w-full lg:w-1/4">
            <label htmlFor="createdDateFrom">Ngày tạo từ</label>
            <input
              onChange={handleSearchChange}
              id="createdDateFrom"
              name="createdDateFrom"
              type="date"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <label htmlFor="createdDateTo">Đến ngày</label>
            <input
              onChange={handleSearchChange}
              id="createdDateTo"
              name="createdDateTo"
              type="date"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <label htmlFor="crawlSource">Nguồn crawl</label>
            <select
              onChange={handleSearchChange}
              id="crawlSource"
              name="crawlSource"
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Chọn nguồn crawl</option>
              <option value="csdl_internal">cơ sở dữ liệu nội bộ</option>
              <option value="link_web_external">trang web bên ngoài</option>
              <option value="crawl">dịch vụ crawl</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="w-full lg:w-1/4">
            <label htmlFor="isBlackList">Black list</label>
            <select
              onChange={handleSearchChange}
              id="isBlackList"
              name="isBlackList"
              className="w-full px-4 py-2 border rounded"
            >
              <option value="true">Có</option>
              <option value="false">Không</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-fixed	w-full">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Tên công ty</th>
                <th className="px-4 py-2">Địa chỉ công ty</th>
                <th className="px-4 py-2">URL website</th>
                <th className="px-4 py-2">Quy mô công ty</th>
                <th className="px-4 py-2">Lĩnh vực hoạt động</th>
                <th className="px-4 py-2">Nguồn crawl</th>
                <th className="px-4 py-2">Black list</th>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2">Ngày cập nhật cuối cùng</th>
              </tr>
            </thead>
            <tbody id="companyList">
              {toiawases.map((toiawase) => (
                <tr
                  key={toiawase?.id}
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() =>
                    router.push(`/toiawase/detail/${toiawase?.id}`)
                  }
                >
                  <td className="px-4 py-2">{toiawase?.companyName}</td>
                  <td className="px-4 py-2">{toiawase?.companyAddress}</td>
                  <td className="px-4 py-2">{toiawase?.companyWebsite}</td>
                  <td className="px-4 py-2">{toiawase?.companySize}</td>
                  <td className="px-4 py-2">{toiawase?.businessActivities}</td>
                  <td className="px-4 py-2">{toiawase?.crawlSource}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`${
                        toiawase.isBlackList ? "bg-gray-900" : "bg-green-700"
                      } text-sm p-2 text-center text-white inline-block rounded-xl`}
                    ></span>
                  </td>
                  <td className="px-4 py-2">
                    {formatToISO(toiawase?.createdAt)}
                  </td>
                  <td className="px-4 py-2">
                    {formatToISO(toiawase?.lastUpdateDate)}
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
