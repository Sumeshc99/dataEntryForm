import React, { useEffect, useState } from "react";

interface Props {
  initialTitle?: string;
  initialDescription?: string;
  submitLabel?: string;
  onSubmit: (title: string, description: string) => void;
  onCancel?: () => void;
}

export const TaskForm: React.FC<Props> = ({
  initialTitle = "",
  initialDescription = "",
  submitLabel = "Add",
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
  }, [initialTitle, initialDescription]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(title, description);
        if (!onCancel) {
          setTitle("");
          setDescription("");
        }
      }}
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      <input
        aria-label="title"
        placeholder="Please add title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        aria-label="description"
        placeholder="Please add description"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};
