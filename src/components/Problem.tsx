
import React from 'react';

const Problem = () => {
  const costFactors = [
    {
      icon: '⏱️',
      title: 'Downtime',
      description: 'Operations shut down for days, costing millions in lost production'
    },
    {
      icon: '🏢',
      title: 'Reputational Risk',
      description: 'Safety incidents damage stakeholder trust and social license'
    },
    {
      icon: '📋',
      title: 'Regulatory Scrutiny',
      description: 'Authorities demand demonstrable human factors programs'
    },
    {
      icon: '👥',
      title: 'Team Morale',
      description: 'Incidents affect workforce confidence and productivity'
    }
  ];

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

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover-lift">
              <div className="text-6xl font-bold text-orange mb-4">95%</div>
              <h3 className="text-2xl font-semibold text-navy mb-3">
                Of mining incidents involve human factors*
              </h3>
              <p className="text-muted-foreground">
                According to Patterson & Shappell studies, the vast majority of mining accidents stem from human factors rather than equipment failure.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                *Patterson & Shappell (2010), Human Error in Mining Operations
              </p>
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

        {/* The Real Cost of Inaction */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-navy mb-8 text-center">The Real Cost of Inaction</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {costFactors.map((factor, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{factor.icon}</div>
                <h4 className="font-semibold text-navy mb-2">{factor.title}</h4>
                <p className="text-muted-foreground text-sm">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
