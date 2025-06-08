
import React, { useState } from 'react';

const Solution = () => {
  const [activeTab, setActiveTab] = useState('workshops');

  const solutions = {
    workshops: {
      title: 'Workshops (Face-to-Face)',
      benefit: 'Immersive, scenario-based training at your site',
      description: 'Bring aviation-grade human factors training directly to your operation. Our expert facilitators deliver hands-on workshops that simulate real mining scenarios, teaching your teams to recognize and mitigate human error before incidents occur.',
      features: [
        'Customized to your specific mining operation',
        'Interactive scenario-based learning',
        'Crew resource management techniques',
        'Leadership and communication skills',
        'Just culture implementation'
      ]
    },
    digital: {
      title: 'Digital LMS Modules',
      benefit: 'SCORM/xAPI ready; integrates into existing company LMS',
      description: 'Scalable digital learning modules that seamlessly integrate with your existing training infrastructure. Our comprehensive LMS content delivers consistent human factors education across all shifts and locations.',
      features: [
        'SCORM and xAPI compliant',
        'Progress tracking and analytics',
        'Mobile-responsive design',
        'Multilingual capabilities',
        'Regular content updates'
      ]
    },
    consulting: {
      title: 'Consulting',
      benefit: 'Safety-culture diagnostics and procedure redesign',
      description: 'Expert consulting services to transform your safety culture from the ground up. We assess current procedures, identify human factors risks, and redesign systems for optimal safety performance.',
      features: [
        'Safety culture assessment',
        'Procedure optimization',
        'Risk factor analysis',
        'Implementation roadmap',
        'Ongoing support and monitoring'
      ]
    }
  };

  return (
    <section id="solution" className="py-16 md:py-24 bg-white">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-6">
            Aviation-Proven Solutions for Mining
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Three comprehensive approaches to embed human factors excellence in your operation
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row border-b border-gray-200 mb-8">
            {Object.entries(solutions).map(([key, solution]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-4 font-semibold text-left sm:text-center transition-all duration-300 ${
                  activeTab === key
                    ? 'text-orange border-b-2 border-orange bg-white rounded-t-lg'
                    : 'text-muted-foreground hover:text-navy'
                }`}
              >
                {solution.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-navy mb-3">
                  {solutions[activeTab as keyof typeof solutions].title}
                </h3>
                <p className="text-orange font-semibold mb-4">
                  {solutions[activeTab as keyof typeof solutions].benefit}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {solutions[activeTab as keyof typeof solutions].description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-navy mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {solutions[activeTab as keyof typeof solutions].features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange rounded-full flex-shrink-0"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80" 
                alt="Mining training solution"
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute top-4 right-4 bg-white px-3 py-2 rounded-lg shadow-lg">
                <div className="text-xs text-muted-foreground">Proven Results</div>
                <div className="text-lg font-bold text-navy">38% ↓</div>
                <div className="text-xs text-muted-foreground">Near-misses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
