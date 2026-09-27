'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteWebsiteAction({
  id,
  slug,
}: {
  id: string;
  slug: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      `Hapus Permanen?\n\nYakin ingin menghapus website /${slug}?\nSemua foto yang terhubung juga akan dihapus dari sistem storage.`,
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/websites/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Gagal menghapus website');

      // Refresh halaman biar tabel otomatis update
      router.refresh();
    } catch (error) {
      alert('Terjadi kesalahan saat menghapus website.');
      setIsDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      style={{
        color: '#dc2626', // Warna merah biar keliatan bahaya
        background: 'none',
        border: 'none',
        fontWeight: '600',
        cursor: isDeleting ? 'not-allowed' : 'pointer',
        opacity: isDeleting ? 0.5 : 1,
        padding: 0,
      }}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}
