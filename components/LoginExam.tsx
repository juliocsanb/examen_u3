"use client";

import { useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario,
  configurarPersistencia,
} from "@/firebase/auth";

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

    setError("");

    // Validaciones
    if (!correo.trim() || !contrasena.trim()) {
      setError("Por favor, llena todos los campos.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("El formato del correo no es válido.");
      return;
    }

    setCargando(true);

    try {
      await configurarPersistencia(recordarme);

      // Autenticar usuario con Firebase
      const credenciales = await autenticarUsuario(correo, contrasena);
      
      if (credenciales.user.email) {
        setUsuario({ email: credenciales.user.email });
      }
    } catch (err: unknown) {
      console.error(err);
      
      const firebaseError = err as { code?: string };

      if (firebaseError.code === "auth/invalid-credential" || firebaseError.code === "auth/user-not-found" || firebaseError.code === "auth/wrong-password") {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Ocurrió un error al intentar iniciar sesión.");
      }
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    try {
      // Cerrar sesión en Firebase
      await cerrarSesionUsuario();
      setUsuario(null);
      setCorreo("");
      setContrasena("");
      setError("");
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-sm bg-white p-8 rounded-xl shadow-md border border-gray-100">
        {!usuario ? (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Acceso escolar</h1>
              <p className="text-xs text-gray-500 mt-1">Completa la funcionalidad de inicio de sesión.</p>
            </div>

            <form onSubmit={procesarAcceso} className="space-y-4 flex flex-col">
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  id="correo"
                  type="email"
                  value={correo}
                  onChange={(event) => setCorreo(event.target.value)}
                  placeholder="alumno@correo.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="contrasena"
                  type="password"
                  value={contrasena}
                  onChange={(event) => setContrasena(event.target.value)}
                  placeholder="******"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>

              <div className="flex items-center pt-2">
                <input
                  id="recordarme"
                  type="checkbox"
                  checked={recordarme}
                  onChange={(event) => setRecordarme(event.target.checked)}
                  className="h-4 w-4 text-gray-800 focus:ring-gray-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="recordarme" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Recordarme
                </label>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                  {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={cargando} 
                className={`w-full py-2.5 px-4 mt-4 rounded-lg text-white text-sm font-medium transition-colors ${
                  cargando ? "bg-gray-400 cursor-not-allowed" : "bg-[#0b1121] hover:bg-gray-800"
                }`}
              >
                {tituloBoton}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso escolar</h1>
              <p className="text-xs text-gray-500 mb-6">Ayúdanos a la accesibilidad de este navegador.</p>
              
              <div className="bg-[#e6f4ea] p-4 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">Inicio de sesión correcto</p>
                <h2 className="text-sm font-bold text-[#0b1121]">Bienvenido, {usuario.email}</h2>
              </div>
            </div>

            <button 
              type="button" 
              onClick={salir} 
              className="w-full py-2.5 px-4 bg-[#0b1121] hover:bg-gray-800 text-white text-sm rounded-lg font-medium transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}