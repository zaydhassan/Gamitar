import Cell from "./Cell";

interface GridProps {
  grid: string[][];
  onSelect: (row: number, col: number) => void;
  locked: boolean;
}

const Grid = ({ grid, onSelect, locked }: GridProps) => (
  <div className="grid-container">
    <div className="grid">
      {grid.map((row, rIndex) => (
        <div key={rIndex} className="grid-row">
          {row.map((cell, cIndex) => (
            <Cell
              key={`${rIndex}-${cIndex}`}
              value={cell}
              onClick={() => onSelect(rIndex, cIndex)}
              locked={locked}
              isEmpty={!cell}
            />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Grid;