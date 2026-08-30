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

        <h2>{session.title}</h2>

        <span className="timestamp">
          {formatRelativeTime(session.created_at)}
        </span>
      </div>

      <h1>{session.duration ? session.duration : 0}:00</h1>

      <p>{session.description}</p>

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <button onClick={() => navigate(`/sessions/${session.id}`)}>
          See Details
        </button>

        <div>
          <h3> {session.rating} of out 10</h3>
        </div>
      </div>
    </article>
  );
}
