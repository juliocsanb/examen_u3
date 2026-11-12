"use client";
import {
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useMemo, useState } from "react";
import {
  autenticarUsuario,
  cerrarSesionUsuario
} from "@/firebase/auth";

type AuthUser = {
  email: string;
};

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

export default function LoginExam() {
  const showAlert = () => {
    window.alert("Haz iniciado sesión correctamente. ¡Bienvenido!");
  };
  
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
    setCargando(true); 
    setError("");
    try {      
      if (await autenticarUsuario( correo.trim(), contrasena) ){ 
        setUsuario({ email: correo.trim() });
      }
    } catch (error) {
      console.log("Error de Firebase Auth: ", error);
      setError(
         "No se pudo iniciar sesión. Revisa tus credenciales.",
      );
    }
    finally {
      setCargando(false); 
    }
  }

  async function salir() {
    try {
      await cerrarSesionUsuario();
      setUsuario(null);
      setCorreo("");
      setContrasena("");
      
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100/50 to-indigo-100 px-4 py-12 sm:px-6 lg:px-8">
      <section className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl shadow-blue-900/10 border border-blue-100 p-8 sm:p-10">
        
        {/* Cabecera */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 mb-2">Acceso escolar</h1>
        </div>

        {!usuario ? ( 
          <form onSubmit={procesarAcceso} className="space-y-5">
            {/* Input Correo */}
            <div>
              <label htmlFor="correo" className="block text-sm font-semibold text-blue-900 mb-1.5">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                value={correo}
                onChange={(event) => setCorreo(event.target.value)}
                placeholder="alumno@correo.com"
                className="block w-full rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3 text-blue-900 placeholder-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all sm:text-sm"
              />
            </div>

            {/* Input Contraseña */}
            <div>
              <label htmlFor="contrasena" className="block text-sm font-semibold text-blue-900 mb-1.5">
                Contraseña
              </label>
              <input
                id="contrasena"
                type="password"
                value={contrasena}
                onChange={(event) => setContrasena(event.target.value)}
                placeholder="••••••"
                className="block w-full rounded-xl border border-blue-200 bg-blue-50/50 px-4 py-3 text-blue-900 placeholder-blue-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/20 outline-none transition-all sm:text-sm"
              />
            </div>

            {/* Checkbox Recordarme */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(event) => setRecordarme(event.target.checked)}
                  className="h-4 w-4 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-colors"
                />
                <span className="text-sm font-medium text-blue-700/80 group-hover:text-blue-900 select-none transition-colors">
                  Recordarme
                </span>
              </label>
            </div>

            {/* Mensaje de Error */}
            {error ? (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100 flex items-center gap-2 shadow-sm">
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            ) : null}

            {/* Botón de Envío */}
            <button 
              type="submit" 
              disabled={cargando} 
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-200 active:scale-[0.98] mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {cargando && (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {tituloBoton}
            </button>
          </form>
        ) : (
          
          /* Estado de Éxito */
          <div className="text-center py-6 animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-5 shadow-inner">
               <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <p className="text-sm font-bold text-blue-600 tracking-wider uppercase mb-2">
              Inicio de sesión correcto
            </p>
            <h2 className="text-2xl font-bold text-blue-950 mb-8 truncate">
              Bienvenido,<br/>
              <span className="text-blue-500/90 font-semibold text-lg">{usuario.email}</span>
            </h2>

            <button 
              type="button" 
              onClick={salir} 
              className="w-full py-3 px-4 border-2 border-blue-200 rounded-xl text-blue-700 font-bold hover:bg-blue-50 hover:border-blue-300 focus:ring-4 focus:ring-blue-100 transition-all duration-200 active:scale-[0.98]"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </section>
    </main>
  );
}