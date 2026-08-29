import Navbar from "../components/navbar";
import SessionCard from "../components/SessionCard";
import { usePracticeSessions } from "../lib/usePracticeSessions";
import { supabase } from "../lib/supabase";
import { NavLink } from "react-router-dom";
import { SquarePlus } from "lucide-react";
import { useState, useEffect, Link } from "react";

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
            <span>New Live Pratice Session</span>
            <small>Track your practice in real time</small>
          </NavLink>

          <NavLink to="/manual_session">
            <span>Add a Manual Session</span>
            <small>Log a practice session you've already completed</small>
          </NavLink>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const { sessions, loading, error } = usePracticeSessions(10);
  console.log("sessions data: ", sessions);

  return (
    <>
      <Navbar />
      <div className="main-content-wrapper">
        <h1
          style={{
            position: "fixed",
            top: "0",
            left: "11vw",
            margin: "100",
            fontSize: "35px",
            display: "flex",
          }}
        >
          Woodshed
        </h1>

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
