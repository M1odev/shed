import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
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
            <h1>{session.title}</h1>

            <p>
              {session.profiles?.display_name || session.profiles?.username}
              {" · "}
              {formatRelativeTime(session.created_at)}
            </p>
          </div>

          <div className="session-rating">{session.rating}/10</div>
        </div>

        <div className="session-stats">
          <span>{session.duration} minutes</span>

          {session.improved && <span>✓ 1% better</span>}
        </div>

        {session.description && (
          <p className="session-description">{session.description}</p>
        )}

        {items.length > 0 && (
          <section>
            <h2>Practice Items</h2>

            <ul className="practice-items">
              {items.map((item) => (
                <li className="practice-item" key={item.id}>
                  <span>{item.item_name}</span>
                  <span>{item.duration} minutes</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </>
  );
}
