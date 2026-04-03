import { useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useData } from "@/context/DataContext";
import { parseSiteDataJson } from "@/lib/siteData";
import type { AdminTab } from "@/types";

interface Tab {
  id: AdminTab;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { id: "noticias", label: "Noticias", icon: "📰" },
  { id: "autoridades", label: "Autoridades", icon: "👥" },
  { id: "jornadas", label: "Jornadas", icon: "📅" },
];

const MAX_IMPORT_FILE_BYTES = 512 * 1024;

interface AdminLayoutProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({
  activeTab,
  setActiveTab,
  onLogout,
  children,
}: AdminLayoutProps) {
  const { data, replaceData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = useCallback(() => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `adocmat-backup-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const handleImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        if (file.size > MAX_IMPORT_FILE_BYTES) {
          alert("El archivo supera el tamano maximo permitido para importar.");
          return;
        }

        const parsed = parseSiteDataJson(await file.text());
        if (!parsed) {
          alert(
            "El archivo no es valido. Asegurate de usar un backup generado por este panel.",
          );
          return;
        }

        replaceData(parsed);
        alert("Datos importados correctamente.");
      } catch {
        alert("No se pudo leer el archivo seleccionado.");
      } finally {
        e.target.value = "";
      }
    },
    [replaceData],
  );

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-navy-900 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-accent flex items-center justify-center font-serif text-accent-foreground font-bold text-sm">
            π
          </div>
          <div>
            <span className="text-white font-semibold text-sm">ADOCMAT Admin</span>
            <span className="text-white/30 text-xs ml-2">Panel de gestion</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white text-xs transition-colors"
          >
            Ver sitio ↗
          </a>
          <button
            onClick={handleImportClick}
            title="Importar datos desde un archivo de respaldo"
            className="text-white/50 hover:text-gold-400 text-xs transition-colors"
          >
            ↑ Importar
          </button>
          <button
            onClick={handleExport}
            title="Exportar todos los datos como archivo JSON de respaldo"
            className="text-white/50 hover:text-gold-400 text-xs transition-colors"
          >
            ↓ Exportar
          </button>
          <button
            onClick={onLogout}
            className="text-white/50 hover:text-red-400 text-xs transition-colors"
          >
            Cerrar sesion
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden
        />
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div
          className="flex gap-2 mb-8 bg-white border border-border rounded-xl p-1.5 w-fit"
          role="tablist"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-navy-900 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span aria-hidden>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel">{children}</div>
      </div>
    </div>
  );
}
