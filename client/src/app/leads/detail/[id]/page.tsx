"use client";
import http from "@/lib/http";
import formatToISO from "@/utils/formatTime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import * as Yup from "yup";

import {
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaCalendar,
  FaPlus,
  FaUpload,
  FaPaperclip,
  FaSpinner,
} from "react-icons/fa";
import { ErrorMessage } from "formik";
import { useFormik } from "formik";

const LeadDetails = ({ params }) => {
  const { id } = params;
  console.log(id);

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [leadData, setLeadData] = useState();
  const [contactHistory, setContactHistory] = useState([]);
  useEffect(() => {
    fetchLead();
    fetchLeadHistory();
  }, []);
  const [files, setFiles] = useState([]);

  const contactSchema = Yup.object().shape({
    date: Yup.date().required("Contact date is required"),
    content: Yup.string().required("Content is required"),
  });

  const formik = useFormik({
    initialValues: { date: "", content: "" },
    validationSchema: contactSchema,
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();

      // Append form fields
      formData.append("date", values.date);
      formData.append("content", values.content);

      // Append each file in the files array
      files.forEach((file) => {
        formData.append("attachments", file); // "attachments" is the key; adapt it if your API expects a different key
      });

      try {
        // Submit the FormData
        const response = await http.post(
          `/api/lead_histories/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response) {
          fetchLeadHistory();
          resetForm();
          setFiles([]);
        }
      } catch (error) {
        console.log(error);
        console.error("Failed to submit contact", error);
      }
    },
  });

  const fetchLead = async () => {
    http
      .get(`/api/leads/${id}`)
      .then((result) => {
        setLeadData(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchLeadHistory = async () => {
    http
      .get(`/api/lead_histories/lead/${id}`)
      .then((result) => {
        setContactHistory(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles([...files, ...newFiles]);
  };

  const InfoRow = ({ label, value }) => (
    <div className="flex items-center py-3 border-b border-gray-200">
      <div className="flex items-center w-1/3 text-gray-600">
        <span className="font-medium">{label}:</span>
      </div>
      {label == "Status" ? (
        <div className="w-2/3 text-gray-800">
          <span className="bg-green-700 p-1 text-center text-white rounded inline-block">
            {value}
          </span>
        </div>
      ) : (
        <div className="w-2/3 text-gray-800">{value}</div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Lead Information Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Lead Details
          </h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => router.push(`/leads/edit/${id}`)}
          >
            <CiEdit size={20} className="inline" /> Edit lead
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InfoRow label="Full Name" value={leadData?.fullName} />
            <InfoRow label="Company Name" value={leadData?.companyName} />
            <InfoRow label="Email" value={leadData?.email} />
            <InfoRow label="Phone" value={leadData?.phoneNumber} />
          </div>
          <div>
            <InfoRow label="Status" value={leadData?.leadStatus?.name} />
            <InfoRow label="Source" value={leadData?.leadSource?.name} />
            <InfoRow label="Type" value={leadData?.leadType?.name} />
            <InfoRow label="Assignee" value={leadData?.user?.fullName} />
            <InfoRow
              label="Last Contact"
              value={formatToISO(leadData?.lastContactDate)}
            />
          </div>
        </div>
      </div>

      {/* New Contact Form */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Add New Contact
        </h3>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Date
              </label>
              <input
                type="date"
                name="date"
                value={formik.values.date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {formik.touched.date && formik.errors.date && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.date}
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Files
              </label>
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer bg-gray-50 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors">
                  <FaUpload className="inline mr-2" />
                  Upload Files
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                <span className="text-sm text-gray-600">
                  {files.length} file(s) selected
                </span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              name="content"
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="4"
            />
            {formik.touched.content && formik.errors.content && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.content}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <FaPlus className="mr-2" />
                Add Contact
              </>
            )}
          </button>
        </form>
      </div>

      {/* Contact History */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Contact History
        </h3>
        <div className="space-y-4">
          {contactHistory.map((contact, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {formatToISO(contact?.contact_date)}
                </span>
                {/* {contact.attachments.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600">
                    <FaPaperclip className="mr-1" />
                    {contact.attachments.length} attachment(s)
                  </div>
                )} */}
              </div>
              <p className="text-gray-800">{contact?.description}</p>
              {contact?.file && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">
                    <FaPaperclip className="mr-1" />
                    {contact?.file?.fileName}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
