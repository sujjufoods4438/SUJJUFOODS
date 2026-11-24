import React from 'react';
import { Leaf, Award, ShieldCheck, Factory, CheckCircle2, Users, HeartHandshake } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <div className="bg-sujju-green-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold text-sujju-gold uppercase tracking-widest block">
            Our Heritage & Commitment
          </span>
          <h1 className="text-4xl font-extrabold font-serif">
            About SUJJU FOODS
          </h1>
          <p className="text-base text-sujju-green-200 max-w-2xl mx-auto">
            A state-of-the-art tea powder manufacturing, blending and distribution enterprise founded with a vision to deliver pure, plantation-grade tea to homes across Andhra Pradesh and India.
          </p>
        </div>
      </div>

      {/* Story & Philosophy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-sujju-green-950 font-serif">
              Built on Quality, Freshness & Integrity
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              At SUJJU FOODS, tea is not merely a commercial commodity — it is an everyday tradition cherished by millions. We identified a noticeable gap between commercial market teas with artificial colours or dust grades and the authentic rich liquor of pure tea gardens.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our processing facility combines traditional tea-master tasting expertise with modern automated processing to ensure that every 250g packet meets uncompromising benchmarks of liquor briskness, rich aroma, and golden color.
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
              <div>
                <span className="text-2xl font-extrabold text-sujju-green font-serif">100%</span>
                <p className="text-xs text-gray-500 mt-1">Directly procured tea leaves from certified high-elevation tea plantations.</p>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-sujju-green font-serif">Zero</span>
                <p className="text-xs text-gray-500 mt-1">Artificial colorants, chemical flavoring or adulterants added.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-sujju-cream-300">
            <img
              src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"
              alt="Tea processing"
              className="w-full h-96 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-sujju-cream-100 py-16 border-y border-sujju-cream-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-sujju-cream-300">
              <div className="w-12 h-12 rounded-xl bg-sujju-green-100 flex items-center justify-center text-sujju-green mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-sujju-green-950 font-serif mb-2">Our Mission</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To produce and distribute the purest, highest-quality tea powder at an affordable price (₹180 per 250g pack) with direct-to-doorstep 24-hour delivery supported by an empowered local distributor ecosystem.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-sujju-cream-300">
              <div className="w-12 h-12 rounded-xl bg-sujju-gold-100 flex items-center justify-center text-sujju-gold-700 mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-sujju-green-950 font-serif mb-2">Our Vision</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                To grow as the most dependable and beloved household tea brand across Andhra Pradesh and pan-India, recognized for transparent manufacturing, batch-tested hygiene, and distributor prosperity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Manufacturing Quality Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-sujju-gold uppercase tracking-widest block">
            Quality Assurance
          </span>
          <h2 className="text-3xl font-extrabold text-sujju-green-950 font-serif mt-1">
            Our 5-Stage Manufacturing Journey
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { step: '1', title: 'Estate Selection', desc: 'Direct sourcing of leaves from vetted plantations.' },
            { step: '2', title: 'Master Blending', desc: 'Precise formulation of CTC & orthodox granules.' },
            { step: '3', title: 'Quality Lab Test', desc: 'Moisture, aroma, and infusion density analysis.' },
            { step: '4', title: 'Airtight Packaging', desc: 'Automated nitrogen pouch packing to lock freshness.' },
            { step: '5', title: 'Batch Traceability', desc: 'Every batch coded for verification and tracking.' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-sujju-cream-300 text-center shadow-sm">
              <span className="w-8 h-8 rounded-full bg-sujju-green text-white font-bold text-xs inline-flex items-center justify-center mb-3">
                {item.step}
              </span>
              <h4 className="font-bold text-sujju-green-950 text-sm mb-1">{item.title}</h4>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
