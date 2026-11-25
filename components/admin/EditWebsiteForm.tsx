'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import TemplatePicker from '@/components/admin/TemplatePicker';
import PackagePicker from '@/components/admin/PackagePicker';
import MusicPicker from '@/components/admin/MusicPicker';
import MediaUploader, {
  type UploadedMedia,
} from '@/components/admin/MediaUploader';
import { getTemplateById } from '@/config/templates';
import { packages } from '@/config/packages';
import type { TemplateField } from '@/types/template';
import type { WebsiteRecord } from '@/types/website';

type SaveState = {
  type: 'idle' | 'success' | 'error';
  message: string;
  url?: string;
};

type ContentValue = string | UploadedMedia | UploadedMedia[] | null;

type Props = {
  website: WebsiteRecord;
};

export default function EditWebsiteForm({ website }: Props) {
  const [templateId, setTemplateId] = useState(website.templateId);
  const [packageId, setPackageId] = useState(website.packageId);
  const [slug, setSlug] = useState(website.slug);
  const [content, setContent] = useState<Record<string, ContentValue>>({
    sender_name: website.senderName,
    receiver_name: website.receiverName,
    title: website.title,
    message: website.message,
    event_date: website.eventDate ?? '',
    music: '',

    ...(website.content as Record<string, ContentValue>),
  });

  const [saving, setSaving] = useState(false);

  const [saveState, setSaveState] = useState<SaveState>({
    type: 'idle',
    message: '',
  });

  const [receiverResponse, setReceiverResponse] = useState<Record<
    string,
    unknown
  > | null>(website.receiverResponse ?? null);
  const [resetting, setResetting] = useState(false);

  const template = useMemo(() => getTemplateById(templateId), [templateId]);

  const selectedPackage = useMemo(
    () => packages.find((item) => item.id === packageId),
    [packageId],
  );

  const fields = template?.schema.fields ?? [];

  function updateContent(key: string, value: ContentValue) {
    setContent((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function isFieldAllowed(field: TemplateField) {
    if (field.key === 'message') {
      return selectedPackage?.allowText ?? false;
    }

    if (field.key === 'music') {
      return selectedPackage?.allowMusic ?? false;
    }

    return true;
  }

  function renderField(field: TemplateField) {
    if (!isFieldAllowed(field)) {
      return null;
    }

    const rawValue = content[field.key];

    if (field.type === 'media') {
      const isMultiple = field.multiple === true;

      const mediaValue = isMultiple
        ? Array.isArray(rawValue)
          ? (rawValue as UploadedMedia[])
          : []
        : rawValue && !Array.isArray(rawValue) && typeof rawValue !== 'string'
          ? (rawValue as UploadedMedia)
          : null;

      return (
        <div key={field.key} className="form-field full">
          <MediaUploader
            fieldKey={field.key}
            value={mediaValue}
            multiple={isMultiple}
            required={field.required === true}
            onChange={(value) => updateContent(field.key, value)}
          />

          {field.description ? <small>{field.description}</small> : null}
        </div>
      );
    }

    const value = typeof rawValue === 'string' ? rawValue : '';

    if (field.type === 'textarea') {
      return (
        <label key={field.key} className="full">
          {field.label}

          {field.required ? ' *' : ''}

          <textarea
            rows={5}
            value={value}
            placeholder={field.placeholder}
            required={field.required === true}
            onChange={(event) => updateContent(field.key, event.target.value)}
          />
        </label>
      );
    }

    if (field.type === 'date') {
      return (
        <label key={field.key}>
          {field.label}

          {field.required ? ' *' : ''}

          <input
            type="date"
            value={value}
            required={field.required === true}
            onChange={(event) => updateContent(field.key, event.target.value)}
          />
        </label>
      );
    }

    if (field.type === 'music') {
      return (
        <label key={field.key}>
          {field.label}
          {field.required ? ' *' : ''}
          <MusicPicker
            onChange={(eventValue) => updateContent(field.key, eventValue)}
            required={field.required === true}
            value={value}
          />
          {field.description ? <small>{field.description}</small> : null}
        </label>
      );
    }

    return (
      <label key={field.key}>
        {field.label}

        {field.required ? ' *' : ''}

        <input
          type="text"
          value={value}
          placeholder={field.placeholder}
          required={field.required === true}
          onChange={(event) => updateContent(field.key, event.target.value)}
        />

        {field.description ? <small>{field.description}</small> : null}
      </label>
    );
  }

  async function save(status: 'draft' | 'published') {
    setSaving(true);

    setSaveState({
      type: 'idle',
      message: '',
    });

    try {
      const response = await fetch(`/api/websites/${website.id}`, {
        method: 'PATCH',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          slug,

          templateId,

          packageId,

          senderName: content.sender_name ?? '',

          receiverName: content.receiver_name ?? '',

          title: content.title ?? '',

          message: selectedPackage?.allowText ? (content.message ?? '') : '',

          eventDate: content.event_date || null,

          musicId: selectedPackage?.allowMusic
            ? (content.backgroundMusic ?? '')
            : '',

          musicUrl: '',

          theme: 'romantic',

          content,

          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'UPDATE_FAILED');
      }

      setSaveState({
        type: 'success',

        message:
          status === 'published'
            ? 'Website berhasil dipublish.'
            : 'Draft berhasil diperbarui.',

        url: `/${result.website.slug}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'UPDATE_FAILED';

      setSaveState({
        type: 'error',
        message,
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleResetResponse() {
    const confirmed = window.confirm(
      'Reset jawaban penerima? Status website akan kembali seperti belum dijawab.',
    );
    if (!confirmed) return;

    setResetting(true);
    setSaveState({ type: 'idle', message: '' });

    try {
      const res = await fetch(`/api/websites/${website.id}/response`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error ?? 'RESET_FAILED');
      }

      setReceiverResponse(null);
      setSaveState({
        type: 'success',
        message: 'Jawaban penerima berhasil direset.',
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'RESET_FAILED';
      setSaveState({ type: 'error', message: errMsg });
    } finally {
      setResetting(false);
    }
  }

  const senderName = String(content.sender_name ?? '');
  const receiverName = String(content.receiver_name ?? '');
  const title = String(content.title ?? '');
  const message = String(content.message ?? '');

  return (
    <div className="builder-layout">
      <section className="admin-panel builder-form">
        <div className="step-block">
          <span className="step-number">01</span>

          <div>
            <h2>Choose template</h2>

            <p>Update the selected template.</p>
          </div>
        </div>

        <TemplatePicker value={templateId} onChange={setTemplateId} />

        <div className="step-block">
          <span className="step-number">02</span>

          <div>
            <h2>Choose package</h2>

            <p>Package permissions control available fields.</p>
          </div>
        </div>

        <PackagePicker value={packageId} onChange={setPackageId} />

        <div className="step-block">
          <span className="step-number">03</span>

          <div>
            <h2>Customer content</h2>

            <p>Fields are generated from the selected template schema.</p>
          </div>
        </div>

        <div className="form-grid">
          {fields.map(renderField)}

          <label className="full">
            Slug
            <div className="slug-input">
              <span>truelove.id/</span>

              <input
                value={slug}
                onChange={(event) =>
                  setSlug(
                    event.target.value
                      .replace(/[^a-zA-Z0-9-]/g, '-')
                      .replace(/-+/g, '-')
                      .toLowerCase(),
                  )
                }
              />
            </div>
          </label>
        </div>

        <div className="builder-actions">
          <button
            type="button"
            className="button ghost"
            disabled={saving}
            onClick={() => save('draft')}
          >
            {saving ? 'Saving…' : 'Update Draft'}
          </button>

          <button
            type="button"
            className="button primary"
            disabled={saving}
            onClick={() => save('published')}
          >
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>

        {saveState.type !== 'idle' ? (
          <div className={`save-status ${saveState.type}`}>
            {saveState.message}

            {saveState.url ? (
              <>
                {' '}
                <a href={saveState.url} target="_blank" rel="noreferrer">
                  Open website ↗
                </a>
              </>
            ) : null}
          </div>
        ) : null}
      </section>

      <aside className="admin-panel live-preview-panel">
        <div className="preview-head">
          <span>LIVE PREVIEW</span>

          <span className="status-dot">● {website.status}</span>
        </div>

        <div className="phone-shell">
          <div className="phone-screen">
            <span className="preview-brand">TRUELOVE</span>

            <motion.div
              className="preview-symbol"
              animate={{
                y: [0, -7, 0],

                rotateZ: [-2, 2, -2],
              }}
              transition={{
                duration: 4,

                repeat: Infinity,

                ease: 'easeInOut',
              }}
            >
              💌
            </motion.div>

            <motion.small
              key={receiverName}
              initial={{
                opacity: 0,
                y: 5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              To {receiverName || 'Someone'}
            </motion.small>

            <motion.h3
              key={title}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              {title || 'Your title'}
            </motion.h3>

            <p>
              {selectedPackage?.allowText
                ? message
                : 'Text customization is not included in this package.'}
            </p>

            <strong>— {senderName || 'Someone'}</strong>
          </div>
        </div>

        <p className="preview-url">/{slug || 'your-slug'}</p>
        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
            }}
          >
            <span>RECEIVER RESPONSE</span>
            <span style={{ opacity: 0.7 }}>
              {receiverResponse ? '● Tersimpan' : '○ Kosong'}
            </span>
          </div>

          {receiverResponse ? (
            <>
              <pre
                style={{
                  margin: 0,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  fontSize: '0.72rem',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {JSON.stringify(receiverResponse, null, 2)}
              </pre>

              <button
                type="button"
                className="button ghost"
                disabled={resetting}
                onClick={handleResetResponse}
                style={{ width: '100%' }}
              >
                {resetting ? 'Mereset…' : '↺ Reset Jawaban Penerima'}
              </button>
            </>
          ) : (
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.65 }}>
              Belum ada jawaban atau pilihan tersimpan dari penerima.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
