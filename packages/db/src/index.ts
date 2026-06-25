import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

function cleanConnectionString(url: string) {
  const removed = url.replace(/[?&]sslmode=\w+/g, '').replace(/[?&]pgbouncer=(?:true|false)/g, '');
  return removed.endsWith('?') ? removed.slice(0, -1) : removed;
}

const connectionString = cleanConnectionString(process.env.DATABASE_URL!);

const needsSsl = connectionString.includes('neon.tech') || process.env.NODE_ENV === 'production';
const client = postgres(connectionString, {
  prepare: false,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
  ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
});
export const db = drizzle(client, { schema, logger: false });
export { schema };
