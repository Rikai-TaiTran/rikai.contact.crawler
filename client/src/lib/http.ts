import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useRouter } from "next/navigation";

// Tạo instance Axios
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL as string, // Assert type to string
  timeout: 10000, // Thời gian chờ (10 giây)
});

// Thêm interceptor để đính kèm token
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Use InternalAxiosRequestConfig here
    const token = localStorage.getItem("authToken"); // Lấy token từ local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Đính kèm token vào headers
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi
http.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi tại đây
    if (error.response) {
      if (error.response.status === 401) {
        // Xóa token khỏi local storage
        localStorage.removeItem("authToken");

        // Redirect to login page
        const router = useRouter(); // Get the router instance
        router.push("/login"); // Redirect to login
      }
      // Lỗi từ máy chủ
      console.error("Server Error:", error.response.data);
      console.error("Status:", error.response.status);
    } else if (error.request) {
      // Lỗi không có phản hồi
      console.error("Network Error:", error.request);
    } else {
      // Lỗi khác
      console.error("Error:", error.message);
    }

    return Promise.reject(error); // Trả về lỗi
  }
);

// Xuất instance Axios
export default http;
