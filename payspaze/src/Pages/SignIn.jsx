import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faEye,
  faEyeSlash,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "../Components/index.jsx";
import toast, { Toaster } from "react-hot-toast";
import { axiosPost } from "../service/AxiosConfig.js";
import { apiRoutes } from "../service/ApiRoutes.js";
import setToken from "../utils/setToken.js";

function SignIn() {
  const navigator = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [currentFocus, setCurrentFocus] = useState({
    email: false,
    password: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // react-hook-form setup
  const {
    register,
    getFieldState,
    formState,
    formState: { isDirty, dirtyFields, touchedFields, isValid, errors },
    handleSubmit,
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    if (!isLoading) {
      const { email, password } = data;
      setIsLoading(true);

      const response = await axiosPost(apiRoutes.LOGIN_USER, {
        email,
        password,
      });

      console.log(response);

      if (response.success) {
        toast.success(response.message);

        localStorage.setItem("name", response.data.user.name);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("ETH", response.data.user.eth);
        localStorage.setItem("BTC", response.data.user.btc);

        setToken(response.data.accessToken, response.data.refreshToken);
        navigator("/");
      } else {
        toast.error(response.message);
      }

      setIsLoading(false);
    }

    // Navigate or make API calls here
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-rows-[1fr_0fr_0fr_0fr] gap-6 px-6 py-8 mx-4 mb-8 mt-16 shadow-header-shodow rounded-lg max-w-xl md:mx-auto"
    >
      <div className="grid grid-rows-[0fr_0fr_0fr] gap-5">
        <h1 className="text-3xl justify-self-center">Login</h1>

        {/* Email Field */}
        <div>
          <div
            className={`py-3 px-4 rounded-md grid grid-cols-[0fr_auto] items-center  relative border ${
              getFieldState("email").invalid
                ? "border-red-600"
                : "border-gray-300"
            }   ${
              currentFocus.email &&
              (!getFieldState("email").invalid
                ? "outline outline-primary"
                : "outline outline-red-500")
            }`}
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
            <input
              className="pl-3 text-xl outline-none w-full "
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]/,
                  message: "Invalid email address",
                },
              })}
              onBlur={async () => {
                await trigger("email");
                setCurrentFocus((prev) => ({ ...prev, email: false }));
              }}
              onFocus={() => {
                setCurrentFocus((prev) => ({ ...prev, email: true }));
              }}
            />
            <div
              className={`absolute ${
                currentFocus.email
                  ? getFieldState("email").invalid
                    ? "text-red-500"
                    : "text-primary"
                  : getFieldState("email").invalid
                  ? "text-red-500"
                  : "text-gray-400"
              } 
              
              -top-3 px-1 ml-2 bg-white text-sm`}
            >
              Email
            </div>
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm ">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <div
            className={`py-3 pl-4 pr-2 rounded-md grid grid-cols-[0fr_auto_0fr] items-center relative border ${
              getFieldState("password").invalid
                ? "border-red-600"
                : "border-gray-300"
            }   ${
              currentFocus.password &&
              (!getFieldState("password").invalid
                ? "outline outline-primary"
                : "outline outline-red-500")
            }`}
          >
            <FontAwesomeIcon icon={faLock} className="text-xl" />
            <input
              className="pl-3 text-xl outline-none w-full "
              type={showPassword ? "text" : "password"}
              placeholder="Enter your email"
              {...register("password", {
                required: "password is required",
              })}
              onBlur={async () => {
                await trigger("password");
                setCurrentFocus((prev) => ({ ...prev, password: false }));
              }}
              onFocus={() => {
                setCurrentFocus((prev) => ({ ...prev, password: true }));
              }}
            />
            <div
              className={`absolute ${
                currentFocus.password
                  ? getFieldState("password").invalid
                    ? "text-red-500"
                    : "text-primary"
                  : getFieldState("password").invalid
                  ? "text-red-500"
                  : "text-gray-400"
              } -top-3 px-1 ml-2 bg-white text-sm`}
            >
              Password
            </div>

            <Button
              onClick={() => setShowPassword(!showPassword)}
              type="button"
              className="w-9 px-1 grid place-items-center"
            >
              {showPassword ? (
                <FontAwesomeIcon icon={faEye} className="text-[20px]" />
              ) : (
                <FontAwesomeIcon icon={faEyeSlash} className="text-[20px]" />
              )}
            </Button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm ">{errors.password.message}</p>
          )}
        </div>
      </div>
      {/* Forgot Password */}
      <div className="justify-self-end self-center">
        <Button
          children="Forgot password?"
          className="text-primary text-md font-medium"
        />
      </div>

      {/* Login Button */}
      <div className="">
        <Button
          type="submit"
          children={
            isLoading ? (
              <div className="grid grid-cols-[1fr_0fr] place-items-center gap-2">
                <span>Processing ... </span>
                <div class="w-6 h-6 border-2 border-t-white border-gray-300 rounded-full animate-spin "></div>
              </div>
            ) : (
              "LOGIN"
            )
          }
          className="bg-primary text-white text-center w-full py-2 rounded-md grid place-items-center"
        />
      </div>

      {/* Signup Link */}
      <div className="justify-self-center self-center">
        <Button
          children="Don't have an account? Signup"
          onClick={() => navigator("/sign-up")}
          className="text-primary text-md font-medium"
        />
        <Toaster />
      </div>
    </form>
  );
}

export default SignIn;
