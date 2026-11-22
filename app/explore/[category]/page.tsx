'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories } from '@/config/categories';
import { templates } from '@/config/templates';

type SchemaField = {
  key: string;
  label: string;
  type: string;
  multiple?: boolean;
};

function getDemoPreview(
  field: SchemaField,
  mockData: Record<string, any>,
): string {
  const val = mockData?.[field.key];

  if (field.type === 'music') {
    return 'Bisa request lagu latar sesuai keinginanmu';
  }

  if (field.type === 'media' || field.type === 'image') {
    if (Array.isArray(val)) {
      return val.length > 0
        ? `${val.length} foto di demo (bisa diganti fotomu)`
        : 'Bisa upload beberapa foto kenangan';
    }
    return '1 foto di demo (bisa diganti fotomu)';
  }

  if (val !== undefined && val !== null && String(val).trim() !== '') {
    const clean = String(val).replace(/\s+/g, ' ').trim();
    const snippet = clean.length > 70 ? `${clean.slice(0, 70)}…` : clean;
    return `"${snippet}"`;
  }

  return 'Bisa diisi sesuai keinginanmu';
}

export default function ExplorePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = use(params);
  const categorySlug = resolvedParams.category;

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const categoryTemplates = templates.filter(
    (t) => t.category === categorySlug,
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  if (!activeCategory) {
    notFound();
  }

  const activeTemplate = categoryTemplates[activeIndex];
  const activeTier = (activeTemplate as any)?.tier || 'standard';
  const activeMockData: Record<string, any> =
    (activeTemplate as any)?.mockData || {};
  const orderHref = `/?occasion=${categorySlug}&template=${activeTemplate?.id}&tier=${activeTier}#order`;

  // Ambil daftar field dari schema.json template yang sedang aktif
  const rawFields: SchemaField[] =
    (activeTemplate as any)?.schema?.fields || [];

  const textFields = rawFields.filter((f) =>
    ['text', 'textarea', 'date', 'number'].includes(f.type),
  );
  const mediaFields = rawFields.filter((f) =>
    ['media', 'image'].includes(f.type),
  );
  const musicFields = rawFields.filter((f) => f.type === 'music');

  return (
    <>
      <style>{`
        .explore-layout {
          display: flex;
          height: 100dvh;
          overflow: hidden;
          background: #fff;
        }
        .explore-sidebar {
          width: 280px;
          background: #fff;
          height: 100%;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #eaeaea;
          transition: transform 0.3s ease;
          z-index: 50;
          flex-shrink: 0;
        }
        .explore-main {
          flex: 1;
          height: 100%;
          min-height: 0;
          background: #f4f4f4;
          position: relative;
        }
        .iframe-demo {
          width: 100%;
          height: 100%;
          border: none;
          display: block;
        }
        .mobile-topbar {
          display: none;
        }
        .mobile-overlay {
          display: none;
        }
        .sidebar-close-btn {
          display: none;
          background: transparent;
          border: none;
          padding: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          color: var(--ink, #1a1a1a);
        }

        .template-list-item {
          padding: 14px 16px;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 500;
          font-size: 0.95rem;
          color: var(--ink, #1a1a1a);
          transition: all 0.2s ease;
          border: 1px solid transparent;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .template-list-item:hover {
          background-color: #f9f9f9;
        }
        .template-list-item.active {
          background-color: #fdf8f5;
          color: var(--wine, #8e354a);
          border-color: #f3ecea;
        }

        .premium-badge {
          background: linear-gradient(135deg, #d4af37, #aa820a);
          color: #fff;
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }

        .custom-info-btn {
          width: 100%;
          padding: 10px 12px;
          margin-bottom: 10px;
          background: #faf8f6;
          border: 1px dashed #d8cfc8;
          border-radius: 10px;
          color: #555;
          font-size: 0.82rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .custom-info-btn:hover {
          background: #f3ecea;
          color: var(--wine, #8e354a);
          border-color: var(--wine, #8e354a);
        }

        .sidebar-microcopy {
          margin: 10px 0 0;
          font-size: 0.72rem;
          color: #888;
          text-align: center;
          line-height: 1.45;
        }

        /* Modal Custom Fields */
        .custom-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .custom-modal {
          background: #fff;
          width: 100%;
          max-width: 480px;
          max-height: 84vh;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
        }
        .custom-modal-header {
          padding: 18px 22px;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .custom-modal-body {
          padding: 18px 22px;
          overflow-y: auto;
          flex: 1;
        }
        .custom-group {
          margin-bottom: 20px;
        }
        .custom-group:last-child {
          margin-bottom: 0;
        }
        .custom-group-title {
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--wine, #8e354a);
          margin: 0 0 10px;
        }
        .custom-item-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .custom-item {
          background: #faf8f6;
          border: 1px solid #eee8e2;
          border-radius: 10px;
          padding: 10px 12px;
        }
        .custom-item-label {
          font-size: 0.84rem;
          font-weight: 600;
          color: #1f1f1f;
          margin: 0 0 3px;
        }
        .custom-item-preview {
          font-size: 0.78rem;
          color: #6e655f;
          margin: 0;
          line-height: 1.45;
        }
        .custom-item-tag {
          font-weight: 600;
          color: #9a8d84;
          margin-right: 4px;
        }

        @media (max-width: 768px) {
          .explore-layout {
            flex-direction: column;
          }
          .mobile-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            height: 56px;
            padding: 0 12px;
            background: #fff;
            border-bottom: 1px solid #eaeaea;
            flex-shrink: 0;
            z-index: 40;
          }
          .mobile-menu-trigger {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f8f5f2;
            border: 1px solid #ece6e0;
            border-radius: 10px;
            padding: 7px 11px;
            color: var(--ink, #1a1a1a);
            font-size: 0.84rem;
            font-weight: 600;
            cursor: pointer;
            min-width: 0;
            max-width: 65%;
          }
          .mobile-menu-label {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .mobile-order-cta {
            padding: 8px 14px;
            border-radius: 10px;
            font-size: 0.8rem;
            font-weight: 600;
            white-space: nowrap;
            flex-shrink: 0;
            text-decoration: none;
          }
          .explore-sidebar {
            position: fixed;
            left: 0;
            top: 0;
            height: 100dvh;
            transform: translateX(-100%);
          }
          .explore-sidebar.open {
            transform: translateX(0);
          }
          .sidebar-close-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .mobile-overlay.open {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 45;
          }
        }
      `}</style>

      <div className="explore-layout">
        <header className="mobile-topbar">
          <button
            type="button"
            className="mobile-menu-trigger"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Buka daftar desain"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
            <span className="mobile-menu-label">
              {activeTemplate ? activeTemplate.name : 'Pilih Desain'}
            </span>
            <span style={{ fontSize: '0.7rem', color: '#888', flexShrink: 0 }}>
              ▾
            </span>
          </button>

          <Link href={orderHref} className="button primary mobile-order-cta">
            Gunakan
          </Link>
        </header>

        <div
          className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <aside className={`explore-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <div
            style={{
              padding: '24px 24px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h1
              style={{
                fontSize: '1.2rem',
                fontFamily: 'var(--font-serif)',
                margin: 0,
                color: 'var(--ink)',
                textTransform: 'capitalize',
              }}
            >
              {activeCategory.name}
            </h1>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Tutup daftar desain"
            >
              ✕
            </button>
          </div>

          <div style={{ flex: 1, padding: '0 16px', overflowY: 'auto' }}>
            {categoryTemplates.length === 0 ? (
              <p
                style={{
                  color: 'var(--muted)',
                  textAlign: 'center',
                  marginTop: '20px',
                  fontSize: '0.9rem',
                }}
              >
                Belum ada desain.
              </p>
            ) : (
              categoryTemplates.map((template, index) => (
                <div
                  key={template.id}
                  role="button"
                  tabIndex={0}
                  className={`template-list-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsMobileMenuOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIndex(index);
                      setIsMobileMenuOpen(false);
                    }
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {template.name}
                  </span>
                  {(template as any).tier === 'premium' && (
                    <span className="premium-badge">PREMIUM</span>
                  )}
                </div>
              ))
            )}
          </div>

          <div
            style={{
              padding: '20px 24px 24px',
              borderTop: '1px solid #eaeaea',
            }}
          >
            {rawFields.length > 0 && (
              <button
                type="button"
                className="custom-info-btn"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsCustomModalOpen(true);
                }}
              >
                <span aria-hidden="true">✏️</span>
                <span>Yang bisa di-custom ({rawFields.length} bagian)</span>
              </button>
            )}

            <Link
              href={orderHref}
              className="button primary"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              Gunakan Desain Ini
            </Link>

            <p className="sidebar-microcopy">
              Semua nama, cerita, foto & lagu di demo 100% bisa disesuaikan.
            </p>
          </div>
        </aside>

        <main className="explore-main">
          {activeTemplate ? (
            <iframe
              src={`/demo/${activeTemplate.id}`}
              className="iframe-demo"
              title={`Demo ${activeTemplate.name}`}
            />
          ) : (
            <div
              style={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--muted)',
              }}
            >
              Tidak ada preview yang tersedia.
            </div>
          )}
        </main>
      </div>

      {/* MODAL DAFTAR BAGIAN YANG BISA DI-CUSTOM + CONTOH DI DEMO */}
      {isCustomModalOpen && activeTemplate && (
        <div
          className="custom-modal-backdrop"
          onClick={() => setIsCustomModalOpen(false)}
        >
          <div
            className="custom-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Bagian yang bisa di-custom"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="custom-modal-header">
              <div>
                <h2
                  style={{ margin: 0, fontSize: '1.05rem', color: '#1a1a1a' }}
                >
                  Bagian yang Bisa Di-custom
                </h2>
                <p
                  style={{
                    margin: '2px 0 0',
                    fontSize: '0.8rem',
                    color: '#777',
                  }}
                >
                  {activeTemplate.name} · Teks dalam kutipan adalah contoh di
                  demo
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px 8px',
                }}
                aria-label="Tutup modal"
              >
                ✕
              </button>
            </div>

            <div className="custom-modal-body">
              {textFields.length > 0 && (
                <div className="custom-group">
                  <p className="custom-group-title">
                    📝 Teks & Cerita ({textFields.length})
                  </p>
                  <div className="custom-item-list">
                    {textFields.map((field) => (
                      <div key={field.key} className="custom-item">
                        <p className="custom-item-label">{field.label}</p>
                        <p
                          className="custom-item-preview"
                          style={{ fontStyle: 'italic' }}
                        >
                          {getDemoPreview(field, activeMockData)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {mediaFields.length > 0 && (
                <div className="custom-group">
                  <p className="custom-group-title">
                    📸 Foto & Galeri ({mediaFields.length})
                  </p>
                  <div className="custom-item-list">
                    {mediaFields.map((field) => (
                      <div key={field.key} className="custom-item">
                        <p className="custom-item-label">{field.label}</p>
                        <p className="custom-item-preview">
                          {getDemoPreview(field, activeMockData)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {musicFields.length > 0 && (
                <div className="custom-group">
                  <p className="custom-group-title">🎵 Musik Latar</p>
                  <div className="custom-item-list">
                    {musicFields.map((field) => (
                      <div key={field.key} className="custom-item">
                        <p className="custom-item-label">{field.label}</p>
                        <p className="custom-item-preview">
                          {getDemoPreview(field, activeMockData)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '16px 22px', borderTop: '1px solid #eee' }}>
              <Link
                href={orderHref}
                className="button primary"
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                Pesan Desain Ini Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
