import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useTimer } from "../lib/useTimer";
import { ChevronRight } from "lucide-react";

import submitSession from "../lib/submitSession";

export const timerFormat = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");

  return `${paddedMinutes}:${paddedSeconds}`;
};

function Confirmation({ goal, setGoal, setPreScreen, startSession }) {
  const [goalInput, setGoalInput] = useState("");

  return (
    <div className="confirmation-backdrop">
      <div className="confirmation-popup">
        <h1>Ready to Start?</h1>

        <label htmlFor="goal">
          Goal for this session <span>(optional)</span>
        </label>

        <input
          type="text"
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="e.g. Learn the first movement"
        />

        <button onClick={startSession}>Start Session</button>
      </div>
    </div>
  );
}

function EndPreview({
  elapsed,
  renderItemsList,
  items,
  pause,
  start,
  setOpen,
}) {
  const [session, setSession] = useState({
    title: "",
    rating: 5,
    duration: 0,
    description: "",
    improved: false,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    pause();
  }, []);

  const callSubmitSession = async () => {
    setLoading(true);
    try {
      const response = await submitSession(
        session,
        Math.ceil(elapsed / 60000),
        items,
        true,
      );
      if (response) {
        navigate("/home");
      }
    } finally {
      setLoading(false);
    }
  };

  function closePreview() {
    start();
    setOpen(false);
  }
  return (
    <div className="confirmation-backdrop" onClick={closePreview}>
      <div className="confirmation-popup" onClick={(e) => e.stopPropagation()}>
        <div className="div-container-inline">
          <div className="input-container" style={{ width: "250px" }}>
            <label htmlFor="title-input">Title</label>
            <input
              id="title-input"
              value={session.title}
              onChange={(e) =>
                setSession({ ...session, title: e.target.value })
              }
              placeholder="Practice Session"
            />
          </div>
          <div style={{ width: "75px" }}>
            <h2>{timerFormat(elapsed)}</h2>
          </div>
        </div>

        <div className="div-container-inline" id="circle thing make later">
          <div>{renderItemsList}</div>
        </div>

        <div className="div-container-inline">
          <div className="input-container" style={{ width: "125px" }}>
            <div style={{ display: "inline-flex", gap: "4px" }}>
              <span>Session Rating:</span>
              <span>{session.rating}/10</span>
            </div>

            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={session.rating}
              onChange={(e) =>
                setSession({ ...session, rating: Number(e.target.value) })
              }
            />
          </div>
          <div>
            <label htmlFor="improved">Did you get at least 1% better?</label>
            <input
              id="improved"
              type="checkbox"
              checked={session.improved}
              onChange={() =>
                setSession((prev) => ({ ...prev, improved: !prev.improved }))
              }
            />
          </div>
        </div>

        <div className="input-container">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            placeholder="Worked on some audition material for orchestra"
            value={session.description}
            onChange={(e) =>
              setSession({ ...session, description: e.target.value })
            }
            style={{ width: "350px", height: "75px" }}
          ></textarea>
        </div>
        <button onClick={callSubmitSession}>
          {loading ? "saving" : "Publish Session"}
        </button>
      </div>
    </div>
  );
}

export default function Live() {
  const [preScreen, setPreScreen] = useState(true);
  const [goal, setGoal] = useState("");
  const [items, setItems] = useState([]);
  const [activeItemName, setActiveItemName] = useState("Warm-up");
  const [endViewOpen, setEndViewOpen] = useState(false);
  const { elapsed, isRunning, start, pause, reset } = useTimer();

  const totalSeconds = Math.floor(elapsed / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = timerFormat(elapsed);

  const finishedItemsDuration = items.reduce(
    (total, item) => total + Number(item.duration),
    0,
  );

  const renderFinishedItems = items.map((item) => (
    <li className="practice-item" key={item.id}>
      <span>{item.name}</span>
      <span>{timerFormat(item.duration)}</span>
    </li>
  ));

  function startSession() {
    setPreScreen(false);
    start();
  }

  function newItem() {
    setItems((items) => [
      ...items,
      {
        id: crypto.randomUUID(),
        name: activeItemName,
        duration: elapsed - finishedItemsDuration,
      },
    ]);
    setActiveItemName("");
  }

  return (
    <>
      {preScreen && (
        <Confirmation
          goal={goal}
          setGoal={setGoal}
          setPreScreen={setPreScreen}
          startSession={startSession}
        />
      )}

      {!preScreen && (
        <>
          <Navbar />
          <div>
            <h1>{formattedTime}</h1>
            <h1>{goal}</h1>
            {isRunning ? (
              <button onClick={pause}>BREAK</button>
            ) : (
              <button onClick={start}>RESUME</button>
            )}
            <button
              onClick={() => {
                setEndViewOpen(true);
              }}
            >
              END
            </button>

            <ul className="practice-items">
              <li>
                <ChevronRight />
                <input
                  value={activeItemName}
                  placeholder="New Item"
                  onChange={(e) => {
                    setActiveItemName(e.target.value);
                  }}
                />
                <span>{timerFormat(elapsed - finishedItemsDuration)}</span>
              </li>
              {renderFinishedItems}
              <button onClick={newItem}>Start a new Item</button>
              {endViewOpen && (
                <EndPreview
                  elapsed={elapsed}
                  renderItemsList={renderFinishedItems}
                  items={items}
                  pause={pause}
                  start={start}
                  setOpen={setEndViewOpen}
                />
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
}
