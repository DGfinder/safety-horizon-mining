import React from 'react';

const Curriculum = () => {
  const modules = [
    {
      number: 1,
      title: 'Foundations of HF & Safety Culture',
      description: 'Core principles and cultural transformation'
    },
    {
      number: 2,
      title: 'Situational Awareness & Risk Perception',
      description: 'Environmental monitoring and threat assessment'
    },
    {
      number: 3,
      title: 'Communication & Briefing Protocols',
      description: 'Clear, structured team communication'
    },
    {
      number: 4,
      title: 'Decision-Making Under Pressure',
      description: 'Systematic approaches to critical decisions'
    },
    {
      number: 5,
      title: 'Error Management & Recovery',
      description: 'Trap, detect, and mitigate human errors'
    },
    {
      number: 6,
      title: 'Leadership & Team Dynamics',
      description: 'Effective crew resource management'
    },
    {
      number: 7,
      title: 'Workload & Stress Management',
      description: 'Managing cognitive load and fatigue'
    },
    {
      number: 8,
      title: 'Just Culture Implementation',
      description: 'Building a learning-focused safety culture'
    },
    {
      number: 9,
      title: 'Incident Investigation & Learning',
      description: 'Human factors analysis techniques'
    },
    {
      number: 10,
      title: 'Emergency Response & Crisis Management',
      description: 'High-pressure scenario management'
    },
    {
      number: 11,
      title: 'Technology Interface & Automation',
      description: 'Human-machine interaction optimization'
    },
    {
      number: 12,
      title: 'Continuous Improvement Systems',
      description: 'Sustaining safety culture long-term'
    }
  ];

  return (
    <section className="py-16 md:py-32 bg-brand-white">
      <div className="max-w-content mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-brand-brown-900 mb-6">
            A Comprehensive Curriculum for Total Team Readiness
          </h2>
          <p className="text-xl text-brand-brown-600 max-w-3xl mx-auto">
            Twelve focused modules that systematically build human factors expertise 
            across your entire operation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {modules.map((module, index) => (
            <div 
              key={index} 
              className="bg-brand-yellow-50 p-6 rounded-r-lg hover-lift transition-all duration-300 border-l-4 border-brand-orange-500"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-brand-brown-900 text-brand-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {module.number}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-brown-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-brand-brown-600 text-sm">
                    {module.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-brand-orange-500/10 p-6 rounded-lg inline-block">
            <p className="text-brand-orange-500 font-semibold">
              💡 Each module includes interactive scenarios, assessment tools, and practical implementation guides
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
