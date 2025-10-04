import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from './Icons';

const CreateModal = ({ showCreateModal, setShowCreateModal, genres }) => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!showCreateModal) return null;

  const handleGenerate = async () => {
    if (!selectedGenre) return;

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowCreateModal(false);
      setSelectedGenre('');
      setCustomTitle('');
    } catch (err) {
      setError('Failed to generate newsletter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Create New Newsletter</h2>
          <button 
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">Select Genre</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`${genre.color} text-white p-3 sm:p-4 rounded-lg text-left transition-all ${
                    selectedGenre === genre.id ? 'ring-2 ring-orange-400' : 'hover:scale-105'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg">{genre.emoji}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">{genre.day}</span>
                  </div>
                  <h4 className="font-bold">{genre.name}</h4>
                  <p className="text-xs opacity-90">{genre.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Custom Title (Optional)</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Leave blank for AI-generated title"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-900 mb-2">AI Generation Process</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Scan latest music releases and trends</li>
              <li>• Analyze streaming data and social signals</li>
              <li>• Generate personalized content for your audience</li>
              <li>• Quality check and editorial review</li>
            </ul>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateModal(false)}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={!selectedGenre || loading}
              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <PlusIcon />
                  <span>Generate Newsletter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
