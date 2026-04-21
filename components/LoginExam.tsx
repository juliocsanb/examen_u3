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
    if (correo.trim() === "" || contrasena.trim() === "") {
      setError("Por favor, completa todos los campos.");
      return;
    }
    // TODO: validar formato de correo.
    if (!esCorreoValido(correo)) {
      setError("El formato del correo no es válido.");
      return;
    }
    // TODO: activar estado de carga.
    setCargando(true);
    try {
      // TODO: configurar persistencia según recordarme.
      await configurarPersistencia(recordarme);
      //autenticar usuario con Firebase
      const credencial = await autenticarUsuario(correo, contrasena);
      // TODO: guardar usuario autenticado en estado.
      if (credencial.user.email) {
        setUsuario({ email: credencial.user.email });
      }
    } catch (err) {// TODO: manejar errores y mostrarlos en pantalla.
      console.error(err);
      setError("Correo o contraseña incorrectos. Verifica tus datos.");
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
    } catch (err) {
      console.error("Error al cerrar sesión", err);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F4F6F8] px-4 font-sans">
      <section className="w-full max-w-95 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="text-center mb-6">
          <h1 className="text-xl font-bold text-[#111827] mb-1">Acceso escolar</h1>
          <p className="text-[11px] text-gray-500">Completa la funcionalidad de inicio de sesión.</p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="flex flex-col gap-4">
            <div>
              <label htmlFor="correo" className="block text-[11px] font-medium text-gray-600 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label htmlFor="contrasena" className="block text-[11px] font-medium text-gray-600 mb-1.5">
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="••••••"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-400 placeholder:text-gray-400"
              />
            </div>

            <div className="flex items-center gap-2 mt-1 mb-1">
              <input
                id="recordarme"
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
                className="h-3 w-3 text-[#111827] border-gray-300 rounded focus:ring-[#111827] cursor-pointer"
              />
              <label htmlFor="recordarme" className="text-[11px] text-gray-600 cursor-pointer">
                Recordarme
              </label>
            </div>

            {error && (
              <div className="bg-[#FEF2F2] text-[#DC2626] py-2 px-3 rounded-md text-[11px]">
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={cargando} 
              className="w-full bg-[#111827] text-white text-xs font-medium py-2.5 rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed mt-1"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-[#ECFDF5] py-4 px-2 rounded-md border border-[#D1FAE5] text-center flex flex-col gap-1">
              <p className="text-[11px] text-[#065F46]">Inicio de sesión correcto</p>
              <h2 className="text-sm font-bold text-[#064E3B]">Bienvenido, {usuario.email}</h2>
            </div>

            <button 
              type="button" 
              onClick={salir} 
              className="w-full bg-[#111827] text-white text-xs font-medium py-2.5 rounded-md hover:bg-gray-800 transition-colors mt-2"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}