"use client";

import { useState, type FormEvent } from "react";

const labelClassName =
  "text-[13px]/4 font-medium tracking-[0.01em] text-[#42474d]";
const linkClassName = "text-[#1a4464] transition-colors hover:text-[#a73646]";
const inputClassName =
  "h-[46px] w-full rounded-sm bg-white text-sm/5 tracking-[0.005em] text-[#231531] " +
  "shadow-[inset_0_0_0_1px_rgba(108,91,123,0.25)] outline-none transition-all duration-200 " +
  "placeholder:text-[#c2c7ce] focus:bg-[#fbf0ff] " +
  "focus:shadow-[inset_0_0_0_1.5px_#355c7d,0_0_0_3px_rgba(248,161,149,0.25)]";

export default function LoginPage() {
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  async function iniciarSesion(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cargando) return;

    const formulario = event.currentTarget;
    const datos = new FormData(formulario);
    const email = String(datos.get("email") ?? "").trim();
    const contrasena = String(datos.get("password") ?? "");

    setMensaje("");
    setCargando(true);

    try {
      const { firebaseAuth } = await import("@/src/lib/firebaseConfig");
      const { signInWithEmailAndPassword } = await import("firebase/auth");

      const resultado = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        contrasena,
      );

      setMensaje(`Bienvenido, ${resultado.user.email ?? email}.`);
      formulario.reset();
      window.location.href = "/bienvenida";
    } catch {
      setMensaje("No se pudo iniciar sesión. Revisa tus credenciales.");
    } finally {
      setCargando(false);
    }
  }
  return (
    <div className="flex min-h-screen flex-col overscroll-none bg-white font-['DM_Sans',sans-serif] text-sm/5 tracking-[0.005em] text-[#231531] selection:bg-[#ffdadb] selection:text-[#40000e]">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,100..1000&family=Material+Symbols+Outlined&display=swap"
        precedence="default"
      />

      <header className="flex w-full items-center justify-between px-5 py-6 md:px-8">
        <div className="flex items-center gap-2 text-[#1a4464]">
          <span className="flex size-7 items-center justify-center rounded-sm bg-[#355c7d] text-white">
            <span
              aria-hidden="true"
              className="material-symbols-outlined text-[16px]!"
            >
              lock
            </span>
          </span>
          <span className="text-xl/7 font-medium tracking-tight">Solitude</span>
        </div>
        <span aria-hidden="true" className="size-2 rounded-full bg-[#a73646]" />
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-4 md:px-8">
        <div className="w-full max-w-[440px] px-4 py-4 md:px-0">
          <section
            aria-labelledby="login-heading"
            className="rounded-lg bg-white p-6 shadow-xs md:p-10"
          >
            <div
              aria-hidden="true"
              className="mb-6 h-0.5 w-12 rounded-full bg-linear-to-r/srgb from-[#355c7d] via-[#6e2a41] to-[#ff7987]"
            />
            <header className="mb-10 flex flex-col gap-1">
              <h1
                id="login-heading"
                className="text-[32px]/10 font-semibold tracking-tight text-[#1a4464]"
              >
                Iniciar sesión
              </h1>
              <p className="text-[#42474d]">
                Ingresa tus credenciales para continuar
              </p>
            </header>

            <form className="flex flex-col gap-6" onSubmit={iniciarSesion}>
              <div className="flex flex-col gap-1">
                <label className={labelClassName} htmlFor="email">
                  Correo electrónico
                </label>
                <input
                  autoComplete="email"
                  className={`${inputClassName} px-4`}
                  id="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  required
                  type="email"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-2">
                  <label className={labelClassName} htmlFor="password">
                    Contraseña
                  </label>
                  <a
                    className={`${linkClassName} text-right text-[11px]/3.5 font-semibold tracking-[0.04em]`}
                    href="#"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <input
                    autoComplete="current-password"
                    className={`${inputClassName} pr-12 pl-4 tracking-widest focus:tracking-normal`}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={mostrarContrasena ? "text" : "password"}
                  />
                  <button
                    aria-label={
                      mostrarContrasena
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    className={`absolute inset-y-0 right-0 flex cursor-pointer items-center justify-center px-4 transition-colors hover:text-[#1a4464] ${mostrarContrasena ? "text-[#1a4464]" : "text-[#72777e]"}`}
                    onClick={() => setMostrarContrasena((visible) => !visible)}
                    type="button"
                  >
                    <span
                      aria-hidden="true"
                      className="material-symbols-outlined text-[20px]! select-none"
                    >
                      {mostrarContrasena ? "visibility" : "visibility_off"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  aria-busy={cargando}
                  className="flex h-12 w-full cursor-pointer items-center justify-center gap-1 rounded-sm bg-[#355c7d] text-[13px]/4 font-medium tracking-[0.01em] text-white shadow-xs transition-all duration-200 select-none hover:bg-[#1a4464] focus-visible:outline-[3px] focus-visible:outline-[rgba(246,114,128,0.35)] active:scale-[0.99] active:bg-[#355c7d] disabled:cursor-wait disabled:bg-[#355c7d]"
                  disabled={cargando}
                  type="submit"
                >
                  {cargando ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                      />
                      <span>Accediendo...</span>
                    </>
                  ) : (
                    <>
                      <span>Iniciar sesión</span>
                      <span
                        aria-hidden="true"
                        className="material-symbols-outlined text-[18px]!"
                      >
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <p className="mt-10 flex flex-wrap items-center justify-center gap-1 pt-6 text-xs/4.5 tracking-[0.01em] text-[#42474d]">
              <span>¿No tienes una cuenta?</span>
              <a
                className={`${linkClassName} text-[13px]/4 font-medium`}
                href="#"
              >
                Crear cuenta
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
