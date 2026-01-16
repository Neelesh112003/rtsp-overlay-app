import { useEffect, useRef, useState, useCallback } from "react";
import axios from "axios";

import RTSPConfig from "./components/RTSPConfig";
import VideoPlayer from "./components/VideoPlayer";
import VideoControls from "./components/VideoControls";
import OverlayList from "./components/OverlayList";
import OverlayModal from "./components/OverlayModal";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

export default function App() {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  const [rtspUrl, setRtspUrl] = useState("");
  const [overlays, setOverlays] = useState([]);
  const [selectedOverlay, setSelectedOverlay] = useState(null);
  const [showAddOverlay, setShowAddOverlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const [newOverlay, setNewOverlay] = useState({
    type: "text",
    content: "",
    position: { x: 50, y: 50 },
    size: { width: 200, height: 50 },
  });

  useEffect(() => {
    loadOverlays();
    loadSettings();
  }, []);

  const loadOverlays = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/overlays`);
      setOverlays(res.data.overlays || []);
    } catch (err) {
      console.error("Load overlays error:", err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/settings`);
      setRtspUrl(res.data.settings?.rtsp_url || "");
    } catch (err) {
      console.error("Load settings error:", err);
    }
  };

  const saveSettings = async () => {
    try {
      await axios.put(`${API_BASE_URL}/api/settings`, {
        rtsp_url: rtspUrl,
        stream_active: isPlaying,
      });
      console.log("Settings saved!");
    } catch (err) {
      console.error("Save settings error:", err);
    }
  };

  const addOverlay = async () => {
    if (!newOverlay.content.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/overlays`, newOverlay);
      setOverlays((prev) => [...prev, res.data.overlay]);
      setShowAddOverlay(false);
      setNewOverlay({
        type: "text",
        content: "",
        position: { x: 50, y: 50 },
        size: { width: 200, height: 50 },
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteOverlay = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/overlays/${id}`);
      setOverlays((prev) => prev.filter((o) => o._id !== id));
      setSelectedOverlay(null);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateOverlay = async (id, updates) => {
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/overlays/${id}`,
        updates
      );
      setOverlays((prev) =>
        prev.map((o) => (o._id === id ? res.data.overlay : o))
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };


  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    const newMuted = !isMuted;
    setIsMuted(newMuted);

    if (newMuted) {
      videoRef.current.muted = true;
    } else {
      videoRef.current.muted = false;
      videoRef.current.volume = volume / 100;
    }
  }, [isMuted, volume]);

  const changeVolume = useCallback(
    (v) => {
      const safeVolume = Math.max(0, Math.min(100, Number(v) || 70));
      setVolume(safeVolume);

      if (videoRef.current && !isMuted) {
        videoRef.current.volume = safeVolume / 100;
        videoRef.current.muted = false;
      }
    },
    [isMuted]
  );


  const handleOverlayMouseDown = useCallback((e, overlay) => {
    e.preventDefault();
    setSelectedOverlay(overlay._id);
  }, []);


  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      if (!isMuted) {
        const vol = Math.round(video.volume * 100);
        setVolume(vol);
      }
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [isMuted]);

  return (
    <div className="min-h-screen bg-white text-white">
      <header className="bg-black p-6 text-3xl font-bold text-center shadow-2xl">
        RTSP Overlay Dashboard
      </header>

      <main className="max-w-7xl mx-auto p-8 space-y-8">
        <RTSPConfig
          rtspUrl={rtspUrl}
          setRtspUrl={setRtspUrl}
          onSave={saveSettings}
        />

        <VideoPlayer
          videoRef={videoRef}
          videoContainerRef={videoContainerRef}
          rtspUrl={rtspUrl}
          isPlaying={isPlaying}
          overlays={overlays}
          selectedOverlay={selectedOverlay}
          onSelect={setSelectedOverlay}
          onUpdate={updateOverlay} 
          onDelete={deleteOverlay}
        />

        <VideoControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          onPlayPause={togglePlay}
          onMuteToggle={toggleMute}
          onVolumeChange={changeVolume}
          onAddOverlay={() => setShowAddOverlay(true)}
          loading={loading}
        />

        <OverlayList
          overlays={overlays}
          selectedOverlay={selectedOverlay}
          onSelect={setSelectedOverlay}
          onDelete={deleteOverlay}
        />

        <OverlayModal
          show={showAddOverlay}
          onClose={() => setShowAddOverlay(false)}
          newOverlay={newOverlay}
          setNewOverlay={setNewOverlay}
          onAdd={addOverlay}
          loading={loading}
        />
      </main>
    </div>
  );
}
