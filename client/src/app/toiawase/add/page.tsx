"use client";
import LeadAddForm from "@/components/leads/LeadAddForm";
import ToiawaseAddForm from "@/components/toiawase/ToiawaseAddForm";
import http from "@/lib/http";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const ToiawaseNewPage = () => {
  const router = useRouter();

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
