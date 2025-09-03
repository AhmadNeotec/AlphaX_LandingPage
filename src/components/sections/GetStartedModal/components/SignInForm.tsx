import { EMAIL_PATTERN } from "@constants/index";
import { enqueueSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { rootStore } from "@store/index";
import React, { useState, useEffect } from "react";
import Loader from "@components/common/Loader";
import { cn } from "@utils/index";
import { useNavigate } from "react-router-dom";
import Logo from "@components/Logo";
import { withApiAuthHeaders } from "@api/authHeaders";
import { FaEye, FaEyeSlash } from "react-icons/fa";
//import PaymentDetailsModal from "../../../../pages/PaymentDetailsModal";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpPassword, setFpPassword] = useState("");
  const [fpConfirm, setFpConfirm] = useState("");
  const [fpShowPwd, setFpShowPwd] = useState(false);
  const [fpShowConfirm, setFpShowConfirm] = useState(false);
  const [fpLoading, setFpLoading] = useState(false);

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
    setFpEmail("");
    setFpPassword("");
    setFpConfirm("");
    setShowForgotModal(true);
  };

  const submitForgotPassword = async () => {
    try {
      if (!fpEmail || !EMAIL_PATTERN.test(fpEmail)) {
        enqueueSnackbar("Enter a valid email", { variant: "warning" });
        return;
      }
      if (!fpPassword || fpPassword.length < 6) {
        enqueueSnackbar("Password must be at least 6 characters", { variant: "warning" });
        return;
      }
      if (fpPassword !== fpConfirm) {
        enqueueSnackbar("Passwords do not match", { variant: "warning" });
        return;
      }
      setFpLoading(true);
      const res = await fetch("https://test.neotec.ai/api/method/alphax_erp.api.change_password.change_user_password", {
        method: "POST",
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ userId: fpEmail, newPassword: fpPassword }),
      });
      let data: any = null;
      try {
        data = await res.json();
      } catch {}
      console.log('[ForgotPassword] Response status:', res.status);
      console.log('[ForgotPassword] Raw data:', data);

      const status = data?.message?.status || data?.status;
      const apiMsg = data?.message?.message || data?.message || (status === 'success' ? 'Password updated successfully.' : 'Failed to reset password');

      if (!res.ok || status !== "success") {
        throw new Error(typeof apiMsg === 'string' ? apiMsg : 'Failed to reset password');
      }

      enqueueSnackbar(typeof apiMsg === 'string' ? apiMsg : 'Password updated successfully.', { variant: "success" });
      setShowForgotModal(false);
      setFpEmail("");
      setFpPassword("");
      setFpConfirm("");
    } catch (err: any) {
      const errorMessage = typeof err?.message === 'string' ? err.message : 'Error updating password';
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setFpLoading(false);
    }
  };

  //const OAUTH_CLIENT_ID = "CLIENT_ID_FROM_OAUTH_CLIENT"; // TODO: Replace with your actual client ID
  //const OAUTH_REDIRECT_URI = "https://neotechis.com/callback";
  //const OAUTH_AUTH_URL = `https://test.neotec.ai/api/method/frappe.integrations.oauth2.authorize?client_id=${OAUTH_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URI)}&scope=all`;
  
  const OAUTH_CLIENT_ID = "0hvu703krt"; // from your Frappe OAuth Client
  const OAUTH_REDIRECT_URI = "https://neotechis.com/callback";
  const OAUTH_SCOPE = "all";
  const OAUTH_AUTH_URL = `https://test.neotec.ai/api/method/frappe.integrations.oauth2.authorize?client_id=${OAUTH_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(OAUTH_REDIRECT_URI)}&scope=${encodeURIComponent(OAUTH_SCOPE)}`;

  // Remove old onSubmit logic and replace with OAuth redirect
  const onOAuthLogin = () => {
    try {
      // Persist the email the user typed for downstream API usage
      // This should only be cleared on explicit logout
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emailVal = (document.getElementById('email') as HTMLInputElement)?.value || '';
      if (emailVal) localStorage.setItem('user', emailVal);
    } catch {}
    window.location.href = OAUTH_AUTH_URL;
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
          <form key={formKey} className="w-full space-y-6" onSubmit={e => { e.preventDefault(); onOAuthLogin(); }}>
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
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300 pr-12"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400 hover:text-[#774A67] focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
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
                className="w-full py-3 px-4 flex justify-center items-center gap-2 text-base font-semibold rounded-xl bg-gradient-to-r from-[#774A67] to-[#5e3752] text-white hover:from-[#5e3752] hover:to-[#774A67] transform transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign in
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
    {/* Forgot Password Modal */}
    {showForgotModal && (
      <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
          <button
            className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800"
            onClick={() => setShowForgotModal(false)}
            aria-label="Close"
          >
            &times;
          </button>
          <h3 className="text-xl font-bold text-[#774A67] mb-4">Reset Password</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={fpEmail}
                onChange={(e) => setFpEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/40"
                placeholder="your@email.com"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <input
                type={fpShowPwd ? "text" : "password"}
                value={fpPassword}
                onChange={(e) => setFpPassword(e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/40"
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => setFpShowPwd((v) => !v)}
              >
                {fpShowPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
              <input
                type={fpShowConfirm ? "text" : "password"}
                value={fpConfirm}
                onChange={(e) => setFpConfirm(e.target.value)}
                className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white/70 dark:bg-gray-900/40"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-500"
                onClick={() => setFpShowConfirm((v) => !v)}
              >
                {fpShowConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="button"
              disabled={fpLoading}
              onClick={submitForgotPassword}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#774A67] to-[#5e3752] text-white font-semibold hover:from-[#5e3752] hover:to-[#774A67] disabled:opacity-60"
            >
              {fpLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default SignInForm;
