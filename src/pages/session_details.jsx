import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { GraduationCap } from "lucide-react";
import { formatRelativeTime } from "../lib/formatRelativeTime";
import Navbar from "../components/navbar";

export default function SessionDetails() {
  const { sessionId } = useParams();

  const [session, setSession] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getSession() {
      setLoading(true);
      setError("");

      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from("practice_sessions")
          .select(
            `
          id,
          title,
          duration,
          rating,
          description,
          improved,
          created_at,
          user_id,
          profiles!user_id (
            username,
            display_name
          )
        `,
          )
          .eq("id", sessionId)
          .single();

        if (sessionError) {
          console.log("Session Error: ", sessionError);
          throw sessionError;
        }

        const { data: itemData, error: itemError } = await supabase
          .from("session_items")
          .select("session_id, item_name, duration, position")
          .eq("session_id", sessionId)
          .order("position", { ascending: true });

        if (itemError) {
          console.log("item errror: ", itemError);
          throw itemError;
        }

        setSession(sessionData);
        setItems(itemData);
      } catch (error) {
        setError("Unable to load this practice session.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getSession();
  }, [sessionId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!session) {
    return <Navigate to="/home" replace />;
  }

  return (
    <>
      <Navbar />

      <main className="session-details">
        <div className="session-details-header">
          <div>
            <h1>{session.title ? session.title : "Unnamed Shed Sesh"}</h1>

            <h3>
              {session.profiles?.display_name || session.profiles?.username}
              {" · "}
              {formatRelativeTime(session.created_at)}
              {" · "}
              {session.rating}/10
            </h3>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            gap: "1.5rem",
            marginTop: "2rem",
          }}
        >
          {items.length > 0 ? (
            <section>
              <h2>Practice Items</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <ul className="practice-items">
                  {items.map((item) => (
                    <li className="practice-item" key={item.id}>
                      <span>{item.item_name}</span>
                      <span>{item.duration} minutes</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ) : (
            <h3>No practice items recorded for this shed sesh</h3>
          )}

          <div className="session-stats">
            <h2>{session.duration} min</h2>

            {session.description ? (
              <>
                <h3 className="session-description">{session.description}</h3>
              </>
            ) : (
              <p className="session-description">No description.</p>
            )}

            {session.improved && (
              <h4>
                {" "}
                <GraduationCap /> 1% better
              </h4>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
