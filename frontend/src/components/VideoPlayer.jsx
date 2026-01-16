import React, { useEffect, useCallback } from "react";
import OverlayElement from "./OverlayElement";

const VideoPlayer = ({
  videoRef,
  videoContainerRef,
  rtspUrl,
  isPlaying,
  overlays,
  selectedOverlay,
  onSelect,
  onUpdate, 
  onDelete,
}) => {
  const getVideoSource = () => {
    if (rtspUrl && !rtspUrl.startsWith("rtsp://")) {
      return rtspUrl;
    }
    return "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  };

  const videoSource = getVideoSource();

  const handleOverlayMouseDown = useCallback(
    (e, overlay) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(overlay._id);
    },
    [onSelect]
  );

  const showPlayButton = !isPlaying;

  const toggleFullscreen = useCallback(() => {
    if (!videoContainerRef.current) return;

    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(console.log);
    } else {
      document.exitFullscreen();
    }
  }, []);

  return (
    <div
      ref={videoContainerRef}
      className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800/50 cursor-pointer hover:border-blue-500/50 transition-all duration-300 justify-center"
      style={{ aspectRatio: "16/9", height: "500px" }}
      onDoubleClick={toggleFullscreen}
    >
      <video
        ref={videoRef}
        src={videoSource}
        className="w-full h-full object-contain"
        preload="metadata"
        muted
        playsInline
        onClick={() => videoRef.current?.play()}
      />

      {overlays.map((overlay) => (
        <OverlayElement
          key={overlay._id}
          overlay={overlay}
          isSelected={selectedOverlay === overlay._id}
          onMouseDown={(e) => handleOverlayMouseDown(e, overlay)}
          onDelete={() => onDelete(overlay._id)}
          onUpdate={onUpdate} 
        />
      ))}

      {showPlayButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all duration-500 z-40">
          <button
            onClick={() => videoRef.current?.play()}
            className="w-32 h-32 bg-linear-to-br from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 
                       text-white rounded-3xl flex items-center justify-center text-5xl font-bold shadow-2xl border-4 border-white/30
                       hover:border-white/50 hover:shadow-3xl active:scale-95 transition-all duration-300 hover:scale-110"
            title="Play (Click anywhere) / Fullscreen (Double-click)"
          >
            ▶
          </button>
        </div>
      )}

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-50 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm 
                   rounded-2xl flex items-center justify-center text-white text-xl transition-all duration-200 
                   hover:scale-110 hover:shadow-2xl border-2 border-white/30"
        title="Fullscreen (⛶)"
      >
        ⛶
      </button>

      {!videoRef.current && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-white text-xl font-semibold animate-pulse">
            Loading Stream...
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
