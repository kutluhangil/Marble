import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import BuiltWith from '@/components/landing/BuiltWith';
import Footer from '@/components/landing/Footer';
import DataProvider from '@/components/providers/DataProvider';

export default function Home() {
  return (
    <main>
      <DataProvider />
      <Nav />
      <Hero />
      <HowItWorks />
      <BuiltWith />
      <Footer />
    </main>
  );
}
