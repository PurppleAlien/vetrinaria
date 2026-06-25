import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getDashboardMetrics } from '@/lib/actions/dashboard';
import { AnimatedDashboardClient } from './dashboard-client';

const statusLabels: Record<string, string> = {
  scheduled: 'Programada', confirmed: 'Confirmada', checked_in: 'Checó entrada',
  in_exam: 'En consulta', checked_out: 'Terminada', cancelled: 'Cancelada', no_show: 'No asistió',
};
const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  confirmed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  checked_in: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  no_show: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect('/auth/login');

  const metrics = await getDashboardMetrics();

  const cards = [
    {
      title: 'Citas Hoy', value: metrics.appointmentsToday,
      icon: 'Calendar', href: '/appointments',
      description: `${metrics.appointmentsTodayStatuses['scheduled'] ?? 0} pendientes`,
      color: 'from-blue-500/20 to-blue-500/5',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Clientes', value: metrics.clientsTotal,
      icon: 'Users', href: '/clients',
      description: 'registrados',
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Pacientes', value: metrics.patientsTotal,
      icon: 'PawPrint', href: '/patients',
      description: 'activos',
      color: 'from-purple-500/20 to-purple-500/5',
      iconColor: 'text-purple-500',
    },
    {
      title: 'Ingresos Hoy', value: `$${metrics.revenueToday.toFixed(2)}`,
      icon: 'DollarSign', href: '/invoices',
      description: `$${metrics.revenueMonth.toFixed(2)} este mes`,
      color: 'from-amber-500/20 to-amber-500/5',
      iconColor: 'text-amber-500',
    },
  ];

  return (
    <AnimatedDashboardClient cards={cards} metrics={metrics} statusLabels={statusLabels} statusColors={statusColors} />
  );
}
