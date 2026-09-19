'use client';

import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

export default function QRModalAction({ slug }: { slug: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const url = `https://truelove-kappa.vercel.app//${slug}`; // Ganti domain asli nanti
  const heartIconUrl =
    "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238e354a'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E";

  const downloadQR = () => {
    const originalCanvas = qrRef.current?.querySelector('canvas');
    if (!originalCanvas) return;

    // 1. Tentukan seberapa tebal margin putihnya (dalam pixel)
    const padding = 32;

    // 2. Bikin kanvas baru yang ukurannya lebih besar dari QR asli
    const canvasWithMargin = document.createElement('canvas');
    canvasWithMargin.width = originalCanvas.width + padding * 2;
    canvasWithMargin.height = originalCanvas.height + padding * 2;

    const ctx = canvasWithMargin.getContext('2d');
    if (!ctx) return;

    // 3. Warnai background kanvas baru jadi putih full
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWithMargin.width, canvasWithMargin.height);

    // 4. Tempel QR Code asli tepat di tengah-tengah kanvas baru
    ctx.drawImage(originalCanvas, padding, padding);

    // 5. Convert kanvas baru yang sudah bermargin ke PNG dan Download
    const pngUrl = canvasWithMargin
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `QR-Truelove-${slug}.png`;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setIsOpen(false); // Tutup popup setelah sukses download
  };

  return (
    <>
      {/* Tombol Pemicu di Tabel */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          color: 'var(--wine)',
          fontWeight: '600',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        QR
      </button>

      {/* Modal Popup (Hanya muncul jika isOpen true) */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '32px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '20px',
              position: 'relative',
              minWidth: '320px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            {/* Tombol Close Modal */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: '#f3ecea',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: 'var(--wine)',
                fontWeight: 'bold',
              }}
            >
              ✕
            </button>

            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: 0, color: 'var(--ink)' }}>
                QR Code Undangan
              </h3>
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '0.9rem',
                  color: 'var(--muted)',
                }}
              >
                /{slug}
              </p>
            </div>

            {/* Area QR Code */}
            <div
              ref={qrRef}
              style={{
                background: '#fff',
                padding: '16px',
                borderRadius: '16px',
                border: '1px solid var(--line)',
              }}
            >
              <QRCodeCanvas
                value={url}
                size={200}
                bgColor="#ffffff"
                fgColor="#462a2d" // Warna dark wine Truelove
                level="H"
                imageSettings={{
                  src: heartIconUrl,
                  height: 48,
                  width: 48,
                  excavate: true,
                }}
              />
            </div>

            <button
              onClick={downloadQR}
              className="button primary"
              style={{ width: '100%' }}
            >
              Download Gambar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
