import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, Video } from "lucide-react";
import axios from 'axios';

const API_URL = 'http://localhost:8000';
const WS_URL = 'ws://localhost:8000/pose-estimation/stream';

export function PoseEstimation() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const outputCanvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const animationFrameRef = useRef<number>();
    const isProcessingRef = useRef(false); // Persistir flag para frames

    const wsRef = useRef<WebSocket | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        if (isStreaming) {
            // Para usar POST (tu método actual):
            // processVideoStream();

            // Para usar WebSocket (recomendado):
            startWebSocketStream();
        } else {
            stopWebSocketStream();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStreaming]);

    // === Upload video handler ===
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_URL}/pose-estimation/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to process video');
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    // === Camera handlers ===
    const startCameraStream = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user"
                } 
            });
            streamRef.current = stream;
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await new Promise((resolve) => {
                    videoRef.current!.oncanplay = () => resolve(true);
                });
                setIsStreaming(true);
                setError(null);
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError('Failed to access camera');
        }
    };

    const stopCameraStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        setIsStreaming(false);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (outputCanvasRef.current) {
            const ctx = outputCanvasRef.current.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, outputCanvasRef.current.width, outputCanvasRef.current.height);
        }
    };

    // === Tu función actual POST base64 ===
    const processVideoStream = () => {
        if (!videoRef.current || !canvasRef.current || !isStreaming) {
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("Could not get canvas context");
            return;
        }

        let localIsProcessing = false;

        const processFrame = async () => {
            if (!isStreaming || !video.videoWidth || !video.videoHeight) {
                return;
            }

            if (!localIsProcessing) {
                localIsProcessing = true;
                try {
                    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                    }
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const frameData = canvas.toDataURL('image/jpeg', 0.8);
                    const response = await axios.post(`${API_URL}/pose-estimation/detect`, frameData);

                    if (response.data.image && outputCanvasRef.current) {
                        const img = new Image();
                        img.onload = () => {
                            const ctx = outputCanvasRef.current!.getContext('2d');
                            if (ctx) {
                                outputCanvasRef.current!.width = img.width;
                                outputCanvasRef.current!.height = img.height;
                                ctx.drawImage(img, 0, 0);
                            }
                        };
                        img.src = `data:image/jpeg;base64,${response.data.image}`;
                    }
                } catch (error) {
                    console.error("Error processing frame:", error);
                } finally {
                    localIsProcessing = false;
                }
            }
            if (isStreaming) {
                animationFrameRef.current = requestAnimationFrame(processFrame);
            }
        };

        processFrame();
    };

    // === Nueva función WebSocket para streaming ===
    const startWebSocketStream = () => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        wsRef.current = new WebSocket(WS_URL);
        wsRef.current.binaryType = 'arraybuffer';

        wsRef.current.onopen = () => {
            console.log('WebSocket connected');
            requestAnimationFrame(processWebSocketFrame);
        };

        wsRef.current.onmessage = (event) => {
            if (event.data instanceof Blob) {
                const imgBlob = event.data;
                const imgUrl = URL.createObjectURL(imgBlob);
                const img = new Image();
                img.onload = () => {
                    if (outputCanvasRef.current) {
                        const ctx = outputCanvasRef.current.getContext('2d');
                        if (ctx) {
                            outputCanvasRef.current.width = img.width;
                            outputCanvasRef.current.height = img.height;
                            ctx.clearRect(0, 0, img.width, img.height);
                            ctx.drawImage(img, 0, 0);
                        }
                    }
                    URL.revokeObjectURL(imgUrl);
                };
                img.src = imgUrl;
            }
        };

        wsRef.current.onerror = (err) => {
            console.error('WebSocket error:', err);
            setError('WebSocket connection error');
        };

        wsRef.current.onclose = () => {
            console.log('WebSocket closed');
        };
    };

    const stopWebSocketStream = () => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    };

    const processWebSocketFrame = () => {
        if (!isStreaming || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
        }
        if (!videoRef.current || !canvasRef.current) {
            requestAnimationFrame(processWebSocketFrame);
            return;
        }
        if (isProcessingRef.current) {
            requestAnimationFrame(processWebSocketFrame);
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            requestAnimationFrame(processWebSocketFrame);
            return;
        }

        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        isProcessingRef.current = true;

        canvas.toBlob(
            (blob) => {
                if (blob && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        if (reader.result) {
                            wsRef.current!.send(reader.result);
                            isProcessingRef.current = false;
                        }
                    };
                    reader.readAsArrayBuffer(blob);
                } else {
                    isProcessingRef.current = false;
                }
                requestAnimationFrame(processWebSocketFrame);
            },
            'image/jpeg',
            0.8
        );
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Pose Estimation</CardTitle>
                <CardDescription>
                    Upload a video or use your camera for real-time pose estimation
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="upload">Upload Video</TabsTrigger>
                        <TabsTrigger value="camera">Camera Stream</TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="video-upload"
                                disabled={isProcessing}
                            />
                            <label htmlFor="video-upload">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    disabled={isProcessing}
                                >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {isProcessing ? 'Processing...' : 'Upload Video'}
                                </Button>
                            </label>
                            {videoUrl && (
                                <video
                                    controls
                                    className="w-full max-w-2xl rounded-lg"
                                    src={videoUrl}
                                />
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="camera" className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                            {!isStreaming ? (
                                <Button
                                    onClick={startCameraStream}
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Video className="mr-2 h-4 w-4" />
                                    Start Camera
                                </Button>
                            ) : (
                                <Button
                                    onClick={stopCameraStream}
                                    variant="destructive"
                                    className="w-full"
                                >
                                    Stop Camera
                                </Button>
                            )}
                            <div className="relative w-full max-w-2xl aspect-video bg-black rounded-lg overflow-hidden">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="hidden"
                                />
                                <canvas
                                    ref={canvasRef}
                                    className="hidden"
                                />
                                <canvas
                                    ref={outputCanvasRef}
                                    className="w-full h-full object-contain"
                                    style={{ display: isStreaming ? 'block' : 'none' }}
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}