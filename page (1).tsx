import CreateWebsiteForm from "@/components/admin/CreateWebsiteForm";
import { databaseReady } from "@/lib/prisma";

export default function CreateWebsitePage() {
  const dbReady = databaseReady();

  return (
    <main>
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">GENERATOR V1</p>
          <h1>Create Website</h1>
          <p>Template → Package → Content → Animated Preview → Save / Publish.</p>
        </div>
        <span className={`db-badge ${dbReady ? "on" : ""}`}>{dbReady ? "● Prisma connected" : "○ Mock mode"}</span>
      </div>
      <CreateWebsiteForm databaseReady={dbReady} />
    </main>
  );
}
