import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../lib/formatRelativeTime";

export default function SessionCard({ session, userInfo }) {
  const navigate = useNavigate();
  return (
    <article className="session-card">
      <div className="session-card-header">
        {userInfo && (
          <div className="user-info">
            <span className="display-name">
              {session.profiles.display_name}
            </span>

            <span className="username"> @{session.profiles.username}</span>
          </div>
        )}

        <span className="timestamp">
          {formatRelativeTime(session.created_at)}
        </span>
      </div>

      <h2>{session.title}</h2>

      <p>{session.description}</p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>{session.duration} min</span>
        <span>{session.rating}/10</span>
      </div>
      <button onClick={() => navigate(`/sessions/${session.id}`)}>
        See Details
      </button>
    </article>
  );
}
