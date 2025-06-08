
import React from 'react';

const SocialProof = () => {
  const testimonials = [
    {
      quote: "We cut near-misses 38% in 6 months. The aviation approach finally gave our supervisors the tools they needed.",
      author: "Sarah Mitchell",
      role: "Safety Superintendent",
      company: "BHP Iron Ore"
    },
    {
      quote: "TSA's human factors training transformed how our teams communicate. Critical decisions are now made with precision.",
      author: "David Chen",
      role: "Operations Manager",
      company: "Newmont Mining"
    }
  ];

  const logos = [
    { name: "BHP", color: "text-gray-400" },
    { name: "Newmont", color: "text-gray-400" },
    { name: "Rio Tinto", color: "text-gray-400" },
    { name: "Barrick", color: "text-gray-400" },
    { name: "Glencore", color: "text-gray-400" }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mining operators worldwide choose our aviation-proven approach to human factors training
          </p>
        </div>

        {/* Video Testimonial Placeholder */}
        <div className="mb-16">
          <div className="bg-gray-100 rounded-lg aspect-video max-w-4xl mx-auto relative overflow-hidden group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80" 
              alt="Video testimonial"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/60 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <div className="w-0 h-0 border-l-8 border-l-navy border-t-6 border-t-transparent border-b-6 border-b-transparent ml-2"></div>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <div className="font-semibold">Sarah Mitchell, BHP Safety Superintendent</div>
              <div className="text-sm text-white/80">"How aviation CRM transformed our safety culture"</div>
            </div>
          </div>
        </div>

        {/* Written Testimonials */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg hover-lift">
              <div className="text-4xl text-orange mb-4">"</div>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-navy rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-navy">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Logos */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-8">Trusted by leading mining companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {logos.map((logo, index) => (
              <div key={index} className={`text-2xl font-bold ${logo.color} hover:text-navy transition-colors`}>
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
