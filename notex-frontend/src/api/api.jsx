import axios from "axios";
const api = axios.create({
  baseURL: "https://notex-backend-1-f4ld.onrender.com",
  timeout: 20000
});
export default api;
