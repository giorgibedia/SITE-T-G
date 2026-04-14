/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { ImageSegmenter, HandLandmarker, FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { Camera, RefreshCw, Palette, AlertCircle, Sparkles, X } from 'lucide-react';

const CHARACTERS = [
  { name: 'None', value: 'none' },
  { name: 'Vampire', value: 'vampire' },
  { name: 'Wizard', value: 'wizard' },
  { name: 'Avatar', value: 'avatar' },
  { name: 'Fairy', value: 'fairy' },
  { name: 'Elf', value: 'elf' },
];

const HAIR_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Neon Blue', value: '#00FFFF' },
  { name: 'Hot Pink', value: '#FF69B4' },
  { name: 'Emerald', value: '#50C878' },
  { name: 'Purple', value: '#800080' },
  { name: 'Crimson', value: '#DC143C' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Orange', value: '#FF4500' },
  { name: 'Teal', value: '#008080' },
];

const NAIL_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Classic Red', value: '#FF0000' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Neon Pink', value: '#FF1493' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Lavender', value: '#E6E6FA' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Silver', value: '#C0C0C0' },
  { name: 'Burgundy', value: '#800020' },
];

const BG_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Beach', value: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1280&q=80' },
  { name: 'Galaxy', value: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1280&q=80' },
  { name: 'City', value: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1280&q=80' },
  { name: 'Forest', value: 'https://images.unsplash.com/photo-1448375240586-882707db8855?w=1280&q=80' },
  { name: 'Studio Gray', value: '#808080' },
  { name: 'Chroma Green', value: '#00FF00' },
  { name: 'Pitch Black', value: '#000000' },
];

const BEARD_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Black', value: '#1A1A1A' },
  { name: 'Dark Brown', value: '#3B2F2F' },
  { name: 'Brown', value: '#4A3018' },
  { name: 'Blonde', value: '#E6C594' },
  { name: 'Red', value: '#8B2500' },
  { name: 'Gray', value: '#808080' },
  { name: 'White', value: '#FFFFFF' },
];

const EYEBROW_COLORS = [
  { name: 'None', value: 'transparent' },
  { name: 'Black', value: '#1A1A1A' },
  { name: 'Dark Brown', value: '#3B2F2F' },
  { name: 'Brown', value: '#4A3018' },
  { name: 'Blonde', value: '#E6C594' },
  { name: 'Red', value: '#8B2500' },
  { name: 'Gray', value: '#808080' },
  { name: 'Neon Blue', value: '#00FFFF' },
];

const BEARD_STYLES = [
  { name: 'Full Beard', value: 'full' },
  { name: 'Goatee', value: 'goatee' },
  { name: 'Mustache', value: 'mustache' },
];

const MEMES = [
  { name: 'None', value: 'none' },
  { name: 'Deal With It', value: 'deal_with_it' },
  { name: 'Thug Life', value: 'thug_life' },
  { name: 'Clown', value: 'clown' },
  { name: 'Crown', value: 'crown' },
  { name: 'Crying', value: 'crying' },
  { name: 'Heart Eyes', value: 'heart_eyes' },
  { name: 'Mind Blown', value: 'mind_blown' },
  { name: 'Cool Dog', value: 'cool_dog' },
  { name: 'Alien', value: 'alien' },
  { name: 'Spinning Star', value: 'spinning_star' },
  { name: 'Floating Hearts', value: 'floating_hearts' },
  { name: 'Pulsing Brain', value: 'pulsing_brain' },
  { name: 'Party', value: 'party' },
];

const GLASSES = [
  { name: 'None', value: 'none' },
  { name: 'Sunglasses', value: 'sunglasses' },
  { name: 'Nerd Glasses', value: 'nerd' },
  { name: 'Goggles', value: 'goggles' },
  { name: 'Aviators', value: 'aviators' },
  { name: 'Star Glasses', value: 'star_glasses' },
];

const WATCHES = [
  { name: 'None', value: 'none' },
  { name: 'Watch', value: 'watch' },
  { name: 'Smartwatch', value: 'smartwatch' },
  { name: 'Gold Bracelet', value: 'gold_bracelet' },
];

const MAKEUPS = [
  { name: 'None', value: 'none' },
  { name: 'Red Lips', value: 'red_lips' },
  { name: 'Goth', value: 'goth' },
  { name: 'Blush', value: 'blush' },
  { name: 'Cat Eye', value: 'cat_eye' },
  { name: 'Clown Paint', value: 'clown_paint' },
  { name: 'Cyberpunk', value: 'cyberpunk' },
];

