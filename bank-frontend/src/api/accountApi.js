import axiosClient from "./axiosClient";

export const getMyAccounts = async () => {
  const response = await axiosClient.get("/Accounts");

  return response.data;
};

export const getAccount = async (accountId) => {
  const response = await axiosClient.get(
    `/Accounts/${accountId}`
  );

  return response.data;
};

export const createAccount = async (data) => {
  const response = await axiosClient.post(
    "/Accounts",
    data
  );

  return response.data;
};

export const closeAccount = async (accountId) => {
  const response = await axiosClient.put(
    `/Accounts/${accountId}/close`
  );

  return response.data;
};