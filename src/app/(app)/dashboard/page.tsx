import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">
          Willkommen im Schutzkonzept-Generator.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Die 5 Module</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-600">
          Hier erscheint in Kürze die Modul-Übersicht (PROJ-2). Du bist bereits
          angemeldet und deinem Verein zugeordnet.
        </CardContent>
      </Card>
    </div>
  );
}
