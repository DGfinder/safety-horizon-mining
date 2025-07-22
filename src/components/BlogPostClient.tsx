'use client';

import React from 'react';

interface BlogPostClientProps {
  children: React.ReactNode;
}

const BlogPostClient = ({ children }: BlogPostClientProps) => {
  const scrollToNewsletter = () => {
    const element = document.getElementById('newsletter');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact-cta');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      {children}
      {/* Newsletter Signup */}
      <section id="newsletter" className="py-16 bg-brand-brown-900">
        <div className="max-w-content mx-auto px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-white mb-4">
              Get More Safety Insights
            </h2>
            <p className="text-brand-white/80 mb-8">
              Weekly insights from aviation safety experts delivered to your inbox. 
              No spam, just valuable content for mining professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="your.email@miningcompany.com"
                className="px-6 py-3 rounded-lg border-0 text-brand-brown-900 placeholder-brand-brown-500 flex-1 max-w-md"
              />
              <button 
                onClick={scrollToNewsletter}
                className="bg-brand-orange-500 text-brand-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-orange-600 transition-colors whitespace-nowrap hover-lift"
              >
                Subscribe
              </button>
            </div>
            <p className="text-brand-white/60 text-sm mt-4">
              Join 500+ mining professionals • Unsubscribe anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPostClient;