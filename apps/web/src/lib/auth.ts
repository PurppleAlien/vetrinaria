import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { db, schema } from '@vetrinaria/db';
import { eq } from 'drizzle-orm';
import { authConfig } from './auth.config';

type UserRole = 'super_admin' | 'admin' | 'veterinarian' | 'technician' | 'receptionist';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        try {
          const user = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .then((rows) => rows[0]);

          if (!user || !user.active) return null;

          const isValid = await compare(password, user.passwordHash);
          if (!isValid) return null;

          return {
            id: String(user.id),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role as UserRole,
            clinicId: user.clinicId,
          };
        } catch (err) {
          console.error('[AUTH DB ERROR]', err);
          return null;
        }
      },
    }),
  ],
});
