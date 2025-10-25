import { useEffect, useState } from "react";
import { socket } from "./socket";
import Grid from "./Grid";
import "./index.css";

function App() {
  const [grid, setGrid] = useState<string[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill(""))
  );
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [locked, setLocked] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    socket.on("gridUpdate", (updatedGrid: string[][]) => setGrid(updatedGrid));
    socket.on("onlineUsers", (count: number) => setOnlineUsers(count));
    return () => {
      socket.off("gridUpdate");
      socket.off("onlineUsers");
    };
  }, []);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && locked) {
      setLocked(false);
    }
  }, [timeRemaining, locked]);

  const handleCellClick = (row: number, col: number) => {
    if (!locked && grid[row][col] === "") {
      setSelectedCell({ row, col });
      setShowModal(true);
      setInputValue("");
    }
  };

  const handleSubmit = () => {
    if (selectedCell && inputValue.trim()) {
      socket.emit("selectCell", {
        row: selectedCell.row,
        col: selectedCell.col,
        char: inputValue.trim(),
      });
      setLocked(true);
      setTimeRemaining(60); 
      setShowModal(false);
      setInputValue("");
      setSelectedCell(null);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setInputValue("");
    setSelectedCell(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="app">
      <div className="header">
        <h1>Multiplayer Unicode Grid</h1>
        <div className="status-bar">
          <div className="players-badge">
            <span className="pulse-dot"></span>
            <span>Players online: <strong>{onlineUsers}</strong></span>
          </div>
          {locked && (
            <div className="lock-badge">
              🔒 Locked for {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      </div>

      <Grid grid={grid} onSelect={handleCellClick} locked={locked} />

      {showModal && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Enter a Unicode Character</h3>
            <p className="modal-hint">
              Try: 😀 ★ ♠ α ⚡ ❤️ 🎮 ✨ 🔥 or any character!
            </p>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.slice(0, 5))}
              placeholder="Enter character..."
              autoFocus
              maxLength={5}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <div className="modal-actions">
              <button onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn-primary"
                disabled={!inputValue.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;