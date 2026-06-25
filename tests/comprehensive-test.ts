import postgres from 'postgres';
import { execSync } from 'child_process';

const connectionString = process.env.DATABASE_URL!;
const pgClient = postgres(connectionString, { prepare: false, max: 5 });

const BASE = 'http://localhost:3000';
let passed = 0;
let failed: string[] = [];

function assert(name: string, ok: boolean, detail?: string) {
  if (ok) { passed++; console.log('  PASS: ' + name); }
  else { failed.push(name); console.log('  FAIL: ' + name + (detail ? ' - ' + detail : '')); }
}

function run(cmd: string): string {
  try { return execSync(cmd, { encoding: 'utf-8', timeout: 25000 }).trim(); }
  catch (e: any) { return (e.stdout || e.message || '').trim(); }
}

async function countTable(table: string): Promise<number> {
  const rows = await pgClient`select count(*)::int as cnt from ${pgClient(table)}`;
  return Number(rows[0]?.cnt ?? 0);
}

async function main() {
  console.log('\n========================================');
  console.log('  VETRINARIA - Comprehensive Test Suite');
  console.log('========================================\n');

  // ---- Phase 1: API Health ----
  console.log('--- Phase 1: API Health ---');

  const h = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/health'));
  assert('GET /api/health returns 200', h.status === 'healthy');
  assert('Health checks include app', h.checks?.app === 'ok');
  assert('Version is set', !!h.version);
  assert('Timestamp is present', !!h.timestamp);

  // ---- Phase 2: Unauthenticated API ----
  console.log('\n--- Phase 2: Unauthenticated API ---');

  const cList = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/clients/list'));
  assert('GET /api/clients/list returns array', Array.isArray(cList));
  console.log('  Existing clients: ' + cList.length);

  const vList = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/users/vets'));
  assert('GET /api/users/vets returns array', Array.isArray(vList));
  console.log('  Existing vets: ' + vList.length);

  const notifCode = run('curl -s --max-time 15 -o /tmp/curl_n.txt -w "%{http_code}" ' + BASE + '/api/notifications');
  assert('GET /api/notifications without auth returns 401', notifCode === '401');

  const pByClient = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/patients/by-client/1'));
  assert('GET /api/patients/by-client/1 returns array', Array.isArray(pByClient));
  console.log('  Patients for client 1: ' + pByClient.length);

  const aByPatient = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/appointments/by-patient/1'));
  assert('GET /api/appointments/by-patient/1 returns array', Array.isArray(aByPatient));

  // ---- Phase 3: Auth ----
  console.log('\n--- Phase 3: Authentication ---');

  const regMissing = run('curl -s --max-time 15 -X POST ' + BASE + '/api/auth/register -H "Content-Type: application/json" -d \'{"email":"test@test.com"}\'');
  assert('Register missing fields returns 400', regMissing.includes('obligatorios'));

  const regDup = run('curl -s --max-time 15 -X POST ' + BASE + '/api/auth/register -H "Content-Type: application/json" -d \'{"email":"admin@vetrinaria.app","password":"test123","firstName":"T","lastName":"U"}\'');
  assert('Register duplicate email returns 400', regDup.includes('registrado'));

  const regOk = run('curl -s --max-time 15 -X POST ' + BASE + '/api/auth/register -H "Content-Type: application/json" -d \'{"email":"testuser2@vetrinaria.app","password":"test123456","firstName":"Test","lastName":"User"}\'');
  assert('Register valid user returns success', regOk.includes('success') || regOk.includes('true'));

  const csrfRes = JSON.parse(run('curl -s --max-time 15 -c /tmp/vet-cookies.txt ' + BASE + '/api/auth/csrf'));
  const csrfToken = csrfRes.csrfToken;
  assert('CSRF token obtained', !!csrfToken);

  run('curl -s --max-time 15 -X POST ' + BASE + '/api/auth/callback/credentials' +
    ' -H "Content-Type: application/x-www-form-urlencoded"' +
    ' -b /tmp/vet-cookies.txt -c /tmp/vet-cookies.txt' +
    ' -d "email=admin@vetrinaria.app&password=admin123&csrfToken=' + csrfToken + '"' +
    ' -o /tmp/curl_login.txt -w "%{http_code}" -L');
  const sessionRes = JSON.parse(run('curl -s --max-time 15 -b /tmp/vet-cookies.txt ' + BASE + '/api/auth/session'));
  assert('Login works (session has user)', sessionRes?.user?.email === 'admin@vetrinaria.app');

  const csrf2 = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/auth/csrf'));
  const badCode = run('curl -s --max-time 15 -X POST ' + BASE + '/api/auth/callback/credentials' +
    ' -H "Content-Type: application/x-www-form-urlencoded"' +
    ' -d "email=admin@vetrinaria.app&password=wrongpass&csrfToken=' + csrf2.csrfToken + '"' +
    ' -o /tmp/curl_bad.txt -w "%{http_code}" -L');
  assert('Wrong password returns non-200', badCode !== '200');

  const notifAuth = run('curl -s --max-time 15 -b /tmp/vet-cookies.txt ' + BASE + '/api/notifications');
  assert('Notifications with auth returns data', JSON.parse(notifAuth) !== null && 'unread' in JSON.parse(notifAuth));

  // ---- Phase 4: Database Seeding ----
  console.log('\n--- Phase 4: Inserting Data via Database ---');

  // Get clinic and admin
  const clinicRows = await pgClient`select id from clinics where slug = 'central'`;
  const clinicId = clinicRows[0].id;
  const adminRows = await pgClient`select id from users where email = 'admin@vetrinaria.app'`;
  const adminId = adminRows[0].id;
  console.log('  Clinic ID: ' + clinicId + ', Admin ID: ' + adminId);

  // ============== CLIENTS ==============
  const clientNames = [
    'Maria Garcia', 'Carlos Lopez', 'Ana Martinez', 'Pedro Rodriguez',
    'Lucia Fernandez', 'Miguel Sanchez', 'Sofia Torres', 'Diego Ramirez',
    'Valentina Herrera', 'Fernando Castillo'
  ];
  for (let i = 0; i < clientNames.length; i++) {
    const email = 'cli' + (i + 2) + '@example.com';
    const phone = '+5211111111' + String(10 + i).padStart(2, '0');
    const addr = 'Calle Test ' + (i + 1) + '23';
    await pgClient`
      insert into clients (clinic_id, name, email, phone, address, active)
      values (${clinicId}, ${clientNames[i]}, ${email}, ${phone}, ${addr}, true)
    `;
  }
  const clientCount = await countTable('clients');
  assert('Clients >= 11 (got ' + clientCount + ')', clientCount >= 11);
  console.log('  Total clients: ' + clientCount);

  const allClients = await pgClient`select id from clients order by id`;

  // ============== PATIENTS ==============
  const species = ['dog', 'cat', 'rabbit', 'bird'];
  const dogB = ['Labrador', 'Pastor Aleman', 'Beagle', 'Bulldog'];
  const catB = ['Simes', 'Persa', 'Maine Coon'];
  const pNames = [
    'Luna', 'Rocky', 'Bella', 'Toby', 'Coco', 'Canela', 'Simba', 'Nala',
    'Thor', 'Kira', 'Zeus', 'Lola', 'Bruno', 'Milo', 'Tequila', 'Bambu',
    'Pelusa', 'Rex', 'Chispa', 'Niebla', 'Oso', 'Pecas', 'Lucky', 'Daisy',
    'Tita', 'Bimbo', 'Firulais', 'Copito'
  ];
  const colors = ['Cafe', 'Negro', 'Blanco', 'Gris', 'Dorado'];
  let ni = 0;
  for (const c of allClients) {
    const numP = c.id <= 4 ? 3 : 2;
    for (let p = 0; p < numP; p++) {
      const name = pNames[ni % pNames.length];
      ni++;
      const sp = species[Math.floor(Math.random() * species.length)];
      let breed: string | null = null;
      if (sp === 'dog') breed = dogB[Math.floor(Math.random() * dogB.length)];
      else if (sp === 'cat') breed = catB[Math.floor(Math.random() * catB.length)];
      const g = Math.random() > 0.5 ? 'male' : 'female';
      const by = 2018 + Math.floor(Math.random() * 8);
      const bm = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const bd = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
      const birthDate = by + '-' + bm + '-' + bd;
      const color = colors[Math.floor(Math.random() * colors.length)];
      await pgClient`
        insert into patients (clinic_id, client_id, name, species, breed, gender, birth_date, color, active)
        values (${clinicId}, ${c.id}, ${name}, ${sp}, ${breed}, ${g}, ${birthDate}, ${color}, true)
      `;
    }
  }
  const patCount = await countTable('patients');
  assert('Patients >= 22 (got ' + patCount + ')', patCount >= 22);
  console.log('  Total patients: ' + patCount);

  // ============== APPOINTMENTS ==============
  const allPats = await pgClient`select id, client_id from patients order by id`;
  const today = new Date().toISOString().slice(0, 10);
  const tom = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const day2 = new Date(Date.now() + 172800000).toISOString().slice(0, 10);
  const dateOpts = [today, tom, day2];
  const apptTypes = ['consultation', 'vaccination', 'surgery', 'emergency', 'grooming', 'follow_up'];
  const apptStatuses = ['scheduled', 'confirmed', 'checked_in', 'cancelled'];

  for (let i = 0; i < Math.min(allPats.length, 25); i++) {
    const pat = allPats[i];
    const hh = 8 + Math.floor(Math.random() * 10);
    const mm = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
    const d = dateOpts[Math.floor(Math.random() * dateOpts.length)];
    const t = apptTypes[Math.floor(Math.random() * apptTypes.length)];
    const s = apptStatuses[Math.floor(Math.random() * apptStatuses.length)];
    const st = String(hh).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':00';
    const et = String(hh + 1).padStart(2, '0') + ':' + String(mm).padStart(2, '0') + ':00';
    await pgClient`
      insert into appointments (clinic_id, patient_id, client_id, vet_id, date, start_time, end_time, type, status, created_by)
      values (${clinicId}, ${pat.id}, ${pat.client_id}, ${adminId}, ${d}, ${st}, ${et}, ${t}, ${s}, ${adminId})
    `;
  }
  const aCount = await countTable('appointments');
  assert('Appointments > 0 (got ' + aCount + ')', aCount > 0);
  console.log('  Total appointments: ' + aCount);

  // ============== MEDICAL RECORDS ==============
  const allAppts = await pgClient`select id, patient_id from appointments order by id`;
  const diagnoses = ['Saludable', 'Infeccion de oido', 'Control de peso', 'Vacunacion al dia', 'Alergia cutanea'];
  for (const appt of allAppts.slice(0, 15)) {
    const vitals = JSON.stringify({
      weight: 15 + Math.random() * 20,
      temperature: 38.5,
      heartRate: 90,
      respiratoryRate: 25
    });
    const diag = diagnoses[Math.floor(Math.random() * diagnoses.length)];
    await pgClient`
      insert into medical_records (clinic_id, patient_id, appointment_id, subjective, objective, assessment, plan, diagnosis, created_by, vitals)
      values (${clinicId}, ${appt.patient_id}, ${appt.id},
              'Paciente alerta. Buen estado general.',
              'Signos vitales normales.',
              'Paciente sano.',
              'Continuar plan. Revision en 6 meses.',
              ${diag}, ${adminId}, ${vitals})
    `;
  }
  const mrCount = await countTable('medical_records');
  assert('Medical records > 0 (got ' + mrCount + ')', mrCount > 0);
  console.log('  Total medical records: ' + mrCount);

  // ============== SUPPLIERS ==============
  const suppData = [
    { n: 'VetFarma S.A.', c: 'Luis Gomez', e: 'ventas@vetfarma.com', p: '+525511111101', a: 'Av Industria 100' },
    { n: 'PetSupply MX', c: 'Ana Ruiz', e: 'info@petsupply.mx', p: '+525511111102', a: 'Calle Comercio 200' },
    { n: 'DistriVet', c: 'Carlos Mena', e: 'pedidos@distrivet.com', p: '+525511111103', a: 'Blvd Logistica 300' },
    { n: 'Farmacia Animal', c: 'Sofia Paz', e: 'contacto@farmaciaanimal.com', p: '+525511111104', a: 'Av Salud 400' },
    { n: 'BioCaninos', c: 'Roberto Gil', e: 'ventas@biocaninos.com', p: '+525511111105', a: 'Calle Veterinaria 500' },
  ];
  for (const s of suppData) {
    await pgClient`
      insert into suppliers (clinic_id, name, contact, email, phone, address, active)
      values (${clinicId}, ${s.n}, ${s.c}, ${s.e}, ${s.p}, ${s.a}, true)
    `;
  }
  const sCount = await countTable('suppliers');
  assert('Suppliers >= 5 (got ' + sCount + ')', sCount >= 5);
  console.log('  Total suppliers: ' + sCount);

  // ============== PRODUCTS ==============
  const prodData = [
    { n: 'Vacuna Puppy DP', t: 'medication', s: 'MED-001', pr: 350, cp: 200, st: 50, ro: 10 },
    { n: 'Antipulgas NexGard', t: 'medication', s: 'MED-002', pr: 450, cp: 280, st: 30, ro: 5 },
    { n: 'Correa Reflectante', t: 'supply', s: 'SUP-001', pr: 180, cp: 90, st: 100, ro: 20 },
    { n: 'Cama Ortopedica', t: 'supply', s: 'SUP-002', pr: 850, cp: 500, st: 15, ro: 5 },
    { n: 'Croquetas Premium 7kg', t: 'food', s: 'FOO-001', pr: 650, cp: 400, st: 40, ro: 10 },
    { n: 'Alimento Humedo Gatitos', t: 'food', s: 'FOO-002', pr: 35, cp: 18, st: 200, ro: 50 },
    { n: 'Consulta General', t: 'service', s: 'SER-001', pr: 500, cp: 0, st: 9999, ro: 0 },
    { n: 'Bano Medicado', t: 'service', s: 'SER-002', pr: 350, cp: 100, st: 9999, ro: 0 },
    { n: 'Juguete Kong', t: 'supply', s: 'SUP-003', pr: 220, cp: 120, st: 60, ro: 15 },
    { n: 'Shampoo Especial', t: 'supply', s: 'SUP-004', pr: 160, cp: 80, st: 45, ro: 10 },
  ];
  for (const p of prodData) {
    const desc = 'Producto: ' + p.n;
    await pgClient`
      insert into products (clinic_id, name, description, type, sku, price, cost_price, stock_quantity, reorder_point, active)
      values (${clinicId}, ${p.n}, ${desc}, ${p.t}, ${p.s}, ${String(p.pr)}, ${String(p.cp)}, ${p.st}, ${p.ro}, true)
    `;
  }
  const pCount = await countTable('products');
  assert('Products >= 10 (got ' + pCount + ')', pCount >= 10);
  console.log('  Total products: ' + pCount);

  // ============== INVOICES ==============
  for (let i = 0; i < 10; i++) {
    const appt = allAppts[i % allAppts.length];
    const invNum = 'INV-' + String(i + 1).padStart(6, '0');
    const sub = 200 + Math.floor(Math.random() * 3000);
    const tax = Math.round(sub * 0.16 * 100) / 100;
    const tot = sub + tax;
    const st = ['draft', 'issued', 'paid', 'cancelled'][Math.floor(Math.random() * 4)];
    const cId = allClients[Math.floor(Math.random() * allClients.length)].id;
    await pgClient`
      insert into invoices (clinic_id, client_id, appointment_id, invoice_number, subtotal, tax, total, status)
      values (${clinicId}, ${cId}, ${appt.id}, ${invNum}, ${String(sub)}, ${String(tax)}, ${String(tot)}, ${st})
    `;

    const numItems = 1 + Math.floor(Math.random() * 3);
    for (let it = 0; it < numItems; it++) {
      const qty = 1 + Math.floor(Math.random() * 2);
      const up = 50 + Math.floor(Math.random() * 500);
      await pgClient`
        insert into invoice_items (invoice_id, description, quantity, unit_price, total)
        values ((select id from invoices where invoice_number = ${invNum}),
                ${'Producto ' + String(it + 1)}, ${qty}, ${String(up)}, ${String(qty * up)})
      `;
    }
  }
  const iCount = await countTable('invoices');
  assert('Invoices >= 10 (got ' + iCount + ')', iCount >= 10);
  console.log('  Total invoices: ' + iCount);

  // ============== NOTIFICATIONS ==============
  const notifTitles = [
    'Nueva cita programada', 'Factura emitida', 'Cliente registrado',
    'Paciente dado de alta', 'Recordatorio de vacunacion', 'Inventario bajo',
    'Cumpleanos de mascota', 'Pago recibido'
  ];
  const notifTypes = ['appointment', 'invoice', 'client', 'patient', 'system'];
  for (let i = 0; i < notifTitles.length; i++) {
    const createdAt = new Date(Date.now() - i * 3600000).toISOString();
    const isRead = i % 3 === 0;
    const nType = notifTypes[Math.floor(Math.random() * notifTypes.length)];
    await pgClient`
      insert into notifications (user_id, title, message, type, read, created_at)
      values (${adminId}, ${notifTitles[i]}, ${'Mensaje: ' + notifTitles[i]}, ${nType}, ${isRead}, ${createdAt})
    `;
  }
  const nCount = await countTable('notifications');
  assert('Notifications > 0 (got ' + nCount + ')', nCount > 0);
  console.log('  Total notifications: ' + nCount);

  // ---- Phase 5: API Verification ----
  console.log('\n--- Phase 5: API Data Verification ---');

  const clientsApi = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/clients/list'));
  assert('API returns all clients (got ' + clientsApi.length + ')', clientsApi.length >= 11);

  const vetsApi = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/users/vets'));
  assert('API returns vets', vetsApi.length >= 2);

  const patApi = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/patients/by-client/' + allClients[0].id));
  assert('Patients API returns data', Array.isArray(patApi) && patApi.length > 0);

  const apptApi = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/appointments/by-patient/' + allPats[0].id));
  assert('Appointments API returns data', Array.isArray(apptApi));

  const h2 = JSON.parse(run('curl -s --max-time 15 ' + BASE + '/api/health'));
  assert('Health endpoint still healthy', h2.status === 'healthy');

  // ---- Phase 6: DB Verification ----
  console.log('\n--- Phase 6: Database Record Counts ---');

  const tables = ['clinics', 'users', 'clients', 'patients', 'appointments', 'medical_records',
    'suppliers', 'products', 'invoices', 'invoice_items', 'notifications'];
  const counts: Record<string, number> = {};
  for (const t of tables) {
    counts[t] = await countTable(t);
  }

  console.log('\n  Final Record Counts:');
  for (const [t, c] of Object.entries(counts)) {
    console.log('    ' + t + ': ' + c);
  }

  const checks: Record<string, number> = {
    clinics: 1, users: 2, clients: 11, patients: 22, appointments: 1,
    medical_records: 1, suppliers: 5, products: 10, invoices: 1, notifications: 1
  };
  for (const [t, min] of Object.entries(checks)) {
    assert('Table ' + t + ' >= ' + min + ' (actual: ' + counts[t] + ')', counts[t] >= min);
  }

  // ---- Summary ----
  console.log('\n========================================');
  console.log('  TEST SUMMARY');
  console.log('========================================');
  console.log('  Passed: ' + passed);
  console.log('  Failed: ' + failed.length);
  if (failed.length > 0) {
    console.log('  Failed tests:');
    for (const f of failed) console.log('    - ' + f);
  }
  console.log('');

  await pgClient.end();
  process.exit(failed.length > 0 ? 1 : 0);
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
