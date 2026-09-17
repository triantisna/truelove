import Link from 'next/link';

import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export default async function AdminDashboard() {
  if (!prisma) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const [totalOrders, revenue, publishedWebsites, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          price: true,
        },
        where: {
          paymentStatus: 'PAID',
        },
      }),
      prisma.website.count({
        where: {
          status: 'PUBLISHED',
        },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          package: true,
        },
      }),
    ]);

  const totalRevenue = revenue._sum.price ?? 0;

  return (
    <main>
      <div className="admin-page-head">
        <div>
          <p className="eyebrow">TRUELOVE ADMIN</p>
          <h1>Overview</h1>
          <p>Monitor your latest sales and active websites.</p>
        </div>
        <Link className="button primary" href="/admin/websites/create">
          + Create Website
        </Link>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <span>Total Pendapatan</span>
          <strong>{rupiah.format(totalRevenue)}</strong>
          <small>all orders</small>
        </div>
        <div className="stat-card">
          <span>Total Pesanan Masuk</span>
          <strong>{totalOrders}</strong>
          <small>all orders</small>
        </div>
        <div className="stat-card">
          <span>Website Aktif</span>
          <strong>{publishedWebsites}</strong>
          <small>published websites</small>
        </div>
      </div>

      <section className="admin-panel table-panel">
        <div className="panel-title">
          <h2>Recent Orders</h2>
          <p>The five latest customer orders.</p>
        </div>
        <div className="data-table">
          <div className="data-row overview-row data-head">
            <span>Customer</span>
            <span>Occasion</span>
            <span>Package</span>
            <span>Price</span>
            <span>Payment Status</span>
          </div>
          {recentOrders.map((order) => (
            <div className="data-row overview-row" key={order.id}>
              <strong>{order.customerName}</strong>
              <span>{order.occasion}</span>
              <span>{order.package?.name ?? '—'}</span>
              <strong>{rupiah.format(order.price)}</strong>
              <span>{order.paymentStatus}</span>
            </div>
          ))}
          {recentOrders.length === 0 ? (
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
