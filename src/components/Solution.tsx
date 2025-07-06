'use client';

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
      ],
      image: '/img/service-01.jpg',
      stats: {
        value: '38%',
        label: 'Near-misses',
        sublabel: 'Reduction'
      }
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
      ],
      image: '/img/service-02.jpg',
      stats: {
        value: '92%',
        label: 'Completion',
        sublabel: 'Rate'
      }
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
      ],
      image: '/img/service-03.jpg',
      stats: {
        value: '45%',
        label: 'Efficiency',
        sublabel: 'Improvement'
      }
    }
  };

  return (
    <section id="solution" className="py-16 md:py-44 bg-brand-white">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-brown-900 mb-6">
            Aviation-Proven Solutions for Mining
          </h2>
          <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
            Three comprehensive approaches to embed human factors excellence in your operation
          </p>
        </div>

        <div className=" ">
          {/* Tab Navigation */}
          <div className="flex flex-col justify-center sm:flex-row">
            {Object.entries(solutions).map(([key, solution]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-6 py-4 font-semibold text-left sm:text-center transition-all duration-300 ${
                  activeTab === key
                    ? 'text-brand-orange-500 border-b-2 border-brand-orange-500 bg-brand-white rounded-t-lg'
                    : 'text-brand-brown-600 hover:text-brand-brown-900'
                }`}
              >
                {solution.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-brand-yellow-50 grid md:grid-cols-2 gap-12 items-center rounded-lg overflow-hidden">
            <div className="space-y-6 p-8">
              <div>
                <h3 className="text-2xl font-bold text-brand-brown-900 mb-3">
                  {solutions[activeTab as keyof typeof solutions].title}
                </h3>
                <p className="text-brand-orange-500 font-semibold mb-4">
                  {solutions[activeTab as keyof typeof solutions].benefit}
                </p>
                <p className="text-brand-brown-600 leading-relaxed">
                  {solutions[activeTab as keyof typeof solutions].description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-brand-brown-900 mb-3">Key Features:</h4>
                <ul className="space-y-2">
                  {solutions[activeTab as keyof typeof solutions].features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-orange-500 rounded-full flex-shrink-0"></div>
                      <span className="text-brand-brown-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                <img 
                  src={solutions[activeTab as keyof typeof solutions].image}
                  alt={`${solutions[activeTab as keyof typeof solutions].title} illustration`}
                  className="object-cover w-full h-full transition-opacity duration-300"
                />
              </div>
              {/* <div className="absolute top-4 right-4 bg-brand-white px-4 py-3 rounded-lg shadow-lg">
                <div className="text-xs text-brand-brown-600">{solutions[activeTab as keyof typeof solutions].stats.sublabel}</div>
                <div className="text-xl font-bold text-brand-brown-900">{solutions[activeTab as keyof typeof solutions].stats.value}</div>
                <div className="text-xs text-brand-brown-600">{solutions[activeTab as keyof typeof solutions].stats.label}</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Solution;
