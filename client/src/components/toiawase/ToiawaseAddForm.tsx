import http from "@/lib/http";
import formatToISO from "@/utils/formatTime";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const ToiawaseAddForm = ({ id }) => {
  const [toiawaseData, setToiawaseData] = useState();
  const [leadTypes, setLeadTypes] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [contactChannels, setContactChannels] = useState([]);
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      companyName: toiawaseData?.companyName || "",
      companySize: toiawaseData?.companySize || "",
      companyWebsite: toiawaseData?.companyWebsite || "",
      companyAddress: toiawaseData?.companyAddress || "",
      crawlSource: toiawaseData?.crawlSource || "",
      businessActivities: toiawaseData?.businessActivities || "",
      isBlackList: toiawaseData?.isBlackList || false,
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Tên công ty là bắt buộc"),
      companySize: Yup.string(),
      companyWebsite: Yup.string().url("URL không hợp lệ"),
      companyAddress: Yup.string(),
      crawlSource: Yup.string().required("Nguồn crawl là bắt buộc"),
      businessActivities: Yup.string(),
      isBlackList: Yup.boolean(),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      if (id) {
        handleUpdate(values);
      } else {
        handleAdd(values);
      }
    },
  });

  useEffect(() => {
    fetchUsers();
    if (id) {
      fetchLead();
    }
  }, []);

  const fetchLead = async () => {
    http
      .get(`/api/toiawase/${id}`)
      .then((result) => {
        setToiawaseData(result?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAdd = async (values: any) => {
    http
      .post("/api/toiawase", values)
      .then((result) => {
        if (result) router.push("/toiawase");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = async (values: any) => {
    http
      .put(`/api/toiawase/${id}`, values)
      .then((result) => {
        if (result) router.push("/toiawase");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchUsers = async () => {
    http
      .get("/api/users/list")
      .then((result) => {
        setUsers(result?.data);
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
          {formik.touched.companyName && formik.errors.companyName ? (
            <div className="text-red-600">{formik.errors.companyName}</div>
          ) : null}
        </div>

        {/* Email */}
        <div className="w-1/2">
          <label htmlFor="companySize">Quy mô công ty</label>
          <input
            id="companySize"
            name="companySize"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.companySize}
            className="w-full px-4 py-2 border rounded"
          />
          {formik.touched.companySize && formik.errors.companySize ? (
            <div className="text-red-600">{formik.errors.companySize}</div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-3">
        {/* Số điện thoại */}
        <div className="w-1/2">
          <label htmlFor="companyWebsite">URL Website</label>
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
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <label htmlFor="businessActivities">Lĩnh vực hoạt động</label>
          <input
            id="businessActivities"
            name="businessActivities"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.businessActivities}
            className="w-full px-4 py-2 border rounded"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="countryRegion">Nguồn crawl</label>
          <select
            id="crawlSource"
            name="crawlSource"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.crawlSource}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Chọn nguồn crawl</option>
            <option value="csdl_internal">cơ sở dữ liệu nội bộ</option>
            <option value="link_web_external">trang web bên ngoài</option>
            <option value="crawl">dịch vụ crawl</option>
            {/* Add more options as needed */}
          </select>
          {formik.touched.crawlSource && formik.errors.crawlSource ? (
            <div className="text-red-600">{formik.errors.crawlSource}</div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <label htmlFor="isBlackList">Black list</label>
          <select
            id="isBlackList"
            name="isBlackList"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.isBlackList}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="true">Có</option>
            <option value="false">Không</option>
          </select>
          {formik.touched.isBlackList && formik.errors.isBlackList ? (
            <div className="text-red-600">{formik.errors.isBlackList}</div>
          ) : null}
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-[200px] bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          {id ? "Update toiawase" : "Tạo toiawase"}
        </button>
      </div>
    </form>
  );
};

export default ToiawaseAddForm;
