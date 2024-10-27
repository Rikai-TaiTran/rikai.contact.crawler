import http from "@/lib/http";
import formatToISO from "@/utils/formatTime";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const UserAddForm = ({ id }) => {
  const [userData, setUserData] = useState();
  const [leadTypes, setLeadTypes] = useState([]);
  const [leadSources, setLeadSources] = useState([]);
  const [leadStatuses, setLeadStatuses] = useState([]);
  const [contactChannels, setContactChannels] = useState([]);
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      fullName: userData?.fullName || "",
      email: userData?.email || "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
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
    if (id) {
      fetchUser();
    }
  }, []);

  const handleAdd = async (values: any) => {
    const response = await http.post(
      "/api/users/register", // URL của API đăng nhập hoặc đăng ký
      values
    );
    if (response) {
      router.push("/users");
    }
  };

  const handleUpdate = async (values: any) => {
    const response = await http.put(
      `/api/users/${id}`, // URL của API đăng nhập hoặc đăng ký
      values
    );
    if (response) {
      router.push("/users");
    }
  };

  const fetchUser = async () => {
    http
      .get(`/api/users/${id}`)
      .then((result) => {
        setUserData(result?.data);
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
          <label htmlFor="fullName" className="sr-only">
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border ${
              formik.touched.fullName && formik.errors.fullName
                ? "border-red-500"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
            placeholder="Full Name"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.fullName && formik.errors.fullName ? (
            <div className="text-red-500">{formik.errors.fullName}</div>
          ) : null}
        </div>

        {/* Email */}
        <div className="w-1/2">
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="text"
            className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border ${
              formik.touched.email && formik.errors.email
                ? "border-red-500"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
            placeholder="Email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500">{formik.errors.email}</div>
          ) : null}
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-1/2">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border ${
              formik.touched.password && formik.errors.password
                ? "border-red-500"
                : "border-gray-300"
            } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm`}
            placeholder="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500">{formik.errors.password}</div>
          ) : null}
        </div>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-[200px] bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          {id ? "Update user" : "Tạo user"}
        </button>
      </div>
    </form>
  );
};

export default UserAddForm;
