export default function BienvenidaPage() {
  return (
    <main className="grid min-h-screen bg-background px-6 py-5">
      <div className="my-8 w-full max-w-xl place-self-center rounded-2xl border border-outline-variant/40 bg-surface-container-low px-6 py-12 text-center shadow-xl sm:py-16">
        <span
          aria-hidden="true"
          className="material-symbols-outlined mb-5 rounded-xl bg-primary/10 p-3 text-primary"
        >
          terminal
        </span>
        <h1 className="font-display-hero text-3xl font-bold tracking-tight text-primary sm:text-6xl">
          ¡BIENVENIDO!
        </h1>
        <p className="mt-3 text-on-surface-variant">DevAtlas</p>
      </div>
    </main>
  );
}
