"use client";
import LeadAddForm from "@/components/leads/LeadAddForm";
import { useEffect } from "react";

const LeadNewPage = () => {
  useEffect(() => {}, []);

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Tạo mới Lead</h2>
        <LeadAddForm id={null} />
      </div>
    </div>
  );
};

export default LeadNewPage;
