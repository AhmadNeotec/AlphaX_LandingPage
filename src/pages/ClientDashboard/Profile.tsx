import React, { useState } from 'react';
import { withApiAuthHeaders } from '@api/authHeaders';

const userEmail = localStorage.getItem('user') || 'User';

const Profile: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Determine confirm password outline color
  let confirmPasswordOutline = "border-gray-300 dark:border-gray-700";
  if (confirmPassword.length > 0) {
    if (confirmPassword !== newPassword) {
      confirmPasswordOutline = "border-red-700 focus:border-red-700 focus:ring-2 focus:ring-red-400";
    } else {
      confirmPasswordOutline = "border-green-700 focus:border-green-700 focus:ring-2 focus:ring-green-400";
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    console.log("[ChangePassword] Submit triggered");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      console.log("[ChangePassword] Validation failed: missing fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      console.log("[ChangePassword] Validation failed: passwords do not match");
      return;
    }

    setLoading(true);
    try {
      console.log("[ChangePassword] Sending API request", {
        userId: userEmail,
        newPassword,
      });
      const response = await fetch(
        "https://test.neotec.ai/api/method/alphax_erp.api.change_password.change_user_password",
        {
          method: "POST",
          headers: withApiAuthHeaders(),
          body: JSON.stringify({
            userId: userEmail,
            newPassword,
          }),
        }
      );
      console.log("[ChangePassword] API response status:", response.status);
      const data = await response.json();
      console.log("[ChangePassword] API response data:", data);
      if (data.message?.status === "success") {
        setSuccess(data.message.message || "Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        console.log("[ChangePassword] Password change successful");
      } else {
        setError(data.message?.message || "Failed to update password.");
        console.log("[ChangePassword] Password change failed", data.message);
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.log("[ChangePassword] Exception:", err);
    } finally {
      setLoading(false);
      console.log("[ChangePassword] Done");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c] overflow-hidden">
      {/* Animated SVG blobs */}
      <svg className="absolute top-0 -left-32 w-[32rem] h-[32rem] opacity-20 z-0 animate-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-0 -right-32 w-[32rem] h-[32rem] opacity-20 z-0 animate-blob animation-delay-2000" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#60A5FA" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute top-1/2 left-1/2 w-[28rem] h-[28rem] opacity-10 z-0 animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#8b5cf6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
      </svg>
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-16 px-4 md:px-12">
        <div className="w-full bg-white dark:bg-[#23232a] rounded-3xl shadow-2xl p-12 flex flex-col items-center border border-[#e0e7ff] dark:border-[#23232a] backdrop-blur-xl" style={{ boxShadow: '0 8px 40px 0 rgba(119,74,103,0.10), 0 1.5px 8px 0 rgba(119,74,103,0.10)' }}>
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#774A67] to-[#8b5cf6] flex items-center justify-center text-6xl text-white font-extrabold mb-6 shadow-lg border-4 border-white dark:border-[#23232a]" style={{ filter: 'drop-shadow(0 0 32px #8b5cf6aa)' }}>
            {userEmail[0]?.toUpperCase() || 'U'}
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-[#774A67] drop-shadow">Your Profile</h2>
          <p className="text-gray-700 dark:text-gray-200 mb-10 text-lg text-center">Manage your account information and settings.</p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f7f8fa] dark:bg-[#23232a] rounded-2xl p-6 shadow flex flex-col gap-2 border border-[#e0e7ff] dark:border-[#23232a]">
              <h3 className="font-semibold text-[#774A67] mb-1 text-lg">Account Details</h3>
              <div className="flex flex-col gap-1 text-base">
                <span><b>Email:</b> {userEmail}</span>
                <span><b>User ID:</b> {userEmail}</span>
              </div>
            </div>
            <div className="bg-[#f7f8fa] dark:bg-[#23232a] rounded-2xl p-6 shadow flex flex-col gap-2 border border-[#e0e7ff] dark:border-[#23232a]">
              <h3 className="font-semibold text-[#774A67] mb-1 text-lg">Change Password</h3>
              <form className="flex flex-col gap-2" onSubmit={handleChangePassword}>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Current Password"
                    className="rounded px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18181c] w-full pr-10"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#774A67] focus:outline-none"
                    onClick={() => setShowCurrentPassword(v => !v)}
                  >
                    {showCurrentPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.104-2.44A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.43 5.818M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6" /></svg>
                    )}
                  </button>
                </div>
                <input
                  type="password"
                  placeholder="New Password"
                  className="rounded px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#18181c]"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm New Password"
                    className={`rounded px-3 py-2 bg-white dark:bg-[#18181c] w-full pr-10 focus:outline-none ${confirmPasswordOutline}`}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#774A67] focus:outline-none"
                    onClick={() => setShowConfirmPassword(v => !v)}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592m3.104-2.44A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.43 5.818M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 6L6 6" /></svg>
                    )}
                  </button>
                </div>
                <button
                  type="submit"
                  className={`bg-[#774A67] text-white px-4 py-2 rounded font-semibold mt-2 ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
                {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
                {success && <div className="text-green-600 text-sm mt-1">{success}</div>}
              </form>
            </div>
            <div className="bg-[#f7f8fa] dark:bg-[#23232a] rounded-2xl p-6 shadow flex flex-col gap-2 border border-[#e0e7ff] dark:border-[#23232a] md:col-span-2">
              <h3 className="font-semibold text-[#774A67] mb-1 text-lg">Subscription Status</h3>
              <span className="text-gray-700 dark:text-gray-200 text-base">You are currently on a trial or active subscription. More details coming soon.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 