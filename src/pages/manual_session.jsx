import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { Navigate, useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { SquareCheck } from "lucide-react";
import { SquareX } from "lucide-react";
import { Minus } from "lucide-react";
import { SquarePlus } from "lucide-react";
import submitSession from "../lib/submitSession";

function Items({ onDurationChange, onItemsChange }) {
  const [practiceItems, setPracticeItems] = useState([]);
  const [makingItem, setMakingItem] = useState(true);

  const totalDuration = practiceItems.reduce(
    (total, item) => total + Number(item.duration),
    0,
  );

  const renderItemsList = practiceItems.map((item) => (
    <li className="practice-item" key={item.id}>
      <span>{item.name}</span>
      <span>{item.duration} min</span>
    </li>
  ));
  function addItem(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newName = formData.get("name");
    const newDuration = formData.get("duration");

    setPracticeItems((practiceItems) => [
      ...practiceItems,
      { id: crypto.randomUUID(), name: newName, duration: newDuration },
    ]);

    e.target.reset();
  }

  useEffect(() => {
    onDurationChange(totalDuration);
  }, [totalDuration]);

  useEffect(() => {
    onItemsChange(practiceItems);
  }, [practiceItems]);

  return (
    <>
      <div className="manual-items-row">
        <div className="manual-items-controls">
          <button
            onClick={() => setMakingItem(true)}
            style={{
              maxWidth: "100px",
              borderColor: "transparent",
              backgroundColor: "transparent",
              marginTop: "15px",
            }}
          >
            <SquarePlus />
          </button>

          {makingItem && (
            <div className="manual-item-form-row">
              <form
                onSubmit={addItem}
                style={{ display: "flex", gap: "15px", flexWrap: "balance" }}
              >
                <input
                  className="line-text"
                  type="text"
                  name="name"
                  placeholder="Item Name"
                  required
                />
                <input
                  className="line-text"
                  type="number"
                  name="duration"
                  placeholder="Duration in Minutes"
                  min="1"
                  required
                />
                <button className="icon-button" type="submit">
                  {" "}
                  <SquareCheck />{" "}
                </button>
              </form>
              <button
                className="icon-button"
                onClick={() => setMakingItem(false)}
              >
                <SquareX />
              </button>
            </div>
          )}
        </div>

        <div className="manual-items-list">
          {practiceItems.length > 0 && (
            <ul className="practice-items manual-practice-items">
              {renderItemsList}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

export default function Manual() {
  const [session, setSession] = useState({
    title: "",
    rating: 5,
    duration: 0,
    description: "",
    improved: true,
  });

  const navigate = useNavigate();
  const [usingItems, SetUsingItems] = useState(true);
  const [itemDuration, setItemDuration] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingInfo, setViewingInfo] = useState(false);

  const finalDuration = usingItems ? itemDuration : session.duration;
  const callSubmitSession = (session, duration, items_list) => {
    stupidAbstraction(session, duration, items_list);
  };

  async function stupidAbstraction(session, duration, items_list) {
    setLoading(true);
    const response = await submitSession(
      session,
      duration,
      items_list,
      usingItems,
    );
    setLoading(false);

    if (response) {
      navigate("/home");
    }
  }

  return (
    <>
      <Navbar />

      <div className="manual-page-shell">
        <div className="page-header">
          <h1>Manual Shed</h1>
        </div>
        <div className="div-container-inline manual-top-row">
          <div className="input-container manual-title-field">
            <label htmlFor="title-input" style={{ fontSize: "1.25rem" }}>
              Title
            </label>
            <input
              id="title-input"
              style={{
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                borderBottom: "2px solid var(--border)",
                minHeight: "4.5rem",
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                width: "min(100%, 26rem)",
              }}
              value={session.title}
              onChange={(e) =>
                setSession({ ...session, title: e.target.value })
              }
              placeholder="Shed Sesh"
            />
          </div>

          <div className="input-container manual-rating-field">
            <div style={{ display: "inline-flex", gap: "4px" }}>
              <span> Rating</span>
            </div>
            <div>
              <h2 style={{ fontSize: "2.25rem" }}>
                {session.rating} out of 10
              </h2>
            </div>

            <input
              style={{ width: "min(100%, 200px)" }}
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
        </div>

        <div className="manual-controls-row">
          <label className="switch">
            <input
              type="checkbox"
              checked={usingItems}
              onChange={() => SetUsingItems(!usingItems)}
            />
            <span className="slider">
              <span>Duration</span>
              <span>Items</span>
            </span>
          </label>

          <button
            onClick={() => setViewingInfo(!viewingInfo)}
            style={{
              backgroundColor: "transparent",
              borderColor: "transparent",
            }}
          >
            <Info />
          </button>
          {viewingInfo && (
            <textarea
              readOnly
              style={{
                width: "min(100%, 250px)",
                minHeight: "3.75rem",
                resize: "none",
                outline: "none",
                backgroundColor: "var(--info)",
                borderRadius: "8px",
              }}
            >
              Items allows you to break your practice into specific tasks you
              did during the session instead of simply an overall time.
            </textarea>
          )}
        </div>

        <div className="manual-items-wrapper">
          {usingItems ? (
            <Items
              onDurationChange={setItemDuration}
              onItemsChange={setItems}
            />
          ) : (
            <div className="input-container">
              <label htmlFor="duration_input">Duration</label>
              <input
                type="number"
                id="duration_input"
                style={{ maxWidth: "100px" }}
                min="1"
                value={session.duration}
                onChange={(e) =>
                  setSession({ ...session, duration: Number(e.target.value) })
                }
              />
            </div>
          )}
        </div>

        <div className="div-container-inline manual-bottom-row">
          <div className="input-container">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              placeholder="Worked on some audition material for orchestra"
              value={session.description}
              onChange={(e) =>
                setSession({ ...session, description: e.target.value })
              }
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "8px",
                minHeight: "5rem",
                width: "min(100%, 26rem)",
              }}
            ></textarea>
          </div>

          <div>
            <label htmlFor="improved"></label>
            <button
              id="improved"
              onClick={() =>
                setSession((prev) => ({ ...prev, improved: !prev.improved }))
              }
              className={session.improved ? "button-happy" : "button-sad"}
            >
              Did you get at least 1% better?
            </button>
          </div>
        </div>

        <div className="manual-submit-row">
          <button
            onClick={() => callSubmitSession(session, finalDuration, items)}
            disabled={loading}
            style={{
              width: "min(100%, 250px)",
              marginTop: "30px",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </>
  );
}
