'use client';

import React, { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the homepage
    const isHomepage = window.location.pathname === '/';
    
    if (isHomepage) {
      // On homepage: scroll to section
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // On other pages: navigate to homepage with hash
      window.location.href = `/#${sectionId}`;
    }
    
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-brand-white/95 text-brand-brown-900 backdrop-blur-sm shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-content mx-auto px-8 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img src="/img/logo.svg" alt="Crew Resource Mining logo" className="h-42 w-auto" />
        </a>
        
        {/* Desktop Navigation */}
        <div className={`hidden md:flex ${isScrolled ? 'text-brand-brown-900' : 'text-brand-white'} items-center space-x-8`}>
          <button 
            onClick={() => scrollToSection('problem')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            The Problem
          </button>
          <button 
            onClick={() => scrollToSection('solution')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Our Solution
          </button>
          <button 
            onClick={() => scrollToSection('outcomes')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Outcomes
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            About TSA
          </button>
          <a
            href="/blog"
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            Insights
          </a>
          <a
            href="/lms"
            className="text-sm font-medium hover:opacity-70 transition-opacity"
          >
            LMS Portal
          </a>
          <button
            onClick={() => scrollToSection('contact')}
            className="bg-brand-orange-500 text-brand-white px-6 py-2 rounded-sm font-medium hover:bg-brand-orange-600 transition-all duration-300 hover-lift"
          >
            Book a Call
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className={`md:hidden flex flex-col items-center justify-center w-8 h-8 space-y-1 ${isScrolled ? 'text-brand-brown-900' : 'text-brand-white'}`}
          aria-label="Toggle mobile menu"
        >
          <span className={`w-6 h-0.5 transition-all duration-300 ${isScrolled ? 'bg-brand-brown-900' : 'bg-brand-white'} ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 transition-all duration-300 ${isScrolled ? 'bg-brand-brown-900' : 'bg-brand-white'} ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 transition-all duration-300 ${isScrolled ? 'bg-brand-brown-900' : 'bg-brand-white'} ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-brand-white/95 backdrop-blur-sm min-h-screen z-50">
          <div className="flex flex-col items-center py-8 space-y-6">
            <button 
              onClick={() => scrollToSection('problem')}
              className="text-lg font-medium text-brand-brown-900 hover:text-brand-orange-500 transition-colors py-2"
            >
              The Problem
            </button>
            <button 
              onClick={() => scrollToSection('solution')}
              className="text-lg font-medium text-brand-brown-900 hover:text-brand-orange-500 transition-colors py-2"
            >
              Our Solution
            </button>
            <button 
              onClick={() => scrollToSection('outcomes')}
              className="text-lg font-medium text-brand-brown-900 hover:text-brand-orange-500 transition-colors py-2"
            >
              Outcomes
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-lg font-medium text-brand-brown-900 hover:text-brand-orange-500 transition-colors py-2"
            >
              About TSA
            </button>
            <a
              href="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-brand-brown-900 hover:text-brand-orange-500 transition-colors py-2"
            >
              Insights
            </a>
            <a
              href="/lms"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-brand-brown-900 hover:text-brand-orange-500 transition-colors py-2"
            >
              LMS Portal
            </a>
            <button
              onClick={() => scrollToSection('contact')}
              className="bg-brand-orange-500 text-brand-white px-8 py-3 rounded-sm font-medium hover:bg-brand-orange-600 transition-all duration-300 hover-lift mt-4"
            >
              Book a Call
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
