import Link from "next/link";
import Image from "next/image";
import { Shield, BookOpen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-white p-1.5">
            <Image
              src="/Logo_HSB.svg.png"
              alt="Hamburger Sportbund"
              width={40}
              height={34}
              priority
            />
          </div>
          <span className="font-semibold">Schutzkonzept-Generator</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-slate-300 hover:text-white"
          >
            Anmelden
          </Link>
          <Button asChild size="sm">
            <Link href="/registrieren">Registrieren</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl bg-white p-5 shadow-xl shadow-blue-950/40">
            <Image
              src="/Logo_HSB.svg.png"
              alt="Hamburger Sportbund"
              width={120}
              height={100}
              priority
            />
          </div>
        </div>
        <div className="mb-4 text-xs uppercase tracking-[0.3em] text-blue-400">
          Hamburger Sportbund · Für Vereine &amp; Verbände
        </div>
        <h1 className="font-serif text-4xl leading-tight md:text-6xl">
          Kinderschutz,
          <br />
          Schritt für Schritt.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-slate-400 md:text-lg">
          Ein interaktiver Generator, der euren Verein durch alle fünf
          Bausteine eines rechtssicheren Schutzkonzeptes führt – mit
          KI-Erklärungen, Vorlagen und Zertifikat am Ende.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button asChild size="lg">
            <Link href="/registrieren">Jetzt starten →</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:text-white">
            <Link href="/login">Anmelden</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-3">
          <Feature
            icon={<BookOpen className="h-5 w-5" />}
            title="5 Module"
            text="Von Satzung bis Intervention strukturiert aufgearbeitet."
          />
          <Feature
            icon={<Sparkles className="h-5 w-5" />}
            title="KI-Erklärungen"
            text="Komplexe Themen in verständlicher Sprache."
          />
          <Feature
            icon={<Shield className="h-5 w-5" />}
            title="Zertifikat"
            text="Nachweis für Vorstand und Mitglieder."
          />
        </div>

        <p className="mt-16 text-xs text-slate-500">
          Basiert auf DOSB-Stufenmodell · dsj-Standards · §72a SGB VIII
        </p>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 text-left">
      <div className="mb-2 flex items-center gap-2 text-blue-400">
        {icon}
        <span className="text-sm font-semibold text-slate-100">{title}</span>
      </div>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}
