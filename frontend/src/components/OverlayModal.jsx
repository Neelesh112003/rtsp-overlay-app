import React from 'react';

const AddOverlayModal = ({
  show,
  onClose,
  newOverlay,
  setNewOverlay,
  onAdd,
  loading,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md mx-4 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-white">Add New Overlay</h2>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2 text-gray-200">
            Overlay Type
          </label>
          <select
            value={newOverlay.type}
            onChange={(e) =>
              setNewOverlay({ ...newOverlay, type: e.target.value })
            }
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2 text-gray-200">
            {newOverlay.type === 'text' ? 'Text Content' : 'Image URL'}
          </label>
          <input
            type="text"
            value={newOverlay.content}
            onChange={(e) =>
              setNewOverlay({ ...newOverlay, content: e.target.value })
            }
            placeholder={
              newOverlay.type === 'text'
                ? 'Enter text...'
                : 'https://example.com/logo.png'
            }
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Width (px)
            </label>
            <input
              type="number"
              value={newOverlay.size.width}
              onChange={(e) =>
                setNewOverlay({
                  ...newOverlay,
                  size: {
                    ...newOverlay.size,
                    width: parseInt(e.target.value) || 200,
                  },
                })
              }
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {newOverlay.type === 'image' && (
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-200">
                Height (px)
              </label>
              <input
                type="number"
                value={newOverlay.size.height}
                onChange={(e) =>
                  setNewOverlay({
                    ...newOverlay,
                    size: {
                      ...newOverlay.size,
                      height: parseInt(e.target.value) || 50,
                    },
                  })
                }
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onAdd}
            disabled={!newOverlay.content.trim() || loading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <span>💾</span>
            Add Overlay
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOverlayModal;