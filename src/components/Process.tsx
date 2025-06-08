
import React from 'react';

const Process = () => {
  const steps = [
    {
      number: "01",
      title: "Discovery Call",
      description: "We assess your current safety culture, identify human factors risks, and understand your specific operational challenges.",
      icon: "🔍",
      deliverable: "Risk Assessment Report"
    },
    {
      number: "02", 
      title: "Tailored Program",
      description: "Custom-designed training program combining workshops, digital modules, and consulting tailored to your mine site's unique needs.",
      icon: "🎯",
      deliverable: "Implementation Roadmap"
    },
    {
      number: "03",
      title: "Measurable Results",
      description: "Ongoing monitoring and measurement of safety metrics with regular reporting to demonstrate ROI and continuous improvement.",
      icon: "📊",
      deliverable: "Performance Dashboard"
    }
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">
            Our Proven Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three structured steps to transform your safety culture and deliver measurable results
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-orange/30"></div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Step Number */}
                <div className="w-16 h-16 bg-orange text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-6 relative z-10">
                  {step.number}
                </div>

                {/* Content Card */}
                <div className="bg-gray-50 p-8 rounded-lg hover-lift">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-navy mb-4">{step.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="bg-white px-4 py-2 rounded-lg">
                    <span className="text-sm font-semibold text-orange">Deliverable:</span>
                    <span className="text-sm text-navy ml-2">{step.deliverable}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button 
            onClick={scrollToContact}
            className="bg-navy text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-navy/90 transition-all duration-300 hover-lift"
          >
            Start Your Discovery Call
          </button>
          <p className="text-sm text-muted-foreground mt-4">
            No obligation • 30-minute consultation • Immediate insights
          </p>
        </div>
      </div>
    </section>
  );
};

export default Process;
