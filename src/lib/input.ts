import { WORD_LENGTH } from "./types";

export function applyDraftInput(
  draft: string,
  key: string,
  canType: boolean,
): { draft: string; submit: boolean } {
  if (!canType) {
    return { draft, submit: false };
  }
  if (key === "enter") {
    return { draft, submit: draft.length === WORD_LENGTH };
  }
  if (key === "backspace" || key === "delete") {
    return { draft: draft.slice(0, -1), submit: false };
  }
  if (/^[a-z]$/.test(key) && draft.length < WORD_LENGTH) {
    return { draft: `${draft}${key}`, submit: false };
  }
  return { draft, submit: false };
}
