import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../Components/index.jsx";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";
import { axiosPost } from "../service/AxiosConfig.js";
import { apiRoutes } from "../service/ApiRoutes.js";

function Home() {
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      to: "",
      from: "",
      amount: "",
      description: "",
    },
  });

  const [currentFocus, setCurrentFocus] = useState({
    to: false,
    from: false,
    amount: false,
    description: false,
  });

  const onSubmit = async (data) => {
    if (!isLoading) {
      setIsLoading(true);
      const { to, from, amount, description } = data;

      const response = await axiosPost(apiRoutes.MAKE_PAYMENT, {
        to,
        from,
        amount,
        description: description || "",
      });

      if (response.success) {
        toast.success(response.message);
        console.log(response);
        
        localStorage.setItem("BTC", response.data.user.btc);
        localStorage.setItem("ETH", response.data.user.eth);
        setShowPayment(false);
      } else {
        toast.error(response.message);
      }

      setIsLoading(false);
    }

    reset();
  };

  const handleBlur = (field) => {
    setCurrentFocus((prev) => ({
      ...prev,
      [field]: false,
    }));
  };

  return (
    <div className="grid place-items-center p-8 min-h-[73vh]">
      <div className="grid grid-row-3 gap-3 place-items-center px-2">
        <h1 className="text-4xl text-center">Make a Payment</h1>
        <p className="text-center">
          Click the button below and fill out the form to complete your payment.
        </p>
        <Button
          children="PAYMENT BUTTON"
          className="bg-primary text-white px-4 py-1.5 rounded-md mt-3 text-md tracking-wide shadow-header-shadow"
          onClick={() => setShowPayment(!showPayment)}
        />
      </div>
      {showPayment &&
        createPortal(
          <div className="absolute top-0 left-0 w-full h-full bg-[#000000aa] grid place-items-center ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-rows-[1fr_5fr_1fr] gap-5 bg-white py-4 px-3 rounded-md"
            >
              <div className="text-2xl pl-2">Make a Payment</div>
              <div className="grid grid-rows-4 gap-3 px-2">
                {/* 'To' Field */}
                <div className="relative">
                  <input
                    type="email"
                    {...register("to", {
                      required: true,
                      pattern: {
                        value: /^[^\s@]+@[^\s@]/,
                        message: "Invalid email address",
                      },
                    })}
                    placeholder={!currentFocus.to ? "To *" : ""}
                    onFocus={() =>
                      setCurrentFocus((prev) => ({ ...prev, to: true }))
                    }
                    onBlur={() => handleBlur("to")}
                    className="border rounded-md border-spacing-3 border-gray-400 px-3 py-3  min-w-64 text-lg outline-primary md:w-[600px]"
                  />

                  {(watch("to") !== "" || currentFocus.to) && (
                    <div
                      className={`text-sm align-middle absolute -top-3 bg-white ml-2 px-2 ${
                        watch("to") !== "" && !currentFocus.to
                          ? "text-gray-400"
                          : "text-primary"
                      } `}
                    >
                      To *
                    </div>
                  )}
                </div>

                {/* 'From' Field */}
                <div className="relative">
                  <select
                    {...register("from", {
                      required: true,
                    })}
                    className="border outline-primary rounded-md border-spacing-3 border-gray-400 px-3 py-4  min-w-64 text-lg md:w-[600px] appearance-none "
                    onFocus={() =>
                      setCurrentFocus((prev) => ({ ...prev, from: true }))
                    }
                    onBlur={() =>
                      setCurrentFocus((prev) => ({ ...prev, from: false }))
                    }
                  >
                    <option value="" disabled hidden></option>
                    <option value="-" disabled>
                      Select Currency
                    </option>
                    <option value="BTC">BTC</option>
                    <option value="ETH">ETH</option>
                  </select>

                  {!watch("from") && !currentFocus.from && (
                    <div className="absolute top-[30%] text-xl pl-3 text-gray-400">
                      From *
                    </div>
                  )}

                  <div className="absolute top-1/3  right-0 pr-4 pointer-events-none">
                    <FontAwesomeIcon
                      icon={faCaretDown}
                      className="text-2xl"
                      rotation={currentFocus.from ? 180 : 0}
                    />
                  </div>

                  {(watch("from") !== "" || currentFocus.from) && (
                    <div
                      className={`text-sm align-middle absolute -top-3 bg-white ml-2 px-2 z-50 ${
                        watch("from") !== "" && !currentFocus.from
                          ? "text-gray-400"
                          : "text-primary"
                      } `}
                    >
                      From *
                    </div>
                  )}
                </div>

                {/* 'Amount' Field */}
                <div className="relative">
                  <input
                    type="number"
                    {...register("amount", {
                      required: true,
                      min: {
                        value: 1,
                        message: "Amount must be at least 1",
                      },
                    })}
                    placeholder={!currentFocus.amount ? "Amount *" : ""}
                    onFocus={() =>
                      setCurrentFocus((prev) => ({ ...prev, amount: true }))
                    }
                    onBlur={() => handleBlur("amount")}
                    className="border outline-primary rounded-md border-spacing-3 border-gray-400 px-3 py-3  min-w-64 text-lg md:w-[600px]"
                  />

                  {(watch("amount") !== "" || currentFocus.amount) && (
                    <div
                      className={`text-sm align-middle absolute -top-3 bg-white ml-2 px-2 ${
                        watch("amount") !== "" && !currentFocus.amount
                          ? "text-gray-400"
                          : "text-primary"
                      } `}
                    >
                      Amount *
                    </div>
                  )}
                </div>

                {/* 'Description' Field */}
                <div className="relative">
                  <input
                    type="text"
                    {...register("description", {
                      maxLength: {
                        value: 100,
                        message: "Description must be less than 100 characters",
                      },
                    })}
                    placeholder={!currentFocus.description ? "Description" : ""}
                    onFocus={() =>
                      setCurrentFocus((prev) => ({
                        ...prev,
                        description: true,
                      }))
                    }
                    onBlur={() => handleBlur("description")}
                    className="border outline-primary rounded-md border-spacing-3 border-gray-400 px-3 py-3  min-w-64 text-lg md:w-[600px]"
                  />

                  {(watch("description") !== "" ||
                    currentFocus.description) && (
                    <div
                      className={`text-sm align-middle absolute -top-3 bg-white ml-2 px-2 ${
                        watch("description") !== "" && !currentFocus.description
                          ? "text-gray-400"
                          : "text-primary"
                      } `}
                    >
                      Description
                    </div>
                  )}
                </div>
              </div>

              <div className="self-center grid grid-cols-2 items-center  pt-3 md:grid-cols-[1fr_4fr_4fr_1fr] ">
                <Button
                  className="text-primary  md:col-start-2"
                  children="CANCEL"
                  onClick={() => setShowPayment(false)}
                />
                <Button
                  type="submit"
                  disabled={!isValid}
                  className={`${
                    isValid
                      ? "text-white bg-primary"
                      : "text-gray-500 bg-slate-200"
                  }  p-2 rounded-md  md:col-start-3`}
                  children="SUBMIT"
                />
                <Toaster />
              </div>
            </form>
          </div>,
          document.body
        )}
    </div>
  );
}

export default Home;
