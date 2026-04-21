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
      setError("Campos incompletos");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("El formato del correo no es válido");
      return;
    }

    setCargando(true);

    try {
      await configurarPersistencia(recordarme);
      const cred = await autenticarUsuario(correo, contrasena);
      setUsuario({ email: cred.user.email ?? "" });
    } catch (e: any) {
      setError(e.message ?? "Error al iniciar sesión");
    } finally {
      setCargando(false);
    }
  }

  async function salir() {
    await cerrarSesionUsuario();
    setUsuario(null);
    setCorreo("");
    setContrasena("");
    setRecordarme(false);
    setError("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-linear-30 from-blue-500 to-gray-950">
      <section className="w-full max-w-md rounded-4xl bg-white border-gray-500 border-8 py-5 px-7 hover:border-blue-400 hover:shadow-2xl hover:scale-105 transition duration-300">
        <div>
          <h1 className="w-full text-center text-2xl font-extrabold italic text-blue-700 my-2">Acceso escolar</h1>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso}>
            <div className="flex flex-col my-3">
              <label htmlFor="correo" className="font-medium mr-2">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="font-bold text-sm px-2 py-1 max-w-full rounded-4xl bg-white border-gray-600 border-2 hover:border-blue-500 hover:text-blue-500"
              />
            </div>

            <div className="flex flex-col my-3 ml-auto">
              <label htmlFor="contrasena" className="font-medium mr-2">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                className="font-bold text-sm px-2 py-1 max-w-full rounded-4xl bg-white border-gray-600 border-2 hover:border-blue-500 hover:text-blue-500 mr-2"
              />
            </div>

            <label >
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
              />
              Recordarme
            </label>

            {error ? <div className="bg-red-100 border-1 border-red-500 py-1 my-2 rounded-sm text-red-600 w-full text-center">{error}</div> : null}

            <button type="submit" disabled={cargando} className="w-full py-2 rounded-4xl my-3 bg-gray-200 font-black italic hover:bg-blue-500 hover:text-white">
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div>
            <div className="bg-emerald-50 rounded-sm py-3">
              <p className="text-center font-extrabold bg-emerald-600 text-white rounded-4xl mb-3">Inicio de sesión correcto</p>
              <h2 className="w-full text-center text-emerald-600 font-bold">Bienvenido, {usuario.email}</h2>
            </div>

            <button type="button" onClick={salir} className="w-full rounded-4xl font-black italic bg-gray-200 py-2 hover:bg-red-500 hover:text-white my-3">
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}