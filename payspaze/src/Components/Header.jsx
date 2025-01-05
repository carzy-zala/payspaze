import React, { useEffect, useState } from "react";
import { Button } from "../Components/index.jsx";
import { Link } from "react-router-dom";
import setToken from "../utils/setToken.js";
import { apiRoutes } from "../service/ApiRoutes.js";
import { axiosGet } from "../service/AxiosConfig.js";
import toast, { Toaster } from "react-hot-toast";

function Header() {
  const [isLoggedInUser, setIsLoggedInUser] = useState(
    !!localStorage.getItem("accessToken")
  );

  const [balance, setBalance] = useState({
    eth: "",
    btc: "",
  });

  const updateLoginState = () => {
    setIsLoggedInUser(!!localStorage.getItem("accessToken"));
    setBalance({
      btc : localStorage.getItem("BTC"),
      eth : localStorage.getItem("ETH")
    });
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (!isLoading) {
      setIsLoading(true);

      const response = await axiosGet(apiRoutes.LOGOUT_USER);

      if (response.success) {
        await toast.success(response.message);
        setToken();
        // updateLoginState();
      } else {
        toast.error(response.message);
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateLoginState();
    }, 100);

    return () => clearInterval(interval); // Cleanup interval when component unmounts
  }, []);

  return (
    <div className="bg-primary px-4 grid grid-cols-[1fr_2fr]  min-h-16  items-center gap-3 shadow-header-shodow py-2">
      <Link to="/" className="outline-none">
        <h1 className="text-2xl font-bold text-teal-600 font-sans">
          Pay
          <span className="text-orange-400">Spaze</span>
        </h1>
      </Link>

      {isLoggedInUser ? (
        <div className="justify-self-end  grid  md:grid-cols-[2fr_0fr] gap-3 text-white place-items-center">
          <div className="hidden md:grid  md:grid-cols-3 gap-3 place-items-center">
            Your Balance :
            <div className="shadow-custom px-4 py-1.5 rounded-md bg-red-400 font-semibold">
              ETH : {localStorage.getItem("ETH")}{" "}
            </div>
            <div className="shadow-custom px-4 py-1.5 rounded-md bg-red-400 font-semibold">
              BTC : {localStorage.getItem("BTC")}
            </div>
          </div>
          <div>
            <Button
              children="LOGOUT"
              className=" px-4 py-1.5 shadow-custom text-white mr-4 rounded-md text-[14px] tracking-wide "
              onClick={handleLogout}
            />
            <Toaster />
          </div>
        </div>
      ) : (
        <div className="justify-self-end grid grid-cols-2">
          <Link to="/sign-in">
            <Button
              children="LOG IN"
              className=" px-4 py-1.5 shadow-custom text-white mr-4 rounded-md text-[14px] tracking-wide "
            />
          </Link>
          <Link to="/sign-up">
            <Button
              children="SIGN UP"
              className="  px-4 py-1.5 shadow-custom text-white text-[14px] tracking-wide rounded-md"
            />
          </Link>
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default Header;
