'use client';

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
      isScrolled ? 'bg-brand-white/95 text-brand-brown-900 backdrop-blur-sm shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-content mx-auto px-8 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img src="/img/logo.svg" alt="Crew Resource Mining logo" className="h-42 w-auto" />
        </a>
        
        <div className={` md:flex ${isScrolled ? 'text-brand-brown-900' : 'text-brand-white'}  items-center space-x-8`}>
          <button 
            onClick={() => scrollToSection('problem')}
            className="max-md:hidden text-sm font-medium hover:opacity-70 transition-opacity"
          >
            The Problem
          </button>
          <button 
            onClick={() => scrollToSection('solution')}
            className="max-md:hidden text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Our Solution
          </button>
          <button 
            onClick={() => scrollToSection('outcomes')}
            className="max-md:hidden text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Outcomes
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="max-md:hidden text-sm font-medium hover:opacity-70 transition-opacity"
          >
            About TSA
          </button>
          <button 
            onClick={() => scrollToSection('contact')}
            className="bg-brand-orange-500 text-brand-white px-6 py-2 rounded-sm font-medium hover:bg-brand-orange-600 transition-all duration-300 hover-lift"
          >
            Book a Call
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
