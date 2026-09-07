import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { DefaultSession } from 'next-auth';

import { authConfig } from './auth.config';
import { prisma } from '@/lib/prisma';

if (!prisma) {
  throw new Error('DATABASE_NOT_CONFIGURED');
}

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      role?: string;
    } & DefaultSession['user'];
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    role?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
});
