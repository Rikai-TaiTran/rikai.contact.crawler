"use client";
import http from "@/lib/http";
import formatToISO from "@/utils/formatTime";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CiEdit } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";

import { FaPlus, FaSpinner } from "react-icons/fa";
import DialogConfirm from "@/components/dialog/DialogConfirm";

interface ToiawaseDetailsParams {
  id: string; // or number, depending on your route structure
  // Add other parameters as needed
}

interface ToiawaseDetailsProps {
  params: ToiawaseDetailsParams;
}

const ToiawaseDetails: React.FC<ToiawaseDetailsProps> = ({ params }) => {
  interface InfoRowType {
    label: string;
    value: string | undefined | boolean;
  }
  const { id } = params;
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const router = useRouter();
  const [toiawaseData, setToiawaseData] = useState<toiawaseType>();
  const [users, setUsers] = useState<userType[]>();
  useEffect(() => {
    fetchToiawase();
    fetchUsers();
    fetchToiawaseHistory();
  }, []);

  const validationSchema = Yup.object().shape({
    sendDate: Yup.date().required("Ngày gửi là bắt buộc").nullable(),
    senderId: Yup.string().required("Người gửi là bắt buộc").nullable(),
    isSendSuccess: Yup.boolean(),
    hasMeeting: Yup.boolean(),
  });

  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      sendDate: "",
      senderId: "",
      isSendSuccess: "true",
      hasMeeting: "true",
    },
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      const response = await http.post(
        `/api/toiawase_histories/toiawase/${id}`,
        values
      );
      if (response) {
        fetchToiawaseHistory();
        resetForm();
        setLoading(false);
      }
    },
  });

  const fetchToiawase = async () => {
    http
      .get(`/api/toiawase/${id}`)
      .then((result) => {
        setToiawaseData(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteToiawase = async () => {
    http
      .delete(`/api/toiawase/${id}`)
      .then((result) => {
        if (result) {
          setIsOpenDialog(false);
          router.push("/toiawase");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUsers = async () => {
    http
      .get("/api/users/list?getall=true")
      .then((result) => {
        setUsers(result?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchToiawaseHistory = async () => {
    http
      .get(`/api/toiawase_histories/toiawase/${id}`)
      .then((result) => {
        setContactHistory(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onClose = () => {
    setIsOpenDialog(false);
  };

  const onConfirm = () => {
    deleteToiawase();
  };

  // Dummy contact history
  const [contactHistory, setContactHistory] = useState([]);

  const InfoRow = ({ label, value }: InfoRowType) => (
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
            Toiawase Details
          </h2>
          <div className="flex gap-3">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => router.push(`/toiawase/edit/${id}`)}
            >
              <CiEdit size={20} className="inline" /> Edit
            </button>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded"
              onClick={() => setIsOpenDialog(true)}
            >
              <CiTrash size={20} className="inline" /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <InfoRow label="Company Name" value={toiawaseData?.companyName} />
            <InfoRow label="Company size" value={toiawaseData?.companySize} />
            <InfoRow
              label="Company Address"
              value={toiawaseData?.companyAddress}
            />
            <InfoRow
              label="Lĩnh vực hoạt động"
              value={toiawaseData?.businessActivities}
            />
          </div>
          <div>
            <InfoRow label="Black list" value={toiawaseData?.isBlackList} />
            <InfoRow label="Nguồn crawl" value={toiawaseData?.crawlSource} />
            <InfoRow
              label="Ngày tạo"
              value={formatToISO(toiawaseData?.createdAt)}
            />
            <InfoRow
              label="Ngày cập nhật cuối cùng"
              value={formatToISO(toiawaseData?.lastUpdateDate)}
            />
          </div>
        </div>
      </div>

      {/* New Contact Form */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Add History Send
        </h3>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Send Date
              </label>
              <input
                type="date"
                name="sendDate"
                value={formik.values.sendDate}
                onChange={formik.handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  formik.errors.sendDate && formik.touched.sendDate
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                onBlur={formik.handleBlur}
              />
              {formik.errors.sendDate && formik.touched.sendDate && (
                <div className="text-red-500 text-sm">
                  {formik.errors.sendDate}
                </div>
              )}
            </div>
            <div>
              <label htmlFor="senderId">Người gửi</label>
              <select
                id="senderId"
                name="senderId"
                value={formik.values.senderId}
                onChange={formik.handleChange}
                className={`w-full px-4 py-2 border ${
                  formik.errors.senderId && formik.touched.senderId
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded`}
                onBlur={formik.handleBlur}
              >
                <option value="">Chọn nhân viên</option>
                {users?.map((item: userType) => (
                  <option key={item?.id} value={item?.id}>
                    {item?.fullName}
                  </option>
                ))}
              </select>
              {formik.errors.senderId && formik.touched.senderId && (
                <div className="text-red-500 text-sm">
                  {formik.errors.senderId}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="isSendSuccess">Trạng thái</label>
              <select
                id="isSendSuccess"
                name="isSendSuccess"
                className="w-full px-4 py-2 border rounded"
              >
                <option value="true">Thành công</option>
                <option value="true">Thất bại</option>
              </select>
            </div>
            <div>
              <label htmlFor="hasMeeting">Có meeting</label>
              <select
                id="hasMeeting"
                name="hasMeeting"
                className="w-full px-4 py-2 border rounded"
              >
                <option value="true">Có</option>
                <option value="true">Không</option>
              </select>
            </div>
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
                Add History
              </>
            )}
          </button>
        </form>
      </div>

      {/* Contact History */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          History send
        </h3>
        <div className="space-y-4">
          {contactHistory.map((contact: toiawaseContactType, index: number) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {formatToISO(contact?.sendDate)}
                </span>
              </div>
              <p className="text-gray-800">
                Người gửi : {contact?.sender?.fullName}
              </p>
              <p className="text-gray-800">
                {" "}
                Trang thái: {contact?.isSendSuccess ? "Thành Công" : "Thất bại"}
              </p>
              <p className="text-gray-800">
                Có meeting: {contact?.hasMeeting ? "Có" : "Không"}
              </p>
            </div>
          ))}
        </div>
      </div>
      <DialogConfirm
        isOpen={isOpenDialog}
        onClose={onClose}
        onConfirm={onConfirm}
        message={`Are you sure you want to delete ${toiawaseData?.companyName}`}
        title="Warning"
      />
    </div>
  );
};

export default ToiawaseDetails;
