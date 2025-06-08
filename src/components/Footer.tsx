
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="max-w-content mx-auto px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-2xl font-bold">CRM</div>
              <div className="text-sm text-white/70">Mining by TSA</div>
            </div>
            <p className="text-white/80 mb-4 max-w-md">
              Translating aviation-grade Human Factors & Crew Resource Management 
              into the mining industry to cut incidents and boost performance.
            </p>
            <div className="text-sm text-white/60">
              <p>ABN: 12 345 678 901</p>
              <p>Perth, Western Australia</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-orange">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <button className="block text-white/80 hover:text-white transition-colors">
                The Problem
              </button>
              <button className="block text-white/80 hover:text-white transition-colors">
                Our Solution
              </button>
              <button className="block text-white/80 hover:text-white transition-colors">
                About TSA
              </button>
              <button className="block text-white/80 hover:text-white transition-colors">
                Contact
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-orange">Contact</h4>
            <div className="space-y-2 text-sm text-white/80">
              <p>+61 8 9000 0000</p>
              <p>contact@crmmining.com.au</p>
              <p>Perth, WA</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
          <p>&copy; 2024 CRM Mining by TSA. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
