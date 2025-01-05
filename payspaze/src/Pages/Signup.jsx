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
import {apiRoutes} from "../service/ApiRoutes.js"
import {axiosPost} from "../service/AxiosConfig.js"

function SignIn() {
  const navigator = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [currentFocus, setCurrentFocus] = useState({
    name: false,
    email: false,
    password: false,
    cfpassword: false,
  });

  // react-hook-form setup
  const {
    register,
    getFieldState,
    formState,
    formState: { isDirty, dirtyFields, touchedFields, isValid, errors },
    handleSubmit,
    trigger,
    watch,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);


  const onSubmit = async (data) => {

    if (!isLoading) {
      setIsLoading(true);
      const { name, email, password } = data;

      const response = await axiosPost(apiRoutes.REGISTER_USER, {
        name,
        email,
        password,
      });

      if (response.success) {
        toast.success(response.message);
        navigator("/login")
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
      className="grid grid-rows-[1fr_0fr_0fr] gap-6 md:gap-10 px-6 py-5 mx-4 mb-8 mt-16 shadow-header-shodow rounded-lg max-w-xl md:mx-auto"
    >
      <div className="grid grid-rows-[0fr_0fr_0fr] gap-7 md:gap-8">
        <h1 className="text-3xl justify-self-center">Signup</h1>

        {/* Name Field */}
        <div>
          <div
            className={`py-3 px-2 rounded-md items-center  relative border ${
              getFieldState("name").invalid
                ? "border-red-600"
                : "border-gray-300"
            }   ${
              currentFocus.name &&
              (!getFieldState("name").invalid
                ? "outline outline-primary"
                : "outline outline-red-500")
            }  `}
          >
            <input
              className={`pl-3 text-xl outline-none w-full  ${
                getFieldState("name").invalid
                  ? "placeholder-red-600"
                  : "placeholder-gray-400"
              } `}
              type="text"
              placeholder={currentFocus.name ? "" : "Name"}
              {...register("name", {
                required: "Name is required",
              })}
              onBlur={async () => {
                await trigger("name");
                setCurrentFocus((prev) => ({ ...prev, name: false }));
              }}
              onFocus={() => {
                setCurrentFocus((prev) => ({ ...prev, name: true }));
              }}
            />
            {(currentFocus.name || watch("name")) && (
              <div
                className={`absolute ${
                  currentFocus.name
                    ? getFieldState("name").invalid
                      ? "text-red-500"
                      : "text-primary"
                    : getFieldState("name").invalid
                    ? "text-red-500"
                    : "text-gray-400"
                } 
              
              -top-3 px-1 ml-2 bg-white text-sm`}
              >
                Name
              </div>
            )}
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm ">{errors.name.message}</p>
          )}
        </div>

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

        {/* Confirm Password Field */}

        <div>
          <div
            className={`py-3 pl-4 pr-2 rounded-md grid grid-cols-[0fr_auto_0fr] items-center relative border ${
              getFieldState("cfpassword").invalid
                ? "border-red-600"
                : "border-gray-300"
            }   ${
              currentFocus.cfpassword &&
              (!getFieldState("cfpassword").invalid
                ? "outline outline-primary"
                : "outline outline-red-500")
            }`}
          >
            <FontAwesomeIcon icon={faLock} className="text-xl" />
            <input
              className="pl-3 text-xl outline-none w-full "
              type={showPassword ? "text" : "password"}
              {...register("cfpassword", {
                required: "Please confirm your password ",
                validate: (value) => {
                  return value === watch("password") || "Password must match";
                },
              })}
              onBlur={async () => {
                await trigger("cfpassword");
                setCurrentFocus((prev) => ({ ...prev, cfpassword: false }));
              }}
              onFocus={() => {
                setCurrentFocus((prev) => ({ ...prev, cfpassword: true }));
              }}
            />
            <div
              className={`absolute ${
                currentFocus.cfpassword
                  ? getFieldState("cfpassword").invalid
                    ? "text-red-500"
                    : "text-primary"
                  : getFieldState("cfpassword").invalid
                  ? "text-red-500"
                  : "text-gray-400"
              } -top-3 px-1 ml-2 bg-white text-sm`}
            >
              Confirm Password
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

          {errors.cfpassword && (
            <p className="text-red-500 text-sm ">{errors.cfpassword.message}</p>
          )}
        </div>
      </div>

      {/* Signup Button */}
      <div>
        <Button
          type="submit"
          children="SIGNUP"
          className="bg-primary text-white text-center w-full py-2 rounded-md"
        />
      </div>

      {/* Login Link */}
      <div className="justify-self-center self-center">
        <Button
          children="Already have an account? Login"
          onClick={() => navigator("/sign-in")}
          className="text-primary text-md font-medium"
        />
        <Toaster />
      </div>
    </form>
  );
}

export default SignIn;
