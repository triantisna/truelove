import CreateWebsiteForm from "@/components/admin/CreateWebsiteForm";

export default function CreateWebsitePage() {
  return (
    <main>
      <div className="admin-page-head"><div><p className="eyebrow">GENERATOR V0</p><h1>Create Website</h1><p>Template → Package → Content → Preview. Database save/publish comes next.</p></div></div>
      <CreateWebsiteForm />
    </main>
  );
}
