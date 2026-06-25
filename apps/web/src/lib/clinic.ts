import 'server-only';
import { auth } from '@/lib/auth';

export async function getCurrentClinicId(): Promise<number> {
  const session = await auth();
  if (!session?.user?.clinicId) {
    throw new Error('No clinic context available');
  }
  return session.user.clinicId;
}

export async function getCurrentUserRole(): Promise<string | null> {
  const session = await auth();
  return session?.user?.role ?? null;
}

export async function isSuperAdmin(): Promise<boolean> {
  const role = await getCurrentUserRole();
  return role === 'super_admin';
}
