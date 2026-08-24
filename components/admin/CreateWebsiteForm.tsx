"use client";

import { useMemo, useState } from "react";
import TemplatePicker from "@/components/admin/TemplatePicker";
import PackagePicker from "@/components/admin/PackagePicker";
import { getTemplateById } from "@/config/templates";
import { packages } from "@/config/packages";

export default function CreateWebsiteForm() {
  const [templateId, setTemplateId] = useState("love-letter-01");
  const [packageId, setPackageId] = useState("paket-murah");
  const [senderName, setSenderName] = useState("Arzaniel");
  const [receiverName, setReceiverName] = useState("Melvina");
  const [title, setTitle] = useState("A little thing for you");
  const [message, setMessage] = useState("I made this because some feelings deserve more than a normal chat bubble.");
  const [slug, setSlug] = useState("for-melvina");

  const template = useMemo(() => getTemplateById(templateId), [templateId]);
  const selectedPackage = useMemo(() => packages.find((item) => item.id === packageId), [packageId]);

  return (
    <div className="builder-layout">
      <section className="admin-panel builder-form">
        <div className="step-block">
          <span className="step-number">01</span>
          <div><h2>Choose template</h2><p>Only active templates appear here.</p></div>
        </div>
        <TemplatePicker value={templateId} onChange={setTemplateId} />

        <div className="step-block">
          <span className="step-number">02</span>
          <div><h2>Choose package</h2><p>The package decides which fields the admin can customize.</p></div>
        </div>
        <PackagePicker value={packageId} onChange={setPackageId} />

        <div className="step-block">
          <span className="step-number">03</span>
          <div><h2>Customer content</h2><p>This is already driven by the selected template/package concept.</p></div>
        </div>
        <div className="form-grid">
          <label>Sender<input value={senderName} onChange={(e) => setSenderName(e.target.value)} /></label>
          <label>Receiver<input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} /></label>
          <label className="full">Title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          {selectedPackage?.allowText ? (
            <label className="full">Message<textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} /></label>
          ) : null}
          <label className="full">Slug<div className="slug-input"><span>truelove.id/</span><input value={slug} onChange={(e) => setSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())} /></div></label>
        </div>

        <div className="integration-placeholder">
          <strong>Media uploader placeholder</strong>
          <p>Cloudinary upload will be connected in the next phase. Template requires: {template?.fields.join(", ")}</p>
        </div>

        <div className="builder-actions">
          <button type="button" className="button ghost">Save Draft</button>
          <button type="button" className="button primary">Publish (next phase)</button>
        </div>
      </section>

      <aside className="admin-panel live-preview-panel">
        <div className="preview-head"><span>LIVE PREVIEW</span><span className="status-dot">● Draft</span></div>
        <div className="phone-shell">
          <div className="phone-screen">
            <span className="preview-brand">TRUELOVE</span>
            <div className="preview-symbol">💌</div>
            <small>To {receiverName || "Someone"}</small>
            <h3>{title || "Your title"}</h3>
            <p>{selectedPackage?.allowText ? message : "Text customization is not included in this package."}</p>
            <strong>— {senderName || "Someone"}</strong>
          </div>
        </div>
        <p className="preview-url">/{slug || "your-slug"}</p>
      </aside>
    </div>
  );
}
