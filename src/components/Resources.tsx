
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
    <section className="py-16 md:py-24 bg-orange">
      <div className="max-w-content mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Free Resource: Human Factors Checklist for Mine Supervisors
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Download our comprehensive checklist that helps supervisors identify and mitigate 
              human factors risks before they become incidents. Based on 30+ years of aviation 
              safety protocols, adapted for mining operations.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                <span>Pre-shift risk assessment framework</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                <span>Communication protocol templates</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                <span>Decision-making decision trees</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full flex-shrink-0"></div>
                <span>Situational awareness indicators</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-xl">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-navy mb-2">Get Your Free Checklist</h3>
                  <p className="text-muted-foreground mb-6">
                    Enter your email to download instantly
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-navy mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="supervisor@miningcompany.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-navy text-white py-3 rounded-lg font-semibold hover:bg-navy/90 transition-colors hover-lift"
                >
                  Download Free Checklist
                </button>

                <p className="text-xs text-muted-foreground text-center">
                  We respect your privacy. Unsubscribe anytime. No spam, only valuable safety insights.
                </p>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-2xl font-bold text-navy mb-2">Thank You!</h3>
                <p className="text-muted-foreground">
                  Check your email for the download link. The checklist will help you implement 
                  aviation-grade safety protocols immediately.
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
