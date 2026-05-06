import Navbar from "@/components/Navbar";
import { Estatuto } from "@/components/Estatuto";
import Footer from "@/components/Footer";

export default function EstatutoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar variant />
      <main>
        <Estatuto />
      </main>
      <Footer />
    </div>
  );
}