const TSHIRTS = [
  { name: 'None', value: 'transparent' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Black', value: '#111111' },
  { name: 'White', value: '#EEEEEE' },
  { name: 'Pink', value: '#FF69B4' },
];

const ColorPalette = ({ title, colors, selectedColor, onSelectColor, badgeColor }: any) => (
  <div className="relative border border-white/5 rounded-2xl p-4 bg-black/20 shrink-0 mt-4">
    <div className={`absolute -top-3 left-6 px-3 py-1 ${badgeColor} text-black font-mono text-[10px] font-bold uppercase tracking-widest rounded-full`}>
      {title}
    </div>
    <div className="flex overflow-x-auto pb-2 pt-2 gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {colors.map((color: any) => (
        <button
          key={color.name}
          onClick={() => onSelectColor(color.value)}
          className={`group relative flex flex-col items-center gap-2 transition-all shrink-0 ${
            selectedColor === color.value ? 'scale-110' : 'opacity-60 hover:opacity-100'
          }`}
        >
          <div 
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all overflow-hidden ${
              selectedColor === color.value ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-white/10'
            }`}
            style={{ backgroundColor: color.value === 'transparent' ? '#222' : (color.value.startsWith('http') ? 'transparent' : color.value) }}
          >
            {color.value.startsWith('http') && (
              <img src={color.value} alt={color.name} className="w-full h-full object-cover" crossOrigin="anonymous" />
            )}
            {color.value === 'transparent' && (
              <div className="w-6 h-0.5 bg-red-500/50 rotate-45" />
            )}
          </div>
          <span className="text-[8px] font-mono uppercase tracking-tighter text-white/40 group-hover:text-white/80 whitespace-nowrap">
            {color.name}
          </span>
          {selectedColor === color.value && (
            <div className="absolute -bottom-2 w-1 h-1 bg-white rounded-full" />
          )}
        </button>
      ))}
    </div>
  </div>
);

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSegmenter, setImageSegmenter] = useState<ImageSegmenter | null>(null);
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(null);
  const [selectedColor, setSelectedColor] = useState(HAIR_COLORS[1].value);
  const [selectedNailColor, setSelectedNailColor] = useState(NAIL_COLORS[1].value);
  const [selectedBgColor, setSelectedBgColor] = useState(BG_COLORS[0].value);
  const [selectedBeardColor, setSelectedBeardColor] = useState(BEARD_COLORS[0].value);
  const [selectedEyebrowColor, setSelectedEyebrowColor] = useState(EYEBROW_COLORS[0].value);
  const [selectedBeardStyle, setSelectedBeardStyle] = useState(BEARD_STYLES[0].value);
  const [selectedMeme, setSelectedMeme] = useState(MEMES[0].value);
  const [selectedGlasses, setSelectedGlasses] = useState(GLASSES[0].value);
  const [selectedWatch, setSelectedWatch] = useState(WATCHES[0].value);
  const [selectedMakeup, setSelectedMakeup] = useState(MAKEUPS[0].value);
  const [selectedTshirt, setSelectedTshirt] = useState(TSHIRTS[0].value);
  const [selectedCharacter, setSelectedCharacter] = useState(CHARACTERS[0].value);
  const [activeCategory, setActiveCategory] = useState<string>('characters');
  const [isEffectsPanelOpen, setIsEffectsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isWebcamStarted, setIsWebcamStarted] = useState(false);
  
  const requestRef = useRef<number>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const prevMaskRef = useRef<Float32Array | null>(null);
  const reusableImageDataRef = useRef<ImageData | null>(null);
  const bgImagesRef = useRef<Record<string, HTMLImageElement>>({});

  useEffect(() => {
    BG_COLORS.forEach(bg => {
      if (bg.value.startsWith('http')) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = bg.value;
        bgImagesRef.current[bg.value] = img;
      }
    });
  }, []);

  useEffect(() => {
    async function initMediaPipe() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        
        // Load Multi-class Selfie Segmenter
        // Categories: 0-bg, 1-hair, 2-body, 3-face, 4-clothes, 5-others
        const segmenter = await ImageSegmenter.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          outputCategoryMask: false,
          outputConfidenceMasks: true
        });

        const handTracker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });

        const faceTracker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numFaces: 1
        });
        
        setImageSegmenter(segmenter);
        setHandLandmarker(handTracker);
        setFaceLandmarker(faceTracker);
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to initialize MediaPipe:", err);
        setError("Failed to load AI models. Please check your connection.");
        setIsLoading(false);
      }
    }

    initMediaPipe();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      imageSegmenter?.close();
      handLandmarker?.close();
      faceLandmarker?.close();
    };
  }, []);

  const startWebcam = async () => {
    if (!videoRef.current) return;
    
    try {
      const isMobile = window.innerWidth < 768;
      // Request high resolution for better quality
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: isMobile ? { ideal: 720 } : { ideal: 1280 }, 
          height: isMobile ? { ideal: 1280 } : { ideal: 720 }, 
          facingMode: { ideal: 'user' }
        } 
      });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
        setIsWebcamStarted(true);
      };
    } catch (err: any) {
      console.error("Error accessing webcam:", err);
      if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
        setError("Camera access was denied. Please click the camera icon in your browser's address bar to allow access, or check your system settings, then reload the page.");
      } else if (err.name === 'NotFoundError') {
        setError("No camera found on this device. Please connect a camera and try again.");
      } else {
        setError(`Webcam error: ${err.message || 'Unknown error'}. Please check your camera connection.`);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isWebcamStarted && imageSegmenter && handLandmarker && faceLandmarker) {
      // Start render loop only once
      requestRef.current = requestAnimationFrame(renderLoop);
    }
    return () => {
      isMounted = false;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isWebcamStarted, imageSegmenter, handLandmarker, faceLandmarker]); // Remove state dependencies to prevent multiple loops

  // Use refs for state that needs to be accessed inside the render loop without triggering re-renders
  const stateRefs = useRef({
    selectedColor,
    selectedNailColor,
    selectedBgColor,
    selectedBeardColor,
    selectedEyebrowColor,
    selectedBeardStyle,
    selectedMeme,
    selectedGlasses,
    selectedWatch,
    selectedMakeup,
    selectedTshirt,
    selectedCharacter
  });
  
  // Ref to throttle frames
  const lastFrameTimeRef = useRef<number>(0);

  useEffect(() => {
    stateRefs.current = {
      selectedColor,
      selectedNailColor,
      selectedBgColor,
      selectedBeardColor,
      selectedEyebrowColor,
      selectedBeardStyle,
      selectedMeme,
      selectedGlasses,
      selectedWatch,
      selectedMakeup,
      selectedTshirt,
      selectedCharacter
    };
  }, [selectedColor, selectedNailColor, selectedBgColor, selectedBeardColor, selectedEyebrowColor, selectedBeardStyle, selectedMeme, selectedGlasses, selectedWatch, selectedMakeup, selectedTshirt, selectedCharacter]);

  const renderLoop = (timestamp: number) => {
    if (!videoRef.current || !canvasRef.current || !imageSegmenter || !handLandmarker || !faceLandmarker) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    // CRITICAL: Removed willReadFrequently: true to re-enable GPU acceleration
    const ctx = canvas.getContext('2d'); 
    
    if (!ctx || video.paused || video.ended) {
      requestRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    // Ensure canvas matches video dimensions
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      if (video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        if (!maskCanvasRef.current) {
          maskCanvasRef.current = document.createElement('canvas');
        }
        maskCanvasRef.current.width = video.videoWidth;
        maskCanvasRef.current.height = video.videoHeight;
        maskCtxRef.current = maskCanvasRef.current.getContext('2d', { willReadFrequently: true });
        prevMaskRef.current = null;
        reusableImageDataRef.current = new ImageData(video.videoWidth, video.videoHeight);
      }
    }

    if (canvas.width === 0) {
      requestRef.current = requestAnimationFrame(renderLoop);
      return;
    }

    const startTimeMs = performance.now();
    const { selectedColor, selectedNailColor, selectedBgColor, selectedBeardColor, selectedEyebrowColor, selectedBeardStyle, selectedMeme, selectedGlasses, selectedWatch, selectedMakeup, selectedTshirt, selectedCharacter } = stateRefs.current;
    
    const needsSegmentation = selectedColor !== 'transparent' || selectedBgColor !== 'transparent' || selectedTshirt !== 'transparent';
    const needsHand = selectedNailColor !== 'transparent' || selectedWatch !== 'none' || selectedCharacter !== 'none';
    const needsFace = selectedBeardColor !== 'transparent' || selectedEyebrowColor !== 'transparent' || selectedMeme !== 'none' || selectedGlasses !== 'none' || selectedMakeup !== 'none' || selectedCharacter !== 'none';

    const processFrame = (confidenceMasks?: any[]) => {
      const hairMask = confidenceMasks ? confidenceMasks[1] : null;
      const bgMask = confidenceMasks ? confidenceMasks[0] : null;
      const clothesMask = confidenceMasks ? confidenceMasks[4] : null;

      // 2. Clear main canvas and draw video
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 2.5 Draw Background
      if (selectedBgColor !== 'transparent' && bgMask) {
        const bgData = bgMask.getAsFloat32Array();
        const maskCanvas = maskCanvasRef.current!;
        const maskCtx = maskCtxRef.current!;
        const imageData = reusableImageDataRef.current!;
        const data32 = new Uint32Array(imageData.data.buffer);
        
        // Optimize: Only process pixels if confidence is high enough
        for (let i = 0; i < bgData.length; i++) {
          const confidence = bgData[i];
          if (confidence > 0.1) {
            const alpha = Math.min(255, ((confidence - 0.1) / 0.9) * 255);
            data32[i] = (alpha << 24) | 0x00FFFFFF;
          } else {
            data32[i] = 0; // Transparent
          }
        }
        maskCtx.putImageData(imageData, 0, 0);
        
        maskCtx.globalCompositeOperation = 'source-in';
        if (selectedBgColor.startsWith('http')) {
          const img = bgImagesRef.current[selectedBgColor];
          if (img && img.complete) {
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;
            maskCtx.drawImage(img, x, y, img.width * scale, img.height * scale);
          } else {
            maskCtx.fillStyle = '#000000';
            maskCtx.fillRect(0, 0, canvas.width, canvas.height);
          }
        } else {
          maskCtx.fillStyle = selectedBgColor;
          maskCtx.fillRect(0, 0, canvas.width, canvas.height);
        }
        maskCtx.globalCompositeOperation = 'source-over';

        ctx.save();
        ctx.globalCompositeOperation = 'normal';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.restore();
      }

      // 2.6 Draw T-Shirt
      if (selectedTshirt !== 'transparent' && clothesMask) {
        const clothesData = clothesMask.getAsFloat32Array();
        const maskCanvas = maskCanvasRef.current!;
        const maskCtx = maskCtxRef.current!;
        const imageData = reusableImageDataRef.current!;
        const data32 = new Uint32Array(imageData.data.buffer);
        
        for (let i = 0; i < clothesData.length; i++) {
          const confidence = clothesData[i];
          if (confidence > 0.3) {
            const alpha = Math.min(255, ((confidence - 0.3) / 0.4) * 255);
            data32[i] = (alpha << 24) | 0x00FFFFFF;
          } else {
            data32[i] = 0;
          }
        }
        maskCtx.putImageData(imageData, 0, 0);
        
        maskCtx.globalCompositeOperation = 'source-in';
        maskCtx.fillStyle = selectedTshirt;
        maskCtx.fillRect(0, 0, canvas.width, canvas.height);
        maskCtx.globalCompositeOperation = 'source-over';

        ctx.save();
        ctx.globalCompositeOperation = 'multiply';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.restore();
      }

      if (selectedColor !== 'transparent' && hairMask) {
        const maskCanvas = maskCanvasRef.current!;
        const maskCtx = maskCtxRef.current!;
        
        const hairData = hairMask.getAsFloat32Array();
        
        // Adjusted smoothing factor to 0.4 for a balance between responsiveness and stability
        if (!prevMaskRef.current || prevMaskRef.current.length !== hairData.length) {
          prevMaskRef.current = new Float32Array(hairData);
        } else {
          const smoothingFactor = 0.4;
          for (let i = 0; i < hairData.length; i++) {
            prevMaskRef.current[i] = (hairData[i] * smoothingFactor) + (prevMaskRef.current[i] * (1 - smoothingFactor));
          }
        }

        const smoothedMask = prevMaskRef.current;
        const imageData = reusableImageDataRef.current!;
        const data32 = new Uint32Array(imageData.data.buffer);
        
        for (let i = 0; i < smoothedMask.length; i++) {
          const confidence = smoothedMask[i];
          
          // Soft Alpha Ramping: Start at 30% confidence to catch fine flyaways
          // We use a wider ramp (0.3 to 0.7) for a smoother transition
          if (confidence > 0.3) {
            const alpha = Math.min(255, ((confidence - 0.3) / 0.4) * 255);
            data32[i] = (alpha << 24) | 0x00FFFFFF;
          } else {
            data32[i] = 0;
          }
        }
        
        maskCtx.putImageData(imageData, 0, 0);

        // 4. Color the mask
        maskCtx.globalCompositeOperation = 'source-in';
        maskCtx.fillStyle = selectedColor;
        maskCtx.fillRect(0, 0, canvas.width, canvas.height);
        maskCtx.globalCompositeOperation = 'source-over';

        // 5. Blend colored mask onto main canvas
        ctx.save();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.drawImage(maskCanvas, 0, 0);
        ctx.restore();
      }

      // 6. Draw Nails and Watches
      let handResults: any = null;
      if (needsHand) {
        handResults = handLandmarker.detectForVideo(video, startTimeMs);
        if (handResults.landmarks && (selectedNailColor !== 'transparent' || selectedWatch !== 'none')) {
          if (selectedNailColor !== 'transparent') {
            ctx.save();
            ctx.fillStyle = selectedNailColor;
            ctx.shadowColor = 'rgba(255,255,255,0.4)';
            ctx.shadowBlur = 6;
            
            for (const landmarks of handResults.landmarks) {
              // Fingertip indices: 4, 8, 12, 16, 20
              const tips = [4, 8, 12, 16, 20];
              const dips = [3, 7, 11, 15, 19];
              
              for (let i = 0; i < tips.length; i++) {
                const tip = landmarks[tips[i]];
                const dip = landmarks[dips[i]];
                
                const x = tip.x * canvas.width;
                const y = tip.y * canvas.height;
                const dipX = dip.x * canvas.width;
                const dipY = dip.y * canvas.height;
                
                const dist = Math.sqrt(Math.pow(x - dipX, 2) + Math.pow(y - dipY, 2));
                const nailLength = dist * 0.4;
                const nailWidth = dist * 0.3;
                const angle = Math.atan2(y - dipY, x - dipX);
                
                ctx.translate(x, y);
                ctx.rotate(angle);
                
                // Draw nail
                ctx.beginPath();
                ctx.ellipse(nailLength * 0.4, 0, nailLength, nailWidth, 0, 0, 2 * Math.PI);
                ctx.fill();
                
                // Shine effect
                ctx.fillStyle = 'rgba(255,255,255,0.5)';
                ctx.beginPath();
                ctx.ellipse(nailLength * 0.4, -nailWidth * 0.3, nailLength * 0.4, nailWidth * 0.15, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.fillStyle = selectedNailColor;
                
                ctx.rotate(-angle);
                ctx.translate(-x, -y);
              }
            }
            ctx.restore();
          }

          if (selectedWatch !== 'none') {
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            for (const landmarks of handResults.landmarks) {
              const wrist = landmarks[0];
              const indexBase = landmarks[5];
              const pinkyBase = landmarks[17];
              
              const wristX = wrist.x * canvas.width;
              const wristY = wrist.y * canvas.height;
              
              const wristWidth = Math.sqrt(
                Math.pow((indexBase.x - pinkyBase.x) * canvas.width, 2) +
                Math.pow((indexBase.y - pinkyBase.y) * canvas.height, 2)
              );
              
              ctx.font = `${wristWidth * 1.5}px Arial`;
              if (selectedWatch === 'watch') {
                ctx.fillText('⌚', wristX, wristY);
              } else if (selectedWatch === 'smartwatch') {
                ctx.fillStyle = '#111';
                ctx.fillRect(wristX - wristWidth*0.4, wristY - wristWidth*0.4, wristWidth*0.8, wristWidth*0.8);
                ctx.fillStyle = '#0f0';
                ctx.font = `${wristWidth * 0.3}px monospace`;
                ctx.fillText('12:00', wristX, wristY);
              } else if (selectedWatch === 'gold_bracelet') {
                const angle = Math.atan2(indexBase.y - wrist.y, indexBase.x - wrist.x);
                ctx.strokeStyle = 'gold';
                ctx.lineWidth = wristWidth * 0.2;
                ctx.beginPath();
                ctx.ellipse(wristX, wristY, wristWidth * 0.6, wristWidth * 0.3, angle, 0, Math.PI * 2);
                ctx.stroke();
              }
            }
            ctx.restore();
          }
        }
      }

      // 7. Draw Face Features (Beard, Eyebrows, Makeup, Glasses, Memes, Characters)
      if (selectedBeardColor !== 'transparent' || selectedEyebrowColor !== 'transparent' || selectedMeme !== 'none' || selectedGlasses !== 'none' || selectedMakeup !== 'none' || selectedCharacter !== 'none') {
        const faceResults = faceLandmarker.detectForVideo(video, startTimeMs);
        if (faceResults.faceLandmarks) {
          for (const landmarks of faceResults.faceLandmarks) {
          
          if (selectedBeardColor !== 'transparent') {
            ctx.save();
            ctx.fillStyle = selectedBeardColor;
            ctx.globalCompositeOperation = 'soft-light';
            ctx.filter = 'blur(4px)';
            
            const jawIndices = [132, 58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361];
            const lipIndices = [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61];
            const mustacheTopIndices = [164, 167, 165, 92, 186, 57, 43, 106, 182, 83, 18, 313, 406, 335, 273, 287, 410, 322, 391, 393];
            const mustacheBottomIndices = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
            
            ctx.beginPath();
            
            if (selectedBeardStyle === 'full') {
              // Jawline
              for (let i = 0; i < jawIndices.length; i++) {
                const pt = landmarks[jawIndices[i]];
                if (i === 0) ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
                else ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
              // Lower lip bottom
              for (let i = 0; i < lipIndices.length; i++) {
                const pt = landmarks[lipIndices[i]];
                ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
              ctx.closePath();
              ctx.fill();
              
              // Mustache part of full beard
              ctx.beginPath();
              for (let i = 0; i < mustacheTopIndices.length; i++) {
                const pt = landmarks[mustacheTopIndices[i]];
                if (i === 0) ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
                else ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
              for (let i = 0; i < mustacheBottomIndices.length; i++) {
                const pt = landmarks[mustacheBottomIndices[i]];
                ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
            } else if (selectedBeardStyle === 'goatee') {
              // Goatee (chin area)
              const goateeIndices = [150, 149, 176, 148, 152, 377, 400, 378, 379];
              for (let i = 0; i < goateeIndices.length; i++) {
                const pt = landmarks[goateeIndices[i]];
                if (i === 0) ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
                else ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
              // Lower lip bottom
              for (let i = 0; i < lipIndices.length; i++) {
                const pt = landmarks[lipIndices[i]];
                ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
            } else if (selectedBeardStyle === 'mustache') {
              // Mustache only
              for (let i = 0; i < mustacheTopIndices.length; i++) {
                const pt = landmarks[mustacheTopIndices[i]];
                if (i === 0) ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
                else ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
              for (let i = 0; i < mustacheBottomIndices.length; i++) {
                const pt = landmarks[mustacheBottomIndices[i]];
                ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
            }
            
            ctx.closePath();
            ctx.fill();
            
            // Draw a second pass for multiply to make it darker
            ctx.globalCompositeOperation = 'multiply';
            ctx.globalAlpha = 0.6;
            ctx.fill();
            
            ctx.restore();
          }
          
          if (selectedEyebrowColor !== 'transparent') {
            ctx.save();
            ctx.strokeStyle = selectedEyebrowColor;
            ctx.lineWidth = 8;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.globalCompositeOperation = 'soft-light';
            ctx.filter = 'blur(2px)';
            
            const drawEyebrow = (connections: any[]) => {
              for (const conn of connections) {
                const start = landmarks[conn.start];
                const end = landmarks[conn.end];
                ctx.beginPath();
                ctx.moveTo(start.x * canvas.width, start.y * canvas.height);
                ctx.lineTo(end.x * canvas.width, end.y * canvas.height);
                ctx.stroke();
              }
            };
            
            drawEyebrow(FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW);
            drawEyebrow(FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW);
            
            // Second pass for multiply
            ctx.globalCompositeOperation = 'multiply';
            ctx.globalAlpha = 0.7;
            drawEyebrow(FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW);
            drawEyebrow(FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW);
            
            ctx.restore();
          }

          if (selectedMakeup !== 'none') {
            ctx.save();
            if (selectedMakeup === 'red_lips' || selectedMakeup === 'goth') {
              ctx.fillStyle = selectedMakeup === 'red_lips' ? 'rgba(255, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.7)';
              ctx.globalCompositeOperation = 'multiply';
              ctx.beginPath();
              const upperLip = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 62, 76, 61];
              const lowerLip = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 62, 76, 61];
              
              for (let i = 0; i < upperLip.length; i++) {
                const pt = landmarks[upperLip[i]];
                if (i === 0) ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
                else ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
              for (let i = 0; i < lowerLip.length; i++) {
                const pt = landmarks[lowerLip[i]];
                if (i === 0) ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
                else ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
              ctx.fill();
            }
            if (selectedMakeup === 'blush') {
              ctx.fillStyle = 'rgba(255, 105, 180, 0.3)';
              ctx.globalCompositeOperation = 'multiply';
              ctx.filter = 'blur(10px)';
              const leftCheek = landmarks[205];
              const rightCheek = landmarks[425];
              const faceWidth = Math.sqrt(
                Math.pow((landmarks[454].x - landmarks[234].x) * canvas.width, 2) +
                Math.pow((landmarks[454].y - landmarks[234].y) * canvas.height, 2)
              );
              const radius = faceWidth * 0.15;
              
              ctx.beginPath();
              ctx.arc(leftCheek.x * canvas.width, leftCheek.y * canvas.height, radius, 0, 2 * Math.PI);
              ctx.fill();
              
              ctx.beginPath();
              ctx.arc(rightCheek.x * canvas.width, rightCheek.y * canvas.height, radius, 0, 2 * Math.PI);
              ctx.fill();
            }
            if (selectedMakeup === 'cat_eye') {
              ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
              ctx.lineWidth = 4;
              ctx.lineCap = 'round';
              ctx.lineJoin = 'round';
              const leftEyeOuter = landmarks[33];
              const rightEyeOuter = landmarks[263];
              
              ctx.beginPath();
              ctx.moveTo(leftEyeOuter.x * canvas.width, leftEyeOuter.y * canvas.height);
              ctx.lineTo(leftEyeOuter.x * canvas.width - 20, leftEyeOuter.y * canvas.height - 10);
              ctx.stroke();
              
              ctx.beginPath();
              ctx.moveTo(rightEyeOuter.x * canvas.width, rightEyeOuter.y * canvas.height);
              ctx.lineTo(rightEyeOuter.x * canvas.width + 20, rightEyeOuter.y * canvas.height - 10);
              ctx.stroke();
            }
            if (selectedMakeup === 'clown_paint') {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
              const faceWidth = Math.sqrt(
                Math.pow((landmarks[454].x - landmarks[234].x) * canvas.width, 2) +
                Math.pow((landmarks[454].y - landmarks[234].y) * canvas.height, 2)
              );
              ctx.beginPath();
              ctx.arc(landmarks[1].x * canvas.width, landmarks[1].y * canvas.height, faceWidth * 0.4, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
              ctx.beginPath();
              ctx.arc(landmarks[1].x * canvas.width, landmarks[1].y * canvas.height, faceWidth * 0.1, 0, Math.PI * 2);
              ctx.fill();
            }
            if (selectedMakeup === 'cyberpunk') {
              ctx.strokeStyle = '#00FFFF';
              ctx.lineWidth = 3;
              ctx.shadowColor = '#00FFFF';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.moveTo(landmarks[234].x * canvas.width, landmarks[234].y * canvas.height);
              ctx.lineTo(landmarks[152].x * canvas.width, landmarks[152].y * canvas.height);
              ctx.lineTo(landmarks[454].x * canvas.width, landmarks[454].y * canvas.height);
              ctx.stroke();
              ctx.shadowBlur = 0;
            }
            ctx.restore();
          }

          if (selectedGlasses !== 'none') {
            ctx.save();
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];
            const cx = (leftEye.x + rightEye.x) / 2 * canvas.width;
            const cy = (leftEye.y + rightEye.y) / 2 * canvas.height;
            const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
            const faceWidth = Math.sqrt(
              Math.pow((landmarks[454].x - landmarks[234].x) * canvas.width, 2) +
              Math.pow((landmarks[454].y - landmarks[234].y) * canvas.height, 2)
            );
            
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            if (selectedGlasses === 'sunglasses') {
              ctx.font = `${faceWidth * 1.1}px Arial`;
              ctx.fillText('🕶️', 0, 0);
            } else if (selectedGlasses === 'nerd') {
              ctx.font = `${faceWidth * 1.1}px Arial`;
              ctx.fillText('👓', 0, 0);
            } else if (selectedGlasses === 'goggles') {
              ctx.font = `${faceWidth * 1.1}px Arial`;
              ctx.fillText('🥽', 0, 0);
            } else if (selectedGlasses === 'aviators') {
              ctx.strokeStyle = 'gold';
              ctx.lineWidth = faceWidth * 0.02;
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.beginPath();
              ctx.ellipse(-faceWidth * 0.22, 0, faceWidth * 0.2, faceWidth * 0.15, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
              ctx.beginPath();
              ctx.ellipse(faceWidth * 0.22, 0, faceWidth * 0.2, faceWidth * 0.15, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(-faceWidth * 0.02, -faceWidth * 0.05);
              ctx.lineTo(faceWidth * 0.02, -faceWidth * 0.05);
              ctx.stroke();
            } else if (selectedGlasses === 'star_glasses') {
              ctx.fillStyle = 'rgba(255, 20, 147, 0.8)';
              ctx.strokeStyle = 'white';
              ctx.lineWidth = faceWidth * 0.02;
              
              const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
                let rot = Math.PI / 2 * 3;
                let x = cx;
                let y = cy;
                const step = Math.PI / spikes;
                ctx.beginPath();
                ctx.moveTo(cx, cy - outerRadius);
                for (let i = 0; i < spikes; i++) {
                  x = cx + Math.cos(rot) * outerRadius;
                  y = cy + Math.sin(rot) * outerRadius;
                  ctx.lineTo(x, y);
                  rot += step;
                  x = cx + Math.cos(rot) * innerRadius;
                  y = cy + Math.sin(rot) * innerRadius;
                  ctx.lineTo(x, y);
                  rot += step;
                }
                ctx.lineTo(cx, cy - outerRadius);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
              };
              
              drawStar(-faceWidth * 0.22, 0, 5, faceWidth * 0.25, faceWidth * 0.1);
              drawStar(faceWidth * 0.22, 0, 5, faceWidth * 0.25, faceWidth * 0.1);
            }
            ctx.restore();
          }

          if (selectedCharacter !== 'none') {
            ctx.save();
            const faceWidth = Math.sqrt(
              Math.pow((landmarks[454].x - landmarks[234].x) * canvas.width, 2) +
              Math.pow((landmarks[454].y - landmarks[234].y) * canvas.height, 2)
            );
            
            const faceOval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10];

            if (selectedCharacter === 'vampire') {
              // White face
              ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
              ctx.beginPath();
              for (let i = 0; i < faceOval.length; i++) {
                const pt = landmarks[faceOval[i]];
                if (i === 0) ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
                else ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
              ctx.fill();
              
              // Dark circles under eyes
              ctx.save();
              ctx.globalCompositeOperation = 'multiply';
              const leftEyeBottom = landmarks[145];
              const rightEyeBottom = landmarks[374];
              
              const drawEyeBag = (center: any) => {
                const cx = center.x * canvas.width;
                const cy = center.y * canvas.height + faceWidth * 0.05;
                const rx = faceWidth * 0.15;
                const ry = faceWidth * 0.08;
                const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
                grad.addColorStop(0, 'rgba(50, 0, 0, 0.6)');
                grad.addColorStop(1, 'rgba(50, 0, 0, 0)');
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
                ctx.fill();
              };
              
              drawEyeBag(leftEyeBottom);
              drawEyeBag(rightEyeBottom);
              ctx.restore();
              
              // Red Eyes
              ctx.save();
              ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
              ctx.shadowColor = 'red';
              ctx.shadowBlur = 10;
              ctx.globalCompositeOperation = 'screen';
              const leftEyeCenter = landmarks[468];
              const rightEyeCenter = landmarks[473];
              if (leftEyeCenter && rightEyeCenter) {
                ctx.beginPath();
                ctx.arc(leftEyeCenter.x * canvas.width, leftEyeCenter.y * canvas.height, faceWidth * 0.04, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(rightEyeCenter.x * canvas.width, rightEyeCenter.y * canvas.height, faceWidth * 0.04, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();

              // Fangs
              ctx.fillStyle = '#f5f5f5';
              ctx.strokeStyle = '#333';
              ctx.lineWidth = 1;
              const leftFangBase = landmarks[82]; // Upper lip left
              const rightFangBase = landmarks[312]; // Upper lip right
              
              ctx.beginPath();
              ctx.moveTo(leftFangBase.x * canvas.width - 4, leftFangBase.y * canvas.height);
              ctx.lineTo(leftFangBase.x * canvas.width + 4, leftFangBase.y * canvas.height);
              ctx.lineTo(leftFangBase.x * canvas.width, leftFangBase.y * canvas.height + faceWidth * 0.15);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              
              ctx.beginPath();
              ctx.moveTo(rightFangBase.x * canvas.width - 4, rightFangBase.y * canvas.height);
              ctx.lineTo(rightFangBase.x * canvas.width + 4, rightFangBase.y * canvas.height);
              ctx.lineTo(rightFangBase.x * canvas.width, rightFangBase.y * canvas.height + faceWidth * 0.15);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Blood drip on left fang
              ctx.fillStyle = 'rgba(180, 0, 0, 0.9)';
              ctx.beginPath();
              ctx.arc(leftFangBase.x * canvas.width, leftFangBase.y * canvas.height + faceWidth * 0.18, 2.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.moveTo(leftFangBase.x * canvas.width, leftFangBase.y * canvas.height + faceWidth * 0.15);
              ctx.lineTo(leftFangBase.x * canvas.width, leftFangBase.y * canvas.height + faceWidth * 0.18);
              ctx.strokeStyle = 'rgba(180, 0, 0, 0.9)';
              ctx.lineWidth = 2;
              ctx.stroke();

              // Dracula Collar
              const chin = landmarks[152];
              ctx.fillStyle = 'rgba(20, 0, 0, 0.95)';
              ctx.strokeStyle = 'red';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(chin.x * canvas.width - faceWidth * 0.8, chin.y * canvas.height + faceWidth * 0.8);
              ctx.lineTo(chin.x * canvas.width - faceWidth * 1.5, chin.y * canvas.height - faceWidth * 0.2);
              ctx.lineTo(chin.x * canvas.width - faceWidth * 0.4, chin.y * canvas.height + faceWidth * 1.2);
              ctx.lineTo(chin.x * canvas.width + faceWidth * 0.4, chin.y * canvas.height + faceWidth * 1.2);
              ctx.lineTo(chin.x * canvas.width + faceWidth * 1.5, chin.y * canvas.height - faceWidth * 0.2);
              ctx.lineTo(chin.x * canvas.width + faceWidth * 0.8, chin.y * canvas.height + faceWidth * 0.8);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Hand Accessory: Glass of Blood
              if (handResults && handResults.landmarks && handResults.landmarks.length > 0) {
                const handPos = handResults.landmarks[0][8]; // Index finger
                const hx = handPos.x * canvas.width;
                const hy = handPos.y * canvas.height;
                
                ctx.save();
                ctx.translate(hx, hy);
                // Glass stem
                ctx.strokeStyle = 'rgba(200, 200, 200, 0.8)';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, faceWidth * 0.6);
                ctx.stroke();
                // Glass base
                ctx.beginPath();
                ctx.ellipse(0, faceWidth * 0.6, faceWidth * 0.2, faceWidth * 0.05, 0, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(200, 200, 200, 0.5)';
                ctx.fill();
                ctx.stroke();
                // Glass bowl
                ctx.beginPath();
                ctx.moveTo(-faceWidth * 0.25, -faceWidth * 0.4);
                ctx.quadraticCurveTo(-faceWidth * 0.25, 0, 0, 0);
                ctx.quadraticCurveTo(faceWidth * 0.25, 0, faceWidth * 0.25, -faceWidth * 0.4);
                ctx.closePath();
                ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
                ctx.fill();
                ctx.stroke();
                // Blood inside
                ctx.beginPath();
                ctx.moveTo(-faceWidth * 0.22, -faceWidth * 0.2);
                ctx.quadraticCurveTo(-faceWidth * 0.22, 0, 0, 0);
                ctx.quadraticCurveTo(faceWidth * 0.22, 0, faceWidth * 0.22, -faceWidth * 0.2);
                ctx.closePath();
                ctx.fillStyle = 'rgba(180, 0, 0, 0.9)';
                ctx.fill();
                ctx.restore();
              }
            } else if (selectedCharacter === 'wizard') {
              // Wizard Hat
              const topHead = landmarks[10];
              const leftHead = landmarks[21];
              const rightHead = landmarks[251];
              const hatWidth = faceWidth * 1.8;
              
              ctx.save();
              // Hat shadow
              const cx = topHead.x * canvas.width;
              const cy = topHead.y * canvas.height + faceWidth * 0.1;
              const rx = hatWidth / 2;
              const ry = faceWidth * 0.2;
              const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
              grad.addColorStop(0, 'rgba(0,0,0,0.6)');
              grad.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();

              ctx.fillStyle = '#1a252f'; // Darker blue
              // Hat Brim
              ctx.beginPath();
              ctx.ellipse(topHead.x * canvas.width, topHead.y * canvas.height, hatWidth / 2, faceWidth * 0.2, 0, 0, Math.PI * 2);
              ctx.fill();
              
              // Hat Cone
              ctx.beginPath();
              ctx.moveTo(topHead.x * canvas.width - hatWidth * 0.3, topHead.y * canvas.height);
              ctx.lineTo(topHead.x * canvas.width + hatWidth * 0.3, topHead.y * canvas.height);
              ctx.lineTo(topHead.x * canvas.width + hatWidth * 0.1, topHead.y * canvas.height - faceWidth * 1.8);
              ctx.lineTo(topHead.x * canvas.width - hatWidth * 0.2, topHead.y * canvas.height - faceWidth * 1.4);
              ctx.closePath();
              ctx.fill();
              
              // Hat Band
              ctx.strokeStyle = '#f39c12';
              ctx.lineWidth = faceWidth * 0.15;
              ctx.beginPath();
              ctx.moveTo(topHead.x * canvas.width - hatWidth * 0.28, topHead.y * canvas.height - faceWidth * 0.1);
              ctx.lineTo(topHead.x * canvas.width + hatWidth * 0.28, topHead.y * canvas.height - faceWidth * 0.1);
              ctx.stroke();

              // Magic Staff (drawn to the side or on hand)
              let staffX = topHead.x * canvas.width + faceWidth * 1.5;
              let staffY = topHead.y * canvas.height;
              
              if (handResults && handResults.landmarks && handResults.landmarks.length > 0) {
                const handPos = handResults.landmarks[0][8]; // Index finger
                staffX = handPos.x * canvas.width;
                staffY = handPos.y * canvas.height + faceWidth; // Offset so hand holds the middle
              }
              
              // Staff wood
              const gradient = ctx.createLinearGradient(staffX - 10, 0, staffX + 10, 0);
              gradient.addColorStop(0, '#5c4033');
              gradient.addColorStop(0.5, '#8b5a2b');
              gradient.addColorStop(1, '#3e2723');
              ctx.fillStyle = gradient;
              ctx.fillRect(staffX - 10, staffY - faceWidth, 20, faceWidth * 3);
              
              // Glowing Orb
              const time = startTimeMs / 200;
              const glow = Math.abs(Math.sin(time)) * 15 + 20;
              ctx.save();
              ctx.fillStyle = '#00ffff';
              ctx.shadowColor = '#00ffff';
              ctx.shadowBlur = glow;
              ctx.beginPath();
              ctx.arc(staffX, staffY - faceWidth - 10, 25, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = 'white';
              ctx.shadowBlur = glow * 2;
              ctx.beginPath();
              ctx.arc(staffX, staffY - faceWidth - 10, 12, 0, Math.PI * 2);
              ctx.fill();
              
              // Orb sparkles
              ctx.fillStyle = 'white';
              for(let i=0; i<3; i++) {
                const angle = (time + i * 2) * Math.PI;
                const r = 30 + Math.sin(time * 3 + i) * 10;
                const sx = staffX + Math.cos(angle) * r;
                const sy = staffY - faceWidth - 10 + Math.sin(angle) * r;
                ctx.beginPath();
                ctx.arc(sx, sy, 2, 0, Math.PI*2);
                ctx.fill();
              }
              ctx.restore();
            } else if (selectedCharacter === 'avatar') {
              // Blue Skin
              ctx.fillStyle = 'rgba(0, 150, 255, 0.5)';
              ctx.globalCompositeOperation = 'multiply';
              ctx.beginPath();
              for (let i = 0; i < faceOval.length; i++) {
                const pt = landmarks[faceOval[i]];
                if (i === 0) ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
                else ctx.lineTo(pt.x * canvas.width, pt.y * canvas.height);
              }
              ctx.fill();
              ctx.globalCompositeOperation = 'source-over';
              
              // Stripes
              ctx.strokeStyle = 'rgba(0, 50, 150, 0.6)';
              ctx.lineWidth = faceWidth * 0.05;
              ctx.lineCap = 'round';
              const forehead = landmarks[10];
              const nose = landmarks[8];
              const leftCheek = landmarks[234];
              const rightCheek = landmarks[454];
              
              ctx.beginPath();
              ctx.moveTo(forehead.x * canvas.width, forehead.y * canvas.height);
              ctx.lineTo(nose.x * canvas.width, nose.y * canvas.height - faceWidth * 0.2);
              
              ctx.moveTo(forehead.x * canvas.width - faceWidth * 0.2, forehead.y * canvas.height + faceWidth * 0.1);
              ctx.lineTo(forehead.x * canvas.width - faceWidth * 0.4, forehead.y * canvas.height + faceWidth * 0.3);
              
              ctx.moveTo(forehead.x * canvas.width + faceWidth * 0.2, forehead.y * canvas.height + faceWidth * 0.1);
              ctx.lineTo(forehead.x * canvas.width + faceWidth * 0.4, forehead.y * canvas.height + faceWidth * 0.3);
              
              ctx.moveTo(leftCheek.x * canvas.width, leftCheek.y * canvas.height);
              ctx.lineTo(leftCheek.x * canvas.width + faceWidth * 0.3, leftCheek.y * canvas.height + faceWidth * 0.1);
              
              ctx.moveTo(rightCheek.x * canvas.width, rightCheek.y * canvas.height);
              ctx.lineTo(rightCheek.x * canvas.width - faceWidth * 0.3, rightCheek.y * canvas.height + faceWidth * 0.1);
              
              ctx.stroke();

              // Glowing Freckles
              ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
              ctx.shadowColor = 'rgba(255, 255, 255, 1)';
              ctx.shadowBlur = 5;
              const frecklePoints = [
                landmarks[116], landmarks[117], landmarks[118], landmarks[119],
                landmarks[345], landmarks[346], landmarks[347], landmarks[348],
                landmarks[192], landmarks[416]
              ];
              for (const pt of frecklePoints) {
                if (pt) {
                  ctx.beginPath();
                  ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 2, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
              ctx.shadowBlur = 0;

              // Hand Accessory: Woodsprite (Seed of the Sacred Tree)
              if (handResults && handResults.landmarks && handResults.landmarks.length > 0) {
                const handPos = handResults.landmarks[0][8]; // Index finger
                const hx = handPos.x * canvas.width;
                const hy = handPos.y * canvas.height;
                const time = startTimeMs / 500;
                
                ctx.save();
                ctx.translate(hx, hy - faceWidth * 0.5);
                ctx.rotate(Math.sin(time) * 0.2);
                
                // Glow
                ctx.fillStyle = 'rgba(200, 255, 255, 0.8)';
                ctx.shadowColor = 'rgba(200, 255, 255, 1)';
                ctx.shadowBlur = 20;
                ctx.beginPath();
                ctx.arc(0, 0, faceWidth * 0.1, 0, Math.PI * 2);
                ctx.fill();
                
                // Tentacles
                ctx.strokeStyle = 'rgba(200, 255, 255, 0.6)';
                ctx.lineWidth = 1.5;
                for (let i = 0; i < 6; i++) {
                  const angle = (i / 6) * Math.PI * 2 + time;
                  ctx.beginPath();
                  ctx.moveTo(0, 0);
                  ctx.quadraticCurveTo(
                    Math.cos(angle) * faceWidth * 0.2, Math.sin(angle) * faceWidth * 0.2,
                    Math.cos(angle + 0.5) * faceWidth * 0.4, Math.sin(angle + 0.5) * faceWidth * 0.4
                  );
                  ctx.stroke();
                }
                ctx.restore();
              }
            } else if (selectedCharacter === 'fairy') {
              // Wings
              const neck = landmarks[152]; // Chin, use as base for wings
              
              const time = startTimeMs / 300;
              const flap = Math.sin(time) * 0.2;
              
              ctx.save();
              ctx.globalCompositeOperation = 'screen';
              
              // Left Wing
              ctx.save();
              ctx.translate(neck.x * canvas.width, neck.y * canvas.height + faceWidth * 0.5);
              ctx.rotate(-Math.PI / 4 + flap);
              
              const wingGradientL = ctx.createRadialGradient(-faceWidth*0.5, 0, 0, -faceWidth*0.5, 0, faceWidth * 1.5);
              wingGradientL.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
              wingGradientL.addColorStop(0.5, 'rgba(255, 182, 193, 0.6)');
              wingGradientL.addColorStop(1, 'rgba(135, 206, 235, 0.2)');
              
              ctx.fillStyle = wingGradientL;
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.lineWidth = 2;
              ctx.shadowColor = 'rgba(255, 182, 193, 0.8)';
              ctx.shadowBlur = 15;
              
              ctx.beginPath();
              ctx.ellipse(-faceWidth, 0, faceWidth * 1.2, faceWidth * 0.6, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
              // Inner wing detail
              ctx.beginPath();
              ctx.ellipse(-faceWidth * 0.8, 0, faceWidth * 0.8, faceWidth * 0.3, 0, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
              
              // Right Wing
              ctx.save();
              ctx.translate(neck.x * canvas.width, neck.y * canvas.height + faceWidth * 0.5);
              ctx.rotate(Math.PI / 4 - flap);
              
              const wingGradientR = ctx.createRadialGradient(faceWidth*0.5, 0, 0, faceWidth*0.5, 0, faceWidth * 1.5);
              wingGradientR.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
              wingGradientR.addColorStop(0.5, 'rgba(255, 182, 193, 0.6)');
              wingGradientR.addColorStop(1, 'rgba(135, 206, 235, 0.2)');
              
              ctx.fillStyle = wingGradientR;
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.lineWidth = 2;
              ctx.shadowColor = 'rgba(255, 182, 193, 0.8)';
              ctx.shadowBlur = 15;
              
              ctx.beginPath();
              ctx.ellipse(faceWidth, 0, faceWidth * 1.2, faceWidth * 0.6, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();
              // Inner wing detail
              ctx.beginPath();
              ctx.ellipse(faceWidth * 0.8, 0, faceWidth * 0.8, faceWidth * 0.3, 0, 0, Math.PI * 2);
              ctx.stroke();
              ctx.restore();
              
              ctx.restore(); // restore screen mode
              
              // Sparkles around head
              ctx.fillStyle = 'white';
              ctx.shadowColor = 'white';
              ctx.shadowBlur = 10;
              for(let i=0; i<8; i++) {
                const angle = (time * 0.5 + i) * Math.PI * 0.25;
                const r = faceWidth * 0.9 + Math.sin(time * 2 + i) * 15;
                const sx = landmarks[10].x * canvas.width + Math.cos(angle) * r;
                const sy = landmarks[10].y * canvas.height + Math.sin(angle) * r;
                const size = 2 + Math.sin(time * 5 + i) * 1.5;
                ctx.beginPath();
                ctx.arc(sx, sy, Math.max(0.1, size), 0, Math.PI*2);
                ctx.fill();
              }
              ctx.shadowBlur = 0;

              // Hand Accessory: Magic Wand
              if (handResults && handResults.landmarks && handResults.landmarks.length > 0) {
                const handPos = handResults.landmarks[0][8]; // Index finger
                const hx = handPos.x * canvas.width;
                const hy = handPos.y * canvas.height;
                
                ctx.save();
                ctx.translate(hx, hy);
                ctx.rotate(Math.PI / 6);
                
                // Wand stick
                ctx.strokeStyle = '#f1c40f';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, faceWidth);
                ctx.stroke();
                
                // Star on top
                ctx.fillStyle = '#ffdf00';
                ctx.shadowColor = '#ffdf00';
                ctx.shadowBlur = 15;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                  ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * faceWidth * 0.2,
                             -Math.sin((18 + i * 72) / 180 * Math.PI) * faceWidth * 0.2);
                  ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * faceWidth * 0.1,
                             -Math.sin((54 + i * 72) / 180 * Math.PI) * faceWidth * 0.1);
                }
                ctx.closePath();
                ctx.fill();
                
                // Wand sparkles
                ctx.fillStyle = 'white';
                for(let i=0; i<4; i++) {
                  const angle = (time * 2 + i) * Math.PI * 0.5;
                  const r = faceWidth * 0.3 + Math.sin(time * 5 + i) * 10;
                  ctx.beginPath();
                  ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, 2, 0, Math.PI*2);
                  ctx.fill();
                }
                ctx.restore();
              }
            } else if (selectedCharacter === 'elf') {
              // Pointy Ears
              const leftEar = landmarks[234];
              const rightEar = landmarks[454];
              const leftEarTop = landmarks[127];
              const rightEarTop = landmarks[356];
              
              // Ear base color
              ctx.fillStyle = '#f1c27d'; // Skin tone approximation
              ctx.strokeStyle = '#d4a373';
              ctx.lineWidth = 2;
              
              // Left Ear
              ctx.beginPath();
              ctx.moveTo(leftEar.x * canvas.width, leftEar.y * canvas.height);
              ctx.quadraticCurveTo(
                leftEar.x * canvas.width - faceWidth * 0.8, leftEar.y * canvas.height - faceWidth * 0.5,
                leftEarTop.x * canvas.width - faceWidth * 0.6, leftEarTop.y * canvas.height - faceWidth * 0.8
              );
              ctx.quadraticCurveTo(
                leftEarTop.x * canvas.width - faceWidth * 0.2, leftEarTop.y * canvas.height - faceWidth * 0.2,
                leftEarTop.x * canvas.width, leftEarTop.y * canvas.height
              );
              ctx.fill();
              ctx.stroke();
              
              // Left Ear Blush
              ctx.save();
              const cxL = leftEarTop.x * canvas.width - faceWidth * 0.4;
              const cyL = leftEarTop.y * canvas.height - faceWidth * 0.5;
              const rL = faceWidth * 0.2;
              const gradL = ctx.createRadialGradient(cxL, cyL, 0, cxL, cyL, rL);
              gradL.addColorStop(0, 'rgba(255, 100, 100, 0.4)');
              gradL.addColorStop(1, 'rgba(255, 100, 100, 0)');
              ctx.fillStyle = gradL;
              ctx.beginPath();
              ctx.arc(cxL, cyL, rL, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
              
              // Right Ear
              ctx.beginPath();
              ctx.moveTo(rightEar.x * canvas.width, rightEar.y * canvas.height);
              ctx.quadraticCurveTo(
                rightEar.x * canvas.width + faceWidth * 0.8, rightEar.y * canvas.height - faceWidth * 0.5,
                rightEarTop.x * canvas.width + faceWidth * 0.6, rightEarTop.y * canvas.height - faceWidth * 0.8
              );
              ctx.quadraticCurveTo(
                rightEarTop.x * canvas.width + faceWidth * 0.2, rightEarTop.y * canvas.height - faceWidth * 0.2,
                rightEarTop.x * canvas.width, rightEarTop.y * canvas.height
              );
              ctx.fill();
              ctx.stroke();
              
              // Right Ear Blush
              ctx.save();
              const cxR = rightEarTop.x * canvas.width + faceWidth * 0.4;
              const cyR = rightEarTop.y * canvas.height - faceWidth * 0.5;
              const rR = faceWidth * 0.2;
              const gradR = ctx.createRadialGradient(cxR, cyR, 0, cxR, cyR, rR);
              gradR.addColorStop(0, 'rgba(255, 100, 100, 0.4)');
              gradR.addColorStop(1, 'rgba(255, 100, 100, 0)');
              ctx.fillStyle = gradR;
              ctx.beginPath();
              ctx.arc(cxR, cyR, rR, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();

              // Hand Accessory: Glowing Green Orb
              if (handResults && handResults.landmarks && handResults.landmarks.length > 0) {
                const handPos = handResults.landmarks[0][8]; // Index finger
                const hx = handPos.x * canvas.width;
                const hy = handPos.y * canvas.height;
                const time = startTimeMs / 200;
                
                ctx.save();
                ctx.translate(hx, hy - faceWidth * 0.3);
                
                // Orb glow
                const glow = Math.abs(Math.sin(time)) * 15 + 20;
                ctx.fillStyle = '#2ecc71';
                ctx.shadowColor = '#2ecc71';
                ctx.shadowBlur = glow;
                ctx.beginPath();
                ctx.arc(0, 0, faceWidth * 0.2, 0, Math.PI * 2);
                ctx.fill();
                
                // Inner core
                ctx.fillStyle = '#a8e6cf';
                ctx.shadowBlur = glow * 2;
                ctx.beginPath();
                ctx.arc(0, 0, faceWidth * 0.1, 0, Math.PI * 2);
                ctx.fill();
                
                // Floating leaves
                ctx.fillStyle = '#27ae60';
                ctx.shadowBlur = 0;
                for(let i=0; i<3; i++) {
                  const angle = (time * 0.5 + i * 2) * Math.PI;
                  const r = faceWidth * 0.3 + Math.sin(time * 2 + i) * 10;
                  const lx = Math.cos(angle) * r;
                  const ly = Math.sin(angle) * r;
                  
                  ctx.save();
                  ctx.translate(lx, ly);
                  ctx.rotate(angle + Math.PI / 2);
                  ctx.beginPath();
                  ctx.ellipse(0, 0, faceWidth * 0.08, faceWidth * 0.03, 0, 0, Math.PI * 2);
                  ctx.fill();
                  ctx.restore();
                }
                ctx.restore();
              }
            }
            ctx.restore();
          }

          if (selectedMeme !== 'none') {
            ctx.save();
            const faceWidth = Math.sqrt(
              Math.pow((landmarks[454].x - landmarks[234].x) * canvas.width, 2) +
              Math.pow((landmarks[454].y - landmarks[234].y) * canvas.height, 2)
            );

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (selectedMeme === 'crown') {
              const topHead = landmarks[10];
              ctx.font = `${faceWidth * 0.8}px Arial`;
              ctx.fillText('👑', topHead.x * canvas.width, topHead.y * canvas.height - faceWidth * 0.5);
            } else if (selectedMeme === 'deal_with_it' || selectedMeme === 'thug_life') {
              const leftEye = landmarks[33];
              const rightEye = landmarks[263];
              const cx = (leftEye.x + rightEye.x) / 2 * canvas.width;
              const cy = (leftEye.y + rightEye.y) / 2 * canvas.height;
              const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
              
              ctx.save();
              ctx.translate(cx, cy);
              ctx.rotate(angle);
              ctx.font = `${faceWidth * 1.2}px Arial`;
              ctx.fillText('🕶️', 0, 0);
              ctx.restore();

              if (selectedMeme === 'thug_life') {
                const mouth = landmarks[61];
                ctx.save();
                ctx.translate(mouth.x * canvas.width, mouth.y * canvas.height);
                ctx.rotate(angle + Math.PI / 4);
                ctx.font = `${faceWidth * 0.5}px Arial`;
                ctx.fillText('🚬', 0, 0);
                ctx.restore();
                
                ctx.font = `bold ${faceWidth * 0.4}px Impact`;
                ctx.fillStyle = 'white';
                ctx.strokeStyle = 'black';
                ctx.lineWidth = faceWidth * 0.02;
                ctx.strokeText('THUG LIFE', cx, cy - faceWidth * 0.8);
                ctx.fillText('THUG LIFE', cx, cy - faceWidth * 0.8);
              }
            } else if (selectedMeme === 'clown') {
              // Completely new clown design
              const nose = landmarks[1];
              const leftEye = landmarks[159];
              const rightEye = landmarks[386];
              const mouthLeft = landmarks[61];
              const mouthRight = landmarks[291];
              const mouthBottom = landmarks[17];
              const topHead = landmarks[10];
              
              // 1. White areas around eyes
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.beginPath();
              ctx.ellipse(leftEye.x * canvas.width, leftEye.y * canvas.height, faceWidth * 0.2, faceWidth * 0.15, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.ellipse(rightEye.x * canvas.width, rightEye.y * canvas.height, faceWidth * 0.2, faceWidth * 0.15, 0, 0, Math.PI * 2);
              ctx.fill();
              
              // 2. White area around mouth
              ctx.beginPath();
              ctx.ellipse(nose.x * canvas.width, mouthBottom.y * canvas.height - faceWidth * 0.05, faceWidth * 0.35, faceWidth * 0.25, 0, 0, Math.PI * 2);
              ctx.fill();
              
              // 3. Big red smile outline
              ctx.strokeStyle = '#e74c3c';
              ctx.lineWidth = faceWidth * 0.05;
              ctx.lineCap = 'round';
              ctx.beginPath();
              ctx.moveTo(mouthLeft.x * canvas.width - faceWidth * 0.15, mouthLeft.y * canvas.height - faceWidth * 0.1);
              ctx.quadraticCurveTo(nose.x * canvas.width, mouthBottom.y * canvas.height + faceWidth * 0.25, mouthRight.x * canvas.width + faceWidth * 0.15, mouthRight.y * canvas.height - faceWidth * 0.1);
              ctx.stroke();
              
              // 4. Red cheeks
              ctx.fillStyle = 'rgba(231, 76, 60, 0.8)';
              ctx.beginPath();
              ctx.arc(mouthLeft.x * canvas.width - faceWidth * 0.15, mouthLeft.y * canvas.height - faceWidth * 0.1, faceWidth * 0.08, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(mouthRight.x * canvas.width + faceWidth * 0.15, mouthRight.y * canvas.height - faceWidth * 0.1, faceWidth * 0.08, 0, Math.PI * 2);
              ctx.fill();
              
              // 5. Blue stars over eyes
              ctx.fillStyle = '#3498db';
              const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
                let rot = Math.PI / 2 * 3;
                let x = cx;
                let y = cy;
                const step = Math.PI / spikes;
                ctx.beginPath();
                ctx.moveTo(cx, cy - outerRadius);
                for (let i = 0; i < spikes; i++) {
                  x = cx + Math.cos(rot) * outerRadius;
                  y = cy + Math.sin(rot) * outerRadius;
                  ctx.lineTo(x, y);
                  rot += step;
                  x = cx + Math.cos(rot) * innerRadius;
                  y = cy + Math.sin(rot) * innerRadius;
                  ctx.lineTo(x, y);
                  rot += step;
                }
                ctx.lineTo(cx, cy - outerRadius);
                ctx.closePath();
                ctx.fill();
              };
              drawStar(leftEye.x * canvas.width, leftEye.y * canvas.height - faceWidth * 0.15, 5, faceWidth * 0.1, faceWidth * 0.04);
              drawStar(rightEye.x * canvas.width, rightEye.y * canvas.height - faceWidth * 0.15, 5, faceWidth * 0.1, faceWidth * 0.04);
              
              // 6. Big Red Nose
              const noseGradient = ctx.createRadialGradient(
                nose.x * canvas.width - faceWidth * 0.05, nose.y * canvas.height - faceWidth * 0.05, faceWidth * 0.02,
                nose.x * canvas.width, nose.y * canvas.height, faceWidth * 0.15
              );
              noseGradient.addColorStop(0, '#ff9999');
              noseGradient.addColorStop(0.3, '#ff0000');
              noseGradient.addColorStop(1, '#8b0000');
              ctx.fillStyle = noseGradient;
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 10;
              ctx.beginPath();
              ctx.arc(nose.x * canvas.width, nose.y * canvas.height, faceWidth * 0.15, 0, Math.PI * 2);
              ctx.fill();
              ctx.shadowBlur = 0;
              
              // 7. Rainbow Afro Wig
              ctx.save();
              const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'];
              for (let i = 0; i < 15; i++) {
                const angle = Math.PI + (i / 14) * Math.PI;
                const r = faceWidth * 1.2;
                const cx = topHead.x * canvas.width + Math.cos(angle) * r * 0.8;
                const cy = topHead.y * canvas.height + faceWidth * 0.5 + Math.sin(angle) * r;
                
                ctx.fillStyle = colors[i % colors.length];
                ctx.beginPath();
                ctx.arc(cx, cy, faceWidth * 0.4, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
              
              // 8. Little Clown Hat
              ctx.fillStyle = '#f1c40f'; // Yellow hat
              ctx.beginPath();
              ctx.moveTo(topHead.x * canvas.width - faceWidth * 0.3, topHead.y * canvas.height - faceWidth * 0.8);
              ctx.lineTo(topHead.x * canvas.width + faceWidth * 0.3, topHead.y * canvas.height - faceWidth * 0.8);
              ctx.lineTo(topHead.x * canvas.width, topHead.y * canvas.height - faceWidth * 1.5);
              ctx.closePath();
              ctx.fill();
              // Hat pompom
              ctx.fillStyle = '#e74c3c';
              ctx.beginPath();
              ctx.arc(topHead.x * canvas.width, topHead.y * canvas.height - faceWidth * 1.5, faceWidth * 0.15, 0, Math.PI * 2);
              ctx.fill();
            } else if (selectedMeme === 'crying') {
              const leftEye = landmarks[159];
              const rightEye = landmarks[386];
              ctx.font = `${faceWidth * 0.4}px Arial`;
              ctx.fillText('😭', leftEye.x * canvas.width, leftEye.y * canvas.height + faceWidth * 0.2);
              ctx.fillText('😭', rightEye.x * canvas.width, rightEye.y * canvas.height + faceWidth * 0.2);
            } else if (selectedMeme === 'heart_eyes') {
              const leftEye = landmarks[159];
              const rightEye = landmarks[386];
              ctx.font = `${faceWidth * 0.4}px Arial`;
              ctx.fillText('😍', leftEye.x * canvas.width, leftEye.y * canvas.height);
              ctx.fillText('😍', rightEye.x * canvas.width, rightEye.y * canvas.height);
            } else if (selectedMeme === 'mind_blown') {
              const topHead = landmarks[10];
              ctx.font = `${faceWidth * 0.8}px Arial`;
              ctx.fillText('🤯', topHead.x * canvas.width, topHead.y * canvas.height - faceWidth * 0.3);
            } else if (selectedMeme === 'cool_dog') {
              const nose = landmarks[1];
              ctx.font = `${faceWidth * 1.5}px Arial`;
              ctx.fillText('🐶', nose.x * canvas.width, nose.y * canvas.height);
            } else if (selectedMeme === 'alien') {
              const nose = landmarks[1];
              ctx.font = `${faceWidth * 1.5}px Arial`;
              ctx.fillText('👽', nose.x * canvas.width, nose.y * canvas.height);
            } else if (selectedMeme === 'spinning_star') {
              const topHead = landmarks[10];
              const time = startTimeMs / 500;
              ctx.save();
              ctx.translate(topHead.x * canvas.width, topHead.y * canvas.height - faceWidth * 0.5);
              ctx.rotate(time);
              ctx.font = `${faceWidth * 0.8}px Arial`;
              ctx.fillText('⭐', 0, 0);
              ctx.restore();
            } else if (selectedMeme === 'floating_hearts') {
              const topHead = landmarks[10];
              const time = startTimeMs / 1000;
              const offset1 = (time % 2) * faceWidth;
              const offset2 = ((time + 1) % 2) * faceWidth;
              ctx.font = `${faceWidth * 0.5}px Arial`;
              ctx.globalAlpha = Math.max(0, 1 - (offset1 / (faceWidth * 1.5)));
              ctx.fillText('💖', topHead.x * canvas.width - faceWidth*0.3, topHead.y * canvas.height - offset1);
              ctx.globalAlpha = Math.max(0, 1 - (offset2 / (faceWidth * 1.5)));
              ctx.fillText('💖', topHead.x * canvas.width + faceWidth*0.3, topHead.y * canvas.height - offset2);
              ctx.globalAlpha = 1.0;
            } else if (selectedMeme === 'pulsing_brain') {
              const topHead = landmarks[10];
              const scale = 1 + Math.sin(startTimeMs / 200) * 0.2;
              ctx.save();
              ctx.translate(topHead.x * canvas.width, topHead.y * canvas.height - faceWidth * 0.4);
              ctx.scale(scale, scale);
              ctx.font = `${faceWidth * 0.8}px Arial`;
              ctx.fillText('🧠', 0, 0);
              ctx.restore();
            } else if (selectedMeme === 'party') {
              const topHead = landmarks[10];
              const shake = Math.sin(startTimeMs / 50) * (faceWidth * 0.1);
              ctx.font = `${faceWidth * 1.2}px Arial`;
              ctx.fillText('🎉', topHead.x * canvas.width + shake, topHead.y * canvas.height - faceWidth * 0.5);
            }
            ctx.restore();
          }
          } // End of face loop
        }
      }

      ctx.restore();
      requestRef.current = requestAnimationFrame(renderLoop);
    };

    if (needsSegmentation) {
      imageSegmenter.segmentForVideo(video, startTimeMs, (result) => {
        if (result.confidenceMasks && result.confidenceMasks.length >= 2) {
          processFrame(result.confidenceMasks);
          // CRITICAL FIX: Free WebGL texture memory to prevent massive lag and crashes
          result.confidenceMasks.forEach((mask: any) => {
            if (mask && typeof mask.close === 'function') {
              mask.close();
            }
          });
        } else {
          processFrame();
        }
      });
    } else {
      processFrame();
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#0a0a0a] text-white font-sans flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Top Bar */}
      <div className="w-full max-w-4xl mb-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 md:gap-0 px-6 py-4 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl">
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-4">
            {/* Custom CSS Logo */}
            <div className="relative flex flex-col items-center justify-center w-16 h-16 bg-black rounded-2xl shadow-[0_0_20px_rgba(217,70,239,0.3)] border border-white/5 overflow-hidden shrink-0">
              {/* Corner Brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-fuchsia-500 rounded-tl-sm"></div>
              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-fuchsia-500 rounded-tr-sm"></div>
              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-fuchsia-500 rounded-bl-sm"></div>
              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-fuchsia-500 rounded-br-sm"></div>
              
              {/* Main Text & Lens */}
              <div className="relative flex items-center justify-center mt-1">
                <span className="text-2xl font-black tracking-tighter bg-gradient-to-br from-purple-500 to-fuchsia-500 bg-clip-text text-transparent">T</span>
                <span className="text-lg font-bold text-fuchsia-400 -ml-1 -mr-1 z-10">&</span>
                <span className="text-2xl font-black tracking-tighter bg-gradient-to-br from-pink-400 to-orange-400 bg-clip-text text-transparent">G</span>
                <Sparkles className="w-2.5 h-2.5 text-orange-300 absolute -top-1 -right-2" />
              </div>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-900 via-black to-purple-900 border border-purple-500/50 flex items-center justify-center -mt-1 z-20 shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                <div className="w-2.5 h-2.5 rounded-full bg-black border border-purple-400/50 flex items-center justify-center">
                  <div className="w-1 h-1 rounded-full bg-white/80 translate-x-[-1px] translate-y-[-1px]"></div>
                </div>
              </div>
              <span className="text-[5px] font-mono uppercase tracking-[0.3em] text-fuchsia-200 mt-1">- CAM -</span>
            </div>

            <div className="flex flex-col">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter bg-gradient-to-r from-fuchsia-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                T&G <span className="text-white font-light tracking-widest text-xl md:text-2xl">CAM</span>
              </h1>
              <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 mt-1">
                Made By G.B & T.C
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mb-1">
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full font-mono text-[9px] uppercase tracking-wider flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isWebcamStarted ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={isWebcamStarted ? 'text-emerald-400' : 'text-red-400'}>Live Feed</span>
          </div>
          <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full font-mono text-[9px] uppercase tracking-wider text-white/60">
            GPU Accelerated
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-6xl flex-1 flex gap-6 relative min-h-[50vh] md:min-h-0">
        {/* Main Viewport */}
        <div className="relative flex-1 w-full h-full min-h-[50vh] md:min-h-0 md:aspect-video bg-[#151619] rounded-2xl border border-white/5 shadow-2xl overflow-hidden group">
          <video 
            ref={videoRef} 
            className="hidden" 
            autoPlay 
            playsInline 
            muted 
          />
        
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* System State Overlay */}
        {(!isWebcamStarted && !error) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0a]/80 backdrop-blur-sm z-20 gap-12">
            {!isLoading && (
              <button 
                onClick={startWebcam}
                className="group relative px-10 py-4 bg-white text-black rounded-full font-black uppercase italic tracking-tighter text-lg hover:scale-105 transition-transform flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <Camera className="w-6 h-6" />
                Initialize Camera
              </button>
            )}
            
            <div className="flex flex-col items-center">
              <RefreshCw className={`w-12 h-12 text-emerald-400 mb-4 ${isLoading ? 'animate-spin' : 'opacity-20'}`} />
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-emerald-400/60">
                {isLoading ? 'Initializing AI Models...' : 'Awaiting Camera Feed...'}
              </p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/90 backdrop-blur-md z-30 p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-xl font-bold mb-2 uppercase tracking-tight">System Error</h2>
            <p className="text-red-200/70 max-w-md text-sm mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-500 hover:bg-red-400 text-white rounded-full font-bold text-xs uppercase tracking-widest transition-colors"
            >
              Restart Engine
            </button>
          </div>
        )}

      </div>
      </div>

      {/* Floating Side Panel UI */}
      <div className={`fixed top-[100px] right-4 md:right-6 bottom-4 md:bottom-6 w-[calc(100%-2rem)] md:w-80 bg-[#0a0a0a]/95 backdrop-blur-3xl border-2 border-fuchsia-500/30 rounded-3xl shadow-[0_0_40px_rgba(217,70,239,0.15)] flex flex-col overflow-hidden transition-transform duration-500 z-40 ${isEffectsPanelOpen ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-fuchsia-500/20 shrink-0 bg-gradient-to-r from-fuchsia-500/10 to-transparent">
          <h2 className="text-sm font-bold uppercase tracking-widest text-fuchsia-100">Effects Frame</h2>
          <button onClick={() => setIsEffectsPanelOpen(false)} className="p-2 bg-white/5 rounded-full hover:bg-fuchsia-500/20 transition-colors">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Category Tabs (Compact & Wrapped for easy access) */}
        <div className="grid grid-cols-4 gap-2 p-4 border-b border-fuchsia-500/20 shrink-0">
          {[
            { id: 'characters', icon: '🎭', label: 'Characters' },
            { id: 'backgrounds', icon: '🖼️', label: 'Backgrounds' },
            { id: 'hair', icon: '💇‍♀️', label: 'Hair' },
            { id: 'memes', icon: '😂', label: 'Memes' },
            { id: 'accessories', icon: '🕶️', label: 'Accessories' },
            { id: 'makeup', icon: '💄', label: 'Makeup' },
            { id: 'nails', icon: '💅', label: 'Nails' },
            { id: 'clothes', icon: '👕', label: 'Clothes' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all ${activeCategory === cat.id ? 'bg-fuchsia-500/20 border border-fuchsia-500/50 text-white shadow-[0_0_10px_rgba(217,70,239,0.2)]' : 'bg-white/5 border border-transparent text-white/50 hover:text-white hover:bg-white/10'}`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-center">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          
          {activeCategory === 'characters' && (
            <div className="grid grid-cols-3 gap-3">
              {CHARACTERS.map(char => (
                <button
                  key={char.value}
                  onClick={() => setSelectedCharacter(char.value)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${selectedCharacter === char.value ? 'bg-fuchsia-500/20 border border-fuchsia-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className="text-2xl">{char.value === 'none' ? '🚫' : char.value === 'vampire' ? '🧛' : char.value === 'wizard' ? '🧙' : char.value === 'avatar' ? '👽' : char.value === 'fairy' ? '🧚' : '🧝'}</div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-center">{char.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeCategory === 'backgrounds' && (
            <div className="grid grid-cols-3 gap-3">
              {BG_COLORS.map(bg => (
                <button
                  key={bg.value}
                  onClick={() => setSelectedBgColor(bg.value)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${selectedBgColor === bg.value ? 'bg-blue-500/20 border border-blue-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div 
                    className="w-10 h-10 rounded-full bg-cover bg-center border border-white/20"
                    style={{ background: bg.value.startsWith('http') ? `url(${bg.value})` : bg.value === 'transparent' ? '#222' : bg.value, backgroundSize: 'cover' }}
                  >
                    {bg.value === 'transparent' && <div className="w-full h-full flex items-center justify-center text-sm">🚫</div>}
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-center">{bg.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeCategory === 'hair' && (
            <div className="grid grid-cols-4 gap-3">
              {HAIR_COLORS.map(color => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${selectedColor === color.value ? 'bg-white/10 border border-white/30' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div 
                    className="w-8 h-8 rounded-full border border-white/20"
                    style={{ backgroundColor: color.value === 'transparent' ? '#222' : color.value }}
                  >
                    {color.value === 'transparent' && <div className="w-full h-full flex items-center justify-center text-xs">🚫</div>}
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-center">{color.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeCategory === 'memes' && (
            <div className="grid grid-cols-3 gap-3">
              {MEMES.map(meme => (
                <button
                  key={meme.value}
                  onClick={() => setSelectedMeme(meme.value)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${selectedMeme === meme.value ? 'bg-indigo-500/20 border border-indigo-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className="text-2xl">{meme.value === 'none' ? '🚫' : meme.value === 'crown' ? '👑' : meme.value === 'deal_with_it' ? '🕶️' : meme.value === 'thug_life' ? '🚬' : meme.value === 'clown' ? '🤡' : meme.value === 'crying' ? '😭' : meme.value === 'heart_eyes' ? '😍' : meme.value === 'mind_blown' ? '🤯' : meme.value === 'cool_dog' ? '🐶' : meme.value === 'alien' ? '👽' : meme.value === 'spinning_star' ? '⭐' : meme.value === 'floating_hearts' ? '💖' : meme.value === 'pulsing_brain' ? '🧠' : '🎉'}</div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-center">{meme.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeCategory === 'accessories' && (
            <div className="grid grid-cols-3 gap-3">
              {[...GLASSES, ...WATCHES].map(item => (
                <button
                  key={item.value}
                  onClick={() => {
                    if (GLASSES.find(g => g.value === item.value)) setSelectedGlasses(item.value);
                    else setSelectedWatch(item.value);
                  }}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${(selectedGlasses === item.value || selectedWatch === item.value) ? 'bg-teal-500/20 border border-teal-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className="text-2xl">{item.value === 'none' ? '🚫' : item.value === 'sunglasses' ? '🕶️' : item.value === 'nerd_glasses' ? '🤓' : item.value === 'watch' ? '⌚' : item.value === 'smartwatch' ? '📱' : '✨'}</div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-center">{item.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeCategory === 'makeup' && (
            <div className="grid grid-cols-3 gap-3">
              {MAKEUPS.map(item => (
                <button
                  key={item.value}
                  onClick={() => setSelectedMakeup(item.value)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${selectedMakeup === item.value ? 'bg-rose-500/20 border border-rose-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div className="text-2xl">{item.value === 'none' ? '🚫' : item.value === 'blush' ? '😊' : item.value === 'eyeshadow' ? '👁️' : item.value === 'lipstick' ? '👄' : '🤡'}</div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-center">{item.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeCategory === 'nails' && (
            <div className="grid grid-cols-4 gap-3">
              {NAIL_COLORS.map(color => (
                <button
                  key={color.value}
                  onClick={() => setSelectedNailColor(color.value)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${selectedNailColor === color.value ? 'bg-pink-500/20 border border-pink-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div 
                    className="w-8 h-8 rounded-full border border-white/20"
                    style={{ backgroundColor: color.value === 'transparent' ? '#222' : color.value }}
                  >
                    {color.value === 'transparent' && <div className="w-full h-full flex items-center justify-center text-xs">🚫</div>}
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-center">{color.name}</span>
                </button>
              ))}
            </div>
          )}

          {activeCategory === 'clothes' && (
            <div className="grid grid-cols-4 gap-3">
              {TSHIRTS.map(color => (
                <button
                  key={color.value}
                  onClick={() => setSelectedTshirt(color.value)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all ${selectedTshirt === color.value ? 'bg-emerald-500/20 border border-emerald-500/50' : 'hover:bg-white/5 border border-transparent'}`}
                >
                  <div 
                    className="w-8 h-8 rounded-full border border-white/20"
                    style={{ backgroundColor: color.value === 'transparent' ? '#222' : color.value }}
                  >
                    {color.value === 'transparent' && <div className="w-full h-full flex items-center justify-center text-xs">🚫</div>}
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-center">{color.name}</span>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* See Effects Button (Only visible when panel is closed) */}
      <button 
        onClick={() => setIsEffectsPanelOpen(true)}
        className={`fixed bottom-6 right-4 md:bottom-8 md:right-8 z-50 px-4 py-3 md:px-6 md:py-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-full font-black text-xs md:text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(217,70,239,0.4)] flex items-center gap-2 md:gap-3 transition-all ${isEffectsPanelOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
        See Effects
      </button>

    </div>
  );
}
