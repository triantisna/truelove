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
      </div>

      <section className="admin-panel table-panel">
        <div className="data-table">
          <div className="data-row data-head">
            <span>Date</span>
            <span>Customer</span>
            <span>Occasion</span>
            <span>Package</span>
            <span>Price</span>
            <span>Status</span>
          </div>

          {orders.map((order) => (
            <div className="data-row order-row" key={order.id}>
              <span>{dateFormatter.format(order.createdAt)}</span>
              <div>
                <strong>{order.customerName}</strong>
                <small>{order.customerWhatsapp}</small>
              </div>
              <span>{order.occasion}</span>
              <span>{order.package?.name ?? '—'}</span>
              <strong>{rupiah.format(order.price)}</strong>
              <span
                className={`badge ${
                  order.orderStatus === 'COMPLETED' ? 'active' : ''
                }`}
              >
                {order.orderStatus}
              </span>
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