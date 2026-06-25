'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DogIcon, CatIcon, PawPrintIcon } from '@/components/pet-icons';
import { ThemeColorSwitcher } from '@/components/theme-color-switcher';
import { useTheme } from 'next-themes';
import { Sun, Moon, Heart, Shield } from 'lucide-react';

const floatingPets = [
  { Icon: DogIcon, delay: 0, x: '10%', y: '20%', size: 40 },
  { Icon: CatIcon, delay: 1, x: '85%', y: '15%', size: 36 },
  { Icon: DogIcon, delay: 2, x: '80%', y: '75%', size: 32 },
  { Icon: CatIcon, delay: 0.5, x: '15%', y: '70%', size: 38 },
  { Icon: DogIcon, delay: 1.5, x: '50%', y: '10%', size: 28 },
  { Icon: CatIcon, delay: 2.5, x: '45%', y: '85%', size: 30 },
];

export default function LoginPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useState(() => { setMounted(true); });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Credenciales inválidas');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden">
      <ThemeColorSwitcher />

      <motion.button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="fixed top-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-card border shadow-sm cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {mounted && theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </motion.button>

      {floatingPets.map((pet, i) => (
        <motion.div
          key={i}
          className="absolute z-0"
          style={{ left: pet.x, top: pet.y }}
          animate={{
            y: [0, -15, 0, 10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: pet.delay,
            ease: "easeInOut",
          }}
        >
          <div className="opacity-30 dark:opacity-20">
            <pet.Icon size={pet.size} />
          </div>
        </motion.div>
      ))}

      <motion.div
        className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center p-12"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 animate-gradient bg-gradient-to-br from-primary/20 via-primary/5 to-background" />
        <div className="relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-8"
          >
            <div className="flex items-center justify-center gap-4">
              <DogIcon size={64} />
              <Heart className="h-8 w-8 text-primary animate-pulse" />
              <CatIcon size={64} />
            </div>
          </motion.div>
          <motion.h1
            className="mb-4 text-4xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Vetrinaria
          </motion.h1>
          <motion.p
            className="mb-8 text-lg text-muted-foreground max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Sistema integral para la gestión de tu clínica veterinaria
          </motion.p>
          <motion.div
            className="grid grid-cols-3 gap-4 max-w-sm mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: Shield, label: 'Gestión Clínica' },
              { icon: PawPrintIcon, label: 'Pacientes' },
              { icon: Heart, label: 'Cuidado' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center gap-2 rounded-xl border bg-card/50 p-4 backdrop-blur-sm"
                whileHover={{ y: -5, scale: 1.05 }}
              >
                <item.icon className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="mt-8 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="text-primary/30"
                animate={{ y: [0, -5, 0], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              >
                <PawPrintIcon size={16} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="flex w-full lg:w-1/2 items-center justify-center p-6 relative z-10"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-8 text-center lg:hidden">
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <DogIcon size={40} />
              <CatIcon size={40} />
            </motion.div>
            <h1 className="text-2xl font-bold">Vetrinaria</h1>
          </div>

          <Card className="border-2 shadow-xl">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <PawPrintIcon className="h-7 w-7 text-primary" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
              <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" name="email" type="email" placeholder="correo@ejemplo.com" required className="transition-all focus:ring-2 focus:ring-primary/50" />
                </motion.div>
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      required
                      className="transition-all focus:ring-2 focus:ring-primary/50 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
                    >
                      {showPassword ? 'OCULTAR' : 'MOSTRAR'}
                    </button>
                  </div>
                </motion.div>
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-destructive text-center"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
                <motion.div
                  className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground space-y-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="font-medium text-foreground">Credenciales de prueba:</p>
                  <p>Admin: <span className="font-mono">admin@vetrinaria.app</span> / <span className="font-mono">admin123</span></p>
                  <p>Vet: <span className="font-mono">maria@vetrinaria.app</span> / <span className="font-mono">admin123</span></p>
                </motion.div>
              </CardContent>
              <CardFooter>
                <motion.div
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    type="submit"
                    className="w-full relative overflow-hidden group cursor-pointer"
                    disabled={loading}
                  >
                    <motion.span
                      className="relative z-10"
                      animate={loading ? { opacity: 0 } : { opacity: 1 }}
                    >
                      {loading ? 'Ingresando...' : 'Ingresar'}
                    </motion.span>
                    {loading && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <motion.div
                          className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      </motion.div>
                    )}
                    {!loading && (
                      <motion.div
                        className="absolute inset-0 bg-white/10"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Button>
                </motion.div>
              </CardFooter>
            </form>
          </Card>

          <motion.p
            className="mt-6 text-center text-xs text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            &copy; {new Date().getFullYear()} Vetrinaria. Todos los derechos reservados.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}
