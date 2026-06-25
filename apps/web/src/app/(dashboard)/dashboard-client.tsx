'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, PawPrint, DollarSign, ArrowRight, Activity } from 'lucide-react';
import { DogIcon, CatIcon, PawPrintIcon } from '@/components/pet-icons';
import type { DashboardMetrics } from '@/lib/actions/dashboard';

const iconMap: Record<string, React.ElementType> = {
  Calendar, Users, PawPrint, DollarSign,
};

interface CardData {
  title: string;
  value: string | number;
  icon: string;
  href: string;
  description: string;
  color: string;
  iconColor: string;
}

interface Props {
  cards: CardData[];
  metrics: DashboardMetrics;
  statusLabels: Record<string, string>;
  statusColors: Record<string, string>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
} as const;

export function AnimatedDashboardClient({ cards, metrics, statusLabels, statusColors }: Props) {
  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <DogIcon size={28} />
            </motion.div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <CatIcon size={28} />
            </motion.div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Bienvenido de vuelta</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
      >
        {cards.map((stat) => {
          const Icon = iconMap[stat.icon];
          return (
            <motion.div key={stat.title} variants={itemVariants} whileHover={{ y: -5, scale: 1.02 }}>
              <Link href={stat.href}>
                <Card className="relative overflow-hidden cursor-pointer transition-shadow hover:shadow-lg">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color}`} />
                  <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {Icon && (
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className={`h-4 w-4 ${stat.iconColor}`} />
                      </motion.div>
                    )}
                  </CardHeader>
                  <CardContent className="relative">
                    <motion.div
                      className="text-2xl font-bold"
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    >
                      {stat.value}
                    </motion.div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-7"
        variants={itemVariants}
      >
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Próximas Citas
            </CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/appointments">Ver todas <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {metrics.upcomingAppointments.length === 0 ? (
              <motion.p
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                No hay citas programadas.
              </motion.p>
            ) : (
              <motion.div className="space-y-3" variants={containerVariants}>
                {metrics.upcomingAppointments.map((a, i) => (
                  <motion.div
                    key={a.id}
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      href={`/appointments`}
                      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 group"
                    >
                      <motion.div
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
                        whileHover={{ scale: 1.1 }}
                      >
                        {a.time}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate flex items-center gap-1">
                          <PawPrintIcon size={12} />
                          {a.patientName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{a.clientName} · {a.type}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${statusColors[a.status] ?? ''}`}>
                        {statusLabels[a.status] || a.status}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" /> Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin actividad reciente.</p>
            ) : (
              <motion.div className="space-y-3" variants={containerVariants}>
                {metrics.recentActivity.map((a, i) => (
                  <motion.div
                    key={`${a.type}-${a.id}-${i}`}
                    variants={itemVariants}
                    className="flex items-start gap-2 text-sm group"
                  >
                    <motion.div
                      className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                        a.type === 'client' ? 'bg-blue-500' : a.type === 'patient' ? 'bg-green-500' : 'bg-amber-500'
                      }`}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm">{a.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(a.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="fixed bottom-6 left-24 opacity-10 pointer-events-none hidden lg:block"
        animate={{ y: [0, -8, 0], rotate: [0, 3, 0, -3, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <PawPrintIcon size={32} />
      </motion.div>
    </motion.div>
  );
}
