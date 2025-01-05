import axios from "axios";

const axioInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL || "",
});

// Add a request interceptor to attach the accessToken
axioInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
axioInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error);
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axioInstance;
