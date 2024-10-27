/* eslint-disable @typescript-eslint/no-unused-vars */

import http from "@/lib/http";
import formatToISO from "@/utils/formatTime";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";

interface LeadAddFormProps {
  id: string | number | null;
}
const LeadAddForm: React.FC<LeadAddFormProps> = ({ id }) => {
  const [leadData, setLeadData] = useState<leadType>();
  const [leadTypes, setLeadTypes] = useState<leadTypeType[]>([]);
  const [leadSources, setLeadSources] = useState<leadSourcesType[]>([]);
  const [leadStatuses, setLeadStatuses] = useState<leadStatusType[]>([]);
  const [contactChannels, setContactChannels] = useState<leadStatusType[]>([]);
  const [users, setUsers] = useState<userType[]>([]);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      fullName: leadData?.fullName || "",
      email: leadData?.email || "",
      phone: leadData?.phoneNumber || "",
      companyName: leadData?.companyName || "",
      position: leadData?.position || "",
      companyWebsite: leadData?.companyWebsite || "",
      companyAddress: leadData?.companyAddress || "",
      countryRegion: leadData?.country || "",
      leadSource: leadData?.leadSourceId || "",
      initialContactChannel: leadData?.contactChannelId || "",
      createdDate: "",
      leadStatus: leadData?.leadStatusId || "",
      leadOwner: leadData?.assignedUserId || "",
      lastContactDate: formatToISO(leadData?.lastContactDate) || "",
      leadClassification: leadData?.leadTypeId || "",
      notes: leadData?.note || "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Họ và tên là bắt buộc"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Email là bắt buộc"),
      phone: Yup.string().required("Số điện thoại là bắt buộc"),
      companyName: Yup.string(),
      position: Yup.string(),
      companyWebsite: Yup.string().url("URL không hợp lệ"),
      companyAddress: Yup.string(),
      countryRegion: Yup.string().required("Quốc gia/khu vực là bắt buộc"),
      leadSource: Yup.string().required("Nguồn gốc lead là bắt buộc"),
      initialContactChannel: Yup.string().required(
        "Kênh liên lạc ban đầu là bắt buộc"
      ),
      leadStatus: Yup.string().required("Trạng thái lead là bắt buộc"),
      leadOwner: Yup.string().required("Người phụ trách là bắt buộc"),
      interactionHistory: Yup.string(),
      leadClassification: Yup.string().required("Phân loại lead là bắt buộc"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      if (id) {
        handleUpdateLead(values);
      } else {
        handleAddLead(values);
      }
    },
  });

  useEffect(() => {
    fetchLeadType();
    fetchLeadStatues();
    fetchLeadSources();
    fetchContactChannels();
    fetchUsers();
    if (id) {
      fetchLead();
    }
  }, []);

  const fetchLeadType = async () => {
    http
      .get("/api/lead_types")
      .then((result) => {
        setLeadTypes(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  const handleAddLead = async (values: any) => {
    http
      .post("/api/leads", values)
      .then((result) => {
        if (result) router.push("/leads");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdateLead = async (values: any) => {
    http
      .put(`/api/leads/${id}`, values)
      .then((result) => {
        if (result) router.push("/leads");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchLeadStatues = async () => {
    http
      .get("/api/lead_statuses")
      .then((result) => {
        setLeadStatuses(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchLeadSources = async () => {
    http
      .get("/api/lead_sources")
      .then((result) => {
        setLeadSources(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchContactChannels = async () => {
    http
      .get("/api/contact_channels")
      .then((result) => {
        setContactChannels(result?.data);
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

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="flex gap-3">
        {/* Họ và tên */}
        <div className="w-1/2">
          <label htmlFor="fullName">Họ và tên</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullName}
            className="w-full px-4 py-2 border rounded"
          />
          {formik.touched.fullName && formik.errors.fullName ? (
            <div className="text-red-600">{formik.errors.fullName}</div>
          ) : null}
        </div>

        {/* Email */}
        <div className="w-1/2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            className="w-full px-4 py-2 border rounded"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-600">{formik.errors.email}</div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-3">
        {/* Số điện thoại */}
        <div className="w-1/2">
          <label htmlFor="phone">Số điện thoại</label>
          <input
            id="phone"
            name="phone"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className="w-full px-4 py-2 border rounded"
          />
          {formik.touched.phone && formik.errors.phone ? (
            <div className="text-red-600">{formik.errors.phone}</div>
          ) : null}
        </div>

        {/* Tên công ty */}
        <div className="w-1/2">
          <label htmlFor="companyName">Tên công ty</label>
          <input
            id="companyName"
            name="companyName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.companyName}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
      </div>
      <div className="flex gap-3">
        {/* Vị trí/chức vụ */}
        <div className="w-1/2">
          <label htmlFor="position">Vị trí/chức vụ</label>
          <input
            id="position"
            name="position"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.position}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Website công ty */}
        <div className="w-1/2">
          <label htmlFor="companyWebsite">Website công ty</label>
          <input
            id="companyWebsite"
            name="companyWebsite"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.companyWebsite}
            className="w-full px-4 py-2 border rounded"
          />
          {formik.touched.companyWebsite && formik.errors.companyWebsite ? (
            <div className="text-red-600">{formik.errors.companyWebsite}</div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-3">
        {/* Địa chỉ công ty */}
        <div className="w-1/2">
          <label htmlFor="companyAddress">Địa chỉ công ty</label>
          <input
            id="companyAddress"
            name="companyAddress"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.companyAddress}
            className="w-full px-4 py-2 border rounded"
          />
        </div>

        {/* Quốc gia/khu vực */}
        <div className="w-1/2">
          <label htmlFor="countryRegion">Quốc gia/khu vực</label>
          <select
            id="countryRegion"
            name="countryRegion"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.countryRegion}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="Vietnam">Vietnam</option>
            <option value="USA">USA</option>
            {/* Add more options as needed */}
          </select>
          {formik.touched.countryRegion && formik.errors.countryRegion ? (
            <div className="text-red-600">{formik.errors.countryRegion}</div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-3">
        {/* Nguồn gốc lead */}
        <div className="w-1/2">
          <label htmlFor="leadSource">Nguồn gốc lead</label>
          <select
            id="leadSource"
            name="leadSource"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.leadSource}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Chọn nguồn gốc</option>
            {leadSources?.map((item) => (
              <option key={item?.id} value={item?.id}>
                {item?.name}
              </option>
            ))}
          </select>
          {formik.touched.leadSource && formik.errors.leadSource ? (
            <div className="text-red-600">{formik.errors.leadSource}</div>
          ) : null}
        </div>

        {/* Kênh liên lạc ban đầu */}
        <div className="w-1/2">
          <label htmlFor="initialContactChannel">Kênh liên lạc ban đầu</label>
          <select
            id="initialContactChannel"
            name="initialContactChannel"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.initialContactChannel}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Chọn kênh liên lạc</option>
            {contactChannels?.map((item) => (
              <option key={item?.id} value={item?.id}>
                {item?.name}
              </option>
            ))}
          </select>
          {formik.touched.initialContactChannel &&
          formik.errors.initialContactChannel ? (
            <div className="text-red-600">
              {formik.errors.initialContactChannel}
            </div>
          ) : null}
        </div>
      </div>

      {/* Ngày tạo lead */}
      {/* <div>
            <label htmlFor="createdDate">Ngày tạo lead</label>
            <input
              id="createdDate"
              name="createdDate"
              type="date"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.createdDate}
              className="w-full px-4 py-2 border rounded"
            />
            {formik.touched.createdDate && formik.errors.createdDate ? (
              <div className="text-red-600">{formik.errors.createdDate}</div>
            ) : null}
          </div> */}

      <div className="flex gap-3">
        {/* Trạng thái lead */}
        <div className="w-1/2">
          <label htmlFor="leadStatus">Trạng thái lead</label>
          <select
            id="leadStatus"
            name="leadStatus"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.leadStatus}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Chọn trạng thái</option>
            {leadStatuses?.map((item) => (
              <option key={item?.id} value={item?.id}>
                {item?.name}
              </option>
            ))}
          </select>
          {formik.touched.leadStatus && formik.errors.leadStatus ? (
            <div className="text-red-600">{formik.errors.leadStatus}</div>
          ) : null}
        </div>

        {/* Người phụ trách */}
        <div className="w-1/2">
          <label htmlFor="leadOwner">Người phụ trách</label>
          <select
            id="leadOwner"
            name="leadOwner"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.leadOwner}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Chọn nhân viên</option>
            {users?.map((item) => (
              <option key={item?.id} value={item?.id}>
                {item?.fullName}
              </option>
            ))}
            {/* Add more employees as needed */}
          </select>
          {formik.touched.leadOwner && formik.errors.leadOwner ? (
            <div className="text-red-600">{formik.errors.leadOwner}</div>
          ) : null}
        </div>
      </div>

      {/* Ngày liên hệ cuối cùng */}
      <div className="flex gap-3">
        <div className="w-full lg:w-1/2">
          <label htmlFor="lastContactDate">Ngày liên hệ cuối cùng</label>
          <input
            id="lastContactDate"
            name="lastContactDate"
            type="date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastContactDate}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <label htmlFor="leadClassification">Phân loại lead</label>
          <select
            id="leadClassification"
            name="leadClassification"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.leadClassification}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Chọn phân loại</option>
            {leadTypes?.map((item) => (
              <option key={item?.id} value={item?.id}>
                {item?.name}
              </option>
            ))}
          </select>
          {formik.touched.leadClassification &&
          formik.errors.leadClassification ? (
            <div className="text-red-600">
              {formik.errors.leadClassification}
            </div>
          ) : null}
        </div>
      </div>

      {/* Lịch sử tương tác */}
      {/* <div>
            <label htmlFor="interactionHistory">Lịch sử tương tác</label>
            <textarea
              id="interactionHistory"
              name="interactionHistory"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.interactionHistory}
              className="w-full px-4 py-2 border rounded"
            />
          </div> */}

      {/* Phân loại lead */}

      {/* Ghi chú */}
      <div>
        <label htmlFor="notes">Ghi chú</label>
        <textarea
          id="notes"
          name="notes"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.notes}
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {/* File đính kèm */}
      {/* <div>
            <label htmlFor="attachment">File đính kèm</label>
            <input
              id="attachment"
              name="attachment"
              type="file"
              onChange={(event) => {
                formik.setFieldValue(
                  "attachment",
                  event.currentTarget.files[0]
                );
              }}
              className="w-full px-4 py-2 border rounded"
            />
          </div> */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-[200px] bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          {id ? "Update lead" : "Tạo lead"}
        </button>
      </div>
    </form>
  );
};

export default LeadAddForm;
