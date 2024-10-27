"use client";

import LeadsBoard from "@/components/leads/LeadsBoard";
import Pagination from "@/components/Pagination";
import http from "@/lib/http";
import formatToISO from "@/utils/formatTime";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CiCirclePlus } from "react-icons/ci";

export default function LeadsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useState("");
  const [searchForm, setSearchForm] = useState({
    search: "",
    leadClassification: "",
    leadStatus: "",
    leadSource: "",
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadSpinner, setUploadSpinner] = useState(false);
  const [leadTypes, setLeadTypes] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [contactChannels, setContactChannels] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);
  const [error, setError] = useState(null);
  const pageSize = 20;
  const router = useRouter();

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
    fetchLeads(currentPage, searchParams);
    fetchLeadType();
    fetchLeadStatues();
    fetchLeadSources();
    fetchContactChannels();
    fetchUsers();
  }, [currentPage, searchParams]);

  const fetchLeadStatues = async () => {
    http
      .get("/api/lead_statuses")
      .then((result) => {
        setLeadStatuses(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchLeadType = async () => {
    http
      .get("/api/lead_types")
      .then((result) => {
        setLeadTypes(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchLeadSources = async () => {
    http
      .get("/api/lead_sources")
      .then((result) => {
        setLeadSources(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchContactChannels = async () => {
    http
      .get("/api/contact_channels")
      .then((result) => {
        setContactChannels(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUsers = async () => {
    http
      .get("/api/users/list")
      .then((result) => {
        setUsers(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
      fetchLeads(page, searchParams);
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (event: any) => {
    const { name, value } = event.target;

    // Update the searchForm state
    setSearchForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Create an updated form object for immediate query generation
    const updatedSearchForm = {
      ...searchForm,
      [name]: value,
    };

    // Create the query string based on updatedSearchForm
    const queryString = new URLSearchParams(updatedSearchForm).toString();

    // Update the URL search parameters and reset the page number
    setSearchParams(queryString);
    setCurrentPage(1);

    // Fetch data immediately with the updated search criteria
    fetchLeads(1, queryString);
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

  const fetchLeads = (currentPage: number, searchParams: string) => {
    http
      .get(`/api/leads?page=${currentPage}&${searchParams}`)
      .then((response) => {
        setLeads(response?.data?.data);
        setTotal(response?.data?.pagination?.totalRecords);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
    setLoading(true);
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
          <h2 className="text-2xl font-bold mb-4 mb-0">Leads</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => router.push("/leads/add")}
          >
            <CiCirclePlus size={20} className="inline" />
            Add Lead
          </button>
        </div>
        {/* Search Form */}
        <div className="flex gap-3 mb-5">
          <div className="w-full lg:w-1/4">
            <label htmlFor="fullName">Search</label>
            <input
              id="search"
              onChange={handleSearchChange}
              name="search"
              type="text"
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div className="w-full lg:w-1/4">
            <label htmlFor="leadClassification">Lead type</label>
            <select
              id="leadClassification"
              name="leadClassification"
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">All</option>
              {leadTypes?.map((item) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-1/4">
            <label htmlFor="leadStatus">Lead Status</label>
            <select
              id="leadStatus"
              name="leadStatus"
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">All</option>
              {leadStatuses?.map((item) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-1/4">
            <label htmlFor="leadSource">Lead Source</label>
            <select
              id="leadSource"
              name="leadSource"
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">All</option>
              {leadSources?.map((item) => (
                <option key={item?.id} value={item?.id}>
                  {item?.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-fixed	w-full">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Full Name</th>
                <th className="px-4 py-2">Company Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2 w-[200px]">Status</th>
                <th className="px-4 py-2">Source</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Assignee</th>
                <th className="px-4 py-2">Last contact date</th>
              </tr>
            </thead>
            <tbody id="companyList">
              {leads.map((lead) => (
                <tr
                  key={lead?.id}
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() => router.push(`/leads/detail/${lead?.id}`)}
                >
                  <td className="px-4 py-2">{lead?.fullName}</td>
                  <td className="px-4 py-2">{lead?.companyName}</td>
                  <td className="px-4 py-2">{lead?.email}</td>
                  <td className="px-4 py-2">{lead?.phone}</td>
                  <td className="px-4 py-2">
                    <span className="bg-green-700 text-sm p-1 text-center text-white inline-block rounded">
                      {lead?.leadStatus?.name}
                    </span>
                  </td>
                  <td className="px-4 py-2">{lead?.leadSource?.name}</td>
                  <td className="px-4 py-2">{lead?.leadType?.name}</td>
                  <td className="px-4 py-2">{lead?.user?.fullName}</td>
                  <td className="px-4 py-2">
                    {formatToISO(lead?.lastContactDate)}
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
      {/* <LeadsBoard /> */}
    </div>
  );
}
