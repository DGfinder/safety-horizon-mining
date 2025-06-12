import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-brand-brown-900 text-brand-white py-12">
      <div className="max-w-content mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/img/logo.svg" alt="Crew Resource Mining logo" className="h-7 w-auto" />
            </div>
            <p className="text-brand-white/80 mb-4 max-w-md">
              Translating aviation-grade Human Factors & Crew Resource Management 
              into the mining industry to cut incidents and boost performance.
            </p>
            <div className="text-sm text-brand-white/60">
              <p>ABN: 12 345 678 901</p>
              <p>Perth, Western Australia</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-brand-orange-500">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <button className="block text-brand-white/80 hover:text-brand-white transition-colors">
                The Problem
              </button>
              <button className="block text-brand-white/80 hover:text-brand-white transition-colors">
                Our Solution
              </button>
              <button className="block text-brand-white/80 hover:text-brand-white transition-colors">
                About TSA
              </button>
              <button className="block text-brand-white/80 hover:text-brand-white transition-colors">
                Contact
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-brand-orange-500">Contact</h4>
            <div className="space-y-2 text-sm text-brand-white/80">
              <p>+61 8 9000 0000</p>
              <p>contact@crmmining.com.au</p>
              <p>Perth, WA</p>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-white/60">
          <p>&copy; 2024 CRM Mining by TSA. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="hover:text-brand-white transition-colors">Privacy Policy</button>
            <button className="hover:text-brand-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
