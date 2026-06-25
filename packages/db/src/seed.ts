import { db } from './index';
import {
  clinics, users, clients, patients, appointments,
  medicalRecords, dentalRecords, vaccines, vaccinationRecords,
  products, suppliers, invoices, invoiceItems, notifications,
} from './schema';
import { hash } from 'bcryptjs';

async function seed() {
  console.log('🌱 Seeding database...\n');
  const pw = await hash('admin123', 12);

  await db.delete(notifications);
  await db.delete(invoiceItems);
  await db.delete(invoices);
  await db.delete(dentalRecords);
  await db.delete(medicalRecords);
  await db.delete(appointments);
  await db.delete(vaccinationRecords);
  await db.delete(patients);
  await db.delete(clients);
  await db.delete(users);
  await db.delete(products);
  await db.delete(suppliers);
  await db.delete(vaccines);
  console.log('✔ Datos anteriores limpiados');

  const [clinic] = await db.insert(clinics).values({
    name: 'Clínica Veterinaria Central', slug: 'central',
    email: 'contacto@vetcentral.com', phone: '+521234567890',
    address: 'Av. Principal 456, Ciudad de México',
    settings: {
      theme: 'light', locale: 'es-MX', timezone: 'America/Mexico_City',
      invoicePrefix: 'FAC', taxRate: 16,
    },
  }).returning();
  console.log(`✔ Clínica: ${clinic.name}`);

  const userData = [
    { email: 'admin@vetrinaria.app', firstName: 'Admin', lastName: 'Vetrinaria', role: 'super_admin', phone: '+521234567890' },
    { email: 'maria@vetrinaria.app', firstName: 'María', lastName: 'García', role: 'veterinarian', phone: '+521234567891' },
    { email: 'carlos@vetrinaria.app', firstName: 'Carlos', lastName: 'López', role: 'veterinarian', phone: '+521234567892' },
    { email: 'laura@vetrinaria.app', firstName: 'Laura', lastName: 'Martínez', role: 'receptionist', phone: '+521234567893' },
    { email: 'javier@vetrinaria.app', firstName: 'Javier', lastName: 'Morales', role: 'technician', phone: '+521234567898' },
  ];
  const us: any[] = [];
  for (const u of userData) {
    const [user] = await db.insert(users).values({ ...u, clinicId: clinic.id, passwordHash: pw }).returning();
    us.push(user);
  }
  const [admin, vet1, vet2, recp, tech] = us;
  console.log(`✔ Usuarios: ${us.length}`);

  const cd = [
    { name: 'Juan Pérez', email: 'juan@example.com', phone: '+521234567891', address: 'Calle Principal 123' },
    { name: 'Ana Rodríguez', email: 'ana@example.com', phone: '+521234567894', address: 'Calle Luna 789' },
    { name: 'Pedro Sánchez', email: 'pedro@example.com', phone: '+521234567895', address: 'Av. Sol 234' },
    { name: 'Sofía Hernández', email: 'sofia@example.com', phone: '+521234567896', address: 'Blvd. Estrella 567' },
    { name: 'Miguel Torres', email: 'miguel@example.com', phone: '+521234567897', address: 'Calle Vía Láctea 890' },
    { name: 'Carmen Ruiz', email: 'carmen@example.com', phone: '+521234567810', address: 'Av. Reforma 234', emergencyContact: '+521234567910' },
    { name: 'Roberto Vargas', email: 'roberto@example.com', phone: '+521234567811', address: 'Calle 5 de Mayo 567' },
    { name: 'Lucía Mendoza', email: 'lucia@example.com', phone: '+521234567812', address: 'Blvd. Hidalgo 890', notes: 'Prefiere WhatsApp para comunicaciones' },
    { name: 'Fernando Castillo', email: 'fernando@example.com', phone: '+521234567813', address: 'Av. Juárez 123' },
    { name: 'Gabriela Ríos', email: 'gabriela@example.com', phone: '+521234567814', address: 'Calle Morelos 456' },
    { name: 'Andrés Paredes', email: 'andres@example.com', phone: '+521234567815', address: 'Av. Insurgentes 789' },
    { name: 'Valentina Cruz', email: 'valentina@example.com', phone: '+521234567816', address: 'Calle Veracruz 321', emergencyContact: '+521234567916' },
    { name: 'Diego Herrera', email: 'diego@example.com', phone: '+521234567817', address: 'Blvd. Kukulcán 654' },
    { name: 'Patricia Navarro', email: 'patricia@example.com', phone: '+521234567818', address: 'Calle Puebla 987' },
    { name: 'Óscar Medina', email: 'oscar@example.com', phone: '+521234567819', address: 'Av. Tulum 147' },
  ];
  const cl: any[] = [];
  for (const c of cd) {
    const [client] = await db.insert(clients).values({ clinicId: clinic.id, ...c }).returning();
    cl.push(client);
  }
  const [juan, ana, pedro, sofia, miguel, carmen, roberto, lucia, fernando, gabriela, andres, valentina, diego, patricia, oscar] = cl;
  console.log(`✔ Clientes: ${cl.length}`);

  const pd = [
    { name: 'Max', species: 'dog', breed: 'Labrador', gender: 'male', birthDate: '2020-03-15', color: 'Dorado', weight: [{ value: 30, date: '2025-12-01' }, { value: 31, date: '2026-03-01' }, { value: 30.5, date: '2026-05-15' }], allergies: 'Ninguna', clientId: juan.id },
    { name: 'Luna', species: 'cat', breed: 'Siamés', gender: 'female', birthDate: '2021-08-10', color: 'Gris', weight: [{ value: 4.2, date: '2026-01-15' }, { value: 4.5, date: '2026-05-01' }], allergies: 'Ninguna', clientId: ana.id },
    { name: 'Toby', species: 'dog', breed: 'Golden Retriever', gender: 'male', birthDate: '2019-12-01', color: 'Dorado', weight: [{ value: 31, date: '2025-11-01' }, { value: 32, date: '2026-05-15' }], allergies: 'Pulgas', microchip: '985112003456789', clientId: pedro.id },
    { name: 'Piolín', species: 'bird', breed: 'Canario', gender: 'male', birthDate: '2022-03-20', color: 'Amarillo', weight: [{ value: 0.03, date: '2026-04-10' }], allergies: 'Ninguna', clientId: sofia.id },
    { name: 'Rocky', species: 'dog', breed: 'Pastor Alemán', gender: 'male', birthDate: '2020-07-14', color: 'Negro con café', weight: [{ value: 36, date: '2025-10-01' }, { value: 38, date: '2026-05-20' }], allergies: 'Alimento con pollo', microchip: '985112003456790', clientId: miguel.id },
    { name: 'Coco', species: 'bird', breed: 'Loro Frente Roja', gender: 'female', birthDate: '2018-11-05', color: 'Verde y rojo', weight: [{ value: 0.5, date: '2026-03-01' }], notes: 'Habla palabras sueltas', clientId: sofia.id },
    { name: 'Bella', species: 'dog', breed: 'French Poodle', gender: 'female', birthDate: '2021-06-20', color: 'Blanco', weight: [{ value: 5.2, date: '2026-04-10' }], allergies: 'Ninguna', microchip: '985112003456791', clientId: carmen.id },
    { name: 'Simba', species: 'cat', breed: 'Persa', gender: 'male', birthDate: '2022-01-30', color: 'Gris oscuro', weight: [{ value: 5.8, date: '2026-02-15' }], allergies: 'Lactosa', clientId: roberto.id },
    { name: 'Milo', species: 'dog', breed: 'Husky Siberiano', gender: 'male', birthDate: '2021-09-05', color: 'Gris y blanco', weight: [{ value: 24, date: '2026-05-10' }], allergies: 'Ninguna', clientId: lucia.id },
    { name: 'Kiara', species: 'cat', breed: 'Angora', gender: 'female', birthDate: '2023-04-12', color: 'Blanco', weight: [{ value: 3.8, date: '2026-04-20' }], allergies: 'Ninguna', clientId: fernando.id },
    { name: 'Roco', species: 'dog', breed: 'Boxer', gender: 'male', birthDate: '2020-11-18', color: 'Café', weight: [{ value: 28, date: '2026-03-05' }], allergies: 'Ninguna', clientId: gabriela.id },
    { name: 'Lola', species: 'rabbit', breed: 'Holandés', gender: 'female', birthDate: '2023-08-25', color: 'Gris y blanco', weight: [{ value: 1.8, date: '2026-05-01' }], allergies: 'Ninguna', clientId: andres.id },
    { name: 'Tito', species: 'dog', breed: 'Cocker Spaniel', gender: 'male', birthDate: '2022-02-14', color: 'Dorado', weight: [{ value: 14, date: '2026-04-25' }], allergies: 'Ninguna', clientId: valentina.id },
    { name: 'Leo', species: 'cat', breed: 'Bengalí', gender: 'male', birthDate: '2023-10-08', color: 'Atigrado', weight: [{ value: 4.1, date: '2026-05-18' }], allergies: 'Ninguna', clientId: diego.id },
    { name: 'Princesa', species: 'dog', breed: 'Chihuahua', gender: 'female', birthDate: '2021-12-25', color: 'Café claro', weight: [{ value: 2.8, date: '2026-04-30' }], allergies: 'Picaduras de insectos', clientId: patricia.id },
    { name: 'Zeus', species: 'dog', breed: 'Doberman', gender: 'male', birthDate: '2022-06-01', color: 'Negro y fuego', weight: [{ value: 35, date: '2026-05-22' }], allergies: 'Ninguna', microchip: '985112003456792', clientId: oscar.id },
    { name: 'Nina', species: 'cat', breed: 'Atigrado', gender: 'female', birthDate: '2022-11-12', color: 'Café atigrado', weight: [{ value: 3.5, date: '2026-04-28' }], allergies: 'Ninguna', notes: 'Es tímida con desconocidos', clientId: ana.id },
    { name: 'Oliver', species: 'rabbit', breed: 'Mini Lop', gender: 'male', birthDate: '2024-01-20', color: 'Café', weight: [{ value: 1.2, date: '2026-05-10' }], allergies: 'Ninguna', clientId: carmen.id },
    { name: 'Canela', species: 'dog', breed: 'Shiba Inu', gender: 'female', birthDate: '2023-03-28', color: 'Naranja', weight: [{ value: 9.5, date: '2026-05-12' }], allergies: 'Ninguna', clientId: lucia.id },
    { name: 'Thor', species: 'dog', breed: 'Rottweiler', gender: 'male', birthDate: '2021-05-09', color: 'Negro y café', weight: [{ value: 45, date: '2025-12-01' }, { value: 47, date: '2026-05-20' }], allergies: 'Ninguna', clientId: miguel.id },
    { name: 'Molly', species: 'cat', breed: 'Atigrado', gender: 'female', birthDate: '2024-06-15', color: 'Gris', weight: [{ value: 2.5, date: '2026-05-25' }], allergies: 'Ninguna', clientId: gabriela.id },
    { name: 'Duke', species: 'dog', breed: 'Gran Danés', gender: 'male', birthDate: '2022-08-30', color: 'Gris', weight: [{ value: 62, date: '2026-04-15' }], allergies: 'Ninguna', clientId: diego.id },
  ];
  const pt: any[] = [];
  for (const p of pd) {
    const [patient] = await db.insert(patients).values({ clinicId: clinic.id, ...p }).returning();
    pt.push(patient);
  }
  const [max, luna, toby, piolin, rocky, coco, bella, simba, milo, kiara, roco, lola, tito, leo, princesa, zeus, nina, oliver, canela, thor, molly, duke] = pt;
  console.log(`✔ Pacientes: ${pt.length}`);

  const vacData = [
    { name: 'Rabia', description: 'Antirrábica canina - inactivada', species: 'dog', frequencyDays: 365, isCore: true },
    { name: 'Rabia Felina', description: 'Antirrábica felina - inactivada', species: 'cat', frequencyDays: 365, isCore: true },
    { name: 'Triple Felina', description: 'Panleucopenia + Calicivirus + Rinotraqueítis', species: 'cat', frequencyDays: 365, isCore: true },
    { name: 'Séxtuple', description: 'Moquillo + Hepatitis + Parvovirus + Parainfluenza + Leptospira + Adenovirus', species: 'dog', frequencyDays: 365, isCore: true },
    { name: 'Óctuple', description: 'Séxtuple + Coronavirus + Leptospira adicional', species: 'dog', frequencyDays: 365, isCore: false },
    { name: 'Bordetella', description: 'Tos de las perreras (Bordetella bronchiseptica)', species: 'dog', frequencyDays: 180, isCore: false },
    { name: 'Leucemia Felina', description: 'Prevención de leucemia viral felina (FeLV)', species: 'cat', frequencyDays: 365, isCore: false },
    { name: 'Giardia', description: 'Prevención de giardiasis', species: 'dog', frequencyDays: 365, isCore: false },
    { name: 'Mixomatosis', description: 'Prevención de mixomatosis en conejos', species: 'rabbit', frequencyDays: 365, isCore: true },
    { name: 'Newcastle', description: 'Enfermedad de Newcastle en aves', species: 'bird', frequencyDays: 180, isCore: false },
  ];
  const va: any[] = [];
  for (const v of vacData) {
    const [vac] = await db.insert(vaccines).values({ clinicId: clinic.id, ...v }).returning();
    va.push(vac);
  }
  const [rabia, rabiaF, tripleF, sextuple, octuple, bordetella, leucemiaF, giardia, mixomatosis, newcastle] = va;
  console.log(`✔ Vacunas: ${va.length}`);

  const vxData = [
    { patientId: luna.id, vaccineId: rabiaF.id, appliedDate: '2026-01-15', nextDueDate: '2027-01-15', batchNumber: 'RF-001-2026', doseNumber: 1, administeredBy: vet1.id, applicationSite: 'Subcutánea interescapular' },
    { patientId: luna.id, vaccineId: tripleF.id, appliedDate: '2026-01-15', nextDueDate: '2027-01-15', batchNumber: 'TF-001-2026', doseNumber: 2, administeredBy: vet1.id, applicationSite: 'Subcutánea' },
    { patientId: toby.id, vaccineId: rabia.id, appliedDate: '2026-02-20', nextDueDate: '2027-02-20', batchNumber: 'RB-003-2026', doseNumber: 1, administeredBy: vet2.id, applicationSite: 'Intramuscular' },
    { patientId: toby.id, vaccineId: sextuple.id, appliedDate: '2026-02-20', nextDueDate: '2027-02-20', batchNumber: 'SX-002-2026', doseNumber: 3, administeredBy: vet2.id, applicationSite: 'Subcutánea' },
    { patientId: toby.id, vaccineId: bordetella.id, appliedDate: '2026-02-20', nextDueDate: '2026-08-20', batchNumber: 'BRD-001-2026', doseNumber: 1, administeredBy: vet2.id, applicationSite: 'Intranasal' },
    { patientId: rocky.id, vaccineId: rabia.id, appliedDate: '2026-03-10', nextDueDate: '2027-03-10', batchNumber: 'RB-005-2026', doseNumber: 1, administeredBy: vet1.id, applicationSite: 'Intramuscular' },
    { patientId: rocky.id, vaccineId: sextuple.id, appliedDate: '2026-03-10', nextDueDate: '2027-03-10', batchNumber: 'SX-004-2026', doseNumber: 2, administeredBy: vet1.id, applicationSite: 'Subcutánea' },
    { patientId: bella.id, vaccineId: rabia.id, appliedDate: '2026-04-05', nextDueDate: '2027-04-05', batchNumber: 'RB-008-2026', doseNumber: 1, administeredBy: vet1.id, applicationSite: 'Intramuscular' },
    { patientId: bella.id, vaccineId: octuple.id, appliedDate: '2026-04-05', nextDueDate: '2027-04-05', batchNumber: 'OC-001-2026', doseNumber: 2, administeredBy: vet1.id, applicationSite: 'Subcutánea' },
    { patientId: simba.id, vaccineId: rabiaF.id, appliedDate: '2026-03-22', nextDueDate: '2027-03-22', batchNumber: 'RF-003-2026', doseNumber: 1, administeredBy: vet2.id, applicationSite: 'Subcutánea' },
    { patientId: simba.id, vaccineId: tripleF.id, appliedDate: '2026-03-22', nextDueDate: '2027-03-22', batchNumber: 'TF-002-2026', doseNumber: 2, administeredBy: vet2.id, applicationSite: 'Subcutánea' },
    { patientId: milo.id, vaccineId: rabia.id, appliedDate: '2026-04-15', nextDueDate: '2027-04-15', batchNumber: 'RB-010-2026', doseNumber: 1, administeredBy: vet1.id, applicationSite: 'Intramuscular' },
    { patientId: milo.id, vaccineId: sextuple.id, appliedDate: '2026-04-15', nextDueDate: '2027-04-15', batchNumber: 'SX-006-2026', doseNumber: 2, administeredBy: vet1.id, applicationSite: 'Subcutánea' },
    { patientId: kiara.id, vaccineId: tripleF.id, appliedDate: '2026-05-10', nextDueDate: '2027-05-10', batchNumber: 'TF-004-2026', doseNumber: 1, administeredBy: vet2.id, applicationSite: 'Subcutánea' },
    { patientId: zeus.id, vaccineId: rabia.id, appliedDate: '2026-04-28', nextDueDate: '2027-04-28', batchNumber: 'RB-012-2026', doseNumber: 1, administeredBy: vet1.id, applicationSite: 'Intramuscular' },
    { patientId: zeus.id, vaccineId: octuple.id, appliedDate: '2026-04-28', nextDueDate: '2027-04-28', batchNumber: 'OC-003-2026', doseNumber: 3, administeredBy: vet1.id, applicationSite: 'Subcutánea' },
    { patientId: thor.id, vaccineId: rabia.id, appliedDate: '2026-05-05', nextDueDate: '2027-05-05', batchNumber: 'RB-014-2026', doseNumber: 1, administeredBy: vet2.id, applicationSite: 'Intramuscular' },
    { patientId: lola.id, vaccineId: mixomatosis.id, appliedDate: '2026-05-10', nextDueDate: '2027-05-10', batchNumber: 'MX-001-2026', doseNumber: 1, administeredBy: vet1.id, applicationSite: 'Subcutánea' },
    { patientId: piolin.id, vaccineId: newcastle.id, appliedDate: '2026-02-10', nextDueDate: '2026-08-10', batchNumber: 'NC-001-2026', doseNumber: 1, administeredBy: vet2.id, applicationSite: 'Ala' },
    { patientId: princesa.id, vaccineId: rabia.id, appliedDate: '2026-05-20', nextDueDate: '2027-05-20', batchNumber: 'RB-016-2026', doseNumber: 1, administeredBy: vet1.id, applicationSite: 'Intramuscular' },
  ];
  for (const v of vxData) {
    await db.insert(vaccinationRecords).values({ clinicId: clinic.id, ...v });
  }
  console.log(`✔ Registros de vacunación: ${vxData.length}`);

  const supData = [
    { name: 'Distribuidora Veterinaria del Valle', contact: 'Luis Hernández', email: 'ventas@vetdelvalle.com', phone: '+525512345601' },
    { name: 'Farmacia Veterinaria Nacional', contact: 'Ana Gómez', email: 'pedidos@farvet.com', phone: '+525512345602' },
    { name: 'Proveedora de Mascotas', contact: 'Roberto Díaz', email: 'ventas@promascotas.com', phone: '+525512345603' },
    { name: 'Insumos Médicos Veterinarios', contact: 'Mariana Soto', email: 'info@insumosvet.com', phone: '+525512345604' },
    { name: 'Alimentos Balanceados del Norte', contact: 'José Ruiz', email: 'ventas@alimentosnorte.com', phone: '+525512345605' },
  ];
  for (const s of supData) {
    await db.insert(suppliers).values({ clinicId: clinic.id, ...s });
  }
  console.log(`✔ Proveedores: ${supData.length}`);

  const prodData = [
    { name: 'Amoxicilina 500mg', type: 'medication', sku: 'MED-001', price: '12.50', costPrice: '7.00', stockQuantity: 50, reorderPoint: 10 },
    { name: 'Carprofeno 100mg x30', type: 'medication', sku: 'MED-002', price: '85.00', costPrice: '55.00', stockQuantity: 20, reorderPoint: 5 },
    { name: 'Meloxicam 1.5mg/ml', type: 'medication', sku: 'MED-003', price: '22.00', costPrice: '14.00', stockQuantity: 15, reorderPoint: 5 },
    { name: 'Doxiciclina 100mg', type: 'medication', sku: 'MED-004', price: '18.00', costPrice: '11.00', stockQuantity: 35, reorderPoint: 8 },
    { name: 'Prednisona 20mg', type: 'medication', sku: 'MED-005', price: '15.00', costPrice: '9.00', stockQuantity: 25, reorderPoint: 5 },
    { name: 'Jeringa 3ml x100', type: 'supply', sku: 'SUP-001', price: '45.00', costPrice: '28.00', stockQuantity: 10, reorderPoint: 3 },
    { name: 'Jeringa 5ml x100', type: 'supply', sku: 'SUP-002', price: '55.00', costPrice: '35.00', stockQuantity: 8, reorderPoint: 3 },
    { name: 'Aguja 21G x50', type: 'supply', sku: 'SUP-003', price: '25.00', costPrice: '15.00', stockQuantity: 12, reorderPoint: 4 },
    { name: 'Collar Isabelino Talla M', type: 'supply', sku: 'SUP-004', price: '18.00', costPrice: '10.00', stockQuantity: 15, reorderPoint: 5 },
    { name: 'Collar Isabelino Talla G', type: 'supply', sku: 'SUP-005', price: '22.00', costPrice: '13.00', stockQuantity: 8, reorderPoint: 3 },
    { name: 'Venda Elástica 5m', type: 'supply', sku: 'SUP-006', price: '8.50', costPrice: '4.50', stockQuantity: 30, reorderPoint: 10 },
    { name: 'Gasas Estériles x100', type: 'supply', sku: 'SUP-007', price: '12.00', costPrice: '7.00', stockQuantity: 20, reorderPoint: 5 },
    { name: 'Royal Canin Gastrointestinal 3kg', type: 'food', sku: 'FOO-001', price: '45.00', costPrice: '32.00', stockQuantity: 12, reorderPoint: 3 },
    { name: 'Hills Science Diet Adulto 2kg', type: 'food', sku: 'FOO-002', price: '38.00', costPrice: '28.00', stockQuantity: 8, reorderPoint: 3 },
    { name: 'Royal Canin Urinary 1.5kg', type: 'food', sku: 'FOO-003', price: '32.00', costPrice: '22.00', stockQuantity: 6, reorderPoint: 2 },
    { name: 'Purina Pro Plan Sensitive 3kg', type: 'food', sku: 'FOO-004', price: '42.00', costPrice: '30.00', stockQuantity: 10, reorderPoint: 3 },
    { name: 'Consulta General', type: 'service', sku: 'SRV-001', price: '50.00', stockQuantity: 999 },
    { name: 'Consulta Urgencia', type: 'service', sku: 'SRV-002', price: '80.00', stockQuantity: 999 },
    { name: 'Baño Medicado', type: 'service', sku: 'SRV-003', price: '35.00', stockQuantity: 999 },
    { name: 'Corte de Uñas', type: 'service', sku: 'SRV-004', price: '15.00', stockQuantity: 999 },
    { name: 'Limpieza Dental', type: 'service', sku: 'SRV-005', price: '120.00', stockQuantity: 999 },
    { name: 'Desparasitación Interna', type: 'service', sku: 'SRV-006', price: '25.00', stockQuantity: 999 },
    { name: 'Desparasitación Externa', type: 'service', sku: 'SRV-007', price: '20.00', stockQuantity: 999 },
    { name: 'Hospitalización x día', type: 'service', sku: 'SRV-008', price: '150.00', stockQuantity: 999 },
    { name: 'Radiografía 1 placa', type: 'service', sku: 'SRV-009', price: '35.00', stockQuantity: 999 },
    { name: 'Cirugía Menor', type: 'service', sku: 'SRV-010', price: '250.00', stockQuantity: 999 },
    { name: 'Cirugía Mayor', type: 'service', sku: 'SRV-011', price: '500.00', stockQuantity: 999 },
    { name: 'Pipeta Antipulgas Advocate Talla M', type: 'medication', sku: 'MED-006', price: '28.00', costPrice: '18.00', stockQuantity: 40, reorderPoint: 10 },
    { name: 'Pipeta Antipulgas Advocate Talla G', type: 'medication', sku: 'MED-007', price: '32.00', costPrice: '21.00', stockQuantity: 30, reorderPoint: 8 },
    { name: 'Bravecto 500mg', type: 'medication', sku: 'MED-008', price: '65.00', costPrice: '42.00', stockQuantity: 15, reorderPoint: 5 },
  ];
  const pr: any[] = [];
  for (const p of prodData) {
    const [prod] = await db.insert(products).values({ clinicId: clinic.id, ...p } as any).returning();
    pr.push(prod);
  }
  const pConsulta = pr.find(p => p.sku === 'SRV-001')!;
  const pUrgencia = pr.find(p => p.sku === 'SRV-002')!;
  const pBano = pr.find(p => p.sku === 'SRV-003')!;
  const pCorteUñas = pr.find(p => p.sku === 'SRV-004')!;
  const pLimpiezaDental = pr.find(p => p.sku === 'SRV-005')!;
  const pDesparasitacion = pr.find(p => p.sku === 'SRV-006')!;
  const pRadiografia = pr.find(p => p.sku === 'SRV-009')!;
  const pCirugiaMenor = pr.find(p => p.sku === 'SRV-010')!;
  const pCirugiaMayor = pr.find(p => p.sku === 'SRV-011')!;
  const pHospitalizacion = pr.find(p => p.sku === 'SRV-008')!;
  const pAmox = pr.find(p => p.sku === 'MED-001')!;
  const pCarpro = pr.find(p => p.sku === 'MED-002')!;
  const pAdvocateM = pr.find(p => p.sku === 'MED-006')!;
  const pRoyalGastro = pr.find(p => p.sku === 'FOO-001')!;
  const pHills = pr.find(p => p.sku === 'FOO-002')!;
  const pRoyalUri = pr.find(p => p.sku === 'FOO-003')!;
  console.log(`✔ Productos: ${pr.length}`);

  const apptData: any[] = [
    // Last week (completed, checked_out)
    { patientId: max.id, clientId: juan.id, vetId: vet1.id, date: '2026-05-26', startTime: '09:00', endTime: '09:30', type: 'consultation', status: 'checked_out', notes: 'Control general', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: luna.id, clientId: ana.id, vetId: vet1.id, date: '2026-05-26', startTime: '10:00', endTime: '10:30', type: 'vaccination', status: 'checked_out', notes: 'Revacunación triple felina', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: simba.id, clientId: roberto.id, vetId: vet2.id, date: '2026-05-27', startTime: '11:00', endTime: '11:45', type: 'consultation', status: 'checked_out', notes: 'Problemas digestivos', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: bella.id, clientId: carmen.id, vetId: vet1.id, date: '2026-05-27', startTime: '15:00', endTime: '15:30', type: 'vaccination', status: 'checked_out', notes: 'Refuerzo óctuple', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: roco.id, clientId: gabriela.id, vetId: vet2.id, date: '2026-05-28', startTime: '09:30', endTime: '10:15', type: 'consultation', status: 'checked_out', notes: 'Revisión de dermatitis', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: thor.id, clientId: miguel.id, vetId: vet1.id, date: '2026-05-28', startTime: '14:00', endTime: '14:45', type: 'surgery', status: 'checked_out', notes: 'Biopsia cutánea', room: 'Quirófano', createdBy: vet1.id },
    // 3 days ago (completed, some checked_in)
    { patientId: milo.id, clientId: lucia.id, vetId: vet1.id, date: '2026-06-01', startTime: '08:30', endTime: '09:15', type: 'consultation', status: 'checked_out', notes: 'Dolor en cadera', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: tito.id, clientId: valentina.id, vetId: vet2.id, date: '2026-06-01', startTime: '10:00', endTime: '10:30', type: 'consultation', status: 'checked_out', notes: 'Otitis externa', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: oliver.id, clientId: carmen.id, vetId: tech.id, date: '2026-06-01', startTime: '11:00', endTime: '11:20', type: 'consultation', status: 'checked_out', notes: 'Revisión de uñas', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: princesa.id, clientId: patricia.id, vetId: vet1.id, date: '2026-06-02', startTime: '09:00', endTime: '09:30', type: 'consultation', status: 'checked_out', notes: 'Tos persistente', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: leo.id, clientId: diego.id, vetId: vet2.id, date: '2026-06-02', startTime: '11:00', endTime: '11:30', type: 'vaccination', status: 'checked_out', notes: 'Primera vacuna triple felina', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: thor.id, clientId: miguel.id, vetId: null, date: '2026-06-02', startTime: '16:00', endTime: '17:00', type: 'grooming', status: 'checked_out', notes: 'Baño medicado', createdBy: recp.id },
    { patientId: zeus.id, clientId: oscar.id, vetId: vet1.id, date: '2026-06-02', startTime: '15:00', endTime: '15:45', type: 'consultation', status: 'checked_in', notes: 'Dolor abdominal', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: canela.id, clientId: lucia.id, vetId: vet2.id, date: '2026-06-02', startTime: '12:00', endTime: '12:30', type: 'consultation', status: 'checked_out', notes: 'Revisión general', room: 'Consultorio 2', createdBy: recp.id },
    // Today (various statuses)
    { patientId: zeus.id, clientId: oscar.id, vetId: vet1.id, date: '2026-06-04', startTime: '09:00', endTime: '10:00', type: 'surgery', status: 'in_exam', notes: 'Biopsia', room: 'Quirófano', createdBy: vet1.id },
    { patientId: molly.id, clientId: gabriela.id, vetId: vet2.id, date: '2026-06-04', startTime: '10:00', endTime: '10:30', type: 'consultation', status: 'confirmed', notes: 'Primera consulta', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: coco.id, clientId: sofia.id, vetId: vet1.id, date: '2026-06-04', startTime: '11:00', endTime: '11:30', type: 'consultation', status: 'checked_in', notes: 'Revisión de plumaje', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: lola.id, clientId: andres.id, vetId: vet2.id, date: '2026-06-04', startTime: '12:00', endTime: '12:15', type: 'vaccination', status: 'scheduled', notes: 'Desparasitación', room: 'Consultorio 2', createdBy: recp.id },
    // Tomorrow
    { patientId: rocky.id, clientId: miguel.id, vetId: vet1.id, date: '2026-06-05', startTime: '08:30', endTime: '09:15', type: 'consultation', status: 'scheduled', notes: 'Revisión post-castración', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: duke.id, clientId: diego.id, vetId: vet2.id, date: '2026-06-05', startTime: '10:00', endTime: '11:00', type: 'consultation', status: 'confirmed', notes: 'Revisión de articulaciones', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: bella.id, clientId: carmen.id, vetId: null, date: '2026-06-05', startTime: '15:00', endTime: '15:45', type: 'grooming', status: 'scheduled', notes: 'Corte y baño', createdBy: recp.id },
    // Next week
    { patientId: max.id, clientId: juan.id, vetId: vet2.id, date: '2026-06-08', startTime: '09:00', endTime: '09:30', type: 'follow_up', status: 'scheduled', notes: 'Seguimiento de tratamiento', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: luna.id, clientId: ana.id, vetId: vet1.id, date: '2026-06-08', startTime: '11:00', endTime: '11:30', type: 'consultation', status: 'scheduled', notes: 'Revisión de infección urinaria', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: tito.id, clientId: valentina.id, vetId: vet2.id, date: '2026-06-09', startTime: '10:00', endTime: '10:30', type: 'follow_up', status: 'scheduled', notes: 'Control de otitis', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: roco.id, clientId: gabriela.id, vetId: vet1.id, date: '2026-06-09', startTime: '11:30', endTime: '12:15', type: 'consultation', status: 'scheduled', notes: 'Control dermatitis', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: nina.id, clientId: ana.id, vetId: vet2.id, date: '2026-06-09', startTime: '15:00', endTime: '15:30', type: 'consultation', status: 'scheduled', notes: 'Revisión general', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: toby.id, clientId: pedro.id, vetId: null, date: '2026-06-10', startTime: '16:00', endTime: '16:30', type: 'grooming', status: 'confirmed', notes: 'Corte de uñas y baño', createdBy: recp.id },
    { patientId: milo.id, clientId: lucia.id, vetId: vet1.id, date: '2026-06-10', startTime: '09:00', endTime: '10:00', type: 'surgery', status: 'confirmed', notes: 'Luxación de rótula', room: 'Quirófano', createdBy: vet1.id },
    { patientId: canela.id, clientId: lucia.id, vetId: vet2.id, date: '2026-06-11', startTime: '10:00', endTime: '10:30', type: 'vaccination', status: 'scheduled', notes: 'Vacunación antirrábica', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: princesa.id, clientId: patricia.id, vetId: vet1.id, date: '2026-06-11', startTime: '11:00', endTime: '11:30', type: 'follow_up', status: 'scheduled', notes: 'Control de tos', room: 'Consultorio 1', createdBy: recp.id },
    // Week after next
    { patientId: kiara.id, clientId: fernando.id, vetId: vet1.id, date: '2026-06-15', startTime: '09:00', endTime: '09:30', type: 'consultation', status: 'scheduled', notes: 'Revisión general', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: rocky.id, clientId: miguel.id, vetId: vet2.id, date: '2026-06-16', startTime: '14:00', endTime: '15:00', type: 'surgery', status: 'scheduled', notes: 'Cirugía menor', room: 'Quirófano', createdBy: vet2.id },
    { patientId: oliver.id, clientId: carmen.id, vetId: vet1.id, date: '2026-06-17', startTime: '10:00', endTime: '10:20', type: 'consultation', status: 'scheduled', notes: 'Revisión general', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: zeus.id, clientId: oscar.id, vetId: null, date: '2026-06-18', startTime: '16:00', endTime: '17:00', type: 'grooming', status: 'scheduled', notes: 'Baño completo', createdBy: recp.id },
    { patientId: duke.id, clientId: diego.id, vetId: vet1.id, date: '2026-06-18', startTime: '09:00', endTime: '10:00', type: 'follow_up', status: 'scheduled', notes: 'Seguimiento de articulaciones', room: 'Consultorio 1', createdBy: recp.id },
    { patientId: molly.id, clientId: gabriela.id, vetId: vet2.id, date: '2026-06-19', startTime: '11:00', endTime: '11:30', type: 'vaccination', status: 'scheduled', notes: 'Primera vacuna', room: 'Consultorio 2', createdBy: recp.id },
    // Cancelled / no_show
    { patientId: princesa.id, clientId: patricia.id, vetId: vet2.id, date: '2026-05-29', startTime: '14:00', endTime: '14:30', type: 'consultation', status: 'cancelled', notes: 'Cancelado por la dueña', room: 'Consultorio 2', createdBy: recp.id },
    { patientId: tito.id, clientId: valentina.id, vetId: vet1.id, date: '2026-05-30', startTime: '10:00', endTime: '10:30', type: 'consultation', status: 'no_show', notes: 'No se presentó', room: 'Consultorio 1', createdBy: recp.id },
  ];
  const ap: any[] = [];
  for (const a of apptData) {
    const vals: any = { clinicId: clinic.id, ...a };
    if (!vals.vetId) delete vals.vetId;
    const [appt] = await db.insert(appointments).values(vals).returning();
    ap.push(appt);
  }
  console.log(`✔ Citas: ${ap.length}`);

  // Link appointments for medical records
  const appMax = ap[0];
  const appLuna = ap[1];
  const appSimba = ap[2];
  const appRoco = ap[4];
  const appMilo = ap[6];
  const appTito = ap[7];
  const appPrincesa = ap[9];
  const appZeus = ap[12];
  const appThor2 = ap[11];

  const mrData = [
    {
      patientId: max.id, appointmentId: appMax.id,
      subjective: 'Dueño reporta que Max ha estado comiendo menos y ha perdido energía. Nota que bebe agua normalmente.',
      objective: 'Peso: 30.5kg. Temp: 38.4°C. FC: 80 lpm. FR: 22 rpm. Palpación abdominal normal. Mucosas rosadas. Signos vitales dentro de parámetros.',
      assessment: 'Anorexia parcial sin otros hallazgos significativos. Posible malestar gastrointestinal leve o estrés estacional.',
      plan: 'Dieta blanda por 48hrs (pollo + arroz). Regresar si persiste. Probióticos orales 1 vez al día por 5 días.',
      vitals: { weight: 30.5, temperature: 38.4, heartRate: 80, respiratoryRate: 22 },
      diagnosis: 'Anorexia parcial — probable dispepsia leve',
      createdBy: vet1.id,
    },
    {
      patientId: luna.id, appointmentId: appLuna.id,
      subjective: 'Propietaria reporta que Luna ha estado bebiendo más agua de lo normal y perdió el apetito.',
      objective: 'Peso: 4.3kg. Temp: 38.5°C. FC: 120 lpm. FR: 24 rpm. Mucosas rosadas, hidratación normal.',
      assessment: 'Polidipsia y anorexia leve. Sospecha de infección urinaria. Se descartan problemas metabólicos mayores.',
      plan: 'Tomar muestra de orina para análisis. Iniciar antibioterapia. Regresar en 7 días. Monitorear ingesta de agua.',
      vitals: { weight: 4.3, temperature: 38.5, heartRate: 120, respiratoryRate: 24 },
      diagnosis: 'Sospecha de infección del tracto urinario',
      createdBy: vet1.id,
    },
    {
      patientId: simba.id, appointmentId: appSimba.id,
      subjective: 'Dueño reporta vómito ocasional después de comer y heces blandas por 3 días. Sin pérdida de apetito.',
      objective: 'Peso: 5.6kg. Temp: 38.2°C. FC: 150 lpm. Palpación abdominal con leve dolor en epigastrio. Mucosas ligeramente pálidas.',
      assessment: 'Gastroenteritis leve. Probable intolerancia alimentaria o cambio repentino de dieta.',
      plan: 'Ayuno 12 horas. Luego dieta blanda. Metronidazol 50mg cada 12h por 5 días. Regresar si no mejora en 48h.',
      vitals: { weight: 5.6, temperature: 38.2, heartRate: 150, respiratoryRate: 30 },
      diagnosis: 'Gastroenteritis aguda leve',
      createdBy: vet2.id,
    },
    {
      patientId: roco.id, appointmentId: appRoco.id,
      subjective: 'Dueña reporta que Roco se rasca constantemente, especialmente en el vientre y las patas. Nota enrojecimiento.',
      objective: 'Peso: 27.5kg. Temp: 38.1°C. Eritema en abdomen ventral y zonas interdigitales. Presencia de pápulas. Sin evidencia de parásitos visibles.',
      assessment: 'Dermatitis atópica. Posibles alergias ambientales. Se descarta sarna por raspado negativo.',
      plan: 'Baño medicado con clorhexidina c/3 días. Prednisona 20mg c/24h por 5 días. Regresar en 10 días. Considerar prueba de alergias.',
      vitals: { weight: 27.5, temperature: 38.1, heartRate: 100, respiratoryRate: 24 },
      diagnosis: 'Dermatitis atópica moderada',
      createdBy: vet2.id,
    },
    {
      patientId: milo.id, appointmentId: appMilo.id,
      subjective: 'Dueña reporta que Milo cojea de la pata trasera izquierda después de correr en el parque. No hubo traumatismo visible.',
      objective: 'Peso: 24kg. Temp: 38.3°C. A la palpación de la rodilla izquierda presenta dolor, inflamación leve y signo de cajón positivo.',
      assessment: 'Posible luxación de rótula medial grado II. También podría ser desgarro de ligamento cruzado.',
      plan: 'Radiografía de rodilla izquierda. Reposo absoluto 1 semana. Carprofeno 100mg c/24h por 5 días. Evaluar necesidad de cirugía.',
      vitals: { weight: 24, temperature: 38.3, heartRate: 110, respiratoryRate: 28 },
      diagnosis: 'Sospecha de luxación de rótula izquierda',
      createdBy: vet1.id,
    },
    {
      patientId: tito.id, appointmentId: appTito.id,
      subjective: 'Dueña reporta que Tito sacude la cabeza frecuentemente y se rasca las orejas. Olor desagradable en oído derecho.',
      objective: 'Peso: 14kg. Temp: 38.0°C. Conducto auditivo derecho eritematoso con exudado marrón oscuro abundante. Left ear menos afectado. Citología: cocos y levaduras.',
      assessment: 'Otitis externa bacteriana y micótica bilateral, más severa en oído derecho.',
      plan: 'Limpieza de oídos con solución limpiadora. Gotas óticas con antibiótico y antifúngico c/12h por 14 días. Regresar en 7 días.',
      vitals: { weight: 14, temperature: 38.0, heartRate: 90, respiratoryRate: 22 },
      diagnosis: 'Otitis externa bilateral — mixta bacteriana/micótica',
      createdBy: vet2.id,
    },
    {
      patientId: princesa.id, appointmentId: appPrincesa.id,
      subjective: 'Dueña reporta que Princesa tose frecuentemente, especialmente después de hacer ejercicio. Ha perdido algo de peso.',
      objective: 'Peso: 2.6kg. Temp: 38.6°C. FC: 140 lpm. FR: 32 rpm. Auscultación pulmonar con crepitantes leves. Tráquea sensible a la palpación.',
      assessment: 'Posible colapso traqueal temprano o bronquitis. Descartar cardiopatía por su tamaño.',
      plan: 'Radiografía de tórax. Antitusígeno (butorfanol) si es necesario. Regresar con resultados. Evitar collar y usar arnés.',
      vitals: { weight: 2.6, temperature: 38.6, heartRate: 140, respiratoryRate: 32 },
      diagnosis: 'Sospecha de colapso traqueal vs. bronquitis',
      createdBy: vet1.id,
    },
    {
      patientId: zeus.id, appointmentId: appZeus.id,
      subjective: 'Dueño reporta que Zeus está decaído, se queja al moverse y tiene el abdomen sensible. No ha defecado en 24 horas.',
      objective: 'Peso: 35kg. Temp: 38.8°C. Abdomen tenso a la palpación, dolor en cuadrante derecho. Signos de incomodidad.', 
      assessment: 'Posible pancreatitis aguda. Descartar obstrucción intestinal o torsión gástrica.',
      plan: 'Hospitalización inmediata. Ayuno. Análisis de sangre (amilasa, lipasa). Radiografía abdominal. Fluidoterapia IV. Analgésicos.',
      vitals: { weight: 35, temperature: 38.8, heartRate: 130, respiratoryRate: 36 },
      diagnosis: 'Sospecha de pancreatitis aguda',
      createdBy: vet1.id,
    },
  ];
  for (const mr of mrData) {
    await db.insert(medicalRecords).values({ clinicId: clinic.id, ...mr });
  }
  console.log(`✔ Expedientes médicos: ${mrData.length}`);

  const drData = [
    {
      patientId: toby.id, createdBy: vet2.id,
      teeth: [
        { toothNumber: 104, status: 'calculus', notes: 'Cálculo moderado en premolar' },
        { toothNumber: 105, status: 'gingivitis', notes: 'Encía inflamada con sangrado leve' },
        { toothNumber: 109, status: 'fractured', notes: 'Fractura de corona sin exposición pulpar' },
        { toothNumber: 207, status: 'calculus', notes: 'Cálculo severo' },
        { toothNumber: 208, status: 'gingivitis', notes: 'Bolsillo periodontal de 4mm' },
        { toothNumber: 301, status: 'worn', notes: 'Desgaste por edad' },
        { toothNumber: 407, status: 'missing', notes: 'Perdido por enfermedad periodontal avanzada' },
      ],
      notes: { general: 'Enfermedad periodontal estadio II. Se recomienda limpieza dental profesional y radiografías dentales completas.' },
    },
    {
      patientId: roco.id, createdBy: vet2.id,
      teeth: [
        { toothNumber: 103, status: 'calculus' },
        { toothNumber: 104, status: 'calculus' },
        { toothNumber: 108, status: 'gingivitis' },
        { toothNumber: 204, status: 'fractured', notes: 'Fractura complicada con exposición' },
      ],
      notes: { general: 'Enfermedad periodontal estadio I. Fractura del 204 requiere extracción o endodoncia.' },
    },
  ];
  for (const dr of drData) {
    await db.insert(dentalRecords).values({ clinicId: clinic.id, ...dr });
  }
  console.log(`✔ Registros dentales: ${drData.length}`);

  const invSeeds = [
    { clientId: juan.id, appointmentId: appMax.id, invoiceNumber: 'FAC-2026-0001', subtotal: '475.00', tax: '76.00', total: '551.00', status: 'paid', notes: 'Pagado con tarjeta',
      items: [
        { description: 'Consulta General', quantity: 1, unitPrice: '50.00', total: '50.00' },
        { description: 'Radiografía de tórax', quantity: 1, unitPrice: '35.00', total: '35.00' },
        { description: 'Análisis de sangre', quantity: 1, unitPrice: '40.00', total: '40.00' },
      ]},
    { clientId: ana.id, appointmentId: appLuna.id, invoiceNumber: 'FAC-2026-0002', subtotal: '135.00', tax: '21.60', total: '156.60', status: 'paid', notes: 'Pagado en efectivo',
      items: [
        { description: 'Consulta General', quantity: 1, unitPrice: '50.00', total: '50.00' },
        { description: 'Análisis de orina', quantity: 1, unitPrice: '25.00', total: '25.00' },
        { description: 'Vacuna Triple Felina', quantity: 1, unitPrice: '35.00', total: '35.00' },
        { description: 'Amoxicilina 500mg', quantity: 2, unitPrice: '12.50', total: '25.00' },
      ]},
    { clientId: roberto.id, appointmentId: appSimba.id, invoiceNumber: 'FAC-2026-0003', subtotal: '102.00', tax: '16.32', total: '118.32', status: 'paid', notes: 'Pagado con transferencia',
      items: [
        { description: 'Consulta General', quantity: 1, unitPrice: '50.00', total: '50.00' },
        { description: 'Metronidazol 50mg', quantity: 1, unitPrice: '27.00', total: '27.00' },
        { description: 'Dieta Gastrointestinal Royal Canin', quantity: 1, unitPrice: '25.00', total: '25.00' },
      ]},
    { clientId: gabriela.id, appointmentId: appRoco.id, invoiceNumber: 'FAC-2026-0004', subtotal: '170.00', tax: '27.20', total: '197.20', status: 'issued', notes: 'Pendiente de pago - recordatorio enviado',
      items: [
        { description: 'Consulta General', quantity: 1, unitPrice: '50.00', total: '50.00' },
        { description: 'Prednisona 20mg', quantity: 1, unitPrice: '15.00', total: '15.00' },
        { description: 'Baño Medicado', quantity: 3, unitPrice: '35.00', total: '105.00' },
      ]},
    { clientId: carmen.id, appointmentId: null, invoiceNumber: 'FAC-2026-0005', subtotal: '45.00', tax: '7.20', total: '52.20', status: 'paid', notes: 'Compra directa en recepción',
      items: [
        { description: 'Royal Canin Gastrointestinal 3kg', quantity: 1, unitPrice: '45.00', total: '45.00' },
      ]},
    { clientId: pedro.id, appointmentId: null, invoiceNumber: 'FAC-2026-0006', subtotal: '223.00', tax: '35.68', total: '258.68', status: 'issued', notes: 'Factura de consulta + medicamentos',
      items: [
        { description: 'Carprofeno 100mg x30', quantity: 1, unitPrice: '85.00', total: '85.00' },
        { description: 'Radiografía de cadera', quantity: 2, unitPrice: '35.00', total: '70.00' },
        { description: 'Collar Isabelino Talla G', quantity: 1, unitPrice: '22.00', total: '22.00' },
        { description: 'Pipeta Advocate Talla G', quantity: 2, unitPrice: '32.00', total: '64.00' },
      ]},
    { clientId: valentina.id, appointmentId: appTito.id, invoiceNumber: 'FAC-2026-0007', subtotal: '105.00', tax: '16.80', total: '121.80', status: 'paid', notes: 'Pagado con tarjeta',
      items: [
        { description: 'Consulta General', quantity: 1, unitPrice: '50.00', total: '50.00' },
        { description: 'Gotas óticas antibióticas', quantity: 1, unitPrice: '35.00', total: '35.00' },
        { description: 'Solución limpiadora de oídos', quantity: 1, unitPrice: '20.00', total: '20.00' },
      ]},
    { clientId: lucia.id, appointmentId: appMilo.id, invoiceNumber: 'FAC-2026-0008', subtotal: '260.00', tax: '41.60', total: '301.60', status: 'issued', notes: 'Pendiente - esperando resultado de radiografía',
      items: [
        { description: 'Consulta General', quantity: 1, unitPrice: '50.00', total: '50.00' },
        { description: 'Radiografía de rodilla', quantity: 2, unitPrice: '35.00', total: '70.00' },
        { description: 'Carprofeno 100mg x30', quantity: 1, unitPrice: '85.00', total: '85.00' },
        { description: 'Venda Elástica', quantity: 3, unitPrice: '8.50', total: '25.50' },
        { description: 'Collar Isabelino Talla M', quantity: 1, unitPrice: '18.00', total: '18.00' },
      ]},
    { clientId: patricia.id, appointmentId: appPrincesa.id, invoiceNumber: 'FAC-2026-0009', subtotal: '85.00', tax: '13.60', total: '98.60', status: 'draft', notes: 'En espera de resultados de radiografía',
      items: [
        { description: 'Consulta General', quantity: 1, unitPrice: '50.00', total: '50.00' },
        { description: 'Radiografía de tórax', quantity: 1, unitPrice: '35.00', total: '35.00' },
      ]},
    { clientId: oscar.id, appointmentId: appZeus.id, invoiceNumber: 'FAC-2026-0010', subtotal: '730.00', tax: '116.80', total: '846.80', status: 'issued', notes: 'Hospitalización + cirugía',
      items: [
        { description: 'Consulta Urgencia', quantity: 1, unitPrice: '80.00', total: '80.00' },
        { description: 'Hospitalización x día', quantity: 2, unitPrice: '150.00', total: '300.00' },
        { description: 'Análisis de sangre completo', quantity: 1, unitPrice: '45.00', total: '45.00' },
        { description: 'Radiografía abdominal', quantity: 1, unitPrice: '35.00', total: '35.00' },
        { description: 'Cirugía Menor', quantity: 1, unitPrice: '250.00', total: '250.00' },
      ]},
    { clientId: gabriela.id, appointmentId: null, invoiceNumber: 'FAC-2026-0011', subtotal: '28.00', tax: '4.48', total: '32.48', status: 'draft',
      items: [
        { description: 'Pipeta Advocate Talla M', quantity: 1, unitPrice: '28.00', total: '28.00' },
      ]},
    { clientId: andres.id, appointmentId: null, invoiceNumber: 'FAC-2026-0012', subtotal: '25.00', tax: '4.00', total: '29.00', status: 'issued', notes: 'Desparasitación',
      items: [
        { description: 'Desparasitación Interna', quantity: 1, unitPrice: '25.00', total: '25.00' },
      ]},
  ];
  for (const invData of invSeeds) {
    const { items, ...invFields } = invData;
    const [inv] = await db.insert(invoices).values({ clinicId: clinic.id, ...invFields }).returning();
    for (const item of items) {
      await db.insert(invoiceItems).values({ invoiceId: inv.id, ...item });
    }
  }
  console.log(`✔ Facturas: ${invSeeds.length}`);

  const notifData = [
    { userId: admin.id, title: '🐾 Recordatorio de cita', message: 'Max tiene seguimiento el 8 de junio con el Dr. Carlos.', type: 'appointment', link: '/appointments' },
    { userId: vet1.id, title: '📋 Nueva cita asignada', message: 'Se te asignó la revisión de Kiara el 15 de junio a las 9:00.', type: 'appointment', link: '/appointments' },
    { userId: vet2.id, title: '📋 Nueva cita asignada', message: 'Cirugía de Rocky programada para el 16 de junio a las 14:00.', type: 'appointment', link: '/appointments' },
    { userId: recp.id, title: '📋 Recordatorio', message: 'Toby tiene baño programado mañana 10 de junio a las 16:00.', type: 'appointment', link: '/appointments' },
    { userId: recp.id, title: '💰 Facturas pendientes', message: '3 facturas están en estado "issued" (FAC-2026-0004, 0006, 0008).', type: 'invoice', link: '/invoices' },
    { userId: admin.id, title: '📦 Inventario bajo', message: 'Hills Science Diet Adulto 2kg (stock: 8), Jeringa 5ml (stock: 8).', type: 'system', link: '/inventory' },
    { userId: admin.id, title: '🐶 Paciente registrado', message: 'Molly (Atigrado) y Duke (Gran Danés) fueron registrados hoy.', type: 'patient', link: '/patients' },
    { userId: vet1.id, title: '⚠️ Urgencia', message: 'Zeus (Doberman) hospitalizado por sospecha de pancreatitis.', type: 'system', link: '/patients/16' },
    { userId: recp.id, title: '💳 Pago recibido', message: 'FAC-2026-0007 de Valentina Cruz fue pagada con tarjeta.', type: 'invoice', link: '/invoices' },
    { userId: admin.id, title: '📊 Reporte semanal', message: 'Esta semana: 12 citas atendidas, 8 facturas emitidas.', type: 'system' },
    { userId: tech.id, title: '🔬 Laboratorio', message: 'Resultados de análisis de Zeus disponibles para revisión.', type: 'system', link: '/patients/16' },
  ];
  for (const n of notifData) {
    await db.insert(notifications).values(n);
  }
  console.log(`✔ Notificaciones: ${notifData.length}`);

  console.log('\n' + '='.repeat(60));
  console.log('✅ SEED COMPLETADO EXITOSAMENTE');
  console.log('='.repeat(60));
  console.log('');
  console.log('Resumen de datos cargados:');
  console.log('  👤 Usuarios:      ' + us.length + ' (admin, 2 vets, recep, técnico)');
  console.log('  👥 Clientes:      ' + cl.length);
  console.log('  🐾 Pacientes:     ' + pt.length + ' (perros, gatos, aves, conejos)');
  console.log('  💉 Vacunas:       ' + va.length + ' tipos, ' + vxData.length + ' aplicaciones');
  console.log('  🏪 Proveedores:   ' + supData.length);
  console.log('  📦 Productos:     ' + pr.length + ' (meds, insumos, comida, servicios)');
  console.log('  📅 Citas:         ' + ap.length + ' (pasadas, hoy, próximas)');
  console.log('  📋 Expedientes:   ' + mrData.length + ' registros SOAP');
  console.log('  🦷 Odontogramas:  ' + drData.length);
  console.log('  💰 Facturas:      ' + invSeeds.length + ' con items');
  console.log('  🔔 Notificaciones:' + notifData.length);
  console.log('');
  console.log('Credenciales (admin123 para todos):');
  console.log('  admin@vetrinaria.app   — Super Admin');
  console.log('  maria@vetrinaria.app   — Veterinaria');
  console.log('  carlos@vetrinaria.app  — Veterinario');
  console.log('  laura@vetrinaria.app   — Recepción');
  console.log('  javier@vetrinaria.app  — Técnico');
}

seed().catch(e => { console.error('❌ Seed falló:', e); process.exit(1); });
