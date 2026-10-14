// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthScreen } from "./AuthScreen";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("AuthScreen", () => {
  it("shows the login card without the game board", () => {
    render(<AuthScreen mode="login" />);
    const card = screen
      .getByRole("heading", { name: "Word Guess" })
      .closest("section");
    expect(card?.className).toContain("max-w-100");
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
    expect(screen.getByRole("button", { name: "Sign in" }).className).toContain(
      "w-full",
    );
    expect(screen.getByRole("contentinfo")).toHaveTextContent(
      "Word Guess on this server",
    );
    expect(screen.queryByTestId("board")).not.toBeInTheDocument();
    expect(document.body.innerHTML).not.toContain("Recent games");
  });

  it("shows a login error without displaying the password", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { error: "The username or password is incorrect." },
          { status: 401 },
        ),
      ),
    );

    render(<AuthScreen mode="login" />);
    await user.type(screen.getByLabelText("Username"), "ada");
    await user.type(screen.getByLabelText("Password"), "secret-pass");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("The username or password is incorrect.");
    expect(alert.textContent).not.toContain("secret-pass");
    expect(screen.getByLabelText("Password")).toHaveAttribute(
      "type",
      "password",
    );
  });
});
