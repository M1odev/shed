import { supabase } from "../lib/supabase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";

export default function Settings() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  async function changePassword() {
    setLoading(true);
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage("Password Changed");
      }
    } finally {
      setLoading(false);
    }
  }

  async function logOut() {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage("logging out");
      }
    } finally {
      setLoading(false);
      navigate("/");
    }
  }
  return (
    <>
      <Navbar />
      <div className="input-container" style={{ width: "250px" }}>
        <h2>Change your Password</h2>
        <label htmlFor="newpassword">New Password</label>
        <input
          id="newpassword"
          placeholder="enter your new password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setError(null);
          }}
        />
        <label htmlFor="confirmpassword">Confirm Password</label>
        <input
          id="confirmpassword"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirm(e.target.value);
            setError(null);
          }}
        />

        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}

        <button onClick={changePassword}>
          {loading ? "loading" : "Reset Password"}
        </button>
      </div>
      <div
        className="input-container"
        style={{ width: "250px", position: "relative", top: "50px" }}
      >
        <button onClick={logOut}>{loading ? "loading" : "Log Out"}</button>
      </div>
    </>
  );
}
