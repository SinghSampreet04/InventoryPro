import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ""
});

API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("inventoryToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.startsWith("/auth/")) {
      sessionStorage.removeItem("inventoryToken");
      sessionStorage.removeItem("inventoryUsername");
      window.dispatchEvent(new Event("inventory:session-expired"));
    }
    return Promise.reject(error);
  }
);

export const getProducts = () => API.get("/api/products");
export const createProduct = (data) => API.post("/api/products", data);
export const updateProduct = (id, data) => API.put(`/api/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);

export const getAnalytics = () => API.get("/analytics");
export const getCategoryAnalytics = () => API.get("/analytics/categories");
export const getLowStock = () => API.get("/api/products/low-stock");

export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);

export const getApiError = (error, fallback = "Something went wrong") => {
  const response = error.response?.data;
  if (response?.fieldErrors) {
    return Object.values(response.fieldErrors)[0];
  }
  return response?.message || fallback;
};
