import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getWebsiteBySlug as getMockWebsiteBySlug } from "@/lib/mock-data";
import type { WebsiteRecord } from "@/types/website";

export async function getWebsiteBySlug(slug: string): Promise<WebsiteRecord | null> {
  const supabase = getSupabaseServerClient();

  if (!supabase) return getMockWebsiteBySlug(slug);

  const { data, error } = await supabase
    .from("websites")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return getMockWebsiteBySlug(slug);

  return {
    id: data.id,
    slug: data.slug,
    templateId: data.template_id,
    packageId: data.package_id,
    senderName: data.sender_name,
    receiverName: data.receiver_name,
    title: data.title ?? "",
    message: data.message ?? "",
    eventDate: data.event_date ?? undefined,
    musicUrl: data.music_url ?? undefined,
    status: data.status,
    expiresAt: data.expires_at ?? undefined,
    createdAt: data.created_at,
    content: data.content ?? {}
  };
}
