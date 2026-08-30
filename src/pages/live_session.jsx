import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useTimer } from "../lib/useTimer";
import { ChevronRight } from "lucide-react";

import submitSession from "../lib/submitSession";

  const timerFormat = (ms) => {
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
          placeholder="e.g. Work on TYP Auditon"
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

  const correctedItems = items.map((item) => ({
    id: item.id,
    name: item.name,
    duration: Math.floor(item.duration / 60000),
  }));

  useEffect(() => {
    pause();
  }, []);

  const callSubmitSession = async () => {
    setLoading(true);
    try {
      const response = await submitSession(
        session,
        Math.ceil(elapsed / 60000),
        correctedItems,
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
              placeholder="Shed Sesh"
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
            <button
              className={session.improved ? "button-happy" : "button-sad"}
              onClick={() =>
                setSession((prev) => ({ ...prev, improved: !prev.improved }))
              }
            >
              Did you get at least 1% better?
            </button>
          </div>
        </div>

        <div className="input-container">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "8px",
              height: "80px",
            }}
            placeholder="Worked on some audition material for orchestra"
            value={session.description}
            onChange={(e) =>
              setSession({ ...session, description: e.target.value })
            }
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <h1>{formattedTime}</h1>
            <h2>{goal}</h2>
            <div style={{ display: "flex", gap: "15px" }}>
              <div>
                <ul className="practice-items">
                  {renderFinishedItems}
                  <li>
                    <ChevronRight />
                    <input
                      value={activeItemName}
                      placeholder="New Item"
                      style={{
                        background: "transparent",
                        border: "none",
                        position: "relative",
                        bottom: "6px",
                        outline: "none",
                        boxShadow: "none",
                      }}
                      onChange={(e) => {
                        setActiveItemName(e.target.value);
                      }}
                    />
                    <span style={{ position: "relative", bottom: "6px" }}>
                      {timerFormat(elapsed - finishedItemsDuration)}
                    </span>
                  </li>
                </ul>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  justifyContent: "space-evenly",
                }}
              >
                <button onClick={newItem}> New Item</button>

                {isRunning ? (
                  <button onClick={pause}>Take a Break </button>
                ) : (
                  <button onClick={start}> Resume </button>
                )}
                <button
                  onClick={() => {
                    setEndViewOpen(true);
                  }}
                >
                  Finish Shed
                </button>
              </div>
            </div>

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
          </div>
        </>
      )}
    </>
  );
}
