import { EMAIL_PATTERN } from "@constants/index";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { rootStore } from "@store/index";
import React, { useState, useEffect } from "react";
import Loader from "@components/common/Loader";
import { cn } from "@utils/index";
import { useNavigate } from "react-router-dom";
import Logo from "@components/Logo";
import PaymentDetailsModal from "../../../../pages/PaymentDetailsModal";

type Props = {
  toggleSignUp: () => void;
  loginSuccess: boolean;
  setLoginSuccess: React.Dispatch<React.SetStateAction<boolean>>;
};

const SignInForm = ({ loginSuccess, setLoginSuccess }: Props) => {
  const [formKey, setFormKey] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const clientLogin = rootStore(({ handleClientLogin }) => handleClientLogin);
  const [logging, setLogging] = useState(false);
  const navigate = useNavigate();
  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);

  // Reset form on component mount
  useEffect(() => {
    setFormKey(prev => prev + 1);
    setTimeout(() => {
      reset({ email: "", password: "" });
      setValue("email", "");
      setValue("password", "");
    }, 0);
  }, [reset, setValue]);

  useEffect(() => {
    if (!loginSuccess) {
      setFormKey(prev => prev + 1);
      setTimeout(() => {
        reset({ email: "", password: "" });
        setValue("email", "");
        setValue("password", "");
      }, 0);
    }
  }, [loginSuccess, reset, setValue]);

  useEffect(() => {
    const storedLoginSuccess = localStorage.getItem("loginSuccess");
    if (storedLoginSuccess === "false") {
      setLoginSuccess(false);
    }
  }, []);

  const handleForgotPassword = () => {
    enqueueSnackbar("Forgot password functionality coming soon!", { variant: "info" });
  };

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log("🔐 Attempting login with:", data);
    setLogging(true);
    try {
      // Check for super admin credentials
      if (data.email === "Superadmin@gmail.com" && data.password === "SuperAdmin@1234") {
        console.log("✅ Super admin login successful");
        localStorage.setItem("isSuperAdmin", "true");
        setLoginSuccess(true);
        enqueueSnackbar("Welcome Super Admin!", { variant: "success" });
        setTimeout(() => {
          console.log("➡️ Redirecting to CMS panel dashboard");
          toggleStarted();
          navigate("/cms-panel", { replace: true });
        }, 500);
        return;
      }

      // Regular login flow
      localStorage.removeItem("sid");
      console.log("🧹 Cleared localStorage token");

      await fetch(" http://172.22.60.121:8000/api/method/logout", {
        method: "GET",
        credentials: "include",
      });
      console.log("🔄 Forced logout of any existing session");

      const loginRes = await fetch(" http://172.22.60.121:8000/api/method/alphax_erp.api.login.login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      console.log("📥 Login response status:", loginRes.status);

      if (!loginRes.ok) {
        const err = await loginRes.json();
        console.error("❌ Login failed:", err);

        const messages = JSON.parse(err._server_messages || "[]");
        const errorMsg = messages.length ? messages[0] : err.message || "Login failed";
        throw new Error(errorMsg);
      }

      const result = await loginRes.json();
      console.log("✅ Login successful, response:", result);

      const { token, user } = result?.message || {};

      if (!token || !user) {
        console.error("❗ Missing token or user in response:", result);
        throw new Error("Invalid response: missing token or user");
      }

      localStorage.setItem("sid", token);
      console.log("💾 Token saved to localStorage");

      // Store user id in localStorage for later use
      localStorage.setItem("user", user);
      console.log("💾 User id saved to localStorage:", user);

      clientLogin(token);
      console.log("🔓 clientLogin called");

      // Directly go to client dashboard after login
      setTimeout(() => {
        toggleStarted();
        navigate("/clientLogin");
      }, 500);
    } catch (error) {
      console.error("🚨 Login error:", error);
      enqueueSnackbar((error as Error).message || "Login failed", {
        variant: "error",
      });
      // Reset form on error
      setFormKey(prev => prev + 1);
      setTimeout(() => {
        reset({ email: "", password: "" });
        setValue("email", "");
        setValue("password", "");
      }, 0);
    } finally {
      setLogging(false);
    }
  };

  return (
    <>
    <div className={cn(
      "w-full mx-4 my-4 lg:mx-0 lg:mt-7 bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:bg-gray-800/90 dark:border-gray-700/50 md:max-w-[450px] transform perspective-1000 hover:scale-[1.02] transition-all duration-300",
      loginSuccess && "md:max-w-max"
    )}>
      {!loginSuccess && (
        <div className="p-8 sm:p-10">
          {/* Logo Section */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#774A67] to-[#5e3752] bg-clip-text text-transparent leading-relaxed pb-1">
              Sign in
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              What you need to manage your business in one software!
            </p>
          </div>

          {/* Form Section */}
          <form key={formKey} className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Email has invalid format",
                    },
                  })}
                />
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.email?.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                  })}
                />
                {formErrors.password && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.password?.message}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-[#774A67] hover:text-[#5e3752] font-medium transition-colors duration-200"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={logging}
                className="w-full py-3 px-4 flex justify-center items-center gap-2 text-base font-semibold rounded-xl bg-gradient-to-r from-[#774A67] to-[#5e3752] text-white hover:from-[#5e3752] hover:to-[#774A67] transform transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {logging ? <Loader /> : "Sign in"}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-500 bg-white dark:bg-gray-800">Or</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account yet?{" "}
              <a
                href="/signup"
                onClick={(e) => {
                  e.preventDefault();
                  toggleStarted();
                  navigate("/signup");
                }}
                className="font-medium text-[#774A67] hover:text-[#5e3752] transition-colors duration-200"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default SignInForm;
