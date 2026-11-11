"use client";

import { useMemo, useState } from "react";
import { autenticarUsuario, cerrarSesionUsuario } from "@/firebase/auth";

type AuthUser = {
  email: string;
};

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);

  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!correo.trim() || !contrasena.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("El formato del correo electrónico no es válido.");
      return;
    }

    try {
      setCargando(true);
      const credencial = await autenticarUsuario(correo, contrasena);
      const emailUsuario = credencial.user.email || correo;

      setUsuario({ email: emailUsuario });
      alert(`Bienvenido, ${emailUsuario}`);
    } catch (err: any) {
      console.error(err);
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Correo o contraseña incorrectos.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Inténtalo más tarde.");
      } else {
        setError("Ocurrió un error al iniciar sesión. Verifica tus datos.");
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
      console.error("Error al cerrar sesión", err);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold text-gray-900">Acceso escolar</h1>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} className="space-y-4">
            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="contrasena"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-600 text-sm"
              />
            </div>

            {error ? (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            ) : null}

            {/* Botón color morado/violeta, más grande, redondo y con tipografía estilizada */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-semibold text-base tracking-wide rounded-full shadow-md shadow-purple-600/20 transition-all disabled:opacity-50 cursor-pointer mt-2"
            >
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div>
              <p className="text-sm font-medium text-green-600">
                Inicio de sesión correcto
              </p>
              <h2 className="text-lg font-bold text-gray-900 mt-1">
                Bienvenido, {usuario.email}
              </h2>
            </div>

            <button
              type="button"
              onClick={salir}
              className="w-full py-2.5 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm rounded-full transition-colors cursor-pointer"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
