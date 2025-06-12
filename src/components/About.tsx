import React, { useState, useEffect } from 'react';

const About = () => {
  const [countersTriggered, setCountersTriggered] = useState(false);

  const team = [
    {
      name: 'Cassandra Cooke',
      role: 'Lead Aviation Safety Expert',
      experience: '15+ years commercial aviation',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Hayden Hamilton',
      role: 'Mining Operations Specialist',
      experience: '12+ years mining safety',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Kym Deed',
      role: 'Human Factors Instructor',
      experience: '20+ years training development',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Lisa Wright',
      role: 'Safety Culture Consultant',
      experience: '18+ years organizational development',
      image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Ram Patkunam',
      role: 'Technical Training Lead',
      experience: '25+ years technical instruction',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const credentials = [
    {
      number: '100+',
      label: 'Years Combined Aviation Experience',
      description: 'Proven track record across commercial and military aviation'
    },
    {
      number: '5',
      label: 'Expert HF Instructors',
      description: 'Certified human factors specialists and safety professionals'
    },
    {
      number: '4',
      label: 'Continents Trained',
      description: 'Global experience adapting safety programs across cultures'
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

    const section = document.getElementById('about');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="pt-16 md:pt-32 bg-brand-yellow-50">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-brown-900 mb-6">
            Meet the Team
          </h2>
          <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
            Aviation experts and mining professionals united by a shared mission: 
            translating flight deck excellence into mine site safety
          </p>
        </div>

        {/* Credibility Badges */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {credentials.map((credential, index) => (
            <div 
              key={index} 
              className={`p-8  text-center transition-all duration-500 ${
                countersTriggered ? 'animate-counter' : 'opacity-0'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl md:text-5xl font-bold text-brand-orange-500 mb-4">
                {credential.number}
              </div>
              <h3 className="text-lg font-semibold text-brand-brown-900 mb-3">
                {credential.label}
              </h3>
              <p className="text-brand-brown-600 text-sm leading-relaxed">
                {credential.description}
              </p>
            </div>
          ))}
        </div>

        {/* Team Photos */}
        <div className="grid md:grid-cols-5 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-brand-brown-900 mb-1">{member.name}</h3>
              <p className="text-sm text-brand-orange-500 font-medium mb-1">{member.role}</p>
              <p className="text-xs text-brand-brown-600">{member.experience}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-brand-brown-900 text-brand-white p-8 rounded-t-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Founded by Team Safety Awareness</h3>
          <p className="text-brand-white/80 max-w-3xl mx-auto">
            Established safety consultancy with deep roots in both aviation and mining. 
            Our unique cross-industry perspective delivers practical, implementable solutions 
            that create lasting safety culture transformation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
