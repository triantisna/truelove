"use client";

import { templates } from "@/config/templates";

export default function TemplatePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="picker-grid">
      {templates.filter((item) => item.active).map((template) => (
        <button
          type="button"
          key={template.id}
          className={`picker-card ${value === template.id ? "selected" : ""}`}
          onClick={() => onChange(template.id)}
        >
          <span className="tiny-label">{template.category}</span>
          <strong>{template.name}</strong>
          <small>{template.description}</small>
        </button>
      ))}
    </div>
  );
}
