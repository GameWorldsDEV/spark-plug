import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { CreatorBuilder, isProhibitedDraftKey } from "./creator-builder";

describe("CreatorBuilder", () => {
  it.each(["maxContextTokens", "contextTokens", "inputTokens", "outputTokens", "tokenCount"])(
    "allows non-secret token accounting field %s",
    (key) => expect(isProhibitedDraftKey(key)).toBe(false),
  );

  it.each(["token", "accessToken", "refresh_token", "privateKey", "api_key", "command", "localPath", "password"])(
    "blocks secret or executable field %s",
    (key) => expect(isProhibitedDraftKey(key)).toBe(true),
  );

  it("keeps publishing gated while exposing safe lifecycle and model-license review", async () => {
    const { container } = render(<CreatorBuilder />);
    expect(screen.getByText("PREVIEW LOCKED")).toBeVisible();
    expect(screen.getByText("commercial ok")).toBeVisible();

    fireEvent.change(screen.getByLabelText("License"), { target: { value: "CC-BY-NC-4.0" } });
    expect(screen.getByText("noncommercial")).toBeVisible();
    expect(screen.getByText(/blocked from paid listings/i)).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "03 PUBLISH" }));
    expect(screen.getByRole("button", { name: /pro publishing disabled/i })).toBeDisabled();
    expect(screen.getByText("LICENSE REVIEW")).toBeVisible();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("shows the authenticated handoff without pretending the public site grants access", () => {
    render(<CreatorBuilder accountHref="https://marketplace.example/account" publishingHref="https://marketplace.example/creator/new" />);
    expect(screen.getByRole("link", { name: /sign in securely/i })).toHaveAttribute("href", "https://marketplace.example/account");
    fireEvent.click(screen.getByRole("button", { name: "03 PUBLISH" }));
    expect(screen.getByRole("link", { name: /continue to pro publishing/i })).toHaveAttribute("href", "https://marketplace.example/creator/new");
  });

  it("offers Spark Plug engines and declarative capabilities", () => {
    render(<CreatorBuilder />);
    const engine = screen.getByLabelText("Engine");
    for (const name of ["vLLM", "Colibri", "MLX", "Ollama"]) expect(engine).toHaveTextContent(name);
    fireEvent.click(screen.getByLabelText("tools"));
    fireEvent.click(screen.getByLabelText("thinking"));
    fireEvent.click(screen.getByLabelText("vision"));
    fireEvent.click(screen.getByLabelText("streaming"));
    expect(screen.getByLabelText("Generated package JSON")).toHaveTextContent('"tools"');
  });

  it("renders closed engine-specific MLX and Ollama settings", () => {
    render(<CreatorBuilder />);
    const engine = screen.getByLabelText("Engine");
    fireEvent.change(engine, { target: { value: "mlx" } });
    expect(screen.getByLabelText("Prefill step tokens")).toBeVisible();
    expect(screen.getByLabelText("Generated package JSON")).toHaveTextContent('"prefillStepTokens": 2048');
    expect(screen.getByLabelText("Generated package JSON")).not.toHaveTextContent("kvCacheBits");
    fireEvent.change(engine, { target: { value: "ollama" } });
    expect(screen.getByLabelText("GPU layers")).toBeVisible();
    expect(screen.getByLabelText("Flash attention")).toBeChecked();
    expect(screen.getByLabelText("Generated package JSON")).toHaveTextContent('"keepAliveSeconds": 300');
  });
});
