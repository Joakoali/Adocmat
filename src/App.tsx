import { Suspense, lazy } from "react";
import { DataProvider } from "@/context/DataContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Noticias from "@/components/Noticias";
import Jornadas from "@/components/Jornadas";
import Autoridades from "@/components/Autoridades";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import EstatutoPage from "@/pages/EstatutoPage";

const AdminPanel = lazy(() => import("@/admin/AdminPanel"));

function PublicSite() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Noticias />
        <Jornadas />
        <Autoridades />
        <Contacto />
      </main>
      <Footer />
    </div>
  );
}

function AdminLoadingFallback() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <div className="text-center text-white/70">
        <div className="size-10 border-2 border-white/15 border-t-gold-400 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm tracking-wide uppercase">Cargando panel admin</p>
      </div>
    </div>
  );
}

export default function App() {
  const isAdminPath = window.location.pathname.startsWith("/admin");
  const isEstatutoPath = window.location.pathname.startsWith("/estatuto");

  return (
    <DataProvider>
      {isAdminPath ? (
        <Suspense fallback={<AdminLoadingFallback />}>
          <AdminPanel />
        </Suspense>
      ) : isEstatutoPath ? (
        <EstatutoPage />
      ) : (
        <PublicSite />
      )}
    </DataProvider>
  );
}
