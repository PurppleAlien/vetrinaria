'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  Calendar,
  Users,
  PawPrint,
  FileText,
  Syringe,
  Receipt,
  Package,
  Settings,
  MessageSquare,
  ChevronLeft,
  Bell,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DogIcon, CatIcon } from '@/components/pet-icons';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/appointments', label: 'Agenda', icon: Calendar },
  { href: '/clients', label: 'Clientes', icon: Users },
  { href: '/patients', label: 'Pacientes', icon: PawPrint },
  { href: '/medical-records', label: 'Historial Clínico', icon: FileText },
  { href: '/odontogram', label: 'Odontograma', icon: Heart },
  { href: '/vaccinations', label: 'Vacunación', icon: Syringe },
  { href: '/invoices', label: 'Facturación', icon: Receipt },
  { href: '/inventory', label: 'Inventario', icon: Package },
  { href: '/messages', label: 'Mensajes', icon: MessageSquare },
  { href: '/notifications', label: 'Notificaciones', icon: Bell },
];

const bottomItems = [
  { href: '/settings', label: 'Configuración', icon: Settings },
];

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.05, type: "spring" as const, stiffness: 300, damping: 24 },
  }),
};

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      layout
      className={cn(
        'flex flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 relative overflow-hidden',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      <div className="absolute top-2 right-2 opacity-5">
        <DogIcon size={32} />
      </div>
      <div className="absolute bottom-16 left-1 opacity-5">
        <CatIcon size={28} />
      </div>

      <div className="flex h-14 items-center justify-between px-4 relative z-10">
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2 font-semibold group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <PawPrint className="h-5 w-5 text-primary" />
            </motion.div>
            <motion.span
              layout
              className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              Vetrinaria
            </motion.span>
            <Sparkles className="h-3 w-3 text-primary/40" />
          </Link>
        ) : (
          <Link href="/" className="mx-auto group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <PawPrint className="h-5 w-5 text-primary" />
            </motion.div>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn('h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground', collapsed && 'mx-auto')}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>
      <Separator className="bg-sidebar-foreground/10" />
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item, i) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <motion.div
              key={item.href}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 relative group',
                  isActive
                    ? 'font-medium'
                    : 'hover:bg-sidebar-foreground/5',
                  collapsed && 'justify-center px-2',
                )}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-primary/10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-3 w-full">
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className="shrink-0"
                  >
                    <Icon className={cn(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-primary' : 'text-sidebar-foreground/60 group-hover:text-sidebar-foreground',
                    )} />
                  </motion.div>
                  {!collapsed && (
                    <motion.span
                      layout
                      className={cn(isActive ? 'text-sidebar-foreground' : 'text-sidebar-foreground/70')}
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>
      <Separator className="bg-sidebar-foreground/10" />
      <div className="p-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors relative',
                isActive
                  ? 'bg-sidebar-foreground/10 font-medium'
                  : 'hover:bg-sidebar-foreground/5',
                collapsed && 'justify-center px-2',
              )}
              title={collapsed ? item.label : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bottom"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3 w-full">
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-sidebar-foreground/60')} />
                {!collapsed && <span>{item.label}</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
