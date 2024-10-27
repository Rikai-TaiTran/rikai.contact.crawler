"use client";

import Pagination from "@/components/Pagination";
import http from "@/lib/http";
import formatToISO from "@/utils/formatTime";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";

export default function UserListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const pageSize = 20;
  const router = useRouter();

  const totalPages = Math.ceil(total / pageSize);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchParams]);

  const fetchUsers = async () => {
    http
      .get("/api/users/list")
      .then((result) => {
        setUsers(result?.data?.data);
        setTotal(result?.data?.pagination?.totalRecords);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchUsers();
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-gray-100 p-4">
      {/* CSV Upload Form */}
      {/* <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md mb-6">
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
              </svg>
            </div>
          )}
          {uploadMessage && (
            <div className="mt-4 text-green-500">{uploadMessage}</div>
          )}
        </form>
      </div> */}

      {/* Company List */}
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between mb-3 items-start">
          <h2 className="text-2xl font-bold mb-4 mb-0">User list</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => router.push("/users/add")}
          >
            <CiCirclePlus size={20} className="inline" />
            Add User
          </button>
        </div>
        {/* Search Form */}
        {/* <div className="flex gap-3 mb-5">
          <div className="w-full lg:w-1/4">
            <label htmlFor="createdDate">Ngày tạo từ</label>
            <input
              id="createdDate"
              name="createdDate"
              type="date"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <label htmlFor="createdDate">Đến ngày</label>
            <input
              id="createdDate"
              name="createdDate"
              type="date"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <label htmlFor="countryRegion">Nguồn crawl</label>
            <select
              id="crawlSource"
              name="crawlSource"
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Chọn nguồn crawl</option>
              <option value="csdl_internal">cơ sở dữ liệu nội bộ</option>
              <option value="link_web_external">trang web bên ngoài</option>
              <option value="crawl">dịch vụ crawl</option>
            </select>
          </div>
          <div className="w-full lg:w-1/4">
            <label htmlFor="isBlackList">Black list</label>
            <select
              id="isBlackList"
              name="isBlackList"
              className="w-full px-4 py-2 border rounded"
            >
              <option value="true">Có</option>
              <option value="false">Không</option>
            </select>
          </div>
        </div> */}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-fixed	w-full">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Full name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Created at</th>
              </tr>
            </thead>
            <tbody id="companyList">
              {users.map((user) => (
                <tr
                  key={user?.id}
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => router.push(`/users/detail/${user?.id}`)}
                >
                  <td className="px-4 py-2">{user?.fullName}</td>
                  <td className="px-4 py-2">{user?.email}</td>
                  <td className="px-4 py-2">{formatToISO(user?.createdAt)}</td>
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
