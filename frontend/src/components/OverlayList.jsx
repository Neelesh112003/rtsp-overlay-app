import React from 'react';

const OverlayList = ({
  overlays,
  selectedOverlay,
  onSelect,
  onDelete,
  loading,
}) => {
  return (
    <div className="bg-black
     p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Overlays ({overlays.length})
      </h2>
      
      {loading ? (
        <p className="text-gray-400 text-center py-8">Loading...</p>
      ) : overlays.length === 0 ? (
        <p className="text-gray-400 text-center py-8">
          No overlays yet. Click "Add Overlay" to create one.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {overlays.map((overlay) => (
            <div
              key={overlay._id}
              onClick={() => onSelect(overlay._id)}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedOverlay === overlay._id
                  ? 'bg-gray-700 border-2 border-blue-500'
                  : 'bg-gray-750 hover:bg-gray-700 border-2 border-transparent'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white mb-1">
                  {overlay.type === 'text' ? '📝 Text' : '🖼️ Image'}
                </div>
                <div className="text-sm text-gray-400 truncate">
                  {overlay.content.substring(0, 50)}
                  {overlay.content.length > 50 ? '...' : ''}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(overlay._id);
                }}
                disabled={loading}
                className="ml-4 px-3 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OverlayList;