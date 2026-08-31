import axios from "axios";

const API_URL = "https://localhost:7191/api/Admin";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminSummary = async () => {
  const response = await axios.get(
    `${API_URL}/summary`,
    getAuthConfig()
  );

  return response.data;
};

export const getAdminUsers = async () => {
  const response = await axios.get(
    `${API_URL}/users`,
    getAuthConfig()
  );

  return response.data;
};

export const getAdminUser = async (id) => {
  const response = await axios.get(
    `${API_URL}/users/${id}`,
    getAuthConfig()
  );
  return response.data;
};
export const getAdminAccounts = async () => {
  const response = await axios.get(
    `${API_URL}/accounts`,
    getAuthConfig()
  );

  return response.data;
};
export const getAdminTransactions = async () => {
  const response = await axios.get(
    `${API_URL}/transactions`,
    getAuthConfig()
  );

  return response.data;
};