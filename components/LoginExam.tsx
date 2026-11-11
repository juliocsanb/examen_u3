"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { FirebaseError } from "firebase/app";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/client";
import { autenticarUsuario } from "@/firebase/auth";

type AuthUser = {
  email: string;
};

function esCorreoValido(correo: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden">
      <div className="w-[640px] h-[640px] bg-[#8083ff]/15 rounded-full blur-[140px] -translate-y-12"></div>
      <div className="w-[420px] h-[420px] bg-[#00a572]/10 rounded-full blur-[120px] translate-x-32 translate-y-36"></div>
    </div>
  );
}

function HeaderBrand() {
  return (
    <header className="relative z-10 w-full pt-8 pb-4 flex justify-center items-center">
      <div className="inline-flex items-center gap-2 group cursor-default">
        <div className="w-10 h-10 rounded-xl bg-[#222a3d] flex items-center justify-center shadow-[0_1px_8px_rgba(0,0,0,0.2)] border border-[#464554]/30">
          <svg
            className="w-6 h-6 text-[#c0c1ff]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
        </div>
        <span className="text-xl text-[#dae2fd] tracking-tight font-bold">
          AuthNexus
        </span>
      </div>
    </header>
  );
}

function CardHeader() {
  return (
    <div className="flex flex-col gap-1 text-left">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#222a3d] text-[#c0c1ff] text-[11px] font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
          Firebase Identity Platform
        </span>
        <span className="font-mono text-[11px] text-[#908fa0]">
          Grupo 218500
        </span>
      </div>
      <h1 className="text-2xl font-semibold text-[#dae2fd] tracking-tight mt-2">
        Acceso escolar
      </h1>
      <p className="text-xs text-[#c7c4d7]">
        Inicia sesión con tus credenciales institucionales para acceder a la
        plataforma.
      </p>
    </div>
  );
}

interface ErrorBannerProps {
  codigoError: string;
  mensajeError: string;
  onDismiss: () => void;
}

function ErrorBanner({
  codigoError,
  mensajeError,
  onDismiss,
}: ErrorBannerProps) {
  if (!mensajeError) return null;

  return (
    <div
      role="alert"
      className="overflow-hidden rounded-lg transition-all duration-300 border border-[#ffb4ab]/20"
    >
      <div className="p-3 flex items-start gap-2.5 bg-[#93000a]/25 text-[#ffdad6]">
        <svg
          className="w-5 h-5 text-[#ffb4ab] shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
        <div className="flex-1 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-semibold text-[#ffb4ab]">
              {codigoError || "auth/validation-error"}
            </span>
            <button
              type="button"
              onClick={onDismiss}
              className="text-[#908fa0] hover:text-[#dae2fd] text-xs px-1 transition-colors"
              aria-label="Cerrar alerta"
            >
              ✕
            </button>
          </div>
          <p className="text-xs mt-0.5 text-[#dae2fd] leading-relaxed">
            {mensajeError}
          </p>
        </div>
      </div>
    </div>
  );
}

