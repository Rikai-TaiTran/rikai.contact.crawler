"use client";
import ToiawaseAddForm from "@/components/toiawase/ToiawaseAddForm";
import { useEffect } from "react";

interface ToiawaseEditPageParams {
  id: string; // or number, depending on your route structure
  // Add other parameters as needed
}

interface ToiawaseEditPageProps {
  params: ToiawaseEditPageParams;
}

const ToiawaseEditPage: React.FC<ToiawaseEditPageProps> = ({ params }) => {
  const { id } = params;

  useEffect(() => {}, []);

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit Toiawase</h2>
        <ToiawaseAddForm id={id} />
      </div>
    </div>
  );
};

export default ToiawaseEditPage;
