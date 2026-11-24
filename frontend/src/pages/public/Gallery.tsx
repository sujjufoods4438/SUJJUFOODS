import React, { useState } from 'react';

export const Gallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'manufacturing' | 'plantations' | 'packaging'>('all');

  const galleryItems = [
    {
      id: 1,
      title: 'High-Elevation Tea Gardens',
      category: 'plantations',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      caption: 'Direct procurement of tender tea leaves from vetted plantation slopes.',
    },
    {
      id: 2,
      title: 'State-of-the-Art CTC Processing Line',
      category: 'manufacturing',
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
      caption: 'Continuous rotorvane cutting, controlled fermentation and temperature-monitored drying.',
    },
    {
      id: 3,
      title: 'Automated 250g Packaging Unit',
      category: 'packaging',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      caption: 'Multi-head computerized weighers and nitrogen-sealed pouch packing.',
    },
    {
      id: 4,
      title: 'Quality Testing & Sensory Cupping',
      category: 'manufacturing',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
      caption: 'Daily infusion aroma, color density and liquor tasting by tea masters.',
    },
    {
      id: 5,
      title: 'Eco-Friendly Leaf Harvesting',
      category: 'plantations',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      caption: 'Sustainable cultivation practices preserving soil fertility and biodiversity.',
    },
    {
      id: 6,
      title: 'Finished Goods Dispatch Hub',
      category: 'packaging',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      caption: 'Barcode and QR-verified batch staging for 24-hour distributor dispatches.',
    },
  ];

  const filteredItems = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold text-sujju-gold uppercase tracking-widest block">
          Behind The Scenes
        </span>
        <h1 className="text-4xl font-extrabold text-sujju-green-950 font-serif mt-1">
          SUJJU FOODS Gallery
        </h1>
        <p className="text-sm text-gray-600 mt-2">
          Glimpses into our ethical sourcing, modern processing facilities, hygienic packaging and distribution network.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'plantations', label: 'Tea Plantations' },
            { id: 'manufacturing', label: 'Manufacturing & Blending' },
            { id: 'packaging', label: 'Packaging & Dispatch' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeCategory === tab.id
                  ? 'bg-sujju-green text-white shadow-sm'
                  : 'bg-sujju-cream-200 text-gray-700 hover:bg-sujju-cream-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition border border-sujju-cream-300"
          >
            <div className="relative overflow-hidden h-64 bg-gray-100">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className="absolute top-3 left-3 bg-sujju-green-950/80 backdrop-blur-sm text-sujju-gold text-[10px] uppercase font-bold px-2.5 py-1 rounded-full">
                {item.category}
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-base text-sujju-green-950 font-serif">{item.title}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
