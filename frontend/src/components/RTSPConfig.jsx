import React from 'react';

const RTSPConfig = ({ rtspUrl, setRtspUrl, onSave }) => {
  return (
    <div className="bg-black p-6 rounded-lg mb-8 shadow-lg">
      <label className="block text-sm font-medium mb-2 text-gray-200">
        RTSP Stream URL
      </label>
      <div className="flex gap-4 mb-2">
        <input
          type="text"
          value={rtspUrl}
          onChange={(e) => setRtspUrl(e.target.value)}
          placeholder="rtsp://example.com/stream or demo video URL"
          className="flex-1 px-4 py-3 bg-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={onSave}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Save Settings
        </button>
      </div>
      <small className="text-gray-400 text-xs">
        Note: RTSP streams require backend conversion. For demo, using sample video.
      </small>
    </div>
  );
};

export default RTSPConfig;