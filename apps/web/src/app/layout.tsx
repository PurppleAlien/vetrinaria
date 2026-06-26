import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vetrinaria - Sistema de Gestión Veterinaria',
  description: 'Sistema integral para la gestión de clínicas veterinarias',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Providers>{children}</Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
export const dynamic = "force-dynamic";
