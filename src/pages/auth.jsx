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
        console.log("signup error: ", error);
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
        redirectTo: "http://localhost:5173/settings",
      });

      if (error) {
        Message(error.message);
        return;
      }

      setErrorMessage("Password reset email sent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h1>

        <p className="description">
          {isLogin
            ? "Sign in to continue."
            : "Create an account to start tracking your practice."}
        </p>

        <div className="form-widget">
          <div>
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
          </div>

          <div>
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
          </div>

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
