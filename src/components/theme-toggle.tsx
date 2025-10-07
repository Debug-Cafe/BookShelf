'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// CORRIGIDO: Definição do tipo Theme para resolver o erro de tipagem
type Theme = 'light' | 'dark' | 'system';

const options = [
  {
    value: 'light',
    label: 'Claro',
    icon: <Sun className="mr-2 h-4 w-4" />,
  },
  {
    value: 'dark',
    label: 'Escuro',
    icon: <Moon className="mr-2 h-4 w-4" />,
  },
  {
    value: 'system',
    label: 'Sistema',
    icon: <Monitor className="mr-2 h-4 w-4" />,
  },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="lg" className="h-10 w-10 px-0 relative">
          {/* Ícones sobrepostos com animação */}
          <Sun className="h-[1.5rem] w-[1.5rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.5rem] w-[1.5rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="mt-2">
        {options.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            // CORRIGIDO: Adicionado 'as Theme' para resolver o erro de tipagem
            onClick={() => setTheme(opt.value as Theme)} 
          >
            {opt.icon}
            <span className="text-lg">{opt.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
