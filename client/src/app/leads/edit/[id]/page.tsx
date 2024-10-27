"use client";
import LeadAddForm from "@/components/leads/LeadAddForm";
import { useEffect } from "react";

interface LeadEditPageParams {
  id: string; // or number, depending on your route structure
  // Add other parameters as needed
}

interface LeadEditPageProps {
  params: LeadEditPageParams;
}
const LeadEditPage: React.FC<LeadEditPageProps> = ({ params }) => {
  const { id } = params;

  useEffect(() => {}, []);

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Lead</h2>
        <LeadAddForm id={id} />
      </div>
    </div>
  );
};

export default LeadEditPage;
