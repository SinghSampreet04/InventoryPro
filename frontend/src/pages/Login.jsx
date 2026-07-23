import { useState } from "react";
import { getApiError, loginUser, registerUser } from "../api/api";

const EMPTY_FORM = { username: "", password: "" };

export default function Login({ onAuthenticated }) {
  const [registerMode, setRegisterMode] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const switchMode = () => {
    setRegisterMode((current) => !current);
    setForm(EMPTY_FORM);
    setError("");
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password) {
      setError("Enter your username and password.");
      return;
    }

    setSubmitting(true);
    try {
      const response = registerMode
        ? await registerUser(form)
        : await loginUser(form);

      sessionStorage.setItem("inventoryToken", response.data.token);
      sessionStorage.setItem("inventoryUsername", response.data.username);
      onAuthenticated(response.data);
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to connect to the InventoryPro API."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="loginPage">
      <section className="loginCard" aria-labelledby="login-title">
        <div className="loginMark" aria-hidden="true">IP</div>
        <p className="eyebrow">Inventory intelligence</p>
        <h1 id="login-title">InventoryPro</h1>
        <p className="loginSubtitle">
          Track stock health, product value, and category performance from one workspace.
        </p>

        <form onSubmit={submit}>
          <label className="fieldLabel" htmlFor="username">Username</label>
          <input
            id="username"
            className="input"
            autoComplete="username"
            placeholder="Enter your username"
            value={form.username}
            onChange={(event) =>
              setForm({ ...form, username: event.target.value })
            }
          />

          <label className="fieldLabel" htmlFor="password">Password</label>
          <input
            id="password"
            className="input"
            type="password"
            autoComplete={registerMode ? "new-password" : "current-password"}
            placeholder={registerMode ? "At least 8 characters" : "Enter your password"}
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />

          {error && <div className="formError" role="alert">{error}</div>}

          <button className="primaryBtn loginSubmit" disabled={submitting}>
            {submitting
              ? registerMode ? "Creating account…" : "Signing in…"
              : registerMode ? "Create account" : "Sign in"}
          </button>
        </form>

        <button className="textButton" type="button" onClick={switchMode}>
          {registerMode
            ? "Already have an account? Sign in"
            : "New to InventoryPro? Create an account"}
        </button>
      </section>
    </main>
  );
}
