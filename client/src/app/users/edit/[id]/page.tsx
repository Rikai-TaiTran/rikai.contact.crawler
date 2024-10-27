"use client";
import UserAddForm from "@/components/user/UserAddForm";
import { useEffect } from "react";

interface EditUserPageParams {
  id: string; // or number, depending on your route structure
  // Add other parameters as needed
}

interface EditUserPageProps {
  params: EditUserPageParams;
}

const EditUserPage: React.FC<EditUserPageProps> = ({ params }) => {
  const { id } = params;

  useEffect(() => {}, []);

  return (
    <div className="bg-gray-100 p-4">
      <div className="max-w-screen-xl mx-auto bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Edit user</h2>
        <UserAddForm id={id} />
      </div>
    </div>
  );
};

export default EditUserPage;
