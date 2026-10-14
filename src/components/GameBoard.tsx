import type { BoardCell, BoardTileState } from "@/lib/board";

const TILE_CLASS: Record<BoardTileState, string> = {
  correct: "border-success bg-success text-success-content",
  present: "border-warning bg-warning text-warning-content",
  absent: "border-neutral bg-neutral text-neutral-content",
  filled: "border-base-content bg-base-100 text-base-content",
  empty: "border-base-300 bg-base-100 text-base-content",
};

export function GameBoard({ rows }: { rows: BoardCell[][] }) {
  return (
    <div
      data-testid="board"
      className="grid w-full max-w-full gap-1.5 overflow-x-hidden"
    >
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          data-testid="board-row"
          className="grid w-full grid-cols-5 gap-1.5"
        >
          {row.map((cell, columnIndex) => (
            <div
              key={columnIndex}
              data-testid={`tile-${rowIndex}-${columnIndex}`}
              data-state={cell.state}
              className={`flex aspect-square min-w-0 items-center justify-center border text-base font-bold uppercase sm:text-xl ${TILE_CLASS[cell.state]}`}
            >
              {cell.letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
