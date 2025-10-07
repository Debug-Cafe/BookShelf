'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import { supabase } from '@/lib/supabaseClient'; // Import do Supabase

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isSmallLogo, setIsSmallLogo] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShowPlaceholder(window.innerWidth >= 450);
      setIsSmallLogo(window.innerWidth < 430);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAuthPage = pathname === "/" || pathname === "/cadastro";
  const isCatalogPage = pathname === "/catalogo";

  if (isAuthPage) {
    return (
      <nav className="w-full bg-[var(--background)] text-[var(--foreground)] relative">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-center items-center h-16">
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <BookOpen size={28} />
            <span className="text-2xl font-bold">CaféBooks</span>
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-[var(--card-background)] text-[var(--foreground)] shadow-lg relative">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center h-16 w-full">

        {/* LOGO */}
        <Link href="/catalogo" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition flex-shrink-0">
          <BookOpen size={isSmallLogo ? 22 : 28} />
          <span className={`font-bold ${isSmallLogo ? 'text-xl' : 'text-2xl'}`}>CaféBooks</span>
        </Link>

        {/* LINKS + PESQUISA */}
        <div className="flex-1 flex items-center gap-4 ml-6">
          {!menuOpen && (
            <div className="hidden sm:flex flex-1 justify-center items-center gap-6">
              <Link href="/catalogo" className="text-base xl:text-lg font-medium hover:text-[var(--primary)] transition">Catálogo</Link>
              <Link href="/Dashboard" className="text-base xl:text-lg font-medium hover:text-[var(--primary)] transition">Dashboard</Link>
            </div>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded hover:bg-[var(--form-background)] sm:hidden flex-shrink-0"
            aria-label="Abrir menu"
          >
            <Menu size={28} />
          </button>

          {isCatalogPage && (
            <div className="relative flex items-center bg-[#f5e6d5] rounded-lg px-3 py-2 flex-1 max-w-[calc(100%-60px)] sm:max-w-[450px]">
              <input
                type="text"
                placeholder={showPlaceholder ? "Buscar..." : ""}
                className="bg-transparent outline-none w-full text-base placeholder:text-gray-600 text-gray-900"
              />
              <Search size={20} className="ml-2 text-gray-900" />
            </div>
          )}
        </div>

        {/* BOTÕES À DIREITA */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-4">
          <ThemeToggle />
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/"; // redireciona para página inicial/login
            }}
            className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-1.5 px-3 rounded"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col bg-[var(--card-background)] border-t border-gray-200 px-4 py-2 gap-3">
          <Link href="/catalogo" className="hover:text-[var(--primary)]">Catálogo</Link>
          <Link href="/Dashboard" className="hover:text-[var(--primary)]">Dashboard</Link>
        </div>
      )}
    </nav>
  );
}
