'use client';

import { useState, useMemo, useEffect } from 'react';
import { templates } from '@/config/templates';

export default function TemplatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  // 1. Dapatkan daftar occasion/kategori unik dari template yang aktif
  const categories = useMemo(() => {
    const activeTemplates = templates.filter((t) => t.active);
    const uniqueCategories = new Set(activeTemplates.map((t) => t.category));
    return Array.from(uniqueCategories);
  }, []);

  // 2. Set state awal dropdown
  const initialCategory = useMemo(() => {
    return templates.find((t) => t.id === value)?.category || 'all';
  }, [value]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);

  // 3. Sinkronisasi dropdown HANYA jika nilai 'value' berubah dari klik parent
  useEffect(() => {
    const cat = templates.find((t) => t.id === value)?.category;
    if (cat) {
      setSelectedCategory(cat);
    }
    // 👇 Perbaikan: selectedCategory dihapus dari array dependency di bawah ini
  }, [value]);

  // 4. Logika filter: Hanya tampilkan template sesuai occasion yang dipilih
  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      if (!t.active) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory)
        return false;
      return true;
    });
  }, [selectedCategory]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Dropdown Filter Occasion */}
      <div className="picker-filter">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '250px',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#fff',
            fontSize: '0.9rem',
            outline: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 5px rgba(0,0,0,0.02)',
          }}
        >
          <option value="all">Semua Occasion</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase().replace('-', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Grid Template - Super Ringkas */}
      <div className="picker-grid">
        {filteredTemplates.map((template) => (
          <button
            type="button"
            key={template.id}
            className={`picker-card ${value === template.id ? 'selected' : ''}`}
            onClick={() => onChange(template.id)}
            style={{
              padding: '12px 16px',
              minHeight: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <span className="tiny-label" style={{ marginBottom: '2px' }}>
              {template.category}
            </span>
            <strong style={{ fontSize: '0.95rem' }}>{template.name}</strong>
          </button>
        ))}
      </div>

      {/* Fallback kalau filter kosong */}
      {filteredTemplates.length === 0 && (
        <p
          style={{ color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic' }}
        >
          Tidak ada template aktif untuk occasion ini.
        </p>
      )}
    </div>
  );
}
