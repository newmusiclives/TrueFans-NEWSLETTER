import React, { useState } from 'react';
import { XMarkIcon, PlusIcon } from './Icons';

const CreateModal = ({ showCreateModal, setShowCreateModal, genres }) => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  if (!showCreateModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Newsletter</h2>
          <button 
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Genre</label>
            <div className="grid grid-cols-2 gap-3">
              {genres.map(genre => (
                <button
                  key={genre.id}
                  onClick={() => setSelectedGenre(genre.id)}
                  className={`${genre.color} text-white p-4 rounded-lg text-left transition-all ${
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

          <div className="flex space-x-3">
            <button
              onClick={() => setShowCreateModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              disabled={!selectedGenre}
              className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <PlusIcon />
              <span>Generate Newsletter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
