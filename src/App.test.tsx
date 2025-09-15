import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

// A small helper to type into inputs
const typeText = (input: HTMLElement, value: string) => {
  fireEvent.change(input, { target: { value } });
};

describe("App (Task Manager)", () => {
  test("renders header", () => {
    render(<App />);
    expect(screen.getByText(/task manager/i)).toBeInTheDocument();
  });

  test("shows loading and then tasks", async () => {
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    const task = await screen.findByText(/welcome!/i);
    expect(task).toBeInTheDocument();
  });

  test("adds a new task", async () => {
    render(<App />);

    // Wait for initial task
    await screen.findByText(/welcome!/i);

    const titleInput = screen.getByPlaceholderText(/title/i);
    const descInput = screen.getByPlaceholderText(/description/i);
    const addBtn = screen.getByRole("button", { name: /add/i });

    typeText(titleInput, "Write tests");
    typeText(descInput, "Write unit tests for App");
    fireEvent.click(addBtn);

    expect(await screen.findByText(/write tests/i)).toBeInTheDocument();
  });

  test("toggles a task's completion", async () => {
    render(<App />);
    const checkbox = await screen.findByRole("checkbox", { name: /welcome!/i });
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  test("filters active and completed tasks", async () => {
    render(<App />);
    await screen.findByText(/welcome!/i);

    const filter = screen.getByLabelText(/filter/i);
    fireEvent.change(filter, { target: { value: "completed" } });

    // If the welcome task was not yet completed, nothing should be visible
    await waitFor(() =>
      expect(screen.queryByText(/welcome!/i)).not.toBeInTheDocument()
    );

    fireEvent.change(filter, { target: { value: "all" } });
    expect(await screen.findByText(/welcome!/i)).toBeInTheDocument();
  });

  test("deletes a task", async () => {
    render(<App />);
    const row = await screen.findByText(/welcome!/i);
    const deleteBtn = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteBtn);

    await waitFor(() =>
      expect(screen.queryByText(/welcome!/i)).not.toBeInTheDocument()
    );
  });
});
