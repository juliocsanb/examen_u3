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

    if (!correo.trim() || !contrasena.trim()) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!esCorreoValido(correo)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    setCargando(true);

    try {
      await configurarPersistencia(recordarme);
      const respuesta = await autenticarUsuario(correo, contrasena);

      setUsuario({
        email: respuesta.user.email ?? correo,
      });
    } catch (error) {
      setError("No fue posible iniciar sesión.");
    } finally {
      setCargando(false);
    }


  }

  // TODO: limpiar errores previos.
  // TODO: validar campos vacíos.
  // TODO: validar formato de correo.
  // TODO: activar estado de carga.
  // TODO: configurar persistencia según recordarme.
  // TODO: autenticar usuario.
  // TODO: guardar usuario autenticado en estado.
  // TODO: limpiar estado de carga.
  // TODO: manejar errores y mostrarlos en pantalla.


  async function salir() {
    await cerrarSesionUsuario();

    setUsuario(null);       // vuelve al formulario
    setCorreo("");         
    setContrasena("");
    // TODO: cerrar sesión en Firebase.
    // TODO: limpiar el usuario en estado.
    // TODO: limpiar formulario si se desea.
  }

  return (
    <main className="contenedor">
      <section className="tarjeta">
        <div>
          <h1 className="titulo">Acceso escolar</h1>
          <p className="subtitulo">Complete la funcionalidad de inicio de sesión.</p>
        </div>

        {!usuario ? (
          <form onSubmit={procesarAcceso} noValidate>
            <div className="campo">
              <label htmlFor="correo" className="label-campo">
                Correo electrónico
              </label>

              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="input"
              />
            </div>

            <div className="campo">
              <label htmlFor="contrasena" className="label-campo">
                Contraseña
              </label>

              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="Ingrese su contraseña"
                className="input"
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

            {error ? <div className="error">{error}</div> : null}

            <button className="boton" type="submit" disabled={cargando}>
              {tituloBoton}
            </button>
          </form>
        ) : (
          <div className="panel-exito">
            <div className="mensaje-exito">
              <p>Inicio de sesión correcto</p>
              <h2>Bienvenido, {usuario.email}</h2>
            </div>

            <button type="button" onClick={salir} className="boton">
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}