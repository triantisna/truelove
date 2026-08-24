"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import TemplatePicker from "@/components/admin/TemplatePicker";
import PackagePicker from "@/components/admin/PackagePicker";
import { getTemplateById } from "@/config/templates";
import { packages } from "@/config/packages";

type SaveState = { type: "idle" | "success" | "error"; message: string; url?: string };

export default function CreateWebsiteForm({ databaseReady }: { databaseReady: boolean }) {
  const [templateId, setTemplateId] = useState("love-letter-01");
  const [packageId, setPackageId] = useState("paket-murah");
  const [senderName, setSenderName] = useState("Arzaniel");
  const [receiverName, setReceiverName] = useState("Melvina");
  const [title, setTitle] = useState("A little thing for you");
  const [message, setMessage] = useState("I made this because some feelings deserve more than a normal chat bubble.");
  const [slug, setSlug] = useState("for-melvina");
  const [eventDate, setEventDate] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>({ type: "idle", message: "" });

  const template = useMemo(() => getTemplateById(templateId), [templateId]);
  const selectedPackage = useMemo(() => packages.find((item) => item.id === packageId), [packageId]);
  const needsDate = template?.fields.includes("event_date") ?? false;

  async function save(status: "draft" | "published") {
    if (!databaseReady) {
      setSaveState({ type: "error", message: "Database belum tersambung. Isi DATABASE_URL + DIRECT_URL, migrate, lalu seed dulu." });
      return;
    }

    setSaving(true);
    setSaveState({ type: "idle", message: "" });

    try {
      const response = await fetch("/api/websites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          templateId,
          packageId,
          senderName,
          receiverName,
          title,
          message: selectedPackage?.allowText ? message : "",
          eventDate: needsDate && eventDate ? eventDate : null,
          musicUrl: selectedPackage?.allowMusic ? musicUrl : "",
          theme: "romantic",
          content: {
            reasons: [
              "You make ordinary days feel lighter.",
              "You make chaos feel a little more like home.",
              "You are still my favorite person to tell everything to."
            ]
          },
          status
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "SAVE_FAILED");

      setSaveState({
        type: "success",
        message: status === "published" ? "Published. Link customer sudah siap dibuka." : "Draft berhasil disimpan.",
        url: `/${result.website.slug}`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "SAVE_FAILED";
      setSaveState({ type: "error", message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="builder-layout">
      <section className="admin-panel builder-form">
        <div className="step-block"><span className="step-number">01</span><div><h2>Choose template</h2><p>Only active templates appear here.</p></div></div>
        <TemplatePicker value={templateId} onChange={setTemplateId} />

        <div className="step-block"><span className="step-number">02</span><div><h2>Choose package</h2><p>Package permissions control available fields.</p></div></div>
        <PackagePicker value={packageId} onChange={setPackageId} />

        <div className="step-block"><span className="step-number">03</span><div><h2>Customer content</h2><p>Admin edits content here; template code remains untouched.</p></div></div>
        <div className="form-grid">
          <label>Sender<input value={senderName} onChange={(e) => setSenderName(e.target.value)} /></label>
          <label>Receiver<input value={receiverName} onChange={(e) => setReceiverName(e.target.value)} /></label>
          <label className="full">Title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          {selectedPackage?.allowText ? <label className="full">Message<textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} /></label> : null}
          {needsDate ? <label>Event date<input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /></label> : null}
          {selectedPackage?.allowMusic ? <label className={needsDate ? "" : "full"}>Music URL<input placeholder="Cloudinary URL — uploader comes next" value={musicUrl} onChange={(e) => setMusicUrl(e.target.value)} /></label> : null}
          <label className="full">Slug<div className="slug-input"><span>truelove.id/</span><input value={slug} onChange={(e) => setSlug(e.target.value.replace(/[^a-zA-Z0-9-]/g, "-").replace(/-+/g, "-").toLowerCase())} /></div></label>
        </div>

        <div className="integration-placeholder">
          <strong>Media module prepared</strong>
          <p>Template asks for: {template?.fields.join(", ")}. Photo/video upload will use Cloudinary in the media phase; database relationship is already present as WebsiteMedia.</p>
        </div>

        <div className="builder-actions">
          <button type="button" className="button ghost" disabled={saving} onClick={() => save("draft")}>{saving ? "Saving…" : "Save Draft"}</button>
          <button type="button" className="button primary" disabled={saving} onClick={() => save("published")}>{saving ? "Publishing…" : "Publish"}</button>
        </div>

        {saveState.type !== "idle" ? (
          <div className={`save-status ${saveState.type}`}>
            {saveState.message}
            {saveState.url ? <> <a href={saveState.url} target="_blank" rel="noreferrer">Open website ↗</a></> : null}
          </div>
        ) : null}
      </section>

      <aside className="admin-panel live-preview-panel">
        <div className="preview-head"><span>ANIMATED LIVE PREVIEW</span><span className="status-dot">● Draft</span></div>
        <div className="phone-shell">
          <div className="phone-screen">
            <span className="preview-brand">TRUELOVE</span>
            <motion.div className="preview-symbol" animate={{ y: [0, -7, 0], rotateZ: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>💌</motion.div>
            <motion.small key={receiverName} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>To {receiverName || "Someone"}</motion.small>
            <motion.h3 key={title} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{title || "Your title"}</motion.h3>
            <p>{selectedPackage?.allowText ? message : "Text customization is not included in this package."}</p>
            <strong>— {senderName || "Someone"}</strong>
          </div>
        </div>
        <p className="preview-url">/{slug || "your-slug"}</p>
      </aside>
    </div>
  );
}
