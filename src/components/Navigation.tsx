
import React, { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-content mx-auto px-8 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img src="/lovable-uploads/9ac6bbb6-f160-48d4-b2ec-8933079cfddc.png" alt="Crew Resource Mining logo" className="h-10 w-auto" />
        </a>
        
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('problem')}
            className="text-sm font-medium text-near-black hover:text-navy transition-colors"
          >
            The Problem
          </button>
          <button 
            onClick={() => scrollToSection('solution')}
            className="text-sm font-medium text-near-black hover:text-navy transition-colors"
          >
            Our Solution
          </button>
          <button 
            onClick={() => scrollToSection('outcomes')}
            className="text-sm font-medium text-near-black hover:text-navy transition-colors"
          >
            Outcomes
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-sm font-medium text-near-black hover:text-navy transition-colors"
          >
            About TSA
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="bg-navy text-white px-6 py-2 rounded-lg font-medium hover:bg-navy/90 transition-all duration-300 hover-lift"
          >
            Book a Call
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
