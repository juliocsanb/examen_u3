"use client";

import { useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/client";
import { getDisplayName } from "next/dist/shared/lib/utils";
import { signInWithEmailAndPassword } from "firebase/auth";
type AuthUser = {
  email: string;
};

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}
export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [bienvenida, setBienvenida]=useState(false);
  const tituloBoton = useMemo(() => (cargando ? "Cargando..." : "Acceder"), [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
try{
   const resultado = await signInWithEmailAndPassword(auth, correo, contrasena);
  setBienvenida(true);
}catch (error){
 console.log("Error al iniciar sesión:", error); 
 setError("No se pudo iniciar sesión. Verifica tu correo y contraseña");
}
console.log({
  correo: correo,
  contrasena: contrasena
});
}


  async function salir() {
    // TODO: cerrar sesión en Firebase.
    // TODO: limpiar el usuario en estado.
    // TODO: limpiar formulario si se desea.
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <section className="w-full max-w-md">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px]"/>
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-500/15 blur-[120px]" />
          <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">Acceso escolar</h1>
          <p className="mt-1.5 text-sm text-slate-400">INSTITUTO TECNOLOGICO DE TOLUCA</p>
        </div>
        
        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-5">
            <div>
              <label htmlFor="correo" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

              <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
             className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-orange-500 focus:ring-orange-500/20 accent-orange-500 cursor-pointer"
              />
              <label htmlFor="recordarme" className="text-sm text-slate-300 cursor-pointer select-none">
                  Recordarme
                </label>
                </div>
            {error ? <div>{error}</div> : null}
            

            <button 
            type="submit" 
            disabled={cargando} 
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-400/40 disabled:opacity-50">
              {tituloBoton}
            </button>
             {bienvenida && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                <div className="bg-[#0047a7] border border-gray-800 p-8 rounded-xl max-w-md text-center shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-3">
                    BIENVENIDO ALUMNO!!!
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Registro Exitoso al{" "}
                    <span className="font-semibold text-white">
                      Acceso a la pagina escolar
                    </span>
                  </p>
                </div>
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <p className="text-sm font-medium text-emerald-400">Inicio de sesión correcto</p>
              <h2 className="mt-1 text-lg font-bold text-white">Bienvenido, {usuario.email}</h2>
            </div>

            <button 
            type="button" 
            onClick={salir} 
            className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700 shadow-lg shadow-red-600/20"
            >
              Cerrar sesión 
            </button>
          </div>
        )}
        </div>
      </section>
    </main>
  ); }