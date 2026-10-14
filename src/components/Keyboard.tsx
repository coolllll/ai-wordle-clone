import type { TileState } from "@/lib/types";

const ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as const;

const KEY_CLASS: Record<TileState, string> = {
  correct: "border-correct bg-correct text-on-correct",
  present: "border-present bg-present text-on-present",
  absent: "border-absent bg-absent text-on-absent",
};

const KEY_BASE =
  "inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-md border px-0 text-xs font-semibold uppercase disabled:opacity-40";

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
                className={
                  state ? KEY_CLASS[state] : "border-line bg-surface text-ink"
                }
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
          className="flex-[1.4] border-primary bg-primary text-on-primary"
          onKey={onKey}
          value="enter"
        />
        <KeyButton
          label="Delete"
          testId="key-delete"
          state="unknown"
          disabled={disabled}
          className="flex-[1.4] border-line bg-surface text-ink"
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
      className={`${KEY_BASE} ${className}`}
      onClick={() => onKey(value)}
    >
      {label}
    </button>
  );
}
