// ===================================================
// ARQUIVO: src/lib/supabaseServer.ts
// ===================================================

// lib/supabaseServer.ts
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
// CORRIGIDO: Importar apenas cookies, remover headers
import { cookies } from "next/headers"; 

export function createServerSupabaseClient() {
  return createServerComponentClient({
    cookies,
    // A propriedade 'headers' foi removida pois não é mais aceita
  });
}
