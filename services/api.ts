import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // 🔥 Certifique-se que está correto
});

export default api;
