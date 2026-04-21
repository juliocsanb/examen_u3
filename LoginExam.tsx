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
    // TODO: validar campos vacíos.
    // TODO: validar formato de correo.
    // TODO: activar estado de carga.
    // TODO: configurar persistencia según recordarme.
    // TODO: autenticar usuario.
    // TODO: guardar usuario autenticado en estado.
    // TODO: limpiar estado de carga.
    // TODO: manejar errores y mostrarlos en pantalla.
  }

  async function salir() {
    // TODO: cerrar sesión en Firebase.
    // TODO: limpiar el usuario en estado.
    // TODO: limpiar formulario si se desea.
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <section className="w-full max-w-md">
        <div>
          <h1>Acceso escolar</h1>
          <p>Completa la funcionalidad de inicio de sesión.</p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso}>
            <div>
              <label htmlFor="correo">Correo electrónico</label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
              />
            </div>

            <div>
              <label htmlFor="contrasena">Contraseña</label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="******"
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

            <button type="submit" disabled={cargando} className="text-white">
              {tituloBoton}
            </button>
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