"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const [esAdmin, setEsAdmin] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function verificarRol() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCargando(false); return; }

      const { data } = await supabase
        .from("user_roles")
        .select("rol")
        .eq("user_id", user.id)
        .single();

      if (data?.rol === "admin") setEsAdmin(true);
      setCargando(false);
    }
    verificarRol();
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="flex justify-between items-center px-20 py-7 border-b border-slate-800 bg-slate-950">
      <Link href="/inicio">
        <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">Proyecto Integrador</p>
        <h1 className="text-white text-2xl font-bold mt-0.5">Everwood Cloud</h1>
      </Link>
      <nav className="flex gap-6 items-center">
        <Link href="/inicio" className="text-slate-400 hover:text-white text-sm font-medium transition">Inicio</Link>
        <Link href="/historial" className="text-slate-400 hover:text-white text-sm font-medium transition">Historial</Link>
        <Link href="/metricas" className="text-slate-400 hover:text-white text-sm font-medium transition">Métricas</Link>
        {!cargando && esAdmin && (
          <Link href="/admin" className="text-slate-400 hover:text-white text-sm font-medium transition">Admin</Link>
        )}
        <button
          onClick={cerrarSesion}
          className="border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium px-5 py-2 rounded-xl text-sm transition"
        >
          Cerrar sesión
        </button>
      </nav>
    </header>
  );
}