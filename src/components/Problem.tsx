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
    <section id="problem" className="pt-16 md:pt-32 bg-brand-yellow-50">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-brown-900 mb-6">
            The Human Factor Crisis
          </h2>
          <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
            Mining operations face unprecedented safety challenges where human error remains the leading cause of serious incidents
          </p>
        </div>

        <div className="grid md:grid-cols-5 max-md:gap-4 items-center ">
          <div className="max-md:order-2 max-md:pl-12 md:col-span-3 relative">
            <img
              src="/img/miner-person.png"
              alt="Mining safety challenges"
              className="w-full"
            />
          </div>
          <div className="md:col-span-2 space-y-6">
            <div className="md:p-8 rounded-lg">
              <div className="text-6xl font-bold text-brand-orange-500 mb-4">#1</div>
              <h3 className="text-2xl font-semibold text-brand-brown-900 mb-3">
                Human factors are the leading cause of mining incidents
              </h3>
              <p className="text-brand-brown-600">
                Just as aviation transformed from reactive to proactive safety through human factors training, mining operations can achieve similar breakthrough results.
              </p>
              <p className="text-xs text-brand-brown-500 mt-2">
                *Aviation industry reduced fatality rates by 95% through systematic human factors programs
              </p>
            </div>
          </div>
        </div>

        {/* The Real Cost of Inaction */}
        <div className="bg-brand-yellow-100 p-8 rounded-t-xl">
          <h3 className="text-2xl font-bold text-brand-brown-900 mb-8 text-center">The Real Cost of Inaction</h3>
          <div className="grid md:grid-cols-4 gap-6">
            {costFactors.map((factor, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{factor.icon}</div>
                <h4 className="font-semibold text-brand-brown-900 mb-2">{factor.title}</h4>
                <p className="text-brand-brown-600 text-sm">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Problem;
