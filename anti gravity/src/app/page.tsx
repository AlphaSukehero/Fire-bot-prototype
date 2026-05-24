import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import SystemDetails from '@/components/sections/SystemDetails';
import Dashboard from '@/components/dashboard/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-ui-900 font-sans selection:bg-ui-accent/30 flex flex-col">
      <Navbar />
      <Hero />
      <About />
      <Dashboard />
      <SystemDetails />
      <Footer />
    </main>
  );
}