interface EmailInputProps {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

function EmailInput({ value, onChange, hasError, disabled }: EmailInputProps) {
  const isValid = value.length > 0 && esCorreoValido(value);

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label
        htmlFor="correo"
        className="text-xs font-medium text-[#c7c4d7] flex items-center justify-between"
      >
        <span>Correo electrónico</span>
        <span className="font-mono text-[11px] text-[#908fa0]">
          alumno@web218500.com
        </span>
      </label>
      <div className="relative flex items-center">
        <svg
          className="w-[18px] h-[18px] absolute left-3 text-[#908fa0] pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
        <input
          id="correo"
          type="email"
          autoComplete="email"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="22280648@web218500.com"
          className={`w-full h-11 pl-10 pr-9 rounded-lg text-sm text-[#dae2fd] placeholder:text-[#908fa0]/60 focus:outline-none transition-all border ${
            hasError
              ? "bg-[#93000a]/10 border-[#ffb4ab]/50 focus:bg-[#31394d]"
              : "bg-[#222a3d] border-transparent focus:bg-[#31394d] focus:border-[#c0c1ff]/40"
          } disabled:opacity-50`}
        />
        {isValid && (
          <svg
            className="w-[18px] h-[18px] absolute right-3 text-[#4edea3] transition-opacity"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
  hasError?: boolean;
  disabled?: boolean;
}

function PasswordInput({
  value,
  onChange,
  hasError,
  disabled,
}: PasswordInputProps) {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [capsLockActivo, setCapsLockActivo] = useState(false);

  const verificarCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActivo(e.getModifierState("CapsLock"));
    }
  };

  return (
    <div className="flex flex-col gap-1.5 text-left">
      <div className="flex items-center justify-between">
        <label
          htmlFor="contrasena"
          className="text-xs font-medium text-[#c7c4d7]"
        >
          Contraseña
        </label>
        <span className="text-[11px] text-[#908fa0]">Seguridad Firebase</span>
      </div>
      <div className="relative flex items-center">
        <svg
          className="w-[18px] h-[18px] absolute left-3 text-[#908fa0] pointer-events-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
          />
        </svg>
        <input
          id="contrasena"
          type={mostrarPassword ? "text" : "password"}
          autoComplete="current-password"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyUp={verificarCapsLock}
          onKeyDown={verificarCapsLock}
          placeholder="••••••••••••"
          className={`w-full h-11 pl-10 pr-10 rounded-lg text-sm text-[#dae2fd] placeholder:text-[#908fa0]/60 focus:outline-none transition-all border ${
            hasError
              ? "bg-[#93000a]/10 border-[#ffb4ab]/50 focus:bg-[#31394d]"
              : "bg-[#222a3d] border-transparent focus:bg-[#31394d] focus:border-[#c0c1ff]/40"
          } disabled:opacity-50`}
        />
        <button
          type="button"
          onClick={() => setMostrarPassword(!mostrarPassword)}
          aria-label="Mostrar u ocultar contraseña"
          className="absolute right-3 p-1 rounded text-[#908fa0] hover:text-[#dae2fd] transition-colors flex items-center justify-center"
        >
          {mostrarPassword ? (
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
              />
            </svg>
          ) : (
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          )}
        </button>
      </div>

      {capsLockActivo && (
        <div className="flex items-center gap-1.5 text-[#ffb95f] text-[11px] font-semibold px-1 pt-0.5">
          <span> Bloq Mayús está activado</span>
        </div>
      )}
    </div>
  );
}

interface AuthenticatedViewProps {
  email: string;
  onLogout: () => void;
  cargando: boolean;
}

function AuthenticatedView({
  email,
  onLogout,
  cargando,
}: AuthenticatedViewProps) {
  const iniciales = email ? email.substring(0, 2).toUpperCase() : "US";

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center py-6 gap-4">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#00a572]/20 text-[#4edea3]">
        <svg
          className="w-9 h-9 animate-bounce"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <div className="absolute inset-0 rounded-full border border-[#4edea3] animate-ping opacity-25"></div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#4edea3]">
          Inicio de sesión correcto
        </p>
        <h2 className="text-xl font-bold text-[#dae2fd] break-all">
          Bienvenido, {email}
        </h2>
        <p className="text-xs text-[#c7c4d7]">
          Credenciales verificadas mediante Firebase Authentication.
        </p>
      </div>

      {/* Tarjeta resumen del usuario */}
      <div className="w-full bg-[#171f33] border border-[#464554]/40 rounded-lg p-3 flex items-center gap-3 text-left mt-1">
        <div className="w-10 h-10 rounded-full bg-[#8083ff] text-[#0d0096] font-bold text-sm flex items-center justify-center shrink-0">
          {iniciales}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#dae2fd] truncate">{email}</p>
          <p className="font-mono text-[11px] text-[#908fa0] truncate">
            Sesión activa • examen-web-tec
          </p>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] shrink-0"></span>
      </div>

      <button
        type="button"
        onClick={onLogout}
        disabled={cargando}
        className="w-full h-11 mt-2 rounded-lg bg-[#222a3d] hover:bg-[#31394d] text-[#dae2fd] text-sm font-medium transition-all border border-[#464554]/50 active:scale-[0.99]"
      >
        Cerrar sesión
      </button>
    </div>
  );
}

