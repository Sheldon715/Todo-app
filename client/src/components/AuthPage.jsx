import React, { useState } from "react";
import { loginApi, registerApi } from "../api/auth";

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSwitchMode(nextMode) {
    if (nextMode === mode) return;

    setMode(nextMode);
    setPassword("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      alert("Please enter both email and password.");
      return;
    }

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

        if(typeof onAuthSuccess === "function") {
          onAuthSuccess(result);
        }
        alert(mode === "login" ? "Login sucessful!" : "Register sucessful!");
      } else {
        console.error("Auth success response missing token:", result);
        alert("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert(error.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Todo App</h1>

        <div className="auth-tabs">
          <button
            type="button"
            className="auth-tab"
            onClick={() => handleSwitchMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className="auth-tab"
            onClick={() => handleSwitchMode("register")}
          >
            Register
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="label">
            <span>Email</span>
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

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

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting
              ? mode === "login"
                ? "Logging in..."
                : "Registering..."
              : mode === "login"
              ? "Login"
              : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;
