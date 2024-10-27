"use client";
import ToiawaseAddForm from "@/components/toiawase/ToiawaseAddForm";
import { useEffect } from "react";

const ToiawaseNewPage = () => {
  useEffect(() => {}, []);

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Tạo mới Toiawase</h2>
        <ToiawaseAddForm id={null} />
      </div>
    </div>
  );
};

export default ToiawaseNewPage;
