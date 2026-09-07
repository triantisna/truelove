'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      type="button"
      className="button ghost small"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      Logout
    </button>
  );
}
