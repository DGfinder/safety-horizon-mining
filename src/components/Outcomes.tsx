import React, { useState, useEffect } from 'react';

const Outcomes = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countersTriggered, setCountersTriggered] = useState(false);

  const outcomes = [
    {
      metric: '65%',
      label: 'Reduction in Incident Rate',
      description: 'Average decrease in safety incidents within 12 months of implementation'
    },
    {
      metric: '78%',
      label: 'Fewer Lost-Time Injuries',
      description: 'Significant reduction in workplace injuries requiring time off'
    },
    {
      metric: '3x',
      label: 'Improved Reporting Culture',
      description: 'Triple the number of near-miss reports, enabling proactive safety measures'
    },
    {
      metric: '23%',
      label: 'Increased Equipment Uptime',
      description: 'Better decision-making leads to reduced equipment damage and downtime'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCountersTriggered(true);
        }
      },
      { threshold: 0.5 }
    );

    const section = document.getElementById('outcomes');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % outcomes.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [outcomes.length]);

  return (
    <section id="outcomes" className="pt-16 md:pt-32 bg-brand-yellow-50">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-brown-900 mb-6">
            Measurable Outcomes & ROI
          </h2>
          <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
            Our aviation-proven methods deliver quantifiable safety improvements and operational excellence
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {outcomes.map((outcome, index) => (
            <div 
              key={index} 
              className={`p-8 text-center transition-all duration-500 ${
                countersTriggered ? 'animate-counter' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-brand-orange-500 mb-4">
                {outcome.metric}
              </div>
              <h3 className="text-lg font-semibold text-brand-brown-900 mb-3">
                {outcome.label}
              </h3>
              <p className="text-brand-brown-600 text-sm leading-relaxed">
                {outcome.description}
              </p>
            </div>
          ))}
        </div>

        {/* ROI Calculator Teaser */}
        <div className="bg-brand-brown-900 text-brand-white rounded-t-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Calculate Your Potential ROI</h3>
          <p className="text-brand-white/80 mb-6 max-w-2xl mx-auto">
            Every prevented incident saves an average of $2.1M in direct and indirect costs. 
            See how human factors training impacts your bottom line.
          </p>
          <button className="bg-brand-orange-500 text-brand-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-orange-600 transition-colors hover-lift">
            Get ROI Analysis
          </button>
        </div>
      </div>
    </section>
  );
};

export default Outcomes;
