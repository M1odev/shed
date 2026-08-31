import Navbar from "../components/navbar";
import SessionCard from "../components/SessionCard";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function PreviousSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      setError(null);

      const { data: user, error: userError } = await supabase.auth.getUser();
      console.log("user: ", user);
      const { data, error: supabaseError } = await supabase
        .from("practice_sessions")
        .select(
          `
              id,
              title,
              duration,
              rating,
              description,
              improved,
              created_at
            `,
        )
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (supabaseError) {
        setError(supabaseError);
      } else {
        setSessions(data);
      }
      console.log("user error : ", userError);
      console.log("session error: ", supabaseError);
      setLoading(false);
    }

    fetchSessions();
  }, []);
  return (
    <>
      <Navbar />
      <div className="main-content-wrapper">
        <div className="page-header">
          <h1>Previous Sheds</h1>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {loading && <p>Loading...</p>}

          {error && <p>Couldn't load feed.</p>}

          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} userInfo={false} />
          ))}
        </div>
      </div>
    </>
  );
}
