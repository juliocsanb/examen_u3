// app/page.tsx
import LoginExam from "@/components/LoginExam";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <LoginExam />
    </main>
  );
}