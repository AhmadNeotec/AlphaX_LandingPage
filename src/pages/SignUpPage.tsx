import { EMAIL_PATTERN } from "@constants/index";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@utils/index";
import Logo from "@components/Logo";
import { rootStore } from "@store/index";
import { withApiAuthHeaders } from "@api/authHeaders";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const features = [
  { icon: "🛍️", name: "Sales", description: "Manage your sales and invoicing" },
  { icon: "📊", name: "Chart of Accounts", description: "Financial management" },
  { icon: "📦", name: "Inventory", description: "Track your stock levels" },
  { icon: "👥", name: "Clients", description: "Customer relationship management" },
  { icon: "🏪", name: "Point of Sale", description: "Retail transactions" },
  { icon: "🏢", name: "Branches", description: "Multi-location management" },
  { icon: "📅", name: "Booking", description: "Appointment scheduling" },
  { icon: "👥", name: "Human Resources", description: "Employee management" },
  { icon: "🎫", name: "Memberships", description: "Subscription management" },
  { icon: "💳", name: "Points and Credits", description: "Loyalty programs" },
  { icon: "📋", name: "Work Order", description: "Service management" }
];

const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlanId = location.state?.planId;
  if (selectedPlanId) {
    console.log("SignUpPage loaded with selected plan:", selectedPlanId);
  }

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const [signing, setSigning] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);
  const handleClientLogin = rootStore(({ handleClientLogin }) => handleClientLogin);

  const onSubmit = async (data: Record<string, string>) => {
    setSigning(true);
    
    // Validate phone number
    const currentPhoneNumber = phoneNumber || data.phoneNumber;
    if (!currentPhoneNumber || currentPhoneNumber.length < 8) {
      enqueueSnackbar("Please enter a valid mobile number", { variant: "error" });
      setSigning(false);
      return;
    }
    
    try {
      const signupPayload = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: currentPhoneNumber,
      };

      console.log("Signup API payload:", signupPayload);

      const signupRes = await fetch(
        "https://test.neotec.ai/api/method/alphax_erp.api.signup.signup",
        {
          method: "POST",
          headers: withApiAuthHeaders(),
          body: JSON.stringify(signupPayload),
          credentials: "include",
        }
      );

      console.log("Signup API response status:", signupRes.status);
      const signupData = await signupRes.json();
      console.log("Signup API response body:", signupData);

      const token =
        signupData?.token ??
        signupData?.message?.token ??
        signupData?.data?.token ?? null;

      if (signupRes.ok && token) {
        enqueueSnackbar("Signup successful!", { variant: "success" });

        // Persist user and token for subsequent authenticated pages
        localStorage.setItem("user", data.email);
        localStorage.setItem("token", token);
        localStorage.setItem("tk", token);

        // Update in-memory auth state
        handleClientLogin(token);

        reset();
        setPhoneNumber("");
        navigate("/clientLogin", { replace: true });
      } else {
        // Backend returns only a success message without a token → auto-login then redirect
        if (
          signupRes.ok &&
          (signupData?.message?.status === "success" ||
            /signup successful/i.test(String(signupData?.message?.message || signupData?.message || "")))
        ) {
          try {
            const loginRes = await fetch(
              "https://test.neotec.ai/api/method/alphax_erp.api.login.login",
              {
                method: "POST",
                headers: withApiAuthHeaders(),
                body: JSON.stringify({ email: data.email, password: data.password }),
                credentials: "include",
              }
            );

            const loginData = await loginRes.json();
            const loginToken = loginData?.message?.token;
            if (loginRes.ok && loginToken) {
              enqueueSnackbar("Signup successful! Redirecting to your dashboard...", { variant: "success" });
              localStorage.setItem("user", data.email);
              localStorage.setItem("token", loginToken);
              localStorage.setItem("tk", loginToken);
              handleClientLogin(loginToken);
              reset();
              navigate("/clientLogin", { replace: true });
            } else {
              // Fallback to login page if auto-login fails
              enqueueSnackbar("Signup completed. Please log in to continue.", { variant: "info" });
              reset();
              setPhoneNumber("");
              navigate("/", { replace: true });
              setTimeout(() => toggleStarted(), 300);
            }
          } catch (e) {
            enqueueSnackbar("Signup completed. Please log in to continue.", { variant: "info" });
            reset();
            setPhoneNumber("");
            navigate("/", { replace: true });
            setTimeout(() => toggleStarted(), 300);
          }
        } else {
          const apiMessage =
            signupData?.message?.message || signupData?.message || "Signup failed. Please try again.";
          throw new Error(apiMessage);
        }
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as Error).message || "Internal error. Please try again later";
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setSigning(false);
    }
  };

  return (
    <>
      <style>
        {`
          .react-tel-input {
            width: 100% !important;
          }
          
          .react-tel-input .form-control {
            width: 100% !important;
            height: 3.25rem !important;
            border-radius: 0.75rem !important;
            border: 1px solid rgba(229, 231, 235, 0.8) !important;
            background-color: rgba(255, 255, 255, 0.5) !important;
            backdrop-filter: blur(4px) !important;
            padding: 0.75rem 1rem !important;
            padding-left: 4.5rem !important;
            font-size: 0.875rem !important;
            transition: all 0.3s ease !important;
            color: #374151 !important;
          }
          
          .react-tel-input .form-control:focus {
            border-color: #774A67 !important;
            box-shadow: 0 0 15px rgba(119, 74, 103, 0.3) !important;
            outline: none !important;
          }
          
          .react-tel-input .flag-dropdown {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            height: 100% !important;
            border-radius: 0.75rem 0 0 0.75rem !important;
            border: 1px solid rgba(229, 231, 235, 0.8) !important;
            background-color: rgba(255, 255, 255, 0.5) !important;
            backdrop-filter: blur(4px) !important;
            border-right: none !important;
            width: 4rem !important;
          }
          
          .react-tel-input .form-control {
            border-left: none !important;
            border-radius: 0 0.75rem 0.75rem 0 !important;
          }
          
          .react-tel-input .selected-flag {
            height: 100% !important;
            padding: 0 0.75rem !important;
            border-radius: 0.75rem 0 0 0.75rem !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }
          
          .react-tel-input .selected-flag .flag {
            margin-right: 0.25rem !important;
            transform: scale(1.2) !important;
          }
          
          .react-tel-input .selected-flag .arrow {
            display: none !important;
          }
          
          .react-tel-input .selected-flag .selected-dial-code {
            color: #6b7280 !important;
            font-weight: 500 !important;
            font-size: 0.875rem !important;
          }
          
          .dark .react-tel-input .form-control {
            background-color: rgba(15, 23, 42, 0.5) !important;
            border-color: rgba(75, 85, 99, 0.8) !important;
            color: #d1d5db !important;
          }
          
          .dark .react-tel-input .flag-dropdown {
            background-color: rgba(15, 23, 42, 0.5) !important;
            border-color: rgba(75, 85, 99, 0.8) !important;
          }
          
          .dark .react-tel-input .selected-flag .selected-dial-code {
            color: #9ca3af !important;
          }
          
          .react-tel-input .country-list {
            background-color: white !important;
            border: 1px solid rgba(229, 231, 235, 0.8) !important;
            border-radius: 0.75rem !important;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
            max-height: 200px !important;
            overflow-y: auto !important;
          }
          
          .dark .react-tel-input .country-list {
            background-color: #1f2937 !important;
            border-color: rgba(75, 85, 99, 0.8) !important;
            color: #d1d5db !important;
          }
          
          .react-tel-input .country-list .country {
            padding: 0.75rem 1rem !important;
            transition: background-color 0.2s ease !important;
            border-bottom: 1px solid rgba(229, 231, 235, 0.3) !important;
          }
          
          .react-tel-input .country-list .country:last-child {
            border-bottom: none !important;
          }
          
          .react-tel-input .country-list .country:hover {
            background-color: rgba(119, 74, 103, 0.1) !important;
          }
          
          .dark .react-tel-input .country-list .country {
            border-bottom: 1px solid rgba(75, 85, 99, 0.3) !important;
          }
          
          .dark .react-tel-input .country-list .country:hover {
            background-color: rgba(119, 74, 103, 0.2) !important;
          }
          
          .react-tel-input .country-list .search {
            padding: 0.75rem 1rem !important;
            border-bottom: 1px solid rgba(229, 231, 235, 0.5) !important;
          }
          
          .react-tel-input .country-list .search input {
            width: 100% !important;
            padding: 0.5rem 0.75rem !important;
            border: 1px solid rgba(229, 231, 235, 0.8) !important;
            border-radius: 0.5rem !important;
            background-color: rgba(255, 255, 255, 0.8) !important;
            font-size: 0.875rem !important;
          }
          
          .dark .react-tel-input .country-list .search {
            border-bottom: 1px solid rgba(75, 85, 99, 0.5) !important;
          }
          
          .dark .react-tel-input .country-list .search input {
            background-color: rgba(31, 41, 55, 0.8) !important;
            border-color: rgba(75, 85, 99, 0.8) !important;
            color: #d1d5db !important;
          }
        `}
      </style>
      <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-[#774A67]/10 via-[#774A67]/20 to-[#774A67]/30 dark:from-[#774A67]/30 dark:via-[#774A67]/25 dark:to-[#774A67]/20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#774A67]/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#774A67]/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiA0OGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyUzEyIDU0LjYyNyAxMiA0OCA1LjM3MyAzNiAxMiAzNnMxMiA1LjM3MyAxMiAxMnpNMTIgMGM2LjYyNyAwIDEyIDUuMzczIDEyIDEyUzE4LjYyNyAyNCAxMiAyNCAwIDE4LjYyNyAwIDEyczUuMzczLTEyIDEyLTEyem0zNiAxMmMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyem0wIDM2YzAgNi42MjctNS4zNzMgMTItMTIgMTJzLTEyLTUuMzczLTEyLTEyIDUuMzczLTEyIDEyLTEyIDEyIDUuMzczIDEyIDEyeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')] opacity-15 dark:opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#774A67]/20 dark:to-[#774A67]/25" />
      </div>
      <div className="flex flex-col lg:flex-row min-h-screen relative z-10">
        {/* Left Section */}
        <div className="hidden lg:flex lg:flex-1 p-6 bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 flex-col overflow-y-auto">
          <div className="max-w-xl mx-auto w-full pt-4">
            <Logo className="w-28 mb-8 transform hover:scale-105 transition-transform duration-300" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your business needs in one software!
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
              AlphaX covers more than 50 industries, select yours and get started in minutes. 
              Find all the essential elements to manage your business from sales and invoicing, 
              accounting, inventory, CRM and HRM.
            </p>
            <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
              Easily activate or deactivate modules based on your industry needs!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_8px_2px_#774A67,0_0_12px_4px_#774A67] hover:border-[#774A67] border border-transparent"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">{feature.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Right Section - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-2 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-sm dark:bg-gray-800/90 rounded-2xl shadow-lg p-4 sm:p-8 transform hover:scale-[1.01] transition-all duration-300 mx-2 my-8 sm:my-0">
            <div className="flex justify-end mb-6">
              <a href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200 text-sm sm:text-base">Home</a>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign up</h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6">Only two minutes to start!</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    {...register("firstName", { required: "First name is required" })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] transition-all duration-300 text-sm"
                    placeholder="First Name *"
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    {...register("lastName", { required: "Last name is required" })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] transition-all duration-300 text-sm"
                    placeholder="Last Name *"
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <input
                    type="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: EMAIL_PATTERN,
                        message: "Invalid email format",
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] transition-all duration-300 text-sm"
                    placeholder="Email Address *"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.email.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] transition-all duration-300 text-sm"
                    placeholder="Password *"
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-xs text-red-600">{formErrors.password.message}</p>
                  )}
                </div>
              </div>
              
              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number <span className="text-red-400">*</span>
                </label>
                <PhoneInput
                  country={"sa"}
                  value={phoneNumber}
                  onChange={(value) => {
                    setPhoneNumber(value);
                    // Update the form value
                    const form = document.querySelector('form');
                    if (form) {
                      const input = form.querySelector('input[name="phoneNumber"]') as HTMLInputElement;
                      if (input) {
                        input.value = value;
                      }
                    }
                  }}
                  specialLabel={""}
                  enableSearch={true}
                  searchPlaceholder="Search country..."
                  inputProps={{
                    name: "phoneNumber",
                    required: true,
                    placeholder: "Enter your mobile number",
                  }}
                />
              </div>
              
              <button
                type="submit"
                disabled={signing}
                className={cn(
                  "w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
                  "bg-gradient-to-r from-[#774A67] to-[#5e3752] hover:from-[#5e3752] hover:to-[#774A67]",
                  "shadow-lg hover:shadow-xl hover:shadow-[#774A67]/30",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                  "focus:outline-none focus:ring-2 focus:ring-[#774A67] focus:ring-offset-2 focus:shadow-[0_0_25px_rgba(119,74,103,0.5)]"
                )}
              >
                {signing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing up...</span>
                  </div>
                ) : (
                  "Sign Up"
                )}
              </button>
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                  Have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      toggleStarted();
                    }}
                    className="text-[#774A67] hover:text-[#5e3752] font-medium transition-colors duration-200 focus:outline-none"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignUpPage;