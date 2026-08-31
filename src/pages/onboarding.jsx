import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

async function checkIndividuality(username) {
  const { data, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

export default function Onboarding() {
  const [userName, setUser] = useState("");
  const [userError, setUserError] = useState("");

  const [display, setDisplay] = useState("");

  const navigate = useNavigate();

  async function submitProfile() {
    const {
      data: { user },
      getUserError,
    } = await supabase.auth.getUser();
    console.log(getUserError);
    const { data, error } = await supabase
      .from("profiles")
      .update({
        username: userName,
        display_name: display,
        onboarding_completed: true,
      })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error(error);
      setUserError(error.message);
      return;
    }

    console.log("updated profile");
    navigate("/home");
  }

  function CheckFeedback() {
    if (userError == "success") {
      return <p className="text-success">Username avaliable</p>;
    } else if (userError) {
      return <p className="error-message">{userError}</p>;
    } else {
      return null;
    }
  }

  async function checkUsername(e) {
    const username = e.target.value.trim().toLowerCase();
    if (!username.trim()) {
      setUserError("Please enter a username.");
      return;
    }

    try {
      const exists = await checkIndividuality(username);

      if (exists) {
        setUserError("Username is already taken.");
      } else if (username.length < 3) {
        setUserError("Username must be at least 3 characters");
      } else {
        setUserError("success");
      }
    } catch (error) {
      setUserError("Couldn't check username. Please wait and then try again.");
      console.error(error);
    }
  }

  return (
    <>
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        <div
          className="input-container"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1vh",
            maxWidth: "85vw",
            position: "relative",
            top: "-20vh",
          }}
        >
          <h2>Create your Profile</h2>
          <label htmlFor="username-input">Choose a username</label>
          <input
            type="text"
            className="inputField"
            id="username-input"
            value={userName}
            onChange={(e) => {
              setUser(e.target.value);
              setUserError("");
            }}
            onBlur={(e) => checkUsername(e)}
          />
          {userError && <CheckFeedback />}

          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            This should be a unique identifier so your friends can find you.
          </p>

          <label htmlFor="display-input">Display Name</label>
          <input
            type="text"
            className="inputField"
            value={display}
            onChange={(e) => {
              setDisplay(e.target.value);
            }}
          />
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            This is the name that will show up with all your practice sessions.
            Be creative!
          </p>

          <button
            className="btn-insert"
            style={{ backgroundColor: "var(--primary)" }}
            onClick={submitProfile}
            disabled={userError !== "" && userError !== "success"}
          >
            {userError !== "" && userError !== "success"
              ? "Username Error"
              : "Continue"}
          </button>
        </div>
      </div>
    </>
  );
}
