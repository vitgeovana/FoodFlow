import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Confirma que a API backend está rodando nesta porta
});

export default api;
