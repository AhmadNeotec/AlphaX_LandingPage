import React, { useState, ChangeEvent } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';

interface Feature {
  id: number;
  title: string;
  description: string;
  heading: string;
  imageUrl: string;
}

const FeaturesManagement = () => {
  const [features, setFeatures] = useState<Feature[]>([
    { id: 1, title: '14-Day Risk-Free Trial', description: 'A trial without credit card requirements.', heading: 'Risk-Free Trial', imageUrl: 'https://example.com/image1.jpg' },
    { id: 2, title: 'Flexible Subscription', description: 'Options for monthly or yearly plans.', heading: 'Flexible Plans', imageUrl: 'https://example.com/image2.jpg' },
    // Add more features as needed
  ]);

  const [newFeature, setNewFeature] = useState<{ title: string; description: string; heading: string; imageUrl: string }>({ title: '', description: '', heading: '', imageUrl: '' });
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);

  const handleAddFeature = () => {
    if (newFeature.title && newFeature.description && newFeature.heading && newFeature.imageUrl) {
      setFeatures([...features, { id: features.length + 1, ...newFeature }]);
      setNewFeature({ title: '', description: '', heading: '', imageUrl: '' });
    }
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setNewFeature({ title: feature.title, description: feature.description, heading: feature.heading, imageUrl: feature.imageUrl });
  };

  const handleUpdateFeature = () => {
    if (editingFeature) {
      setFeatures(features.map(f => f.id === editingFeature.id ? { ...f, ...newFeature } : f));
      setEditingFeature(null);
      setNewFeature({ title: '', description: '', heading: '', imageUrl: '' });
    }
  };

  const handleDeleteFeature = (id: number) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFeature(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative p-6 min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000 z-0" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-[#774A67] mb-6">Features Management</h1>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Feature</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Feature Title"
              value={newFeature.title}
              onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Feature Description"
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Feature Heading"
              value={newFeature.heading}
              onChange={(e) => setNewFeature({ ...newFeature, heading: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <div>
              <label className="block mb-1 font-medium">Feature Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
              {newFeature.imageUrl && (
                <img src={newFeature.imageUrl} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
              )}
            </div>
            <button onClick={editingFeature ? handleUpdateFeature : handleAddFeature} className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
              <FiPlus /> {editingFeature ? 'Update Feature' : 'Add Feature'}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Features</h2>
          <div className="space-y-4">
            {features.map(feature => (
              <div key={feature.id} className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <p className="text-gray-600">Heading: {feature.heading}</p>
                  <img src={feature.imageUrl} alt={feature.title} className="w-20 h-20 object-cover rounded" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditFeature(feature)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDeleteFeature(feature.id)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesManagement; 