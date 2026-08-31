import axiosClient from "./axiosClient";

export const registerUser = async (data) => {
  const response = await axiosClient.post(
    "/Auth/register",
    data
  );

  return response.data;
};

export const loginUser = async (data) => {
  const response = await axiosClient.post(
    "/Auth/login",
    data
  );

  return response.data;
};