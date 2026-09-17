'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

type Music = {
  id: string;
  title: string;
  url: string;
  createdAt: string;
};

export default function MusicLibraryPage() {
  const [musics, setMusics] = useState<Music[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchMusics = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/music');
      if (!response.ok) {
        throw new Error('Daftar lagu gagal dimuat.');
      }

      setMusics((await response.json()) as Music[]);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : 'Daftar lagu gagal dimuat.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMusics();
  }, [fetchMusics]);

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError('Pilih file lagu terlebih dahulu.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('file', file);

      const response = await fetch('/api/music', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Lagu gagal diunggah.');
      }

      setTitle('');
      setFile(null);
      setIsUploadOpen(false);
      await fetchMusics();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : 'Lagu gagal diunggah.',
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <main>
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">CONTENT</p>
          <h1>Music Library</h1>
          <p>Kelola lagu untuk melengkapi website romantis pelanggan.</p>
        </div>
        <button
          className="button primary"
          type="button"
          onClick={() => setIsUploadOpen(true)}
        >
          Upload Lagu Baru
        </button>
      </div>

      {isUploadOpen ? (
        <section className="admin-panel" style={{ marginBottom: 16 }}>
          <div className="panel-title">
            <h2>Upload Lagu Baru</h2>
            <p>Tambahkan lagu yang dapat digunakan pada website pelanggan.</p>
          </div>
          <form className="form-grid" onSubmit={handleUpload} style={{ marginTop: 22 }}>
            <label>
              Judul Lagu
              <input
                required
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Contoh: Perfect"
              />
            </label>
            <label>
              File Audio
              <input
                required
                type="file"
                accept="audio/*"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </label>
            {error ? <p role="alert" style={{ gridColumn: '1 / -1' }}>{error}</p> : null}
            <div style={{ display: 'flex', gap: 10, gridColumn: '1 / -1' }}>
              <button className="button primary" disabled={uploading} type="submit">
                {uploading ? 'Mengunggah...' : 'Simpan Lagu'}
              </button>
              <button
                className="button ghost"
                type="button"
                onClick={() => setIsUploadOpen(false)}
                disabled={uploading}
              >
                Batal
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {!isUploadOpen && error ? <p role="alert">{error}</p> : null}

      <section className="admin-panel table-panel">
        <div className="data-table">
          <div
            className="data-row data-head"
            style={{ gridTemplateColumns: '1.3fr 2fr 1fr' }}
          >
            <span>Title</span>
            <span>Audio</span>
            <span>Tanggal Upload</span>
          </div>
          {loading ? (
            <div className="data-row">Memuat daftar lagu...</div>
          ) : musics.length === 0 ? (
            <div className="data-row">Belum ada lagu di Music Library.</div>
          ) : (
            musics.map((music) => (
              <div
                className="data-row"
                key={music.id}
                style={{ gridTemplateColumns: '1.3fr 2fr 1fr' }}
              >
                <strong>{music.title}</strong>
                <audio controls preload="none" src={music.url}>
                  Browser Anda tidak mendukung pemutar audio.
                </audio>
                <span>
                  {new Date(music.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}