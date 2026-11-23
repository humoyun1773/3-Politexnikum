import React from 'react';
import { NavLink } from 'react-router-dom';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/common/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
      <SEO title="404 - Sahifa topilmadi" description="Siz qidirayotgan sahifa mavjud emas." />

      <div className="space-y-4 max-w-md">
        <div className="h-20 w-20 rounded-3xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-amber-500" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">404</h1>
        <h2 className="text-xl font-bold text-foreground">Sahifa topilmadi</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Siz tashrif buyurmoqchi bo'lgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <NavLink to="/dashboard">
            <Button variant="gradient" className="rounded-xl text-xs sm:text-sm gap-2">
              <Home className="h-4 w-4" /> Bosh sahifaga qaytish
            </Button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
