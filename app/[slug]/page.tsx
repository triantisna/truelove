export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { WebsiteRenderer } from '@/lib/website-renderer';
import { getWebsiteBySlug } from '@/lib/websites';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const website = await getWebsiteBySlug(slug);

  if (!website || website.status !== 'published') {
    return {
      title: 'Not Found | TRUELOVE',
    };
  }

  // Kita casting ke tipe record yang aman
  const content = (website.content as Record<string, any>) || {};

  // 1. Ambil Judul (Prioritas: heroTitle > title > default)
  const title =
    content.heroTitle ||
    website.title ||
    `Kejutan Spesial untuk ${website.receiverName || 'Kamu'}`;

  // 2. Ambil Deskripsi (Ambil max 110 karakter dari pesan)
  let description =
    content.mainMessage ||
    website.message ||
    `Ada kejutan manis dari ${website.senderName || 'seseorang'} untukmu. Buka sekarang!`;
  if (description.length > 110) {
    description = description.substring(0, 107) + '...';
  }

  // 3. Ambil Gambar Thumbnail (Prioritas: Data Media terbaru > Gambar Legacy lama > Default Amplop)
  let imageUrl = 'https://truelove.id/default-og.jpg'; // Kita kasih default jaga-jaga
  if (website.media && website.media.length > 0) {
    const imageMedia = website.media.find((m) => m.type === 'image');
    if (imageMedia?.url) imageUrl = imageMedia.url;
  } else if (
    typeof content.heroImage === 'string' &&
    content.heroImage.startsWith('http')
  ) {
    imageUrl = content.heroImage;
  } else if (content.heroImage?.url) {
    imageUrl = content.heroImage.url;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      // Nanti kalau domain udah beli, ganti "truelove.id" ke domain asli
      url: `https://truelove.id/${slug}`,
      siteName: 'TRUELOVE Digital Gifts',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function PublicGiftPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const website = await getWebsiteBySlug(slug);

  if (!website || website.status !== 'published') {
    notFound();
  }

  return <WebsiteRenderer website={website} />;
}
