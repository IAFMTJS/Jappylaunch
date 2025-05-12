import React, { useRef, useEffect, useState } from 'react';
import { StrokeType, Stroke, StrokePoint, CharacterStroke } from '../types/writing';

interface WritingCanvasProps {
  width: number;
  height: number;
  isDarkMode: boolean;
  showStrokeGuide: boolean;
  characterStroke?: CharacterStroke;
  currentStroke: number;
  onStrokeComplete: (stroke: Stroke) => void;
  onDrawingStart: () => void;
  onDrawingEnd: () => void;
  onClear: () => void;
}

const WritingCanvas: React.FC<WritingCanvasProps> = ({
  width,
  height,
  isDarkMode,
  showStrokeGuide,
  characterStroke,
  currentStroke,
  onStrokeComplete,
  onDrawingStart,
  onDrawingEnd,
  onClear
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const [currentPoints, setCurrentPoints] = useState<StrokePoint[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Set initial canvas style
    ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [width, height, isDarkMode]);

  useEffect(() => {
    if (showStrokeGuide && characterStroke) {
      drawStrokeGuide();
    }
  }, [showStrokeGuide, characterStroke, currentStroke]);

  const drawStrokeGuide = () => {
    const canvas = canvasRef.current;
    if (!canvas || !characterStroke) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear previous guide
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw current stroke guide
    const currentStrokeData = characterStroke.strokes[currentStroke];
    if (!currentStrokeData) return;

    ctx.strokeStyle = isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;

    // Draw the stroke guide
    ctx.beginPath();
    ctx.moveTo(currentStrokeData.startPoint.x, currentStrokeData.startPoint.y);
    currentStrokeData.points.forEach(point => {
      ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    // Draw stroke direction indicator
    const { startPoint, endPoint } = currentStrokeData;
    const midX = (startPoint.x + endPoint.x) / 2;
    const midY = (startPoint.y + endPoint.y) / 2;
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    
    ctx.beginPath();
    ctx.moveTo(midX, midY);
    ctx.lineTo(
      midX + Math.cos(angle - Math.PI/6) * 10,
      midY + Math.sin(angle - Math.PI/6) * 10
    );
    ctx.stroke();

    // Reset stroke style
    ctx.strokeStyle = isDarkMode ? '#ffffff' : '#000000';
    ctx.lineWidth = 3;
  };

  const getPressure = (e: MouseEvent | TouchEvent): number => {
    if ('pressure' in e && typeof (e as PointerEvent).pressure === 'number') {
      return (e as PointerEvent).pressure;
    }
    return 0.5; // Default pressure for non-pressure-sensitive input
  };

  const getCanvasPoint = (e: MouseEvent | TouchEvent): StrokePoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, timestamp: Date.now() };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
      pressure: getPressure(e),
      timestamp: Date.now()
    };
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const point = getCanvasPoint(e.nativeEvent);
    
    isDrawing.current = true;
    setStartTime(Date.now());
    setCurrentPoints([point]);
    onDrawingStart();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;

    const point = getCanvasPoint(e.nativeEvent);
    setCurrentPoints(prev => [...prev, point]);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  };

  const handleEnd = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing.current) return;

    isDrawing.current = false;
    const endTime = Date.now();
    onDrawingEnd();

    // Create stroke object
    const stroke: Stroke = {
      type: determineStrokeType(currentPoints),
      points: currentPoints,
      startPoint: currentPoints[0],
      endPoint: currentPoints[currentPoints.length - 1],
      direction: determineStrokeDirection(currentPoints),
      length: calculateStrokeLength(currentPoints),
      angle: calculateStrokeAngle(currentPoints)
    };

    onStrokeComplete(stroke);
    setCurrentPoints([]);
  };

  const determineStrokeType = (points: StrokePoint[]): StrokeType => {
    // Implement stroke type detection based on points
    // This is a simplified version - you would want more sophisticated detection
    const { startPoint, endPoint } = getStrokeEndpoints(points);
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const angle = Math.abs(Math.atan2(dy, dx) * 180 / Math.PI);

    if (points.length < 3) return 'dot';
    if (angle < 30 || angle > 150) return 'horizontal';
    if (angle > 60 && angle < 120) return 'vertical';
    if (points.some(p => p.pressure && p.pressure > 0.8)) return 'hook';
    return 'complex';
  };

  const determineStrokeDirection = (points: StrokePoint[]): Stroke['direction'] => {
    const { startPoint, endPoint } = getStrokeEndpoints(points);
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    if (Math.abs(angle) < 30) return 'left-to-right';
    if (Math.abs(angle) > 150) return 'right-to-left';
    if (angle > 60 && angle < 120) return 'top-to-bottom';
    if (angle < -60 && angle > -120) return 'bottom-to-top';
    return 'diagonal';
  };

  const getStrokeEndpoints = (points: StrokePoint[]) => ({
    startPoint: points[0],
    endPoint: points[points.length - 1]
  });

  const calculateStrokeLength = (points: StrokePoint[]): number => {
    const { startPoint, endPoint } = getStrokeEndpoints(points);
    return Math.sqrt(
      Math.pow(endPoint.x - startPoint.x, 2) + 
      Math.pow(endPoint.y - startPoint.y, 2)
    );
  };

  const calculateStrokeAngle = (points: StrokePoint[]): number => {
    const { startPoint, endPoint } = getStrokeEndpoints(points);
    return Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x) * 180 / Math.PI;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`border-2 rounded-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    />
  );
};

export default WritingCanvas; 