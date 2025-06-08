
import React from 'react';

const About = () => {
  const experts = [
    {
      name: "Captain James Morrison",
      role: "Chief Pilot & Aviation Safety Expert",
      experience: "30+ years commercial aviation",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
      credentials: "ATPL, Human Factors Specialist"
    },
    {
      name: "Dr. Sarah Williams",
      role: "Mining Safety Consultant",
      experience: "15+ years mining operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b129?auto=format&fit=crop&w=400&q=80",
      credentials: "PhD Mining Engineering, Safety SME"
    },
    {
      name: "Mark Thompson",
      role: "Training & Development Lead",
      experience: "20+ years adult education",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      credentials: "M.Ed, Corporate Training Expert"
    }
  ];

  const stats = [
    { number: "30+", label: "Years Aviation Experience" },
    { number: "15+", label: "Years Mining Industry" },
    { number: "5", label: "Continents Trained" },
    { number: "50+", label: "Mining Sites Improved" }
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">
            TSA | Our Expert Team
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Aviation professionals and mining experts united by a mission to eliminate preventable incidents
          </p>
        </div>

        {/* Expert Profiles */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {experts.map((expert, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover-lift">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={expert.image} 
                  alt={expert.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-navy mb-2">{expert.name}</h3>
                <p className="text-orange font-semibold mb-2">{expert.role}</p>
                <p className="text-muted-foreground mb-3">{expert.experience}</p>
                <p className="text-sm text-muted-foreground">{expert.credentials}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Credibility Numbers */}
        <div className="bg-navy text-white rounded-lg p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-orange">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Company Story */}
        <div className="mt-16 text-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-navy mb-6">Our Mission</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Born from the recognition that aviation's exemplary safety record could transform mining, 
              TSA bridges two critical industries. Our team combines decades of cockpit experience with 
              deep mining operations knowledge, delivering human factors training that saves lives and 
              protects operations worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
