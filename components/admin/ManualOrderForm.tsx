'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

type PackageOption = {
  id: string;
  name: string;
  price: number;
};

type ManualOrderFormProps = {
  packages: PackageOption[];
};

export default function ManualOrderForm({
  packages,
}: ManualOrderFormProps) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [occasion, setOccasion] = useState('');
  const [packageId, setPackageId] = useState(packages[0]?.id ?? '');
  const [price, setPrice] = useState(String(packages[0]?.price ?? ''));
  const [paymentStatus, setPaymentStatus] = useState<'UNPAID' | 'PAID'>(
    'UNPAID',
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handlePackageChange(value: string) {
    setPackageId(value);
    const selectedPackage = packages.find((item) => item.id === value);
    if (selectedPackage) {
      setPrice(String(selectedPackage.price));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          customerWhatsapp,
          occasion,
          packageId,
          price: Number(price),
          paymentStatus,
        }),
      });

      if (response.status !== 201) {
        throw new Error('Order gagal dibuat. Periksa kembali data yang diisi.');
      }

      router.push('/admin/orders');
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Order gagal dibuat.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          required
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
        />
      </label>
      <label>
        WA
        <input
          required
          value={customerWhatsapp}
          onChange={(event) => setCustomerWhatsapp(event.target.value)}
        />
      </label>
      <label>
        Occasion
        <input
          required
          value={occasion}
          onChange={(event) => setOccasion(event.target.value)}
        />
      </label>
      <label>
        Package
        <select
          required
          value={packageId}
          onChange={(event) => handlePackageChange(event.target.value)}
        >
          <option value="" disabled>
            Pilih paket
          </option>
          {packages.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Price
        <input
          required
          min="0"
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </label>
      <label>
        Payment Status
        <select
          value={paymentStatus}
          onChange={(event) =>
            setPaymentStatus(event.target.value as 'UNPAID' | 'PAID')
          }
        >
          <option value="UNPAID">UNPAID</option>
          <option value="PAID">PAID</option>
        </select>
      </label>
      {error ? <p>{error}</p> : null}
      <button className="button primary" disabled={submitting} type="submit">
        {submitting ? 'Menyimpan...' : 'Simpan Order'}
      </button>
    </form>
  );
}
