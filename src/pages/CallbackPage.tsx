import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { rootStore } from "@store/index";

const CallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        console.error("No code in URL");
        navigate("/");
        return;
      }

      try {
        // Exchange code for token
        const res = await fetch("https://test.neotec.ai/api/method/frappe.integrations.oauth2.get_token", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "https://neotechis.com/callback",
            client_id: "93kjpi4dm5", // must match your OAuth Client
          }),
        });

        if (!res.ok) {
          throw new Error("Token exchange failed");
        }

        const data = await res.json();

        // data.message contains access_token, id_token, refresh_token
        const token = data?.access_token || data?.message?.access_token;
        const idToken = data?.id_token || data?.message?.id_token;

        // Try to extract email from id_token (JWT)
        let emailFromIdToken = '';
        if (idToken && idToken.split('.').length === 3) {
          try {
            const payload = JSON.parse(atob(idToken.split('.')[1]));
            emailFromIdToken = payload?.email || payload?.preferred_username || payload?.sub || '';
          } catch (e) {
            console.warn('Failed to decode id_token for email', e);
          }
        }

        if (token) {
          localStorage.setItem("tk", token);
          localStorage.setItem("id_token", idToken || "");
          localStorage.setItem("in", "true");
          if (emailFromIdToken) {
            localStorage.setItem('user', emailFromIdToken);
          }

          // hydrate Zustand store
          rootStore.getState().handleClientLogin(token);

          navigate("/clientLogin"); // redirect to dashboard
        } else {
          console.error("No access token in response", data);
          navigate("/");
        }
      } catch (err) {
        console.error("Auth error", err);
        navigate("/");
      }
    };

    handleAuth();
  }, [navigate]);

  return <p className="text-center mt-10">Processing login...</p>;
};

export default CallbackPage;
