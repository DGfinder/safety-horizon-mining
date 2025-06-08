
import React from 'react';

const Problem = () => {
  return (
    <section id="problem" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">
            The Human Factor Crisis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Mining operations face unprecedented safety challenges where human error remains the leading cause of serious incidents
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover-lift">
              <div className="text-6xl font-bold text-orange mb-4">90%</div>
              <h3 className="text-2xl font-semibold text-navy mb-3">
                Of serious mining incidents trace back to human error
              </h3>
              <p className="text-muted-foreground">
                According to 2019 ICMM and NIOSH studies, the vast majority of mining accidents stem from human factors rather than equipment failure.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-navy">Costly Downtime</h4>
                  <p className="text-muted-foreground">Each incident can shut down operations for days, costing millions in lost production</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-navy">Reputational Risk</h4>
                  <p className="text-muted-foreground">Safety incidents damage stakeholder trust and social license to operate</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-orange rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-navy">Rising Regulatory Pressure</h4>
                  <p className="text-muted-foreground">Authorities demand demonstrable human factors programs and measurable safety improvements</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=800&q=80" 
              alt="Mining safety challenges"
              className="rounded-lg shadow-xl w-full"
            />
            <div className="absolute inset-0 bg-navy/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
