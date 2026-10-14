import type { TileState } from "@/lib/types";

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as const;

const KEY_CLASS: Record<TileState, string> = {
  correct: "btn-success",
  present: "btn-warning",
  absent: "btn-neutral",
};

export function Keyboard({
  letterStates,
  disabled,
  onKey,
}: {
  letterStates: Partial<Record<string, TileState>>;
  disabled: boolean;
  onKey: (key: string) => void;
}) {
  return (
    <div
      data-testid="keyboard"
      className="flex w-full flex-col gap-1.5 overflow-x-hidden"
    >
      {ROWS.map((row) => (
        <div key={row} className="flex w-full gap-1">
          {row.split("").map((letter) => {
            const state = letterStates[letter];
            return (
              <KeyButton
                key={letter}
                label={letter}
                testId={`key-${letter}`}
                state={state ?? "unknown"}
                disabled={disabled}
                className={state ? KEY_CLASS[state] : "btn-outline"}
                onKey={onKey}
                value={letter}
              />
            );
          })}
        </div>
      ))}
      <div className="flex w-full gap-1">
        <KeyButton
          label="Enter"
          testId="key-enter"
          state="unknown"
          disabled={disabled}
          className="btn-primary flex-[1.4]"
          onKey={onKey}
          value="enter"
        />
        <KeyButton
          label="Delete"
          testId="key-delete"
          state="unknown"
          disabled={disabled}
          className="btn-outline flex-[1.4]"
          onKey={onKey}
          value="backspace"
        />
      </div>
    </div>
  );
}

function KeyButton({
  label,
  testId,
  state,
  disabled,
  className,
  onKey,
  value,
}: {
  label: string;
  testId: string;
  state: TileState | "unknown";
  disabled: boolean;
  className: string;
  onKey: (key: string) => void;
  value: string;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      data-state={state}
      disabled={disabled}
      className={`btn btn-sm min-w-0 flex-1 px-0 uppercase ${className}`}
      onClick={() => onKey(value)}
    >
      {label}
    </button>
  );
}
