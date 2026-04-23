import { useState, useEffect, useCallback } from "react";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import AdminNoticias from "./AdminNoticias";
import AdminAutoridades from "./AdminAutoridades";
import AdminJornadas from "./AdminJornadas";
import { supabase } from "@/lib/supabase";
import type { AdminTab } from "@/types";

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("noticias");

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setAuthed(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(!!session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLogin = useCallback(() => setAuthed(true), []);

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // signOut failed — clear local state anyway so user is not stuck
    }
    setAuthed(false);
  }, []);

  if (!authed) return <AdminLogin onLogin={handleLogin} />;

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onLogout={handleLogout}
    >
      {activeTab === "noticias" && <AdminNoticias />}
      {activeTab === "autoridades" && <AdminAutoridades />}
      {activeTab === "jornadas" && <AdminJornadas />}
    </AdminLayout>
  );
}
