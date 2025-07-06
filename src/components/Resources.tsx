import React, { useState } from 'react';

const Resources = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for email submission
    console.log('Email submitted:', email);
    setIsSubmitted(true);
    setEmail('');
  };

  return (
    <section className="py-16 md:py-24 bg-brand-orange-500">
      <div className="max-w-content mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-brand-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Preview Our Aviation-Grade Training
            </h2>
            <div className="bg-brand-white/10 p-6 rounded-lg mb-8">
              <h3 className="text-2xl font-bold mb-2">LMS Module Demo & Safety Assessment</h3>
              <p className="text-brand-white/90">
                Experience firsthand how our former airline captains translate flight deck safety 
                principles into practical mining applications.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-white rounded-full flex-shrink-0"></div>
                <span>Interactive LMS module walkthrough</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-white rounded-full flex-shrink-0"></div>
                <span>Aviation CRM principles for mining</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-white rounded-full flex-shrink-0"></div>
                <span>Safety culture assessment consultation</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-brand-white rounded-full flex-shrink-0"></div>
                <span>Customized implementation roadmap</span>
              </div>
            </div>
          </div>

          <div className="bg-brand-white p-8 rounded-lg shadow-xl">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-brand-brown-900 mb-2">Schedule Your Demo</h3>
                  <p className="text-brand-brown-600 mb-6">
                    Book a personalized LMS demo and safety consultation
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-brand-brown-900 mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="supervisor@miningcompany.com"
                    className="w-full px-4 py-3 border border-brand-brown-200 rounded-lg focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-brown-900 text-brand-white py-3 rounded-lg font-semibold hover:bg-brand-brown-800 transition-colors hover-lift"
                >
                  Schedule Demo Call
                </button>

                <p className="text-xs text-brand-brown-600 text-center">
                  We respect your privacy. Unsubscribe anytime. No spam, only valuable safety insights.
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-brand-brown-900 mb-2">Thank You!</h3>
                <p className="text-brand-brown-600">
                  Thank you for your interest! We'll contact you within 24 hours to schedule your 
                  personalized LMS demo and safety consultation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;
