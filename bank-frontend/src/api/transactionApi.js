import axiosClient from "./axiosClient";

export const getTransactions = async () => {
  const response = await axiosClient.get("/Transactions");
  return response.data;
};

export const getTransaction = async (id) => {
  const response = await axiosClient.get(
    `/Transactions/${id}`
  );

  return response.data;
};

export const getAccountTransactions = async (
  accountId,
  params = {}
) => {
  const response = await axiosClient.get(
    `/Transactions/account/${accountId}`,
    {
      params,
    }
  );

  return response.data;
};

export const deposit = async (data) => {
  const response = await axiosClient.post(
    "/Transactions/deposit",
    data
  );

  return response.data;
};

export const withdraw = async (data) => {
  const response = await axiosClient.post(
    "/Transactions/withdraw",
    data
  );

  return response.data;
};

export const transfer = async (data) => {
  const response = await axiosClient.post(
    "/Transactions/transfer",
    data
  );

  return response.data;
};

export const getAccountSummary = async (accountId) => {
  const response = await axiosClient.get(
    `/Transactions/account/${accountId}/summary`
  );

  return response.data;
};