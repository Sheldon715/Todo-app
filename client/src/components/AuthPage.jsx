import React, { useState } from "react";
import { loginApi, registerApi } from "../api/auth";

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function handleSwitchMode(nextMode) {
    if (nextMode === mode) return;

    setMode(nextMode);
    setPassword("");
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setErrorMessage("");
    setSubmitting(true);

    try {
      let result;

      if (mode === "login") {
        result = await loginApi(trimmedEmail, trimmedPassword);
      } else {
        result = await registerApi(trimmedEmail, trimmedPassword);
      }

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
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMessage(error.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <form className="auth-form" onSubmit={handleSubmit}>
          {errorMessage ? (
            <div className="auth-error">{errorMessage}</div>
          ) : null}
          <div className="auth-input-card">
            <div className="auth-row">
              <label className="auth-label">
                <span>Email</span>
                <input
                  type="email"
                  className="auth-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
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
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </label>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
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
              onClick={() =>
                handleSwitchMode(mode === "login" ? "register" : "login")
              }
            >
              {mode === "login" ? "Register" : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
