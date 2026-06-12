import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080"
});

// PRODUCTS
export const getProducts = () => API.get("/api/products");
export const createProduct = (data) => API.post("/api/products", data);
export const deleteProduct = (id) => API.delete(`/api/products/${id}`);

// ANALYTICS
export const getAnalytics = () => API.get("/analytics");
export const getHistory = () => API.get("/analytics/history");

// LOW STOCK
export const getLowStock = () => API.get("/api/products/low-stock");

// AUTH
export const loginUser = (data) => API.post("/auth/login", data);
export const registerUser = (data) => API.post("/auth/register", data);