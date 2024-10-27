"use client";
import UserAddForm from "@/components/user/UserAddForm";
import { useEffect } from "react";

const AddNewUserPage = () => {
  useEffect(() => {}, []);

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Tạo mới User</h2>
        <UserAddForm id={null} />
      </div>
    </div>
  );
};

export default AddNewUserPage;
