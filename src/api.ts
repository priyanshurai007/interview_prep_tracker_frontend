// src/api.ts
import axios from "axios";

const BASE_URL = "https://interview-prep-tracker-backend.onrender.com/api";

export const fetchTopics = async () => {
  const response = await axios.get(`${BASE_URL}/topics`);
  return response.data;
};
