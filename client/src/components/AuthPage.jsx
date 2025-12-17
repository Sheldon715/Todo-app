import React, { useState } from "react";
import { loginApi, registerApi } from "../api/auth";
import googleIcon from "../assets/images/icon-google.svg";

function AuthPage({ onAuthSuccess, externalMessage, onClearExternalMessage }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const apiOrigin = import.meta.env.VITE_API_ORIGIN || "http://localhost:4000";

  function handleSwitchMode(nextMode) {
    if (nextMode === mode) return;

    setMode(nextMode);
    setPassword("");
    setMessage("");
    setMessageType("");

    onClearExternalMessage?.();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    onClearExternalMessage?.();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setMessageType("error");
      setMessage("Please enter both email and password.");
      return;
    }

    setMessage("");
    setMessageType("");
    setSubmitting(true);

    try {
      if (mode === "login") {
        const result = await loginApi(trimmedEmail, trimmedPassword);

        if (result?.token) {
          localStorage.setItem("todo-app-token", result.token);

          console.log("[Auth success]", result);

          if (typeof onAuthSuccess === "function") {
            onAuthSuccess(result);
          }
        } else {
          console.error("Auth success response missing token:", result);
          alert("Unexpected response from server.");
        }

        return;
      }

      await registerApi(trimmedEmail, trimmedPassword);

      setPassword("");

      setMode("login");

      setMessageType("success");
      setMessage("Registration successful. Please log in.");
    } catch (error) {
      console.error(error);

      if (error.status === 401) {
        setMessageType("error");
        setMessage("Email or password is incorrect.");
        return;
      }

      if (error.status === 409) {
        setMessageType("error");
        setMessage("This email is already registered. Please log in instead.");
        return;
      }

      if (!error.status) {
        setMessageType("error");
        setMessage(
          "Unable to connect to server. Please check your connection or try again later."
        );
        return;
      }

      setMessageType("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          {message ? (
            <div className={`auth-message ${messageType}`}>{message}</div>
          ) : null}
          {!message && externalMessage ? (
            <div className="auth-message error">{externalMessage}</div>
          ) : null}
          <div className="auth-input-card">
            <div className="auth-row">
              <label className="auth-label">
                <span>Email</span>
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    onClearExternalMessage?.();
                  }}
                  placeholder="you@example.com"
                  disabled={submitting}
                />
              </label>
            </div>

            <div className="auth-row">
              <label className="auth-label">
                <span>Password</span>
                <input
                  type="password"
                  className="auth-input"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    onClearExternalMessage?.();
                  }}
                  placeholder="••••••••"
                  disabled={submitting}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`auth-submit ${submitting ? "is-loading" : ""}`}
            disabled={submitting}
          >
            {submitting
              ? mode === "login"
                ? "Logging in..."
                : "Registering..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>

          <div className="auth-switch">
            <span className="auth-switch-text">
              {mode === "login" ? "No account?" : "Already have an account?"}
            </span>

            <button
              type="button"
              className="auth-switch-link"
              disabled={submitting}
              onClick={() =>
                handleSwitchMode(mode === "login" ? "register" : "login")
              }
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </div>

          <div className="auth-divider">or</div>

          <button
            type="button"
            className="auth-google-btn"
            disabled={submitting}
            onClick={() => {
              window.location.href = `${apiOrigin}/api/auth/google`;
            }}
          >
            <img src={googleIcon} alt="Google" className="auth-google-icon" />
            <span>Continue with Google</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
