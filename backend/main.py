from fastapi import FastAPI, UploadFile, File, WebSocket, HTTPException, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
import cv2
import numpy as np
from ultralytics import YOLO
import io
import tempfile
import os
from pathlib import Path
import asyncio
from typing import Optional
import json
import base64

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the YOLO model
MODEL_PATH = Path("models/yolo11x-pose_float16.tflite")
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Please ensure the model file exists.")

try:
    model = YOLO(str(MODEL_PATH))
except Exception as e:
    raise RuntimeError(f"Failed to load YOLO model: {str(e)}")

@app.get("/")
async def read_root():
    return {"status": "ok", "message": "Pose Estimation API is running"}

@app.post("/pose-estimation/detect")
async def detect_pose(frame_data: str):
    try:
        image_data = base64.b64decode(frame_data.split(',')[1] if ',' in frame_data else frame_data)
        nparr = np.frombuffer(image_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if frame is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        results = model(frame, stream=True)
        
        for result in results:
            annotated_frame = result.plot()
            annotated_frame_rgb = cv2.cvtColor(annotated_frame, cv2.COLOR_BGR2RGB)
            _, buffer = cv2.imencode('.jpg', annotated_frame_rgb, [cv2.IMWRITE_JPEG_QUALITY, 80])
            encoded_frame = base64.b64encode(buffer).decode('utf-8')
            return {"image": encoded_frame}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/pose-estimation/upload")
async def process_video(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_path = temp_file.name

    try:
        results = model(temp_path, stream=True)
        cap = cv2.VideoCapture(temp_path)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(cap.get(cv2.CAP_PROP_FPS))

        output_path = temp_path.replace('.mp4', '_output.mp4')
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))

        for result in results:
            frame = result.plot()
            out.write(frame)

        cap.release()
        out.release()

        def iterfile():
            with open(output_path, "rb") as f:
                while chunk := f.read(1024*1024):
                    yield chunk

        return StreamingResponse(
            iterfile(),
            media_type="video/mp4",
            headers={"Content-Disposition": f"attachment; filename=processed_{file.filename}"}
        )
    finally:
        os.unlink(temp_path)
        if os.path.exists(output_path):
            os.unlink(output_path)

@app.websocket("/pose-estimation/stream")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    print("WebSocket connection established")
    frame_count = 0

    try:
        while True:
            data = await websocket.receive_bytes()
            nparr = np.frombuffer(data, np.uint8)
            frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            if frame is None:
                print("Failed to decode frame")
                continue

            results = model(frame, stream=True)
            annotated_frame = None
            for result in results:
                annotated_frame = result.plot()
                break

            if annotated_frame is None:
                annotated_frame = frame

            # Encode annotated frame directly as JPEG (BGR, no RGB conversion)
            success, buffer = cv2.imencode('.jpg', annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            if not success:
                print("Failed to encode annotated frame")
                continue

            await websocket.send_bytes(buffer.tobytes())
            frame_count += 1

    except WebSocketDisconnect:
        print("Client disconnected")

    except Exception as e:
        print(f"WebSocket error: {str(e)}")

# source .venv/bin/activate
# uvicorn main:app --reload --host 0.0.0.0 --port 8000