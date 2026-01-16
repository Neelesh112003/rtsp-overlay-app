from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
import os
from datetime import datetime

# -----------------------------------
# Load environment variables
# -----------------------------------
load_dotenv()

# -----------------------------------
# App Initialization
# -----------------------------------
app = Flask(__name__)
CORS(app)

# -----------------------------------
# MongoDB Configuration
# -----------------------------------
MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb://localhost:27017/rtsp_overlay_db"
)

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    client.admin.command("ping")  # test connection
    print("✅ MongoDB connected successfully")
except Exception as e:
    print("❌ MongoDB connection failed:", e)

db = client["rtsp_overlay_db"]
overlays_collection = db["overlays"]
settings_collection = db["settings"]

# -----------------------------------
# Helper Functions
# -----------------------------------
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# -----------------------------------
# Health Check
# -----------------------------------
@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    })

# -----------------------------------
# CREATE Overlay
# -----------------------------------
@app.route("/api/overlays", methods=["POST"])
def create_overlay():
    try:
        data = request.get_json()

        required_fields = ["type", "content", "position", "size"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        if data["type"] not in ["text", "image"]:
            return jsonify({"error": "Invalid overlay type"}), 400

        overlay = {
            "type": data["type"],
            "content": data["content"],
            "position": {
                "x": data["position"].get("x", 0),
                "y": data["position"].get("y", 0)
            },
            "size": {
                "width": data["size"].get("width", 200),
                "height": data["size"].get("height", 50)
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = overlays_collection.insert_one(overlay)
        overlay["_id"] = str(result.inserted_id)

        return jsonify({
            "message": "Overlay created successfully",
            "overlay": serialize_doc(overlay)
        }), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# READ All Overlays
# -----------------------------------
@app.route("/api/overlays", methods=["GET"])
def get_overlays():
    try:
        overlays = list(overlays_collection.find())
        return jsonify({
            "overlays": [serialize_doc(o) for o in overlays]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# READ Single Overlay
# -----------------------------------
@app.route("/api/overlays/<overlay_id>", methods=["GET"])
def get_overlay(overlay_id):
    try:
        if not ObjectId.is_valid(overlay_id):
            return jsonify({"error": "Invalid overlay ID"}), 400

        overlay = overlays_collection.find_one(
            {"_id": ObjectId(overlay_id)}
        )

        if not overlay:
            return jsonify({"error": "Overlay not found"}), 404

        return jsonify({"overlay": serialize_doc(overlay)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# UPDATE Overlay
# -----------------------------------
@app.route("/api/overlays/<overlay_id>", methods=["PUT"])
def update_overlay(overlay_id):
    try:
        if not ObjectId.is_valid(overlay_id):
            return jsonify({"error": "Invalid overlay ID"}), 400

        data = request.get_json()
        update_doc = {"updated_at": datetime.utcnow()}

        if "type" in data:
            if data["type"] not in ["text", "image"]:
                return jsonify({"error": "Invalid overlay type"}), 400
            update_doc["type"] = data["type"]

        if "content" in data:
            update_doc["content"] = data["content"]

        if "position" in data:
            update_doc["position"] = {
                "x": data["position"].get("x", 0),
                "y": data["position"].get("y", 0)
            }

        if "size" in data:
            update_doc["size"] = {
                "width": data["size"].get("width", 200),
                "height": data["size"].get("height", 50)
            }

        result = overlays_collection.update_one(
            {"_id": ObjectId(overlay_id)},
            {"$set": update_doc}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Overlay not found"}), 404

        updated_overlay = overlays_collection.find_one(
            {"_id": ObjectId(overlay_id)}
        )

        return jsonify({
            "message": "Overlay updated successfully",
            "overlay": serialize_doc(updated_overlay)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# DELETE Overlay
# -----------------------------------
@app.route("/api/overlays/<overlay_id>", methods=["DELETE"])
def delete_overlay(overlay_id):
    try:
        if not ObjectId.is_valid(overlay_id):
            return jsonify({"error": "Invalid overlay ID"}), 400

        result = overlays_collection.delete_one(
            {"_id": ObjectId(overlay_id)}
        )

        if result.deleted_count == 0:
            return jsonify({"error": "Overlay not found"}), 404

        return jsonify({"message": "Overlay deleted successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# GET RTSP Settings
# -----------------------------------
@app.route("/api/settings", methods=["GET"])
def get_settings():
    try:
        settings = settings_collection.find_one({"type": "rtsp"})

        if not settings:
            return jsonify({
                "settings": {
                    "rtsp_url": "",
                    "stream_active": False
                }
            })

        return jsonify({"settings": serialize_doc(settings)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# UPDATE RTSP Settings
# -----------------------------------
@app.route("/api/settings", methods=["PUT"])
def update_settings():
    try:
        data = request.get_json()

        settings_doc = {
            "type": "rtsp",
            "rtsp_url": data.get("rtsp_url", ""),
            "stream_active": data.get("stream_active", False),
            "updated_at": datetime.utcnow()
        }

        settings_collection.update_one(
            {"type": "rtsp"},
            {"$set": settings_doc},
            upsert=True
        )

        return jsonify({
            "message": "Settings updated successfully",
            "settings": settings_doc
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -----------------------------------
# App Entry Point
# -----------------------------------
if __name__ == "__main__":
    try:
        overlays_collection.create_index("created_at")
    except Exception as e:
        print("⚠️ Index creation skipped:", e)

    app.run(
        debug=True,
        host="0.0.0.0",
        port=5000
    )
