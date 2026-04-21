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
      if (!correo.trim() || !contrasena.trim()) {
    setError("Por favor completa todos los campos.");
    return;
  }

    // TODO: validar formato de correo.
      if (!esCorreoValido(correo)) {
    setError("Por favor ingresa un correo electrónico válido.");
    return;
  }
    // TODO: activar estado de carga.
    setCargando(true);

    try {
    // TODO: configurar persistencia según recordarme.
    await configurarPersistencia(recordarme);

    // TODO: autenticar usuario.
    const credencial = await autenticarUsuario(correo, contrasena);

    // TODO: guardar usuario autenticado en estado.
    setUsuario({ email: credencial.user.email || "Usuario sin correo" });
  } catch (err: unknown) {

    // TODO: manejar errores y mostrarlos en pantalla.
    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Ocurrió un error durante el inicio de sesión.");
    }
  } finally {
    // TODO: limpiar estado de carga.
    setCargando(false);
  }
  }

  async function salir() {
    try {
    // TODO: cerrar sesión en Firebase.
    await cerrarSesionUsuario();

    // TODO: limpiar el usuario en estado.
    setUsuario(null);

    // TODO: limpiar formulario si se desea.
    setCorreo("");
    setContrasena("");
    setRecordarme(false);
    setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError("Error al cerrar sesión: " + err.message);
      } else {
        setError("Error al cerrar sesión.");
      }
  }
}

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-gray-100">
      <section className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h1 className="font-bold text-xl text-black">Acceso escolar</h1>
          <p className="text-gray-600 text-sm">Completa la funcionalidad de inicio de sesión.</p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-6">
            <div>
              <label htmlFor="correo" className="block text-black font-medium ">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => {setCorreo(event.target.value); setError("");}}
                placeholder="alumno@correo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-black font-medium ">
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => {setContrasena(event.target.value); setError("");}}
                placeholder="******"
                 className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                className="rounded"
              />
              <span className="text-black">Recordarme</span>
            </label>

            {error ? <div className="text-red-500 text-sm" >{error}</div> : null}

            <button type="submit" disabled={cargando} className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div>
            <div className="text-center">
              <p className="text-green-600 mb-2">Inicio de sesión correcto</p>
              <h2 className="text-black font-medium mb-4">Bienvenido, {usuario.email}</h2>
            </div>

            <button type="button" onClick={salir} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}