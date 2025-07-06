'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const About = () => {
  const [countersTriggered, setCountersTriggered] = useState(false);

  const team = [
    {
      name: 'Cassandra Cooke',
      role: 'Founder & Lead Aviation Safety Expert',
      experience: 'Airline Captain & HF NTS Instructor - 35+ years aviation experience',
      image: '/img/team/cassandra-cooke.png'
    },
    {
      name: 'Hayden Hamilton',
      role: 'Mining Operations & Aviation Safety',
      experience: 'Current Corporate Pilot - 4 years mining safety',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80' // Placeholder until you provide photo
    },
    {
      name: 'Kym Deed',
      role: 'Technical Training Lead',
      experience: 'Check & Training Captain - 40+ years experience',
      image: '/img/team/kym-deed.png'
    },
    {
      name: 'Lisa Wright',
      role: 'Human Factors Instructor ',
      experience: 'Pilot & Aviation Safety Workshops - 20+ years',
      image: '/img/team/lisa-wright.png'
    },
    {
      name: 'Ram Mutukrishnan',
      role: 'Human Factors Instructor',
      experience: 'Airline Captain & HF NTS Instructor - 25+ years experience',
      image: '/img/team/ram-patkunam.png'
    }
  ];

  const credentials = [
    {
      number: '100+',
      label: 'Years Combined Captain Experience',
      description: 'Current and Former airline captains with decades of commercial flight deck experience'
    },
    {
      number: '5',
      label: 'Aviation Safety Experts',
      description: 'Experienced airline pilots and certified human factors specialists'
    },
    {
      number: '100k+',
      label: 'Flight Hours',
      description: 'Extensive real-world experience in high-stakes safety environments'
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
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg bg-gray-100">
                {member.image.startsWith('/img/team/') ? (
                  <Image
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                    priority={index < 2} // Load first 2 images with priority
                  />
                ) : (
                  <img 
                    src={member.image} 
                    alt={`${member.name} - ${member.role}`}
                    className="w-full h-full object-cover"
                  />
                )}
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
