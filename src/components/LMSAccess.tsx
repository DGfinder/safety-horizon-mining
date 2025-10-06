'use client';

import React from 'react';
import { BookOpen, CheckCircle, Shield, Award } from 'lucide-react';

const LMSAccess = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-[#192135] to-[#0f1822]">
      <div className="max-w-content mx-auto px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Safety Culture?
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Access our comprehensive Learning Management System and start your crew resource management training journey today.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Features */}
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-[#EC5C29] flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#192135]">LMS Portal</h3>
                </div>

                <p className="text-slate-600 mb-6">
                  Interactive scenario-based training designed specifically for mining operations, powered by aviation's proven safety methodologies.
                </p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#192135]">Real-World Scenarios</h4>
                      <p className="text-sm text-slate-600">Decision-based training using actual mining situations</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#192135]">Track Progress</h4>
                      <p className="text-sm text-slate-600">Monitor completion and certification status</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-[#EC5C29] mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-[#192135]">Earn Certificates</h4>
                      <p className="text-sm text-slate-600">Industry-recognized training credentials</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - CTA */}
              <div className="bg-gradient-to-br from-[#EC5C29] to-[#d94d1f] p-8 md:p-12 flex flex-col justify-center text-white">
                <h3 className="text-2xl font-bold mb-4">
                  Access Your Training Portal
                </h3>
                <p className="mb-8 text-white/90">
                  Log in to continue your safety training or explore our interactive learning modules.
                </p>

                <div className="space-y-4">
                  <a
                    href="/lms"
                    className="block w-full bg-white text-[#192135] px-8 py-4 rounded-lg font-semibold text-center hover:bg-white/90 transition-all duration-300 hover-lift"
                  >
                    Access LMS Portal
                  </a>

                  <div className="text-center">
                    <p className="text-sm text-white/80">
                      New to Crew Resource Mining?{' '}
                      <a href="#contact" className="font-semibold underline hover:text-white">
                        Contact us for access
                      </a>
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-2xl font-bold">12+</div>
                    <div className="text-xs text-white/80">Scenarios</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-xs text-white/80">Learners</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-xs text-white/80">Pass Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LMSAccess;
