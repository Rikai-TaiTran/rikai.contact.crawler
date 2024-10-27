"use client";
import { useEffect, useState } from "react";
import {
  FaPaperclip,
  FaChartBar,
  FaUsers,
  FaDollarSign,
  FaChartLine,
  FaFilter,
} from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
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
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const LeadDetails = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, []);

  // Dummy lead data
  const leadData = {
    fullName: "John Doe",
    companyName: "Tech Corp Ltd",
    email: "john.doe@techcorp.com",
    phone: "+1 234 567 8900",
    status: "Active",
    source: "Website",
    type: "Enterprise",
    assignee: "Sarah Johnson",
    lastContactDate: "2024-01-15",
    potentialRevenue: 50000,
  };

  // Dummy sales funnel data
  const funnelData = {
    labels: ["Lead", "Qualified", "Proposal", "Negotiation", "Closed"],
    datasets: [
      {
        data: [100, 70, 45, 30, 20],
        backgroundColor: [
          "#3B82F6",
          "#60A5FA",
          "#93C5FD",
          "#BFDBFE",
          "#DBEAFE",
        ],
      },
    ],
  };

  // Dummy performance data
  const performanceData = {
    labels: ["Sarah Johnson", "Mike Brown", "Emily Davis", "Chris Wilson"],
    datasets: [
      {
        label: "Leads Processed",
        data: [45, 38, 42, 35],
        backgroundColor: "#3B82F6",
      },
    ],
  };

  // Dummy conversion rates
  const conversionData = {
    labels: ["Converted", "In Progress", "Lost"],
    datasets: [
      {
        data: [60, 30, 10],
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

  const fetchUser = async () => {
    http
      .get(`/api/users/${id}`)
      .then((result) => {
        setUser(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const InfoRow = ({ label, value }) => (
    <div className="flex items-center py-3 border-b border-gray-200">
      <div className="flex items-center w-1/3 text-gray-600">
        <span className="font-medium">{label}:</span>
      </div>
      <div className="w-2/3 text-gray-800">{value}</div>
    </div>
  );

  const ReportTabs = () => (
    <div className="flex space-x-4 mb-6 border-b border-gray-200">
      {["overview", "performance", "details"].map((tab) => (
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
          <select className="border rounded px-2 py-1">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last Quarter</option>
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                User Details & Analytics
              </h2>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => router.push(`/users/edit/${id}`)}
                >
                  <CiEdit size={20} className="inline" /> Edit user
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <InfoRow label="Full Name" value={user?.fullName} />
                <InfoRow label="Email" value={user?.email} />
                <InfoRow label="Created at" value={user?.createdAt} />
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <ReportTabs />
          {activeTab === "overview" && <OverviewReport />}
          {activeTab === "performance" && <PerformanceReport />}
          {activeTab === "details" && <DetailedReport />}
        </div> */}
      </div>
    </div>
  );
};

export default LeadDetails;
