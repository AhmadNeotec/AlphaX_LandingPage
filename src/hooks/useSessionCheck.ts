import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useSessionCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      console.log('[SessionCheck] Token from localStorage:', token);
      if (!token) {
        console.log('[SessionCheck] No token found, redirecting to login.');
        localStorage.clear();
        navigate("/");
        return;
      }
      try {
        const res = await fetch("https://newhrms.muftaah.com/api/method/alphax_erp.api.check_session.check_session", {
          method: "POST",
          headers: {
            "Authorization": `token ${token}`,
            "Content-Type": "application/json"
          },
          credentials: "include"
        });
        console.log('[SessionCheck] API response status:', res.status);
        const data = await res.json();
        console.log('[SessionCheck] API response data:', data);
        if (!res.ok || data.status !== "valid") throw new Error("Session invalid");
      } catch (err) {
        console.log('[SessionCheck] Session check failed:', err);
        localStorage.clear();
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);
} 