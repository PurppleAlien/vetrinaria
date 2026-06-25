import { Sidebar } from '@/components/sidebar';
import { Navbar } from '@/components/navbar';
import { ThemeColorSwitcher } from '@/components/theme-color-switcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
      <ThemeColorSwitcher />
    </div>
  );
}
