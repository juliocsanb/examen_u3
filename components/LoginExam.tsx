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
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [mostrarCuadroBienvenida, setCuadroBienvenida] = useState(false);
  const [numeroControl, setNumeroControl] = useState("");

  const tituloBoton = useMemo(() => {
    return cargando ? "Iniciando sesión..." : "Ingresar a mi cuenta";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    setError("");
    event.preventDefault();

    if (correo.trim() === "" || contrasena.trim() === "") {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("El formato del correo electrónico no es válido.");
      return;
    }

    setCargando(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        correo.trim(),
        contrasena,
      );

      const numControlExtraido = correo.trim().split("@")[0];
      setNumeroControl(numControlExtraido);

      setCuadroBienvenida(true);
      setUsuario({ email: result.user.email || correo.trim() });
    } catch (error) {
      console.log("Error de firebase, contacta la administrador", error);
      setError("Credenciales incorrectas. Revisa tu correo y contraseña.");
    } finally {
      setCargando(false);
    }

    console.log({ correo, contrasena });
  }

  async function salir() {
    setUsuario(null);
    setCuadroBienvenida(false);
    setCorreo("");
    setContrasena("");
    setError("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 font-sans">
      <section className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-12 overflow-hidden relative">
        {/* Adorno superior sutil */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

        <div className="flex flex-col items-center text-center mb-10">
          <div className="bg-blue-50 p-4 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              ></path>
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Portal Estudiantil
          </h1>
          <p className="text-slate-500 mt-2 text-sm leading-relaxed max-w-xs">
            Ingresa tus credenciales institucionales para acceder a tus
            servicios.
          </p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-6">
            <div className="space-y-5">
              {/* Grupo Correo */}
              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                      />
                    </svg>
                  </div>
                  <input
                    id="correo"
                    type="email"
                    required
                    value={correo}
                    onChange={(event) => setCorreo(event.target.value)}
                    placeholder="ejemplo: 1234567@alumno.com"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Grupo Contraseña */}
              <div>
                <label
                  htmlFor="contrasena"
                  className="block text-sm font-semibold text-slate-700 mb-1.5"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    id="contrasena"
                    type="password"
                    required
                    value={contrasena}
                    onChange={(event) => setContrasena(event.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Fila Opciones */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={recordarme}
                    onChange={(event) => setRecordarme(event.target.checked)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded bg-white checked:bg-blue-600 checked:border-blue-600 cursor-pointer transition-all"
                  />
                  <svg
                    className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                  Recordar mis datos
                </span>
              </label>
              <a
                href="#"
                className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Área de Errores */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 animate-pulse">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Botón Principal */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold text-base py-3.5 px-4 rounded-xl shadow-[0_4px_14px_0_rgb(15,23,42,0.39)] hover:shadow-[0_6px_20px_rgba(15,23,42,0.23)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {cargando ? (
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : null}
              {tituloBoton}
            </button>

            {/* Modal de Bienvenida Rediseñado */}
            {mostrarCuadroBienvenida && (
              <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4 transition-opacity">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-6 py-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <svg
                        className="w-8 h-8 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-wide">
                      ¡Acceso Concedido!
                    </h3>
                  </div>

                  <div className="p-6 text-center">
                    <p className="text-slate-600 mb-2">
                      Bienvenido al portal institucional.
                    </p>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 my-6">
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">
                        Tu Número de Control
                      </p>
                      <p className="text-3xl font-black text-slate-800 tracking-wider">
                        {numeroControl}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCuadroBienvenida(false)}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      Continuar al panel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        ) : (
          /* Estado Sesión Iniciada (Desconectarse) */
          <div className="mt-6 text-center space-y-8 animate-fade-in-up">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 text-blue-100">
                <svg
                  className="w-32 h-32"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="relative z-10">
                <h2 className="text-lg font-semibold text-blue-900 mb-1">
                  Sesión Activa
                </h2>
                <p className="text-slate-600 text-sm">
                  Autenticado correctamente como:
                </p>
                <p className="font-bold text-slate-800 mt-2 text-lg truncate">
                  {usuario.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={salir}
              className="w-full group relative flex justify-center py-3.5 px-4 border-2 border-slate-200 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-red-200 hover:text-red-600 transition-all duration-200 active:scale-[0.98]"
            >
              Cerrar Sesión Segura
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
