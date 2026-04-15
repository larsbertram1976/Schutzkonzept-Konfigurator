import Link from "next/link";
import { Shield } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="px-6 py-6">
        <Link href="/" className="flex items-center gap-2 text-slate-900">
          <Shield className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">Schutzkonzept-Generator</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl text-slate-900">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            {children}
          </div>
          {footer && (
            <div className="mt-6 text-center text-sm text-slate-600">
              {footer}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
