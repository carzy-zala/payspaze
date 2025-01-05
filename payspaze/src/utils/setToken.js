import axioInstance from "../service/axios.js";

const setToken = (accessToken = "", refreshToken = "") => {
  return new Promise((resolve) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);

      refreshToken && localStorage.setItem("refreshToken", refreshToken);
      axioInstance.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem("accessToken");
      localStorage.getItem("refreshToken") &&
        localStorage.removeItem("refreshToken");
      delete axioInstance.defaults.headers.common.Authorization;
    }
    resolve();
  });
};

export default setToken;