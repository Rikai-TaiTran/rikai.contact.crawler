// "use client";

// import Pagination from "@/components/Pagination";
// import http from "@/lib/http";
// import formatToISO from "@/utils/formatTime";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import { CiCirclePlus } from "react-icons/ci";

// export default function LeadsBoard() {
//   const [leads, setLeads] = useState<any[]>([]);
//   const [leadStatuses, setLeadStatuses] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     fetchLeads();
//     fetchLeadStatuses();
//   }, []);

//   const fetchLeads = async () => {
//     try {
//       const response = await http.get("/api/leads");
//       setLeads(response?.data?.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchLeadStatuses = async () => {
//     try {
//       const result = await http.get("/api/lead_statuses");
//       setLeadStatuses(result?.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Group leads by lead status
//   const groupedLeads = leadStatuses.map((status) => ({
//     status,
//     leads: leads.filter((lead) => lead.leadStatus?.id === status.id),
//   }));

//   return (
//     <div className="p-4 bg-gray-100 min-h-screen">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-bold">Leads Board</h2>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={() => router.push("/leads/add")}
//         >
//           <CiCirclePlus size={20} className="inline" />
//           Add Lead
//         </button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {groupedLeads.map((group) => (
//           <div key={group.status.id} className="bg-white p-4 rounded shadow">
//             <h3 className="text-lg font-semibold mb-4 text-center">
//               {group.status.name}
//             </h3>
//             <div className="space-y-2">
//               {group.leads.length > 0 ? (
//                 group.leads.map((lead) => (
//                   <div
//                     key={lead.id}
//                     className="bg-gray-200 p-2 rounded cursor-pointer hover:bg-gray-300"
//                     onClick={() => router.push(`/leads/detail/${lead.id}`)}
//                   >
//                     <p className="font-medium">{lead.fullName}</p>
//                     <p className="text-sm text-gray-600">{lead.companyName}</p>
//                     <p className="text-sm text-gray-600">
//                       Last Contact: {formatToISO(lead.lastContactDate)}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-gray-500 text-sm text-center">No leads</p>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
