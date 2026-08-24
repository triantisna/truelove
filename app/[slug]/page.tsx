import { notFound } from "next/navigation";
import { WebsiteRenderer } from "@/lib/website-renderer";
import { getWebsiteBySlug } from "@/lib/websites";

export default async function PublicGiftPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const website = await getWebsiteBySlug(slug);

  if (!website) notFound();
  return <WebsiteRenderer website={website} />;
}
