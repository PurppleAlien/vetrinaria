import 'server-only';
import { cache } from 'react';
import { db, schema } from '@vetrinaria/db';
import { eq, and, gte, desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { getCurrentClinicId } from '@/lib/clinic';

export interface DashboardMetrics {
  appointmentsToday: number;
  appointmentsTodayStatuses: Record<string, number>;
  clientsTotal: number;
  patientsTotal: number;
  revenueToday: number;
  revenueMonth: number;
  upcomingAppointments: {
    id: number; time: string; patientName: string; clientName: string; type: string; status: string;
  }[];
  recentActivity: {
    type: 'client' | 'patient' | 'appointment' | 'invoice';
    description: string; date: string; id: number;
  }[];
}

export const getDashboardMetrics = cache(async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const clinicId = await getCurrentClinicId();
  const today = new Date().toISOString().slice(0, 10);
  const monthStart = new Date();
  monthStart.setDate(1);
  const monthStartStr = monthStart.toISOString().slice(0, 10);

  const clinicFilter = eq(schema.appointments.clinicId, clinicId);
  const clinicFilterClients = eq(schema.clients.clinicId, clinicId);
  const clinicFilterPatients = eq(schema.patients.clinicId, clinicId);
  const clinicFilterInvoices = eq(schema.invoices.clinicId, clinicId);

  const [apptsAgg, clientsCount, patientsCount,
    invoicesAgg, upcoming, recentClients, recentPatients, recentInvoices] =
    await Promise.all([
      db.select({
        status: schema.appointments.status,
        count: sql<number>`count(*)`,
      }).from(schema.appointments)
        .where(and(clinicFilter, eq(schema.appointments.date, today)))
        .groupBy(schema.appointments.status),

      db.select({ count: sql<number>`count(*)` }).from(schema.clients)
        .where(clinicFilterClients).then(r => Number(r[0]?.count ?? 0)),

      db.select({ count: sql<number>`count(*)` }).from(schema.patients)
        .where(clinicFilterPatients).then(r => Number(r[0]?.count ?? 0)),

      db.select({
        today: sql<number>`coalesce(sum(total) filter (where created_at >= ${today}::timestamp), 0)`,
        month: sql<number>`coalesce(sum(total) filter (where created_at >= ${monthStartStr}::timestamp), 0)`,
      }).from(schema.invoices)
        .where(and(clinicFilterInvoices, eq(schema.invoices.status, 'paid'))),

      db.select({
        id: schema.appointments.id,
        startTime: schema.appointments.startTime,
        type: schema.appointments.type,
        status: schema.appointments.status,
        patientName: schema.patients.name,
        clientName: schema.clients.name,
      }).from(schema.appointments)
        .innerJoin(schema.patients, eq(schema.appointments.patientId, schema.patients.id))
        .innerJoin(schema.clients, eq(schema.appointments.clientId, schema.clients.id))
        .where(and(clinicFilter, gte(schema.appointments.date, today)))
        .orderBy(schema.appointments.date, schema.appointments.startTime)
        .limit(5),

      db.select({ id: schema.clients.id, name: schema.clients.name, createdAt: schema.clients.createdAt })
        .from(schema.clients).where(clinicFilterClients).orderBy(desc(schema.clients.createdAt)).limit(5),

      db.select({ id: schema.patients.id, name: schema.patients.name, createdAt: schema.patients.createdAt })
        .from(schema.patients).where(clinicFilterPatients).orderBy(desc(schema.patients.createdAt)).limit(5),

      db.select({ id: schema.invoices.id, invoiceNumber: schema.invoices.invoiceNumber, total: schema.invoices.total, createdAt: schema.invoices.createdAt })
        .from(schema.invoices).where(clinicFilterInvoices).orderBy(desc(schema.invoices.createdAt)).limit(5),
    ]);

  const apptsTotal = apptsAgg.reduce((sum, r) => sum + Number(r.count), 0);
  const apptsByStatus = Object.fromEntries(apptsAgg.map(r => [r.status, Number(r.count)]));
  const revenueToday = Number(invoicesAgg[0]?.today ?? 0);
  const revenueMonth = Number(invoicesAgg[0]?.month ?? 0);

  const activity: DashboardMetrics['recentActivity'] = [
    ...recentClients.map(c => ({ type: 'client' as const, description: `Nuevo cliente: ${c.name}`, date: c.createdAt.toISOString(), id: c.id })),
    ...recentPatients.map(p => ({ type: 'patient' as const, description: `Nuevo paciente: ${p.name}`, date: p.createdAt.toISOString(), id: p.id })),
    ...recentInvoices.map(i => ({ type: 'invoice' as const, description: `Factura ${i.invoiceNumber} — $${i.total}`, date: i.createdAt.toISOString(), id: i.id })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10);

  const typeLabels: Record<string, string> = {
    consultation: 'Consulta', vaccination: 'Vacunación', surgery: 'Cirugía',
    emergency: 'Emergencia', grooming: 'Peluquería', boarding: 'Hospedaje',
    follow_up: 'Seguimiento', other: 'Otro',
  };

  return {
    appointmentsToday: apptsTotal,
    appointmentsTodayStatuses: apptsByStatus,
    clientsTotal: clientsCount,
    patientsTotal: patientsCount,
    revenueToday,
    revenueMonth,
    upcomingAppointments: upcoming.map(a => ({
      id: a.id,
      time: a.startTime.slice(0, 5),
      patientName: a.patientName,
      clientName: a.clientName,
      type: typeLabels[a.type] || a.type,
      status: a.status,
    })),
    recentActivity: activity,
  };
});
