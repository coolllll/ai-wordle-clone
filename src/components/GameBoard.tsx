import type { BoardCell, BoardTileState } from "@/lib/board";

const TILE_CLASS: Record<BoardTileState, string> = {
  correct: "border-correct bg-correct text-on-correct",
  present: "border-present bg-present text-on-present",
  absent: "border-absent bg-absent text-on-absent",
  filled: "border-ink bg-surface text-ink",
  empty: "border-line bg-surface text-ink",
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
