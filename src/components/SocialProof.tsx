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
    <section className="py-16 md:py-24 bg-brand-white">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-brown-900 mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
            Mining operators worldwide choose our aviation-proven approach to human factors training
          </p>
        </div>

        {/* Video Testimonial Placeholder */}
        <div>
          <div className="bg-brand-yellow-50 rounded-t-lg aspect-video mx-auto relative overflow-hidden group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
              alt="Video testimonial"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-brand-brown-900/60 flex items-center justify-center max-md:pb-8">
              <div className="max-md:w-16 max-md:h-16 w-20 h-20 bg-brand-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.8571 10.5154C20 11.1752 20 12.8248 18.8571 13.4846L8.57143 19.4231C7.42857 20.0829 6 19.2581 6 17.9385L6 6.06154C6 4.74188 7.42857 3.9171 8.57143 4.57692L18.8571 10.5154Z" fill="#CA5C0F" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 text-brand-white">
              <div className="font-semibold">Sarah Mitchell, BHP Safety Superintendent</div>
              <div className="text-sm text-brand-white/80">"How aviation CRM transformed our safety culture"</div>
            </div>
          </div>
        </div>

        {/* Written Testimonials */}
        <div className="bg-brand-yellow-50 grid md:grid-cols-2 gap-12 mb-16 rounded-b-lg overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <div key={index} className=" p-8">
              <div className="text-4xl text-brand-orange-500 mb-4">"</div>
              <p className="text-lg text-brand-brown-600 mb-6 leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brand-brown-900 rounded-full flex items-center justify-center text-brand-white font-semibold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-brand-brown-900">{testimonial.author}</div>
                  <div className="text-sm text-brand-brown-600">{testimonial.role}, {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Client Logos */}
        <div className="text-center">
          <p className="text-sm text-brand-brown-600 mb-8">Trusted by leading mining companies</p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {logos.map((logo, index) => (
              <div key={index} className={`text-2xl font-bold text-brand-brown-400 hover:text-brand-brown-900 transition-colors`}>
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
