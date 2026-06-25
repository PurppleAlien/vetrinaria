import { createClient } from '@supabase/supabase-js';

function getStorageClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false },
  }).storage;
}

export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Buffer,
  contentType?: string,
) {
  const storage = getStorageClient();
  if (!storage) throw new Error('Supabase Storage no configurado');

  const { data, error } = await storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true,
  });

  if (error) throw error;
  return data;
}

export async function getPublicUrl(bucket: string, path: string) {
  const storage = getStorageClient();
  if (!storage) throw new Error('Supabase Storage no configurado');

  const { data } = storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteFile(bucket: string, path: string) {
  const storage = getStorageClient();
  if (!storage) throw new Error('Supabase Storage no configurado');

  const { data, error } = await storage.from(bucket).remove([path]);
  if (error) throw error;
  return data;
}
