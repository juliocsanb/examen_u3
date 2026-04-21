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

    if (!correo || !contrasena) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("El formato del correo no es válido.");
      return;
    }

    setCargando(true);

    try {
      await configurarPersistencia(recordarme);
      const resultado = await autenticarUsuario(correo, contrasena);
      if (resultado.user && resultado.user.email) {
        setUsuario({ email: resultado.user.email });
      }
    } catch (err: any) {
      if (err.code === "auth/invalid-credential") {
        setError("Correo o contraseña incorrectos.");
      } else {
        setError("Error al intentar acceder. Intenta de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    try {
      await cerrarSesionUsuario();
      setUsuario(null);
      setCorreo("");
      setContrasena("");
    } catch (err) {
      setError("No se pudo cerrar la sesión.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <section className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">Acceso</h1>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-4">
            <div>
              <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
              />
            </div>

            <div className="flex items-center">
              <input
                id="recordarme"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
              />
              <label htmlFor="recordarme" className="ml-2 text-sm text-gray-600">Recordarme</label>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors disabled:bg-blue-300"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 font-medium">Inicio de sesión correcto</p>
              <h2 className="text-xl font-bold text-gray-800 mt-2">Bienvenido, {usuario.email}</h2>
            </div>

            <button
              type="button"
              onClick={salir}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md transition-all"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}