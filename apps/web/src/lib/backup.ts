import 'server-only';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

const BACKUPS_DIR = path.join(process.cwd(), 'backups');
const DB_URL = process.env.DATABASE_URL!;

export interface BackupInfo {
  filename: string;
  size: number;
  createdAt: string;
}

function parseDbUrl(url: string) {
  const u = new URL(url);
  return {
    host: u.hostname,
    port: u.port || '5432',
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace('/', ''),
  };
}

export async function ensureBackupsDir() {
  try {
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
  } catch {}
}

export async function createBackup(): Promise<BackupInfo> {
  await ensureBackupsDir();

  const db = parseDbUrl(DB_URL);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `vetrinaria-${timestamp}.dump`;
  const filepath = path.join(BACKUPS_DIR, filename);

  try {
    await execAsync(
      `PGPASSWORD="${db.password}" pg_dump -h ${db.host} -p ${db.port} -U ${db.user} -d ${db.database} -Fc -f "${filepath}"`,
      { timeout: 300000 },
    );
  } catch (error: any) {
    throw new Error(`Error al crear backup: ${error.stderr || error.message}`);
  }

  const stat = await fs.stat(filepath);

  return {
    filename,
    size: stat.size,
    createdAt: new Date().toISOString(),
  };
}

export async function listBackups(): Promise<BackupInfo[]> {
  await ensureBackupsDir();

  const files = await fs.readdir(BACKUPS_DIR);
  const dumpFiles = files.filter((f) => f.endsWith('.dump'));

  const backups = await Promise.all(
    dumpFiles.map(async (filename) => {
      const filepath = path.join(BACKUPS_DIR, filename);
      try {
        const stat = await fs.stat(filepath);
        // Extract date from filename: vetrinaria-YYYY-MM-DDTHH-MM-SS.dump
        const datePart = filename.replace('vetrinaria-', '').replace('.dump', '');
        const isoDate = datePart.replace('T', 'T').replace(/-/g, (m, o) =>
          o === 10 || o === 13 ? '-' : m,
        );
        return {
          filename,
          size: stat.size,
          createdAt: new Date(stat.mtime).toISOString(),
        };
      } catch {
        return null;
      }
    }),
  );

  return backups
    .filter((b): b is BackupInfo => b !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function restoreBackup(filename: string): Promise<void> {
  const db = parseDbUrl(DB_URL);
  const filepath = path.join(BACKUPS_DIR, filename);

  await fs.access(filepath);

  try {
    await execAsync(
      `PGPASSWORD="${db.password}" pg_restore -h ${db.host} -p ${db.port} -U ${db.user} -d ${db.database} -c -Fc "${filepath}"`,
      { timeout: 600000 },
    );
  } catch (error: any) {
    throw new Error(`Error al restaurar backup: ${error.stderr || error.message}`);
  }
}

export async function deleteBackup(filename: string): Promise<void> {
  const filepath = path.join(BACKUPS_DIR, filename);
  await fs.unlink(filepath);
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
