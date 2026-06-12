import { useState } from "react";
import { loginUser, registerUser } from "../api/api";

export default function Login({ onLogin }) {
  const [registerMode, setRegisterMode] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const submit = async () => {
    try {
      const res = registerMode
        ? await registerUser(form)
        : await loginUser(form);

      if (res.data === "LOGIN_SUCCESS") {
        sessionStorage.setItem("loggedIn", "true");
        onLogin();
      }

      if (res.data === "User registered") {
        alert("Account created successfully");
        setRegisterMode(false);
      }
    } catch {
      alert("Server error");
    }
  };

  return (
    <div className="loginPage">
      <div className="loginCard">

        <h1
          style={{
            textAlign: "center",
            marginBottom: 8
          }}
        >
          InventoryPro
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: 30
          }}
        >
          Smart Inventory Analytics Platform
        </p>

        <input
          className="input"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value
            })
          }
        />

        <div style={{ height: 12 }} />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <div style={{ height: 20 }} />

        <button
          className="primaryBtn"
          style={{ width: "100%" }}
          onClick={submit}
        >
          {registerMode ? "Create Account" : "Sign In"}
        </button>

        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "#94a3b8",
            fontSize: 14
          }}
        >
          {registerMode ? (
            <>
              Already have an account?{" "}
              <span
                style={{
                  color: "#60a5fa",
                  cursor: "pointer"
                }}
                onClick={() => setRegisterMode(false)}
              >
                Sign In
              </span>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <span
                style={{
                  color: "#60a5fa",
                  cursor: "pointer"
                }}
                onClick={() => setRegisterMode(true)}
              >
                Create Account
              </span>
            </>
          )}
        </div>

      </div>
    </div>
  );
}