"use client";
import { useEffect, useState } from "react";
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

interface UserDetailsParams {
  id: string; // or number, depending on your route structure
  // Add other parameters as needed
}

interface UserDetailsProps {
  params: UserDetailsParams;
}

interface InfoRowType {
  label: string;
  value: string | undefined;
}

const UserDetails: React.FC<UserDetailsProps> = ({ params }) => {
  const { id } = params;
  const router = useRouter();
  const [user, setUser] = useState<userType>();

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, []);

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

  const InfoRow = ({ label, value }: InfoRowType) => (
    <div className="flex items-center py-3 border-b border-gray-200">
      <div className="flex items-center w-1/3 text-gray-600">
        <span className="font-medium">{label}:</span>
      </div>
      <div className="w-2/3 text-gray-800">{value}</div>
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

export default UserDetails;
