import Navbar from "../components/navbar";
import SessionCard from "../components/SessionCard";
import { usePracticeSessions } from "../lib/usePracticeSessions";
import { supabase } from "../lib/supabase";
import { NavLink } from "react-router-dom";
import { SquarePlus } from "lucide-react";
import { useState, useEffect } from "react";

function NewSessionButton() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="new-session-menu">
      <button
        className={`new-session-button ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <SquarePlus />
      </button>

      {menuOpen && (
        <div className="new-session-options">
          <NavLink to="/live_session">
            <span>New Live Shed</span>
            <small>Track your practice in real time</small>
          </NavLink>

          <NavLink to="/manual_session">
            <span>Add a Manual Shed</span>
            <small>
              {" "}
              Already practiced? Log a practice session you've already completed
            </small>
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { sessions, loading, error } = usePracticeSessions(10);
  const [practiceMinutes, setPracticeMinutes] = useState(0);
  const [sessionNumber, setSessionNumber] = useState(0);

  async function getMinutes() {
    const { data: user, error: userError } = await supabase.auth.getUser();
    console.log("userid", user.user.id);
    const { data, error } = await supabase.rpc(
      "sum_practice_session_duration",
      {
        p_user_id: user.user.id,
      },
    );
    console.log("duration:", data[0]["total_duration"]);
    console.log("count: ", data[0]["sessions_count"]);

    if (error || userError) {
      return "unable to find";
    }
    return [data[0]["total_duration"], data[0]["sessions_count"]];
  }

  useEffect(() => {
    const fetchMinutes = async () => {
      const response = await getMinutes();
      setPracticeMinutes(response[0]);
      setSessionNumber(response[1]);
    };
    fetchMinutes();
  }, []);

  return (
    <>
      <Navbar />
      <div className="main-content-wrapper">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            position: "fixed",
            top: "0",
            left: "11vw",
            gap: "15px",
          }}
        >
          <h1
            style={{
              fontSize: "35px",
              display: "flex",
            }}
          >
            Shedlog
          </h1>
          <p style={{ width: "200px" }}>
            You've practiced for {practiceMinutes} minutes on this acount across{" "}
            {sessionNumber} sessions
          </p>
        </div>

        <NewSessionButton />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {loading && <p>Loading...</p>}

          {error && <p>Couldn't load feed.</p>}

          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} userInfo={true} />
          ))}
        </div>
      </div>
    </>
  );
}
