import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function ProfilPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, role_label")
    .eq("id", user!.id)
    .maybeSingle();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-slate-900">Profil</h1>
        <p className="mt-1 text-slate-600">
          Aktualisiere deine Angaben. Du bist angemeldet als{" "}
          <strong>{user!.email}</strong>.
        </p>
      </div>
      <ProfileForm
        initialName={profile?.display_name ?? ""}
        initialRole={profile?.role_label ?? ""}
      />
    </div>
  );
}
