import Link from 'next/link';

import ManualOrderForm from '@/components/admin/ManualOrderForm';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function CreateManualOrderPage() {
  if (!prisma) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const packages = await prisma.package.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
    orderBy: {
      sortOrder: 'asc',
    },
  });

  return (
    <main>
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">SALES</p>
          <h1>Tambah Manual</h1>
          <p>Create an order directly from the admin dashboard.</p>
        </div>
        <Link className="button ghost" href="/admin/orders">
          Back to Orders
        </Link>
      </div>
      <section className="admin-panel">
        <ManualOrderForm packages={packages} />
      </section>
    </main>
  );
}