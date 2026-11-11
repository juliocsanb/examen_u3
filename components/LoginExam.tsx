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

  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    setError("");
    event.preventDefault();

    try {
      const result = await signInWithEmailAndPassword(auth, correo, contrasena);
      setCuadroBienvenida(true);
    } catch (error) {
      console.log("Error de firebase, contacta la administrador", error);
      setError("No se pudo crear la cuenta. Revisa tu correo y constraseña");
    }
    console.log({
      correo: correo,
      contrasena: contrasena,
    });
  }

  async function salir() {
    // TODO: cerrar sesión en Firebase.
    // TODO: limpiar el usuario en estado.
    // TODO: limpiar formulario si se desea.
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 bg-white">
      <section className="w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          <h1 className="font-headline-md text-xl text-[#0031ba] tracking-tight font-semibold">
            Acceso escolar
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-sm">
            Ingresa tu correo electrónico para poder acceder a la plataforma
            escolar
          </p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso}>
            <div>
              <div className="flex flex-col gap-1.5">
                <label className="block text-sm text-[#195aec] font-bold">
                  <span>Correo electrónico</span>
                </label>
                <div className="relative flex items-center group"></div>
              </div>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-surface-container-lowest border border-[#8cc8f6] rounded-lg text-[#195aec] placeholder-outline font-code-inline text-code-inline focus:outline-none focus:border-[#0001e4] focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            <div>
              <div className="flex flex-col gap-1.5">
                <label className="block text-sm text-[#195aec] font-bold">
                  <span>Contraseña</span>
                </label>
                <div className="relative flex items-center group"></div>
              </div>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
                className="w-full pl-10 pr-3.5 py-2.5 bg-surface-container-lowest border border-[#8cc8f6] rounded-lg text-[#195aec] placeholder-outline font-code-inline text-code-inline focus:outline-none focus:border-[#0001e4] focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>

            <label>
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(event) => setRecordarme(event.target.checked)}
              />
              Recordarme
            </label>

            {error ? <div>{error}</div> : null}

            <button
              type="submit"
              disabled={cargando}
              className="relative w-full overflow-hidden bg-[#00b639] hover:bg-primary text-on-primary font-label-lg text-label-lg py-3.5 px-space-lg rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-space-xs group active:scale-[0.99] focus:outline-none focus:shadow-[0_0_0_2px_#ffffff,0_0_0_4px_#40c2fd]"
            >
              {tituloBoton}
            </button>

            {mostrarCuadroBienvenida && (
              <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
                <div className="bg-[#0047a7] border border-gray-800 p-8 rounded-xl max-w-md text-center shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-3">
                    BIENVENIDO !!!
                  </h3>
                  <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                    Registro Exitoso al{" "}
                    <span className="font-semibold text-white">
                      Acceso Escolar
                    </span>
                  </p>
                </div>
              </div>
            )}
          </form>
        ) : (
          <div>
            <div>
              <p>Inicio de sesión correcto</p>
              <h2>Bienvenido, {usuario.email}</h2>
            </div>

            <button type="button" onClick={salir} className="">
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
