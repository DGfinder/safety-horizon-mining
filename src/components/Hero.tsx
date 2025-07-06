'use client';

import React from 'react';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="top" className="relative min-h-screen h-[45vh] sm:min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/img/hero-image.jpg)',
          objectPosition: 'center 35%'
        }}
      >
        <div className="absolute inset-0 bg-brand-brown-900/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-8 text-center text-brand-white">
        <div className="fade-in-up">
          <h1 className="text-brand-white text-4xl md:text-5xl font-bold">
            From Flight Deck to Mine Site
          </h1>
          
          <p className="mt-4 text-brand-white/90 text-lg md:text-xl max-w-xl mx-auto">
            Led by airline captains with decades of experience, bringing aviation's proven safety transformation to mining operations.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToContact}
              className="bg-brand-orange-500 text-brand-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-orange-600 transition-all duration-300 hover-lift"
            >
              Schedule LMS Demo
            </button>
            
            <button 
              onClick={scrollToContact}
              className="border-2 border-brand-white text-brand-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-white hover:text-brand-brown-900 transition-all duration-300 hover-lift"
            >
              Book Safety Consultation
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-brand-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-brand-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
