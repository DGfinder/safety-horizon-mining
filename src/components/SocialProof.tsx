import React from 'react';

const SocialProof = () => {
  const credibilityPoints = [
    {
      icon: "✈️",
      title: "Aviation Expertise",
      description: "Led by airline captains with decades of commercial flight experience"
    },
    {
      icon: "🛡️",
      title: "Safety Transformation",
      description: "Bringing aviation's proven safety record to mining operations"
    },
    {
      icon: "🎯",
      title: "Practical Application",
      description: "Real-world CRM principles adapted for mining environments"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-brand-white">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-brown-900 mb-6">
            Aviation-Proven Expertise
          </h2>
          <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
            Led by airline captains with decades of commercial flight experience, bringing aviation's safety transformation to mining
          </p>
        </div>

        {/* Credibility Points */}
        <div className="bg-brand-yellow-50 rounded-lg p-8 mb-16">
          <div className="grid md:grid-cols-3 gap-8">
            {credibilityPoints.map((point, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{point.icon}</div>
                <h3 className="text-xl font-semibold text-brand-brown-900 mb-3">{point.title}</h3>
                <p className="text-brand-brown-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-brand-brown-900 text-brand-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Ready to See Our Aviation-Grade Training?</h3>
          <p className="text-brand-white/90 mb-6">
            Preview our LMS modules and discover how airline safety principles transform mining operations
          </p>
          <button className="bg-brand-orange-500 text-brand-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-orange-600 transition-colors hover-lift">
            Schedule LMS Demo
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
