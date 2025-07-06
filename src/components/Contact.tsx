'use client';

import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    honeypot: '' // Bot detection field
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }
      
      setIsSubmitted(true);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-16 md:py-32 bg-brand-yellow-50">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-brown-900 mb-6">
            Ready to Transform Your Safety Culture?
          </h2>
          <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
            Book a discovery call to learn how aviation-proven human factors training 
            can reduce incidents and improve performance at your operation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-brand-white p-8 rounded-lg shadow-lg">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field for bot detection - hidden from humans */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div>
                  <h3 className="text-2xl font-bold text-brand-brown-900 mb-6">Schedule LMS Demo & Safety Consultation</h3>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-brand-brown-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-brown-200 rounded-lg focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-brand-brown-900 mb-2">
                    Work Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-brand-brown-200 rounded-lg focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-brand-brown-900 mb-2">
                    Company & Role
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., BHP Mining - Safety Manager"
                    className="w-full px-4 py-3 border border-brand-brown-200 rounded-lg focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-brand-brown-900 mb-2">
                    Biggest Safety Challenge (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about your current safety challenges..."
                    className="w-full px-4 py-3 border border-brand-brown-200 rounded-lg focus:ring-2 focus:ring-brand-orange-500 focus:border-transparent"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-orange-500 text-brand-white py-4 rounded-lg font-semibold text-lg hover:bg-brand-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors hover-lift"
                >
                  {isSubmitting ? 'Submitting...' : 'Book Discovery Call →'}
                </button>

                <p className="text-xs text-brand-brown-600 text-center">
                  30-minute consultation • No obligation • Immediate insights
                </p>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="text-green-500 text-6xl mb-6">✓</div>
                <h3 className="text-2xl font-bold text-brand-brown-900 mb-4">Thank You!</h3>
                <p className="text-brand-brown-600 text-lg">
                  We'll contact you within 24 hours to schedule your discovery call. 
                  In the meantime, check your email for our free safety resources.
                </p>
              </div>
            )}
          </div>

          {/* Calendar/Contact Info */}
          <div className="space-y-8">
            <div className="bg-brand-brown-900 text-brand-white p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-6">What to Expect</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Safety Culture Assessment</h4>
                    <p className="text-brand-white/80 text-sm">Quick evaluation of your current human factors program</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">Tailored Recommendations</h4>
                    <p className="text-brand-white/80 text-sm">Specific solutions for your operation's unique challenges</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-semibold">ROI Projection</h4>
                    <p className="text-brand-white/80 text-sm">Estimated impact on incident reduction and cost savings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-brand-white p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-brand-brown-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-brand-brown-900">Phone:</span>
                  <span className="ml-2 text-brand-brown-600">+61 8 9450 7469</span>
                </div>
                <div>
                  <span className="font-semibold text-brand-brown-900">Email:</span>
                  <span className="ml-2 text-brand-brown-600">info@crewresourcemining.com.au</span>
                </div>
                <div>
                  <span className="font-semibold text-brand-brown-900">Location:</span>
                  <span className="ml-2 text-brand-brown-600">Perth, Western Australia</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
