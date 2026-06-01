import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import BuiltWith from '@/components/landing/BuiltWith';
import Footer from '@/components/landing/Footer';
import DataProvider from '@/components/providers/DataProvider';
import EventCard from '@/components/ui/EventCard';

export default function Home() {
  return (
    <main>
      <DataProvider />
      <EventCard />
      <Nav />
      <Hero />
      <HowItWorks />
      <BuiltWith />
      <Footer />
    </main>
  );
}
