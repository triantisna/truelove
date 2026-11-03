'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categories } from '@/config/categories';
import { templates } from '@/config/templates';

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

  if (!activeCategory) {
    notFound();
  }

  const activeTemplate = categoryTemplates[activeIndex];
  // Parameter tier akan dikirim ke form order, default ke standard jika tidak ada
  const activeTier = (activeTemplate as any)?.tier || 'standard';

  return (
    <>
      <style>{`
        .explore-layout { display: flex; height: 100vh; overflow: hidden; background: #fff; }
        .explore-sidebar { 
          width: 280px; background: #fff; height: 100vh; display: flex; flex-direction: column;
          border-right: 1px solid #eaeaea; transition: transform 0.3s ease; z-index: 50; flex-shrink: 0;
        }
        .explore-main { flex: 1; height: 100vh; background: #f4f4f4; position: relative; }
        .iframe-demo { width: 100%; height: 100%; border: none; display: block; }
        .mobile-overlay { display: none; }
        .hamburger-btn { display: none; }
        
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
        }

        @media (max-width: 768px) {
          .explore-sidebar { position: fixed; left: 0; top: 0; transform: translateX(-100%); }
          .explore-sidebar.open { transform: translateX(0); }
          .hamburger-btn { 
            display: flex; position: absolute; top: 16px; left: 16px; z-index: 40; 
            background: rgba(255,255,255,0.9); backdrop-filter: blur(4px);
            border: none; padding: 12px; border-radius: 50%; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; align-items: center; justify-content: center;
            color: var(--ink);
          }
          .mobile-overlay.open { display: block; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 45; }
        }
      `}</style>

      <div className="explore-layout">
        <button
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

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
            <h2
              style={{
                fontSize: '1.2rem',
                fontFamily: 'var(--font-serif)',
                margin: 0,
                color: 'var(--ink)',
                textTransform: 'capitalize',
              }}
            >
              {activeCategory.name}
            </h2>
            <button
              className="hamburger-btn"
              style={{
                position: 'relative',
                top: 0,
                left: 0,
                padding: '8px',
                background: 'transparent',
                boxShadow: 'none',
              }}
              onClick={() => setIsMobileMenuOpen(false)}
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
                  className={`template-list-item ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsMobileMenuOpen(false);
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

          <div style={{ padding: '24px', borderTop: '1px solid #eaeaea' }}>
            <Link
              href={`/?occasion=${categorySlug}&template=${activeTemplate?.id}&tier=${activeTier}#order`}
              className="button primary"
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              Gunakan Desain Ini
            </Link>
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
    </>
  );
}
