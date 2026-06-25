'use server';

import { revalidatePath } from 'next/cache';
import { createBackup, listBackups, restoreBackup, deleteBackup, type BackupInfo } from '@/lib/backup';

export type { BackupInfo };

export async function triggerBackup(_formData: FormData): Promise<void> {
  await createBackup();
  revalidatePath('/settings/backups');
}

export async function getBackups(): Promise<BackupInfo[]> {
  return listBackups();
}

export async function removeBackup(filename: string) {
  await deleteBackup(filename);
  revalidatePath('/settings/backups');
}

export async function restoreFromBackup(filename: string) {
  await restoreBackup(filename);
  revalidatePath('/');
}