function FooterInfo() {
  return (
    <footer className="relative z-10 w-full py-6 px-4 md:px-6">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[#c7c4d7] text-[11px]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
          <span>256-Bit TLS Encrypted • Instituto Tecnológico de Toluca</span>
        </div>
        <div className="flex items-center gap-4 text-[#908fa0]">
          <span>Programación Web</span>
          <span>•</span>
          <span>Next.js & Firebase Auth</span>
        </div>
      </div>
    </footer>
  );
}

export default function LoginExam() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [recordarme, setRecordarme] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [codigoError, setCodigoError] = useState("");
  const [usuario, setUsuario] = useState<AuthUser | null>(null);
  const [animarShake, setAnimarShake] = useState(false);
  const solicitudEnCurso = useRef(false);

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUsuario(user?.email ? { email: user.email } : null);
    });
  }, []);

  const tituloBoton = useMemo(() => {
    return cargando ? "Entrando..." : "Entrar";
  }, [cargando]);

  function dispararShake() {
    setAnimarShake(false);
    setTimeout(() => setAnimarShake(true), 10);
  }

  async function procesarAcceso(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (solicitudEnCurso.current) return;

    // 1. Limpiar errores previos
    setError("");
    setCodigoError("");

    const correoLimpio = correo.trim();

    // 2. Validar campos vacíos
    if (!correoLimpio || !contrasena.trim()) {
      setCodigoError("auth/empty-fields");
      setError(
        "Por favor, completa tanto el correo electrónico como la contraseña.",
      );
      dispararShake();
      return;
    }

    // 3. Validar formato de correo
    if (!esCorreoValido(correoLimpio)) {
      setCodigoError("auth/invalid-email");
      setError(
        "El formato del correo electrónico no es válido. Ejemplo: alumno@correo.com",
      );
      dispararShake();
      return;
    }

    // 4. Activar estado de carga para evitar envíos repetidos
    setCargando(true);
    solicitudEnCurso.current = true;

    try {
      // 5. Configurar persistencia según recordarme
      await configurarPersistencia(recordarme);

      // 6. Autenticar usuario en Firebase
      const respuesta = await autenticarUsuario(correoLimpio, contrasena);
      const emailAutenticado = respuesta.user.email;
      if (!emailAutenticado) {
        throw new Error(
          "La cuenta autenticada no tiene un correo electrónico.",
        );
      }

      // 7. Guardar usuario autenticado en estado
      setUsuario({ email: emailAutenticado });
      setContrasena("");

      window.alert(`Bienvenido, ${emailAutenticado}`);
    } catch (err: unknown) {
      // 9. Manejar errores de Firebase y mostrarlos en pantalla
      const code = err instanceof FirebaseError ? err.code : "auth/unknown";
      setCodigoError(code);

      if (
        code.includes("invalid-credential") ||
        code.includes("wrong-password") ||
        code.includes("user-not-found")
      ) {
        setError(
          "Correo o contraseña incorrectos. Verifica tus credenciales de acceso.",
        );
      } else if (code.includes("too-many-requests")) {
        setError(
          "Acceso temporalmente deshabilitado por múltiples intentos fallidos. Intenta más tarde.",
        );
      } else if (code.includes("network-request-failed")) {
        setError("Error de red. Verifica tu conexión a internet.");
      } else if (code === "auth/user-disabled") {
        setError("Esta cuenta está deshabilitada. Contacta al profesor.");
      } else if (code === "auth/invalid-email") {
        setError("El formato del correo electrónico no es válido.");
      } else {
        setError(
          "No fue posible iniciar sesión. Intenta nuevamente o contacta al profesor.",
        );
      }

      dispararShake();
    } finally {
      // 8. Limpiar estado de carga
      setCargando(false);
      solicitudEnCurso.current = false;
    }
  }

  async function salir() {
    if (solicitudEnCurso.current) return;
    solicitudEnCurso.current = true;
    setCargando(true);
    try {
      // Cerrar sesión en Firebase
      await cerrarSesionUsuario();
      // Limpiar el usuario en estado y formulario
      setUsuario(null);
      setContrasena("");
      setError("");
      setCodigoError("");
    } catch (err: unknown) {
      setCodigoError(err instanceof FirebaseError ? err.code : "auth/unknown");
      setError("No fue posible cerrar sesión. Intenta nuevamente.");
    } finally {
      setCargando(false);
      solicitudEnCurso.current = false;
    }
  }

  return (
    <div className="bg-[#0b1326] text-[#dae2fd] antialiased min-h-screen relative overflow-x-hidden flex flex-col justify-between font-sans selection:bg-[#8083ff] selection:text-[#0d0096]">
      <AmbientBackground />
      <HeaderBrand />

      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-4 py-4">
        <section className="w-full max-w-[440px]">
          <div
            className={`relative w-full rounded-xl bg-[#131b2e]/90 backdrop-blur-xl p-6 shadow-2xl border border-[#464554]/30 transition-all duration-300 ${
              animarShake ? "animate-[shake_0.45s_ease-in-out]" : ""
            }`}
          >
            {/* Resplandor interior superior */}
            <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-[#c0c1ff]/20 blur-3xl rounded-full"></div>

            {!usuario ? (
              <div className="relative z-10 flex flex-col gap-4">
                <CardHeader />

                {/* Divisor decorativo */}
                <div className="relative flex items-center justify-center my-1">
                  <div className="w-full h-px bg-[#2d3449]"></div>
                  <span className="absolute px-3 bg-[#131b2e] text-[11px] font-semibold text-[#908fa0] uppercase tracking-wider">
                    Credenciales de acceso
                  </span>
                </div>

                {/* Banner dinámico de errores */}
                <ErrorBanner
                  codigoError={codigoError}
                  mensajeError={error}
                  onDismiss={() => setError("")}
                />

                {/* Formulario principal */}
                <form
                  onSubmit={procesarAcceso}
                  noValidate
                  className="flex flex-col gap-4"
                >
                  <EmailInput
                    value={correo}
                    onChange={setCorreo}
                    hasError={Boolean(
                      error &&
                      (!correo.trim() || !esCorreoValido(correo.trim())),
                    )}
                    disabled={cargando}
                  />

                  <PasswordInput
                    value={contrasena}
                    onChange={setContrasena}
                    hasError={Boolean(error && !contrasena.trim())}
                    disabled={cargando}
                  />

                  {/* Checkbox Recordarme */}
                  <div className="flex items-center justify-between pt-0.5">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <input
                        type="checkbox"
                        checked={recordarme}
                        disabled={cargando}
                        onChange={(event) =>
                          setRecordarme(event.target.checked)
                        }
                        className="w-4 h-4 rounded accent-[#8083ff] bg-[#222a3d] border-[#464554] cursor-pointer"
                      />
                      <span className="text-xs text-[#c7c4d7] group-hover:text-[#dae2fd] transition-colors">
                        Recordarme en este navegador
                      </span>
                    </label>
                  </div>

                  {/* Botón Submit con estado de carga */}
                  <button
                    type="submit"
                    disabled={cargando}
                    className="relative w-full h-11 mt-1 rounded-lg bg-[#c0c1ff] hover:bg-[#e1e0ff] disabled:opacity-60 disabled:cursor-not-allowed text-[#1000a9] font-semibold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 overflow-hidden"
                  >
                    {cargando && (
                      <svg
                        className="animate-spin h-4 w-4 text-[#1000a9]"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    )}
                    <span>{tituloBoton}</span>
                  </button>
                </form>
              </div>
            ) : (
              <>
                <ErrorBanner
                  codigoError={codigoError}
                  mensajeError={error}
                  onDismiss={() => setError("")}
                />
                <AuthenticatedView
                  email={usuario.email}
                  onLogout={salir}
                  cargando={cargando}
                />
              </>
            )}
          </div>
        </section>
      </main>
      <FooterInfo />
    </div>
  );
}
