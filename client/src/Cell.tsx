interface CellProps {
  value: string;
  onClick: () => void;
  locked: boolean;
  isEmpty: boolean;
}

const Cell = ({ value, onClick, locked, isEmpty }: CellProps) => (
  <button
    className={`cell ${isEmpty ? "empty" : "filled"} ${locked && isEmpty ? "disabled" : ""}`}
    onClick={onClick}
    disabled={locked && isEmpty}
  >
    {value}
  </button>
);

export default Cell;