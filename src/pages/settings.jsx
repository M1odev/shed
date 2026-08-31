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

  async function deleteAccount() {
    setLoading(true);
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      const { data, error } = await supabase.auth.deleteUser(user.user.id);
      if (error) {
        setError(error.message);
      } else {
        setSuccessMessage("Account deleted");
      }
    } finally {
      setLoading(false);
      navigate("/");
    }
  }
  return (
    <>
      <Navbar />
      <h1>Settings</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          className="input-container settings-panel"
          style={{
            width: "min(100%, 250px)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
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
          className="input-container settings-panel danger-zone"
          style={{
            width: "min(100%, 250px)",
            position: "relative",
            marginTop: "2.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <h2>Danger Zone</h2>
          <button onClick={logOut}>{loading ? "loading" : "Log Out"}</button>
          <button
            onClick={deleteAccount}
            style={{ backgroundColor: "red", color: "white" }}
          >
            {loading ? "loading" : "Delete Account"}
          </button>
        </div>
      </div>
    </>
  );
}
