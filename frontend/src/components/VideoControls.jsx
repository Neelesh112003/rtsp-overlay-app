import React from 'react';

const VideoControls = ({
  isPlaying,
  isMuted,
  volume,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onAddOverlay,
  loading,
}) => {
  return (
    <div className="bg-black backdrop-blur-md p-6 rounded-b-2xl flex items-center gap-6 shadow-2xl border-t border-gray-700">
      <button
        onClick={onPlayPause}
        className="w-16 h-16 bg-linear-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-200 hover:scale-105 shadow-xl"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>

      <button
        onClick={onMuteToggle}
        className="w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white rounded-xl flex items-center justify-center text-xl transition-all duration-200 hover:scale-105 shadow-lg"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted || volume === 0 ? '🔇' : '🔊'}
      </button>

      <div className="flex items-center gap-2">
        <div className="w-6 text-gray-400">{Math.round(volume)}%</div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={volume}
          onChange={(e) => onVolumeChange(e.target.value)}  
          className="w-32 h-2 bg-gray-600 rounded-xl appearance-none cursor-pointer 
                     accent-blue-500 hover:accent-blue-400 transition-all duration-200
                     [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                     [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full
                     [&::-webkit-slider-thumb]:shadow-md hover:[&::-webkit-slider-thumb]:scale-110"
        />
      </div>

      <button
        onClick={onAddOverlay}
        disabled={loading}
        className="ml-auto px-8 py-3 bg-linear-to-r from-green-600 to-green-500 
                   hover:from-green-500 hover:to-green-400 disabled:from-gray-600 
                   disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold 
                   rounded-xl flex items-center gap-2 transition-all duration-200 
                   hover:scale-105 shadow-xl hover:shadow-2xl"
      >
        ➕ Add Overlay
      </button>
    </div>
  );
};

export default VideoControls;
