'use client';

import { useEffect, useState } from 'react';

type MusicRecord = {
  id: string;
  title: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  required: boolean;
};

export default function MusicPicker({ value, onChange, required }: Props) {
  const [musics, setMusics] = useState<MusicRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMusic() {
      try {
        const res = await fetch('/api/music');
        if (res.ok) {
          const data = await res.json();
          setMusics(data);
        }
      } catch (error) {
        console.error('Failed to fetch music:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchMusic();
  }, []);

  if (loading) {
    return (
      <div className="slug-input" style={{ padding: '12px', color: '#999' }}>
        Memuat lagu...
      </div>
    );
  }

  return (
    <select
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%',
        padding: '12px',
        borderRadius: '12px',
        border: '1px solid var(--line)',
        background: 'transparent',
        color: 'inherit',
      }}
    >
      <option value="">-- Pilih Lagu Pengiring --</option>
      {musics.map((m) => (
        <option key={m.id} value={m.id}>
          {m.title}
        </option>
      ))}
    </select>
  );
}
