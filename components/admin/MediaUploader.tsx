'use client';

import { useRef, useState } from 'react';

export type UploadedMedia = {
  url: string;
  publicId: string;
  resourceType: string;
  caption?: string; // 👇 Tambahan: Menyimpan teks caption/tanggal
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
};

type MediaUploaderProps = {
  fieldKey: string;
  value: UploadedMedia | UploadedMedia[] | null;
  multiple?: boolean;
  required?: boolean;
  onChange: (value: UploadedMedia | UploadedMedia[] | null) => void;
};

export default function MediaUploader({
  fieldKey,
  value,
  multiple = false,
  required = false,
  onChange,
}: MediaUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState('');

  const files = multiple
    ? Array.isArray(value)
      ? value
      : []
    : value && !Array.isArray(value)
      ? [value]
      : [];

  async function handleUpload(selectedFiles: FileList | null) {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const selected = Array.from(selectedFiles);

      const filesToUpload = multiple ? selected : selected.slice(0, 1);

      const uploaded: UploadedMedia[] = [];

      const signatureResponse = await fetch('/api/upload/signature');
      const signatureResult = await signatureResponse.json();

      if (!signatureResponse.ok) {
        throw new Error(signatureResult.error || 'SIGNATURE_FAILED');
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const { signature, timestamp, folder, apiKey } = signatureResult;

      if (
        typeof cloudName !== 'string' ||
        !cloudName ||
        typeof signature !== 'string' ||
        typeof timestamp !== 'number' ||
        typeof folder !== 'string' ||
        typeof apiKey !== 'string'
      ) {
        throw new Error('INVALID_CLOUDINARY_SIGNATURE');
      }

      for (const file of filesToUpload) {
        const formData = new FormData();

        formData.append('file', file);
        formData.append('api_key', apiKey);
        formData.append('timestamp', String(timestamp));
        formData.append('signature', signature);
        formData.append('folder', folder);

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
          {
            method: 'POST',
            body: formData,
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error?.message || 'UPLOAD_FAILED');
        }

        if (
          typeof result.secure_url !== 'string' ||
          typeof result.public_id !== 'string'
        ) {
          throw new Error('INVALID_UPLOAD_RESPONSE');
        }

        uploaded.push({
          url: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto/'),
          publicId: result.public_id,
          resourceType:
            typeof result.resource_type === 'string'
              ? result.resource_type
              : 'image',
          caption: '', // Default caption kosong saat baru upload
          width: typeof result.width === 'number' ? result.width : undefined,
          height: typeof result.height === 'number' ? result.height : undefined,
          format: typeof result.format === 'string' ? result.format : undefined,
          bytes: typeof result.bytes === 'number' ? result.bytes : undefined,
        });
      }

      if (multiple) {
        const existing = Array.isArray(value) ? value : [];
        onChange([...existing, ...uploaded]);
      } else {
        onChange(uploaded[0] ?? null);
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : 'UPLOAD_FAILED',
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  function removeFile(index: number) {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      onChange(current.filter((_, itemIndex) => itemIndex !== index));
      return;
    }
    onChange(null);
  }

  // 👇 Tambahan: Fungsi untuk mengupdate caption/text
  function updateCaption(index: number, newCaption: string) {
    if (multiple) {
      const current = Array.isArray(value) ? [...value] : [];
      if (current[index]) {
        current[index] = { ...current[index], caption: newCaption };
        onChange(current);
      }
    } else {
      const current = value as UploadedMedia;
      if (current) {
        onChange({ ...current, caption: newCaption });
      }
    }
  }

  return (
    <div className="media-uploader">
      {/* Header Info & Action */}
      <div className="media-uploader-header">
        <div className="media-uploader-title-group">
          <strong>{multiple ? 'Upload photos' : 'Upload image'}</strong>
          <small>JPG, PNG, WEBP or GIF · max 10 MB</small>
        </div>

        <button
          type="button"
          className="button ghost small"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading…' : multiple ? 'Add photos' : 'Choose image'}
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        required={required && files.length === 0}
        hidden
        onChange={(event) => handleUpload(event.target.files)}
      />

      {/* Grid Display atau Empty Area */}
      {files.length > 0 ? (
        <div className="media-uploader-grid">
          {files.map((item, index) => (
            // 👇 Kita styling dikit kontainernya biar muat input teks
            <div
              key={`${item.publicId}-${index}`}
              className="media-uploader-item"
              style={{
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingBottom: '8px',
                overflow: 'visible',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1/1',
                }}
              >
                <img
                  src={item.url}
                  alt={`Uploaded media ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <button
                  type="button"
                  className="media-uploader-remove"
                  aria-label={`Remove image ${index + 1}`}
                  onClick={() => removeFile(index)}
                  style={{ zIndex: 10 }}
                >
                  ×
                </button>
              </div>

              {/* 👇 INI DIA: Form input khusus untuk Caption/Tanggal */}
              <input
                type="text"
                placeholder={
                  multiple ? 'Tulis caption...' : 'Caption gambar...'
                }
                value={item.caption || ''}
                onChange={(e) => updateCaption(index, e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  outline: 'none',
                  background: '#fff',
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="media-uploader-empty"
          onClick={() => inputRef.current?.click()}
        >
          <span>＋</span>
          <p>No image uploaded yet.</p>
          <small>Click to browse files</small>
        </div>
      )}

      {error ? <p className="media-uploader-error">{error}</p> : null}
    </div>
  );
}
