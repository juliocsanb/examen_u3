"use client";

import { useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";

//
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
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);

  const tituloBoton = useMemo(() => {
  return cargando ? "Entrando..." : "Entrar";
}, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const correoSinEspacioso = correo.trim();

    setError(""); //borrar errores 
    //campos vacios 
    if (!correoSinEspacioso || !contrasena) {
      setError("Completa el correo y la contrasena");
      return;
    }
    //correo valido 
    if (!esCorreoValido(correoSinEspacioso)) {
      setError("Ingresa un correo electronico valido.");
      return;
    }
    //estado carga 
    setCargando(true);

    try {
      await configurarPersistencia(recordarme);
      const credencial = await autenticarUsuario(
        correoSinEspacioso,
        contrasena,
      );

      setCorreo(correoSinEspacioso);
      setUsuario({
        email: credencial.user.email ?? correoSinEspacioso,
      });
      } catch {
        setError(" error al iniciar sesión");
      } finally {
      setCargando(false);
    }
  }

  async function salir() {
  try {
    await cerrarSesionUsuario(); //cerrar sesion en firebase
    setUsuario(null); //limpiar estado de usuario
    setContrasena("");
    setCorreo(""); //borar campos 
  } catch {
    setError("Error al cerrar sesion");
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center bg-pink-100 px-4 py-10">
      <section className="w-full max-w-md rounded-3xl border border-white bg-white p-8 shadow-xl">
        <div className="mb-8 space-y-3 text-center">
          <span className="inline-flex rounded-full bg-pink-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">
            EXAMEN TANIA CORTES 
          </span>
          <h1 className="text-3xl  tracking-tight text-black">
            Acceso a cuenta
          </h1>
          <p className="text-sm leading-6 text-black">
            inicia sesion con tu cuenta de firebase
          </p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="correo">
                Correo electronico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="NoControl@web218500.com"
                autoComplete="email"
                disabled={cargando} // deshabilitar campo mientras se procesa el acceso
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label htmlFor="contrasena">
                Contrasena
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                disabled={cargando}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <label className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                disabled={cargando}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Recordarme
            </label>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center">
            <div className="space-y-3 rounded-[24px] bg-pink-100 px-5 py-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-300">
                Inicio de sesion correcto
              </p>
              <h2 className="text-xl tracking-tight text-black">
                Bienvenido, {usuario.email}
              </h2>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={salir}
              disabled={cargando}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cargando ? "Cerrando sesion..." : "Cerrar sesion"}
            </button>
          </div>
        )}
      </section>
    </main>
  );
}