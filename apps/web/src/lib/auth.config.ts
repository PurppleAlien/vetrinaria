import type { NextAuthConfig } from 'next-auth';

declare module 'next-auth' {
  interface User {
    role: 'super_admin' | 'admin' | 'veterinarian' | 'technician' | 'receptionist';
    clinicId: number;
  }
  interface Session {
    user: {
      id: string;
      role: 'super_admin' | 'admin' | 'veterinarian' | 'technician' | 'receptionist';
      name: string;
      email: string;
      clinicId: number;
    };
  }
}

export const authConfig: NextAuthConfig = {
  providers: [],
  pages: {
    signIn: '/auth/login',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = user.role;
        (token as any).id = user.id;
        (token as any).clinicId = user.clinicId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).id = (token as any).id;
        (session.user as any).clinicId = (token as any).clinicId;
      }
      return session;
    },
  },
};
