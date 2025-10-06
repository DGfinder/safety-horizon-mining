'use client';

import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import Problem from '@/components/Problem';
import Solution from '@/components/Solution';
import WhyAviation from '@/components/WhyAviation';
import Curriculum from '@/components/Curriculum';
import Outcomes from '@/components/Outcomes';
import LMSAccess from '@/components/LMSAccess';
import SocialProof from '@/components/SocialProof';
import About from '@/components/About';
import Process from '@/components/Process';
import Resources from '@/components/Resources';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Problem />
      <Solution />
      <WhyAviation />
      <Curriculum />
      <Outcomes />
      <LMSAccess />
      <SocialProof />
      <About />
      <Process />
      <Resources />
      <Contact />
      <Footer />
    </div>
  );
}