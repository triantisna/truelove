import Link from 'next/link';

import OrderActions from '@/components/admin/OrderActions';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export default async function OrdersPage() {
  if (!prisma) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      package: true,
    },
  });

  return (
    <main>
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">SALES</p>
          <h1>Orders</h1>
          <p>Review customer orders and their current status.</p>
        </div>
        <Link className="button primary" href="/admin/orders/create">
          + Tambah Manual
        </Link>
      </div>

      <section className="admin-panel table-panel">
        <div className="data-table">
          <div className="data-row orders-row data-head">
            <span>Date</span>
            <span>Customer</span>
            <span>Occasion</span>
            <span>Package</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {orders.map((order) => (
            <div className="data-row orders-row" key={order.id}>
              <span>{dateFormatter.format(order.createdAt)}</span>
              <div>
                <strong>{order.customerName}</strong>
                <small>{order.customerWhatsapp}</small>
              </div>
              <span>{order.occasion}</span>
              <span>{order.package?.name ?? '—'}</span>
              <strong>{rupiah.format(order.price)}</strong>
              <div className="order-statuses">
                <span
                  className={`badge ${
                    order.paymentStatus === 'PAID' ? 'paid' : 'unpaid'
                  }`}
                >
                  {order.paymentStatus}
                </span>
                <span
                  className={`badge ${
                    order.orderStatus === 'COMPLETED' ? 'active' : 'status'
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
              {order.paymentStatus === 'UNPAID' ? (
                <OrderActions orderId={order.id} />
              ) : (
                <span className="muted-action">—</span>
              )}
            </div>
          ))}

          {orders.length === 0 ? (
            <div className="empty-state">
              <strong>No orders yet</strong>
              <p>New customer orders will appear here.</p>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}