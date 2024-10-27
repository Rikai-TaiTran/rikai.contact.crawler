"use client";
import { useEffect, useState } from "react";
import {
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaPlus,
  FaUpload,
  FaPaperclip,
  FaSpinner,
  FaChartBar,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaFilter,
} from "react-icons/fa";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import http from "@/lib/http";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  useEffect(() => {
    getLeadStatisticsByStatus();
    getLeadStatisticsByType();
    getLeadStatisticsByOwner(period);
  }, []);
  const [loading, setLoading] = useState(false);
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [ownerStatistics, setOwnerStatistics] = useState([]);
  const [period, setperiod] = useState("this_month");
  const [leadTypes, setLeadTypes] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [newContact, setNewContact] = useState({
    date: "",
    content: "",
  });
  const statusNames = leadStatuses.map((item) => item?.name);
  const statusCount = leadStatuses.map((item) => item?.count);

  const typeNames = leadTypes.map((item) => item?.name);
  const typeCounts = leadTypes.map((item) => item?.count);

  const ownerCounts = ownerStatistics.map((item) => item?.count);
  const ownerNames = ownerStatistics.map((item) => item?.name);

  const getLeadStatisticsByStatus = async () => {
    http
      .get("/api/leads/statistics_status")
      .then((result) => {
        setLeadStatuses(result?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLeadStatisticsByType = async () => {
    http
      .get("/api/leads/statistics_type")
      .then((result) => {
        setLeadTypes(result?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLeadStatisticsByOwner = async (period: string) => {
    http
      .get(`/api/leads/statistics_owner?period=${period}`)
      .then((result) => {
        setOwnerStatistics(result?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const funnelData = {
    labels: statusNames,
    datasets: [
      {
        label: "Leads Status",
        data: statusCount,
        backgroundColor: ["#3B82F6"],
      },
    ],
  };

  const performanceData = {
    labels: ownerNames,
    datasets: [
      {
        label: "Leads Processed",
        data: ownerCounts,
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const conversionData = {
    labels: typeNames,
    datasets: [
      {
        data: typeCounts,
        backgroundColor: ["#22C55E", "#F59E0B", "#EF4444"],
      },
    ],
  };

  const [contactHistory, setContactHistory] = useState([
    {
      date: "2024-01-15",
      content: "Initial meeting discussion about requirements",
      attachments: ["proposal.pdf"],
    },
    {
      date: "2024-01-10",
      content: "Follow-up email sent regarding pricing",
      attachments: [],
    },
  ]);

  const handleChangeReport = (event: any) => {
    const { value } = event.target;
    setperiod(value);
    getLeadStatisticsByOwner(value);
  };

  const ReportTabs = () => (
    <div className="flex space-x-4 mb-6 border-b border-gray-200">
      {["overview", "performance"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 font-medium ${
            activeTab === tab
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600"
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)} Report
        </button>
      ))}
    </div>
  );

  const OverviewReport = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Sales Funnel</h3>
        <Bar data={funnelData} options={{ responsive: true }} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Conversion Rate</h3>
        <Pie data={conversionData} options={{ responsive: true }} />
      </div>
    </div>
  );

  const PerformanceReport = () => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Team Performance</h3>
        <div className="flex items-center space-x-2">
          <FaFilter />
          <select
            className="border rounded px-2 py-1"
            onChange={handleChangeReport}
            value={period}
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_quarter">Last Quarter</option>
          </select>
        </div>
      </div>
      <Bar data={performanceData} options={{ responsive: true }} />
    </div>
  );

  const DetailedReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-blue-600">
              <FaUsers className="text-2xl" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Leads</div>
              <div className="text-xl font-bold">245</div>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-green-600">
              <FaChartLine className="text-2xl" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Conversion Rate</div>
              <div className="text-xl font-bold">24.5%</div>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-yellow-600">
              <FaDollarSign className="text-2xl" />
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Potential Revenue</div>
              <div className="text-xl font-bold">$1.2M</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Lead Activities</h3>
        <div className="space-y-4">
          {contactHistory.map((contact, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {contact.date}
                </span>
                {contact.attachments.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaPaperclip className="mr-1" />
                    {contact.attachments.length} attachment(s)
                  </div>
                )}
              </div>
              <p className="text-gray-800">{contact.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <ReportTabs />
        {activeTab === "overview" && <OverviewReport />}
        {activeTab === "performance" && <PerformanceReport />}
        {/* {activeTab === "details" && <DetailedReport />} */}
      </div>
    </div>
  );
};

export default DashboardPage;
