// Modul-Definitionen für den Schutzkonzept-Generator (PROJ-2)
// Inhalte sind bewusst im Code versioniert, nicht in der DB.
// check.id muss STABIL bleiben — wird als Primary Key in module_progress verwendet.

export type ModuleCheck = {
  id: string;
  label: string;
  help: string;
  templateId?: string;
};

export type SchutzkonzeptModule = {
  id: number;
  slug: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  colorLight: string;
  intro: string;
  aiPrompt: string;
  checks: ModuleCheck[];
};

export const MODULES: SchutzkonzeptModule[] = [
  {
    id: 1,
    slug: "positionierung",
    emoji: "🏛️",
    title: "Positionierung & Satzung",
    subtitle: "Rechtliche Verankerung des Kinderschutzes",
    color: "#2563EB",
    colorLight: "#DBEAFE",
    intro:
      "Das Fundament jedes Schutzkonzeptes ist die klare Positionierung des Vereins. Kinderschutz muss Chefsache sein – und das fängt in der Satzung an.",
    aiPrompt:
      "Erkläre in 3 Sätzen, warum es wichtig ist, Kinderschutz in der Vereinssatzung zu verankern. Nenne ein konkretes Beispiel, was passiert, wenn das fehlt. Schreibe prägnant und praxisnah für einen Vereinsvorstand.",
    checks: [
      {
        id: "m1.satzung",
        label: "Kinderschutz ist in unserer Satzung / Jugendordnung verankert",
        help: "Musterformulierung verfügbar – wir zeigen sie dir im nächsten Schritt.",
        templateId: "satzung-paragraph",
      },
      {
        id: "m1.vorstand",
        label: "Der Vorstand hat das Thema Kinderschutz offiziell beschlossen",
        help: "Ein Vorstandsbeschluss gibt Handlungssicherheit für alle.",
        templateId: "vorstandsbeschluss",
      },
      {
        id: "m1.leitbild",
        label: "Unser Vereinsleitbild enthält klare Aussagen zum Kinderschutz",
        help: "Leitbild und Satzung zusammen senden ein starkes Signal nach außen.",
      },
    ],
  },
  {
    id: 2,
    slug: "risikoanalyse",
    emoji: "🔍",
    title: "Risiko-Potenzial-Analyse",
    subtitle: "Wo lauern Gefahren in unserem Vereinsalltag?",
    color: "#D97706",
    colorLight: "#FEF3C7",
    intro:
      "Bevor ihr Maßnahmen ergreift, müsst ihr wissen, wo die Risiken in eurem konkreten Vereinskontext liegen. Die Risiko-Potenzial-Analyse ist das Herzstück des Schutzkonzeptes.",
    aiPrompt:
      "Nenne 5 typische Risikosituationen in einem Sportverein, die sexualisierte Gewalt oder Grenzverletzungen begünstigen können. Formuliere sie als kurze, konkrete Fragen, die ein Vereinsvorstand sich stellen sollte. Verwende einen sachlichen, nicht alarmistischen Ton.",
    checks: [
      {
        id: "m2.analyse",
        label: "Wir haben eine strukturierte Risikoanalyse durchgeführt",
        help: "Befragt wurden: Trainer*innen, Eltern, Jugendliche und Vorstand.",
      },
      {
        id: "m2.situationen",
        label: "Wir haben Risikosituationen (z. B. Fahrten, Umkleiden) dokumentiert",
        help: "Besondere Aufmerksamkeit: Einzeltraining, Übernachtungsfahrten, Umkleideräume.",
        templateId: "checkliste-risikosituationen",
      },
      {
        id: "m2.dokumentiert",
        label: "Ergebnisse sind schriftlich dokumentiert und dem Vorstand bekannt",
        help: "Nur dokumentierte Risiken können systematisch adressiert werden.",
      },
    ],
  },
  {
    id: 3,
    slug: "verhaltenskodex",
    emoji: "🤝",
    title: "Verhaltenskodex & Personal",
    subtitle: "Regeln für alle, die mit Kindern arbeiten",
    color: "#059669",
    colorLight: "#D1FAE5",
    intro:
      "Ein Verhaltenskodex schafft Klarheit: Was ist erlaubt, was nicht? Wer in eurem Verein mit Kindern arbeitet, muss die Regeln kennen und akzeptieren – und das schriftlich bestätigen.",
    aiPrompt:
      "Beschreibe in 4 kurzen Absätzen, was ein guter Verhaltenskodex für Trainer*innen und Betreuer*innen in einem Sportverein beinhalten sollte. Fokus: Nähe-Distanz, Kommunikation, körperlicher Kontakt, digitale Medien. Schreibe direkt und umsetzbar.",
    checks: [
      {
        id: "m3.kodex",
        label: "Ein schriftlicher Verhaltenskodex existiert und wird unterzeichnet",
        help: "Gilt für alle: Trainer*innen, Betreuer*innen, Ehrenamtliche.",
        templateId: "verhaltenskodex",
      },
      {
        id: "m3.fuehrungszeugnis",
        label: "Erweiterte Führungszeugnisse werden von allen relevanten Personen eingeholt",
        help: "Gesetzlich vorgeschrieben nach §72a SGB VIII für bestimmte Tätigkeiten.",
        templateId: "fuehrungszeugnis-hinweis",
      },
      {
        id: "m3.ehrenkodex",
        label: "Der DOSB/dsj-Ehrenkodex wird im Verein angewendet",
        help: "Seit 01.01.2012 für alle Lizenzinhaber verpflichtend.",
      },
      {
        id: "m3.einarbeitung",
        label: "Neue Mitarbeitende werden systematisch ins Schutzkonzept eingeführt",
        help: "Onboarding-Prozess dokumentiert und verpflichtend.",
      },
    ],
  },
  {
    id: 4,
    slug: "intervention",
    emoji: "🚨",
    title: "Ansprechpersonen & Intervention",
    subtitle: "Was tun, wenn etwas passiert?",
    color: "#DC2626",
    colorLight: "#FEE2E2",
    intro:
      "Wenn es einen Vorfall gibt, müssen alle wissen: An wen wende ich mich? Was passiert dann? Ein klarer Interventionsplan gibt Sicherheit für Betroffene und Handelnde.",
    aiPrompt:
      "Erkläre in 3 Absätzen, welche Schritte ein Sportverein unternehmen sollte, wenn der Verdacht auf sexualisierte Gewalt besteht. Wer sind die Ansprechpersonen? Was sind die ersten 24-48 Stunden entscheidend? Nenne externe Anlaufstellen in Deutschland.",
    checks: [
      {
        id: "m4.beauftragte",
        label: "Eine Kinderschutzbeauftragte / ein Kinderschutzbeauftragter ist benannt",
        help: "Idealerweise: eine männliche und eine weibliche Ansprechperson.",
        templateId: "ks-beauftragte",
      },
      {
        id: "m4.interventionsplan",
        label: "Ein schriftlicher Interventionsplan existiert",
        help: "Schritt-für-Schritt-Anleitung für den Ernstfall.",
        templateId: "interventionsplan",
      },
      {
        id: "m4.beschwerdeweg",
        label: "Kinder und Jugendliche kennen ihre Beschwerderechte und -wege",
        help: "Partizipation schafft Vertrauen und frühe Warnsignale.",
      },
      {
        id: "m4.beratung",
        label: "Externe Fachberatungsstellen sind dem Verein bekannt",
        help: "z. B. lokaler Kinderschutzbund, Wildwasser e.V., Hilfetelefon 0800 022 0550.",
      },
    ],
  },
  {
    id: 5,
    slug: "schulung",
    emoji: "🎓",
    title: "Schulung & Prävention",
    subtitle: "Sensibilisierung und Wissen für alle",
    color: "#7C3AED",
    colorLight: "#EDE9FE",
    intro:
      "Ein Schutzkonzept lebt nur dann, wenn alle im Verein mitziehen. Regelmäßige Schulungen, offene Kommunikation und Beteiligung der Kinder und Jugendlichen machen den Unterschied.",
    aiPrompt:
      "Nenne 5 konkrete, praxiserprobte Maßnahmen, mit denen ein Sportverein das Thema Kinderschutz in den Vereinsalltag integrieren kann – ohne großen Aufwand. Denke an: Elternabende, Teamsitzungen, Aushänge, digitale Kommunikation, Vereinszeitung. Mache es alltagstauglich.",
    checks: [
      {
        id: "m5.schulungen",
        label: "Regelmäßige Schulungen zum Thema Kinderschutz finden statt",
        help: "Empfehlung: mind. alle 2 Jahre für alle mit Kindern arbeitenden Personen.",
      },
      {
        id: "m5.elterninfo",
        label: "Eltern werden aktiv über das Schutzkonzept und ihre Rechte informiert",
        help: "Aushang, Vereinshomepage, Elternabend – mindestens eine Maßnahme.",
      },
      {
        id: "m5.partizipation",
        label: "Kinder und Jugendliche sind an der Weiterentwicklung des Konzeptes beteiligt",
        help: "z. B. durch Jugendbefragung, Jugendsprecher*in oder Kinder- und Jugendkonferenz.",
      },
      {
        id: "m5.fortschreibung",
        label: "Das Schutzkonzept wird regelmäßig überprüft und aktualisiert (mind. alle 2 Jahre)",
        help: "Kinderschutz ist kein einmaliges Projekt, sondern ein kontinuierlicher Prozess.",
      },
    ],
  },
];

export const ALL_CHECK_IDS: string[] = MODULES.flatMap((m) =>
  m.checks.map((c) => c.id),
);

export function getModuleBySlug(slug: string): SchutzkonzeptModule | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getModuleById(id: number): SchutzkonzeptModule | undefined {
  return MODULES.find((m) => m.id === id);
}
