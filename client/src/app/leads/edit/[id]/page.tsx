"use client";
import LeadAddForm from "@/components/leads/LeadAddForm";
import http from "@/lib/http";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const LeadEditPage = ({ params }) => {
  const { id } = params;
  const router = useRouter();

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
