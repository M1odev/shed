import { useState } from "react";
import { signUp, signIn } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await signIn(email, password);

      if (error) {
        setPassword("");
        setErrorMessage(error.message);
        return;
      }
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await signUp(email, password);

      if (error) {
        setPassword("");
        setErrorMessage(error.message);
        return;
      }
      navigate("/onboarding");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://shed-m1o.vercel.app/settings`,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage("Password reset email sent.");
    } finally {
      setLoading(false);
    }
  };

  const anonymousSignIn = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        setErrorMessage(error.message);
        return;
      }
      navigate("/home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "grid",
        placeItems: "center",
      }}
    >
      <div className="col-6 form-widget">
        <div
          className="input-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "1vh",
            width: "clamp(25rem, 80vw, 400px)",
          }}
        >
          <h1 className="header">
            Shed{" "}
            <img
              style={{
                width: "6rem",
                height: "6rem",
                position: "relative",
                top: "15px",
              }}
              src="/192transparentlight.png"
              alt="Shed Logo"
            />
          </h1>

          <p className="description">
            {isLogin
              ? "Here we go again"
              : "Create an account to start tracking your sheddin'"}
          </p>
          <input
            className="inputField"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMessage("");
            }}
          />

          <input
            className="inputField"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button
            className="button block"
            disabled={loading}
            onClick={isLogin ? handleSignIn : handleSignUp}
          >
            {loading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
          </button>

          <div>
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="link-button"
                  disabled={loading}
                  onClick={() => setIsLogin(false)}
                >
                  Create one
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="link-button"
                  disabled={loading}
                  onClick={() => setIsLogin(true)}
                >
                  Sign in
                </button>
              </p>
            )}
            or{" "}
            <button
              type="button"
              className="link-button"
              disabled={loading}
              onClick={anonymousSignIn}
            >
              Shed as a guest
            </button>
          </div>

          {isLogin && (
            <button
              type="button"
              className="link-button"
              disabled={loading}
              onClick={resetPassword}
            >
              Forgot Password?
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
