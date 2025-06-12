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
    <section className="py-16 md:py-32 bg-brand-white">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-brown-900 mb-6">
            Our Proven Process
          </h2>
          <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
            Three structured steps to transform your safety culture and deliver measurable results
          </p>
        </div>

        <div className="relative">
          {/* Connection Lines */}
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {/* Step Number */}
                <div className="w-20 h-12 bg-brand-orange-500 text-brand-white rounded-t-full flex items-center justify-center text-xl font-bold mx-auto relative z-10 pt-1">
                  {step.number}
                </div>

                {/* Content Card */}
                <div className="bg-brand-yellow-50 p-8 rounded-lg hover-lift">
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-brand-brown-900 mb-4">{step.title}</h3>
                  <p className="text-brand-brown-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <div className="bg-brand-white px-4 py-2 rounded-lg">
                    <span className="text-sm font-semibold text-brand-orange-500">Deliverable:</span>
                    <span className="text-sm text-brand-brown-900 ml-2">{step.deliverable}</span>
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
            className="bg-brand-brown-900 text-brand-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-brand-brown-800 transition-all duration-300 hover-lift"
          >
            Start Your Discovery Call
          </button>
          <p className="text-sm text-brand-brown-600 mt-4">
            No obligation • 30-minute consultation • Immediate insights
          </p>
        </div>
      </div>
    </section>
  );
};

export default Process;
