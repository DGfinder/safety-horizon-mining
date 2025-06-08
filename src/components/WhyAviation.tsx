
import React from 'react';

const WhyAviation = () => {
  const principles = [
    {
      title: 'Awareness',
      description: 'Maintain complete understanding of operational environment and risks',
      icon: '🎯'
    },
    {
      title: 'Communication',
      description: 'Clear, standardized communication protocols that save lives',
      icon: '📡'
    },
    {
      title: 'Decision-Making',
      description: 'Structured processes for critical decisions under pressure',
      icon: '🧠'
    },
    {
      title: 'Leadership',
      description: 'Effective team leadership in high-stakes environments',
      icon: '👥'
    },
    {
      title: 'Just Culture',
      description: 'Learning-focused culture that encourages incident reporting',
      icon: '🛡️'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-navy text-white">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            A Proven Model: From Aviation Success to Mining Reliability
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto mb-8">
            Different tools, same human pressures. The principles that prevent errors in a high-tech cockpit 
            are the same ones that prevent mistakes on a high-consequence mine site. We've re-engineered them for your world.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 mb-16">
          {principles.map((principle, index) => (
            <div key={index} className="text-center group relative">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {principle.icon}
              </div>
              <h3 className="text-lg font-semibold mb-3 text-orange">
                {principle.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {principle.description}
              </p>
              
              {index < principles.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-orange/30"></div>
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/10 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Cross-Industry Proof</h3>
          <p className="text-white/80 max-w-3xl mx-auto">
            Commercial aviation achieved a 99.99% safety record through systematic human factors training. 
            These same principles, adapted for mining operations, deliver measurable safety improvements 
            across industrial environments worldwide.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyAviation;
