import Nav from '@/components/landing/Nav';
import Hero from '@/components/landing/Hero';
import HowItWorks from '@/components/landing/HowItWorks';
import BuiltWith from '@/components/landing/BuiltWith';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <HowItWorks />
      <BuiltWith />
      <Footer />
    </main>
  );
}
