import { formatCompletedAt } from "@/lib/history";
import type { HistoryEntry } from "@/lib/types";

export function HistoryList({ entries }: { entries: HistoryEntry[] }) {
  if (entries.length === 0) {
    return (
      <p data-testid="history-empty" className="text-base-content/70">
        No completed games yet.
      </p>
    );
  }

  return (
    <ol
      data-testid="history-list"
      className="flex w-full flex-col gap-3 overflow-x-hidden"
    >
      {entries.map((entry) => (
        <li
          key={entry.id}
          data-testid="history-entry"
          className="card w-full bg-base-100 shadow-sm"
        >
          <div className="card-body gap-1 p-4">
            <time dateTime={entry.completedAt}>
              {formatCompletedAt(entry.completedAt)}
            </time>
            <p>
              Result: <span data-testid="history-result">{entry.result}</span>
            </p>
            {entry.result === "won" ? (
              <p data-testid="history-score">Score: {entry.score}</p>
            ) : null}
            <p>
              Answer: <span data-testid="history-answer">{entry.answer}</span>
            </p>
            <ol data-testid="history-guesses" className="list-decimal pl-5">
              {entry.guesses.map((guess, index) => (
                <li key={`${entry.id}-${index}`}>{guess}</li>
              ))}
            </ol>
          </div>
        </li>
      ))}
    </ol>
  );
}
