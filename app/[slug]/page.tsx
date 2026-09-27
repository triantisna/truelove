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

  const content = (website.content as Record<string, any>) || {};

  // 1. Ambil Judul
  const title =
    content.heroTitle ||
    website.title ||
    `Kejutan Spesial untuk ${website.receiverName || 'Kamu'}`;

  // 2. Ambil Deskripsi
  let description =
    content.mainMessage ||
    website.message ||
    `Ada kejutan manis dari ${website.senderName || 'seseorang'} untukmu. Buka sekarang!`;
  if (description.length > 110) {
    description = description.substring(0, 107) + '...';
  }

  // 3. Ambil Gambar (Fix Double Slash)
  let imageUrl = 'https://truelove-kappa.vercel.app/default-og.jpg';

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

  // 👇 TRIK CLOUDINARY: Paksa resize gambar biar ukurannya disukai WhatsApp (1200x630, size kecil)
  if (imageUrl.includes('cloudinary.com') && imageUrl.includes('/upload/')) {
    // Menghapus parameter format yang mungkin udah ada, ganti dengan settingan OG
    imageUrl = imageUrl.replace(
      /\/upload\/(v\d+\/)?(?:[a-zA-Z0-9_,-]+\/)?/,
      '/upload/w_1200,h_630,c_fill,q_80,f_jpg/',
    );
  }

  // Pastikan URL bersih dari double slash
  const pageUrl = `https://truelove-kappa.vercel.app/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
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
    // 👇 Tambahan metadataBase sangat disarankan oleh Next.js untuk Vercel
    metadataBase: new URL('https://truelove-kappa.vercel.app'),
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
