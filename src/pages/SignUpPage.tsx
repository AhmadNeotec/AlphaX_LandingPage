import { ENDPOINTS, fetcher } from "@api/useAxiosSWR";
import { EMAIL_PATTERN } from "@constants/index";
import { AxiosError } from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import { cn } from "@utils/index";
import Logo from "@components/Logo";
import { rootStore } from "@store/index";

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
  const [progress, setProgress] = useState(0);
  const [stepMessage, setStepMessage] = useState("Initializing...");
  const [currentStep, setCurrentStep] = useState(0);

  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);

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
        localStorage.setItem("access_token", token);
        reset();

        updateProgress(100, "Redirecting to your dashboard...", 4);
        setTimeout(() => {
          navigate("/admin");
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

  return (
    <div className="h-screen overflow-hidden relative bg-gradient-to-br from-[#774A67]/10 via-[#774A67]/20 to-[#774A67]/30 dark:from-[#774A67]/30 dark:via-[#774A67]/25 dark:to-[#774A67]/20">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {/* Animated gradient circles */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#774A67]/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#774A67]/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiA0OGMwIDYuNjI3LTUuMzczIDEyLTEyIDEyUzEyIDU0LjYyNyAxMiA0OCA1LjM3MyAzNiAxMiAzNnMxMiA1LjM3MyAxMiAxMnpNMTIgMGM2LjYyNyAwIDEyIDUuMzczIDEyIDEyUzE4LjYyNyAyNCAxMiAyNCAwIDE4LjYyNyAwIDEyczUuMzczLTEyIDEyLTEyem0zNiAxMmMwLTYuNjI3IDUuMzczLTEyIDEyLTEyczEyIDUuMzczIDEyIDEyLTUuMzczIDEyLTEyIDEyLTEyLTUuMzczLTEyLTEyem0wIDM2YzAgNi42MjctNS4zNzMgMTItMTIgMTJzLTEyLTUuMzczLTEyLTEyIDUuMzczLTEyIDEyLTEyIDEyIDUuMzczIDEyIDEyeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')] opacity-15 dark:opacity-10" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#774A67]/20 dark:to-[#774A67]/25" />
      </div>

      <div className="flex h-screen relative z-10">
        {/* Left Section */}
        <div className="hidden lg:flex lg:flex-1 p-6 bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 flex-col overflow-y-auto">
          <div className="max-w-xl mx-auto w-full pt-4">
            {/* Logo */}
            <Logo className="w-28 mb-8 transform hover:scale-105 transition-transform duration-300" />

            {/* Main Text */}
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

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_8px_2px_#774A67,0_0_12px_4px_#774A67] hover:border-[#774A67] border border-transparent"
                >
                  <span className="text-xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">{feature.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section - Sign Up Form */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="max-w-md w-full bg-white/60 backdrop-blur-sm dark:bg-gray-800/60 rounded-2xl shadow-lg p-8 transform hover:scale-[1.01] transition-all duration-300">
            {/* Language and Home Links */}
            <div className="flex justify-end mb-6">
              <a href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors duration-200">Home</a>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Sign up</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">Only two minutes to start!</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    {...register("firstName", { required: "First name is required" })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm 
                    dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                    focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] 
                    transition-all duration-300"
                    placeholder="First Name *"
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    {...register("lastName", { required: "Last name is required" })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm 
                    dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                    focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] 
                    transition-all duration-300"
                    placeholder="Last Name *"
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Company Name */}
              <div>
                <input
                  type="text"
                  {...register("companyName", { required: "Company name is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm 
                  dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                  focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] 
                  transition-all duration-300"
                  placeholder="Company Name *"
                />
                {formErrors.companyName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.companyName.message}</p>
                )}
              </div>

              {/* Master of Accounts */}
              <div>
                <input
                  type="text"
                  {...register("masterOfAccounts")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm 
                  dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                  focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] 
                  transition-all duration-300"
                  placeholder="Master of Accounts"
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Based on your business location your account will be created
                </p>
              </div>

              {/* Site Name */}
              <div className="flex items-center">
                <input
                  type="text"
                  {...register("siteName", { required: "Site name is required" })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm 
                  dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                  focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] 
                  transition-all duration-300"
                  placeholder="Site Name *"
                />
                <span className="ml-2 text-gray-500 dark:text-gray-400">.alphaxerp.com</span>
              </div>
              {formErrors.siteName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.siteName.message}</p>
              )}

              {/* Email and Password in one line */}
              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm 
                    dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                    focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] 
                    transition-all duration-300"
                    placeholder="Email Address *"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email.message}</p>
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-200/80 bg-white/50 backdrop-blur-sm 
                    dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400
                    focus:outline-none focus:border-[#774A67] focus:shadow-[0_0_15px_#774A67] 
                    transition-all duration-300"
                    placeholder="Password *"
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password.message}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <PhoneInput
                  country={"sa"}
                  inputClass="!w-full !px-4 !py-3 !rounded-xl !border !border-gray-200/80 !bg-white/50 !backdrop-blur-sm 
                  dark:!bg-slate-900 dark:!border-gray-700 dark:!text-gray-400
                  focus:!outline-none focus:!border-[#774A67] focus:!shadow-[0_0_15px_#774A67] 
                  !transition-all !duration-300 !pl-16"
                  specialLabel={""}
                  value={""}
                  onChange={(value) => {
                    (document.querySelector("input[name='phoneNumber']") as HTMLInputElement).value = value;
                  }}
                  inputProps={{
                    name: "phoneNumber",
                    required: true,
                    placeholder: "Mobile Number *"
                  }}
                />
              </div>

              {/* Submit Button */}
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
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Get Started for FREE"
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-300">
                  Have an account?{" "}
                  <button
                    type="button"
                    onClick={() => { console.log('Sign in button clicked'); toggleStarted(); }}
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
  );
};

export default SignUpPage; 