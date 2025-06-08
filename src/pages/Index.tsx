
import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Solution from '../components/Solution';
import WhyAviation from '../components/WhyAviation';
import Outcomes from '../components/Outcomes';
import SocialProof from '../components/SocialProof';
import About from '../components/About';
import Process from '../components/Process';
import Resources from '../components/Resources';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Problem />
      <Solution />
      <WhyAviation />
      <Outcomes />
      <SocialProof />
      <About />
      <Process />
      <Resources />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
