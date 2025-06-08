
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
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-navy">CRM</div>
          <div className="text-sm text-muted-foreground">Mining by TSA</div>
        </div>
        
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
