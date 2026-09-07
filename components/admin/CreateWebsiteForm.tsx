'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

import TemplatePicker from '@/components/admin/TemplatePicker';
import PackagePicker from '@/components/admin/PackagePicker';
import MediaUploader, {
  type UploadedMedia,
} from '@/components/admin/MediaUploader';

import { getTemplateById } from '@/config/templates';
import { packages } from '@/config/packages';

import type { TemplateField } from '@/types/template';

type SaveState = {
  type: 'idle' | 'success' | 'error';
  message: string;
  url?: string;
};

type ContentValue = string | UploadedMedia | UploadedMedia[] | null;

export default function CreateWebsiteForm({
  databaseReady,
}: {
  databaseReady: boolean;
}) {
  const [templateId, setTemplateId] = useState('love-letter-01');

  const [packageId, setPackageId] = useState('paket-murah');

  const [slug, setSlug] = useState('for-melvina');

  const [content, setContent] = useState<Record<string, ContentValue>>({
    senderName: 'Arzaniel',
    receiverName: 'Melvina',
    heroTitle: 'A little thing for you',
    openingText: 'Someone made this just for you.',
    mainMessage:
      'I made this because some feelings deserve more than a normal chat bubble.',
    closingText: 'You are deeply loved.',
    heroImage: null,
    gallery: [],
    closingImage: null,
    backgroundMusic: '',
  });

  const [saving, setSaving] = useState(false);

  const [saveState, setSaveState] = useState<SaveState>({
    type: 'idle',
    message: '',
  });

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
    if (field.type === 'textarea' && field.key === 'mainMessage') {
      return selectedPackage?.allowText ?? false;
    }

    if (field.type === 'music' || field.key === 'backgroundMusic') {
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

    if (field.type === 'textarea') {
      const value = typeof rawValue === 'string' ? rawValue : '';

      return (
        <label key={field.key} className="full">
          {field.label}

          {field.required ? ' *' : ''}

          <textarea
            rows={5}
            value={value}
            placeholder={field.placeholder}
            required={field.required}
            onChange={(event) => updateContent(field.key, event.target.value)}
          />

          {field.description ? <small>{field.description}</small> : null}
        </label>
      );
    }

    const value = typeof rawValue === 'string' ? rawValue : '';

    return (
      <label key={field.key}>
        {field.label}

        {field.required ? ' *' : ''}

        <input
          type={field.type === 'music' ? 'url' : 'text'}
          value={value}
          placeholder={field.placeholder}
          required={field.required}
          onChange={(event) => updateContent(field.key, event.target.value)}
        />

        {field.description ? <small>{field.description}</small> : null}
      </label>
    );
  }

  async function save(status: 'draft' | 'published') {
    if (!databaseReady) {
      setSaveState({
        type: 'error',
        message:
          'Database belum tersambung. Isi DATABASE_URL + DIRECT_URL, migrate, lalu seed dulu.',
      });

      return;
    }

    setSaving(true);

    setSaveState({
      type: 'idle',
      message: '',
    });

    try {
      /*
       * Convert UploadedMedia objects into
       * JSON-safe content before sending them
       * to the website API.
       *
       * The complete media metadata remains
       * available inside content for now.
       */
      const response = await fetch('/api/websites', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          slug,
          templateId,
          packageId,

          senderName:
            typeof content.senderName === 'string' ? content.senderName : '',

          receiverName:
            typeof content.receiverName === 'string'
              ? content.receiverName
              : '',

          title: typeof content.heroTitle === 'string' ? content.heroTitle : '',

          message: selectedPackage?.allowText
            ? typeof content.mainMessage === 'string'
              ? content.mainMessage
              : ''
            : '',

          eventDate: null,

          musicUrl: selectedPackage?.allowMusic
            ? typeof content.backgroundMusic === 'string'
              ? content.backgroundMusic
              : ''
            : '',

          theme: 'romantic',

          content,

          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'SAVE_FAILED');
      }

      setSaveState({
        type: 'success',

        message:
          status === 'published'
            ? 'Published. Link customer sudah siap dibuka.'
            : 'Draft berhasil disimpan.',

        url: `/${result.website.slug}`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'SAVE_FAILED';

      setSaveState({
        type: 'error',
        message,
      });
    } finally {
      setSaving(false);
    }
  }

  const senderName =
    typeof content.senderName === 'string' ? content.senderName : '';

  const receiverName =
    typeof content.receiverName === 'string' ? content.receiverName : '';

  const heroTitle =
    typeof content.heroTitle === 'string' ? content.heroTitle : '';

  const mainMessage =
    typeof content.mainMessage === 'string' ? content.mainMessage : '';

  return (
    <div className="builder-layout">
      <section className="admin-panel builder-form">
        <div className="step-block">
          <span className="step-number">01</span>

          <div>
            <h2>Choose template</h2>

            <p>Only active templates appear here.</p>
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

        <div className="integration-placeholder">
          <strong>Dynamic template schema</strong>

          <p>
            {template
              ? `${template.name} menyediakan ${fields.length} field yang dibaca langsung dari template.schema.`
              : 'Select a template.'}
          </p>
        </div>

        <div className="builder-actions">
          <button
            type="button"
            className="button ghost"
            disabled={saving}
            onClick={() => save('draft')}
          >
            {saving ? 'Saving…' : 'Save Draft'}
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
          <span>ANIMATED LIVE PREVIEW</span>

          <span className="status-dot">● Draft</span>
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
              key={heroTitle}
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              {heroTitle || 'Your title'}
            </motion.h3>

            <p>
              {selectedPackage?.allowText
                ? mainMessage || 'Your message will appear here.'
                : 'Text customization is not included in this package.'}
            </p>

            <strong>— {senderName || 'Someone'}</strong>
          </div>
        </div>

        <p className="preview-url">/{slug || 'your-slug'}</p>
      </aside>
    </div>
  );
}
