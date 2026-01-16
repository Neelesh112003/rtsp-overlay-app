# RTSP Livestream Overlay Web Application

A full-stack web application for real-time video streaming with customizable overlays.

---

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Flask + Python
- **Database**: MongoDB

---

## Features

-  RTSP stream playback
-  Text and image overlays
-  Drag & drop positioning
-  Resizable overlays
- Real-time updates
- Full CRUD REST APIs

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+**
- **Node.js 16+**
- **MongoDB**

---

## Installation

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python app.py
```

Backend will run on: `http://localhost:5000`

---

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/overlays` | Get all overlays |
| `POST` | `/api/overlays` | Create new overlay |
| `PUT` | `/api/overlays/:id` | Update overlay |
| `DELETE` | `/api/overlays/:id` | Delete overlay |
| `GET` | `/api/settings` | Get RTSP settings |
| `PUT` | `/api/settings` | Update RTSP settings |

---

## Usage

1. Open your browser at `http://localhost:5173/`
2. Click **Play** to start the video stream
3. Click **"Add Overlay"** to create text or image overlays
4. **Drag** overlays to reposition them anywhere on the video
5. **Select** an overlay and use the resize handle to adjust size
6. Click the **X button** to delete overlays

---

## Testing

### Test Backend API
```bash
# Health check
curl http://localhost:5000/api/health

# Get all overlays
curl http://localhost:5000/api/overlays

# Create overlay
curl -X POST http://localhost:5000/api/overlays \
  -H "Content-Type: application/json" \
  -d '{"type":"text","content":"Test","position":{"x":50,"y":50},"size":{"width":200,"height":50}}'
```

### Test MongoDB
```bash
# Open MongoDB shell
mongosh

# Switch to database
use rtsp_overlay_db

# View all overlays
db.overlays.find().pretty()
```

---

## Links

**GitHub Repository**: [https://github.com/Neelesh112003/rtsp-overlay-app.git](https://github.com/Neelesh112003/rtsp-overlay-app.git)

---

## Author

**Neelesh Gupta**

