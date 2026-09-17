'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type OrderActionsProps = {
  orderId: string;
};

export default function OrderActions({ orderId }: OrderActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function markAsPaid() {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: 'PAID' }),
      });

      if (!response.ok) {
        throw new Error('Gagal memperbarui status pembayaran.');
      }

      router.refresh();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Gagal memperbarui status pembayaran.',
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="order-actions">
      <button
        className="button small primary"
        type="button"
        onClick={markAsPaid}
        disabled={isUpdating}
      >
        {isUpdating ? 'Memproses...' : 'Set Lunas'}
      </button>
      {error ? <small className="action-error">{error}</small> : null}
    </div>
  );
}
