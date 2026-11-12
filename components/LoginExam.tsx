"use client";

import { useMemo, useState } from "react";

import {
  autenticarUsuario
} from "@/firebase/auth";



function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [mostrarAviso, setMostrarAviso] = useState(false);
  

const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: limpiar errores previos.
    // TODO: validar campos vacíos.
    // TODO: validar formato de correo.
    // TODO: activar estado de carga.
    // TODO: configurar persistencia según recordarme.
    // TODO: autenticar usuario.
    // TODO: guardar usuario autenticado en estado.
    // TODO: limpiar estado de carga.
    // TODO: manejar errores y mostrarlos en pantalla.
    if (cargando) return;

    setError("");

    if (!correo.trim() || !contrasena) {
      setError("Completa el correo y la contraseña.");
      return;
    }

    if (!esCorreoValido(correo.trim())) {
      setError("El correo no tiene un formato válido.");
      return;
    }

    setCargando(true);

       try {
      const resultado = await autenticarUsuario(correo.trim(), contrasena);
      alert(`Bienvenido, ${resultado.user.email ?? correo.trim()}`);
      setMostrarAviso(true);
    } catch (err) {
      console.log("Error de Firebase Auth: ", err);
      setError("No se pudo iniciar sesión. Revisa tus credenciales.");
    } finally {
      setCargando(false);
    }
  }   
  
  

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <main className="flex-grow flex items-center justify-center px-4 py-8">
        <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="h-1.5 bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#F97316]" />

          <div className="p-8 sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-[#00236f] shadow-md">
  <svg viewBox="0 0 24 24" fill="white" className="h-8 w-8">
    <path d="M12 3 1 9l11 6 9-4.91V17h2V9L12 3Zm-6 9.18V16c0 1.66 2.69 3 6 3s6-1.34 6-3v-3.82l-6 3.27-6-3.27Z" />
  </svg>
</div>
              <h1 className="text-2xl font-bold tracking-tight text-[#00236f]">
                Instituto Tecnológico de Toluca
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Ingresa tus credenciales para acceder a la plataforma.
              </p>
            </div>

          
              <form onSubmit={procesarAcceso} noValidate className="space-y-4">
                <div>
                  <label htmlFor="correo" className="mb-1.5 block text-sm font-medium text-slate-800">
                    Correo electrónico
                  </label>
                  <input
                    id="correo"
                    type="email"
                    value={correo}
                    onChange={(event) => setCorreo(event.target.value)}
                    placeholder="alumno@correo.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-600/15"
                  />
                </div>

                <div>
                  <label htmlFor="contrasena" className="mb-1.5 block text-sm font-medium text-slate-800">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-20 text-slate-900 placeholder-slate-400 outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-blue-600/15"
                      id="contrasena"
                      type={mostrar ? "text" : "password"}
                      value={contrasena}
                      onChange={(event) => setContrasena(event.target.value)}
                      placeholder="******"
                      
                    />
                    <button
                      className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-[#0051d5] hover:text-[#00236f]"
                      type="button"
                      onClick={() => setMostrar((v) => !v)}
                      
                    >
                      {mostrar ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>
                {error ? (
                  <div role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={cargando}
                  className="w-full rounded-lg bg-[#F97316] px-6 py-3 font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-[#EA580C] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {tituloBoton}
                </button>
              </form>
          
          
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
        © 2026 Instituto Tecnológico de Toluca. Todos los derechos reservados.
      </footer>
      {mostrarAviso && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
    <div className="w-full max-w-sm rounded-2xl bg-[#00236f] p-8 text-center text-white shadow-2xl">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-3xl">
        ✓
      </div>
      <h3 className="text-xl font-bold">¡Bienvenido!</h3>
      <p className="mt-2 text-sm text-blue-100">
        Inicio de sesión exitoso
      </p>
      <p className="mt-1 break-all text-sm font-semibold">{correo}</p>
      <button
        type="button"
        onClick={() => setMostrarAviso(false)}
        className="mt-6 w-full rounded-lg bg-[#F97316] px-6 py-2.5 font-bold text-white transition hover:bg-[#EA580C]"
      >
        Aceptar
      </button>
    </div>
  </div>
)}
      
    </div>
  );
}