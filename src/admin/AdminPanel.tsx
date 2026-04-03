import { useState, useEffect, useCallback } from "react";
import AdminLogin from "./AdminLogin";
import AdminLayout from "./AdminLayout";
import AdminNoticias from "./AdminNoticias";
import AdminAutoridades from "./AdminAutoridades";
import AdminJornadas from "./AdminJornadas";
import {
  clearAdminSession,
  hasValidAdminSession,
  refreshAdminSession,
} from "@/lib/adminSession";
import type { AdminTab } from "@/types";

const SESSION_CHECK_INTERVAL_MS = 60_000;

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("noticias");

  useEffect(() => {
    setAuthed(hasValidAdminSession());
  }, []);

  useEffect(() => {
    if (!authed) return;

    const syncSession = () => {
      const isValid = hasValidAdminSession();
      setAuthed(isValid);
      if (isValid) {
        refreshAdminSession();
      }
    };

    const intervalId = window.setInterval(syncSession, SESSION_CHECK_INTERVAL_MS);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncSession();
      }
    };

    window.addEventListener("focus", syncSession);
    window.addEventListener("pointerdown", syncSession, { passive: true });
    window.addEventListener("keydown", syncSession);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", syncSession);
      window.removeEventListener("pointerdown", syncSession);
      window.removeEventListener("keydown", syncSession);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [authed]);

  const handleLogin = useCallback(() => setAuthed(true), []);

  const handleLogout = useCallback(() => {
    clearAdminSession();
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
