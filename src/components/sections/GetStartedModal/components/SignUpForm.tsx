import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
import { EMAIL_PATTERN } from "@constants/index";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import { cn } from "@utils/index";
import Logo from "@components/Logo";
import { rootStore } from "@store/index";

type Props = {
  toggleSignUp: () => void;
};

const SignUpForm = ({ toggleSignUp }: Props) => {
  const navigate = useNavigate();
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
      siteName: "",
      companyName: "",
      masterOfAccounts: "",
      phoneNumber: "",
      otp: "",
    },
    mode: "onChange",
  });

  const [signing, setSigning] = useState(false);
  const handleClientLogin = rootStore(({ handleClientLogin }) => handleClientLogin);
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState("Initializing...");
  const [currentStep, setCurrentStep] = useState(0);

  // Define signup process steps
  const signupSteps = [
    { title: "Validating Information", description: "Checking your details..." },
    { title: "Creating Account", description: "Setting up your profile..." },
    { title: "Configuring Site", description: "Preparing your workspace..." },
    { title: "Finalizing Setup", description: "Almost there..." },
    { title: "Ready!", description: "Redirecting to your dashboard..." },
  ];

  const updateProgress = (value: number, message: string, step: number = -1) => {
    console.log(`Progress update: ${value}% - ${message}`);
    setProgress(value);
    setStepMessage(message);
    if (step >= 0) {
      setCurrentStep(step);
    } else {
      const newStep = Math.min(Math.floor(value / 20), 4);
      setCurrentStep(newStep);
    }
  };

  const onSubmit = async (data: Record<string, string>) => {
    console.log("Form submission started with data:", data);
    setSigning(true);
    updateProgress(5, "Starting signup process...", 0);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      updateProgress(20, "Validating your information...", 0);
      
      updateProgress(40, "Creating your account...", 1);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response: any = await fetcher.post(ENDPOINTS.signup, { ...data })
        .catch(error => {
          console.error("API request failed:", error);
          throw error;
        });
      
      updateProgress(60, "Setting up your site...", 2);
      await new Promise(resolve => setTimeout(resolve, 800));

      const token = response?.token ?? response?.message?.token ?? null;
      const site_url = response?.site_url ?? response?.message?.site_url ?? null;
      
      updateProgress(80, "Finalizing your workspace...", 3);
      await new Promise(resolve => setTimeout(resolve, 800));

      if (token && site_url) {
        enqueueSnackbar(`🎉 Site created! Welcome to AlphaX, ${data.email}`, { variant: "success" });
        // Persist auth context for app
        localStorage.setItem("access_token", token);
        localStorage.setItem("tk", token);
        localStorage.setItem("user", data.email);
        // Update in-memory store so protected areas work immediately
        handleClientLogin(token);
        reset();

        updateProgress(100, "Redirecting to your dashboard...", 4);
        setTimeout(() => {
          navigate("/clientLogin");
        }, 1500);
      } else {
        updateProgress(100, "⚠️ Site was not created.");
        enqueueSnackbar("Site was not created. Please try again later.", { variant: "warning" });
      }
    } catch (error) {
      const errorMessage =
        ((error as AxiosError)?.response?.data as { message: string })?.message ||
        (error as Error).message ||
        "Internal error. Please try again later";

      enqueueSnackbar(errorMessage, { variant: "error" });
      updateProgress(100, "Something went wrong.");
    }
  };

  useEffect(() => {
    if (signing && progress < 100) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const target = Math.min((currentStep + 1) * 20, 100); 
          if (prev < target - 2) {
            return prev + 0.5;
          }
          clearInterval(interval);
          return prev;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [signing, progress, currentStep]);

  return (
    <div className={cn(
      "w-full mx-4 my-4 lg:mx-0 lg:mt-7 bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:bg-gray-800/90 dark:border-gray-700/50 md:max-w-[500px] transform perspective-1000 hover:scale-[1.02] transition-all duration-300"
    )}>
      <div className="p-8 sm:p-10">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#774A67] to-[#5e3752] bg-clip-text text-transparent leading-relaxed pb-1">
            Create account
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Get started with your business management journey
          </p>
        </div>

        <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  {...register("firstName", { required: "First name is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300"
                  placeholder="John"
                />
                {formErrors.firstName && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  {...register("lastName", { required: "Last name is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300"
                  placeholder="Doe"
                />
                {formErrors.lastName && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Company Name and Logo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  {...register("companyName", { required: "Company name is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300"
                  placeholder="Awesome Inc."
                />
                {formErrors.companyName && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.companyName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company Logo <span className="text-red-400">*</span>
                </label>
                <div className="focus-within:border-[#774A67] focus-within:shadow-[0_0_15px_#774A67] transition duration-300 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm dark:border-gray-700 p-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-[#774A67] file:to-[#5e3752] file:text-white hover:file:from-[#5e3752] hover:file:to-[#774A67] dark:file:bg-gray-700 dark:file:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Master of Accounts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Master of Accounts
              </label>
              <input
                type="text"
                {...register("masterOfAccounts")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300"
                placeholder="Master of Accounts"
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Based on your business location your account will be created
              </p>
            </div>

            {/* Site Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Site Name <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  {...register("siteName", { required: "Site name is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300"
                  placeholder="example-site"
                />
                <span className="ml-2 text-gray-500 dark:text-gray-400">.alphaxerp.com</span>
              </div>
              {formErrors.siteName && (
                <p className="mt-2 text-sm text-red-500">{formErrors.siteName.message}</p>
              )}
            </div>

            {/* Email and Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: "Email has invalid format",
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300"
                  placeholder="your@email.com"
                />
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    validate: (value) => {
                      const hasUpperCase = /[A-Z]/.test(value);
                      const hasLowerCase = /[a-z]/.test(value);
                      const hasNumber = /[0-9]/.test(value);
                      const hasSpecialChar = /[^A-Za-z0-9]/.test(value);

                      if (!hasUpperCase) return "Must include at least one uppercase letter";
                      if (!hasLowerCase) return "Must include at least one lowercase letter";
                      if (!hasNumber) return "Must include at least one number";
                      if (!hasSpecialChar) return "Must include at least one special character";

                      return true;
                    },
                  })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm focus:border-[#774A67] focus:ring-2 focus:ring-[#774A67]/20 transition-all duration-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-300"
                  placeholder="Enter a secure password"
                />
                {formErrors.password && (
                  <p className="mt-2 text-sm text-red-500">{formErrors.password.message}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <PhoneInput
                country={"sa"}
                inputClass="!w-full !px-4 !py-3 !rounded-xl !border !border-gray-200/80 !bg-white/50 !backdrop-blur-sm focus:!border-[#774A67] focus:!ring-2 focus:!ring-[#774A67]/20 !transition-all !duration-200 dark:!bg-gray-800/50 dark:!border-gray-700 dark:!text-gray-300"
                specialLabel={""}
                value={""}
                onChange={(value) => {
                  (document.querySelector("input[name='phoneNumber']") as HTMLInputElement).value = value;
                }}
                inputProps={{
                  name: "phoneNumber",
                  required: true,
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={signing}
              className="w-full py-3 px-4 flex justify-center items-center gap-2 text-base font-semibold rounded-xl bg-gradient-to-r from-[#774A67] to-[#5e3752] text-white hover:from-[#5e3752] hover:to-[#774A67] transform transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {signing ? "Creating site..." : "Create Account"}
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

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleSignUp();
              }}
              className="font-medium text-[#774A67] hover:text-[#5e3752] transition-colors duration-200"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>

      {/* Progress Modal */}
      {signing && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full shadow-2xl">
            {/* Step progress with animation */}
            <div className="flex justify-center mb-8">
              <div className="relative w-24 h-24">
                {/* Background circle */}
                <div className="absolute inset-0 rounded-full border-4 border-gray-700"></div>

                {/* Progress circle with gradient */}
                <svg className="absolute inset-0 w-24 h-24 -rotate-90">
                  <circle
                    className="text-transparent"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="38"
                    cx="48"
                    cy="48"
                  />
                  <circle
                    className="text-indigo-500 transition-all duration-300 ease-in-out"
                    strokeWidth="4"
                    strokeLinecap="round"
                    stroke="url(#gradient)"
                    fill="transparent"
                    r="38"
                    cx="48"
                    cy="48"
                    strokeDasharray={`${2 * Math.PI * 38}`}
                    strokeDashoffset={`${2 * Math.PI * 38 * (1 - progress / 100)}`}
                  />

                  {/* Define gradient */}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>

            {/* Stepper title */}
            <h2 className="text-xl font-bold text-center text-white mb-2">
              {signupSteps[currentStep]?.title || "Processing..."}
            </h2>

            {/* Description */}
            <p className="text-gray-300 text-center mb-6">
              {signupSteps[currentStep]?.description || "Please wait..."}
            </p>

            {/* Stepper indicators */}
            <div className="flex justify-between items-center mb-4 px-2">
              {signupSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  {/* Step connector line */}
                  {index > 0 && (
                    <div
                      className={`h-0.5 w-full absolute -ml-full ${index <= currentStep ? "bg-gradient-to-r from-purple-500 to-blue-500" : "bg-gray-700"
                        }`}
                      style={{ width: "100%", marginLeft: "-50%", marginTop: "10px", zIndex: 0 }}
                    ></div>
                  )}

                  {/* Step bubble */}
                  <div
                    className={`z-10 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-500 ${index < currentStep
                      ? "bg-gradient-to-r from-purple-500 to-blue-500"
                      : index === currentStep
                        ? "bg-gradient-to-r from-purple-400 to-blue-400 border-2 border-white animate-pulse"
                        : "bg-gray-700"
                      }`}
                  >
                    {index < currentStep ? (
                      // Completed step check mark
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    ) : (
                      // Step number
                      <span className="text-xs text-white font-medium">{index + 1}</span>
                    )}
                  </div>

                  {/* Step label */}
                  <div className="hidden sm:block text-xs mt-2 text-center whitespace-nowrap">
                    <span
                      className={`${index <= currentStep ? "text-gray-200" : "text-gray-500"
                        } font-medium`}
                    >
                      {step.title.split(" ")[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed status message */}
            <div className="text-center text-gray-400 text-sm mt-6 italic">{stepMessage}</div>

            {/* Animated gear icons */}
            <div className="flex justify-center gap-4 mt-8 opacity-70">
              {[24, 20, 16].map((size, i) => (
                <svg
                  key={i}
                  className={`w-${size} h-${size} ${i % 2 === 0 ? "animate-spin-slow" : "animate-spin-slow-reverse"
                    }`}
                  style={{
                    animationDuration: `${(i + 3) * 2}s`,
                    opacity: 0.6 + i * 0.1,
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={i === 0 ? "#8B5CF6" : i == 1 ? "#3B82F6" : "#EC4899"}
                  viewBox="0 0 24 24"
                >
                  <path d="M19.14 12.936a7.996 7.996 0 0 0 .047-.936 7.996 7.996 0 0 0-.047-.936l2.036-1.593a.5.5 0 0 0 .121-.63l-1.926-3.33a.5.5 0 0 0-.607-.218l-2.396.96a7.98 7.98 0 0 0-1.617-.936l-.36-2.52A.5.5 0 0 0 13.405 2h-2.81a.5.5 0 0 0-.492.415l-.36 2.52a7.98 7.98 0 0 0-1.617.936l-2.396-.96a.5.5 0 0 0-.607.218L2.197 8.46a.5.5 0 0 0 .121.63l2.036 1.593a7.996 7.996 0 0 0 0 1.872L2.318 14.15a.5.5 0 0 0-.121.63l1.926 3.33a.5.5 0 0 0 .607.218l2.396-.96a7.98 7.98 0 0 0 1.617.936l.36 2.52a.5.5 0 0 0 .492.415h2.81a.5.5 0 0 0 .492-.415l.36-2.52a7.98 7.98 0 0 0 1.617-.936l2.396.96a.5.5 0 0 0 .607-.218l1.926-3.33a.5.5 0 0 0-.121-.63l-2.036-1.593zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;




