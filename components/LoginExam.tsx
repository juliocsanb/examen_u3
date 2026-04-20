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

    // TODO: limpiar errores previos.
    setError("");
    // TODO: validar campos vacíos.
    if (!correo || !contrasena) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    // TODO: validar formato de correo.
    if (!esCorreoValido(correo)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }
    // TODO: activar estado de carga.
    setCargando(true);
    // TODO: configurar persistencia según recordarme.
    setCargando(true);
    try {
      await configurarPersistencia(recordarme);
      // TODO: autenticar usuario.
      const credencial = await autenticarUsuario(correo, contrasena);
      // TODO: guardar usuario autenticado en estado.
      setUsuario({ email: credencial.user.email ?? "" });

      // TODO: limpiar estado de carga.
      setCorreo("");
      setContrasena("");
      // TODO: manejar errores y mostrarlos en pantalla.
    } catch (e: any) {
      setError(e.message ?? "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    // TODO: cerrar sesión en Firebase.
    await cerrarSesionUsuario();
    // TODO: limpiar el usuario en estado.
    setUsuario(null);
    // TODO: limpiar formulario si se desea.
    setCorreo("");
    setContrasena("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Acceso escolar</h1>
          <p className="text-sm text-gray-500 mt-1">Llene los campos requeridos</p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-4">

            <div className="flex flex-col gap-1">
              <label htmlFor="correo" className="text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="contrasena" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                className="accent-black"
              />
              Recordarme
            </label>

            {error ? (
              <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg px-3 py-2">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-black text-white font-semibold rounded-lg py-2 hover:bg-gray-800 disabled:opacity-50 transition"
              >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3">

              <p className="text-sm text-green-600">Inicio de sesión correcto</p>
              <h2 className="text-lg font-bold text-gray-800 mt-1">Bienvenido, {usuario.email}</h2>
            </div>

            <button
            type="button"
            onClick={salir}
            className="w-full bg-black text-white font-semibold rounded-lg py-2 hover:bg-gray-800 transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}

    </section>
  </main>
);
}