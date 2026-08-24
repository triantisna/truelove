"use client";

import { packages } from "@/config/packages";

const money = new Intl.NumberFormat("id-ID");

export default function PackagePicker({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <div className="picker-grid">
      {packages.map((item) => (
        <button
          type="button"
          key={item.id}
          className={`picker-card ${value === item.id ? "selected" : ""}`}
          onClick={() => onChange(item.id)}
        >
          <span className="tiny-label">Rp{money.format(item.price)}</span>
          <strong>{item.name}</strong>
          <small>{item.description}</small>
        </button>
      ))}
    </div>
  );
}
