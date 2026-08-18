import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WaitlistForm } from "./waitlist-form";

describe("WaitlistForm", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("submits an email with explicit consent", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const { container } = render(<WaitlistForm />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "person@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.submit(screen.getByRole("button", { name: /join early access/i }).closest("form")!);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    expect(await screen.findByText(/on the signal list/i)).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("shows the safe server message on setup failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({ message: "The list is warming up." }),
      }),
    );
    render(<WaitlistForm />);

    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "person@example.com" },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.submit(screen.getByRole("button", { name: /join early access/i }).closest("form")!);

    expect(await screen.findByText("The list is warming up.")).toBeInTheDocument();
  });
});
