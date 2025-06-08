
import React from 'react';

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const downloadPitchDeck = () => {
    // Placeholder for pitch deck download
    console.log('Downloading pitch deck...');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=2000&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-navy/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-content mx-auto px-8 text-center text-white">
        <div className="fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            From Flight Deck to Mine Site:<br />
            <span className="text-orange">Aviation Human Factors</span><br />
            Re-engineered for Mining
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            27 years of cockpit-proven safety principles delivered to high-risk ground operations
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToContact}
              className="bg-orange text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange/90 transition-all duration-300 hover-lift flex items-center space-x-2"
            >
              <span>Book a Discovery Call</span>
              <span className="text-sm">→ Reduce Incidents</span>
            </button>
            
            <button 
              onClick={downloadPitchDeck}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-navy transition-all duration-300 hover-lift"
            >
              Download Pitch Deck
            </button>
          </div>

          <div className="mt-12 text-sm text-white/70">
            <p>No obligation consultation • Data-driven insights</p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
