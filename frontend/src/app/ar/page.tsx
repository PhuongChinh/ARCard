'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { cardsAPI, Card } from '@/lib/api';

export default function ARPage() {
  const searchParams = useSearchParams();
  const cardId = searchParams.get('id');
  
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [arStarted, setArStarted] = useState(false);
  const [status, setStatus] = useState<string>('Loading...');
  const [viewMode, setViewMode] = useState<'ar' | '3d'>('ar');
  const [hasCamera, setHasCamera] = useState(false);
  
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number>(0);
  const mindarRef = useRef<any>(null);

  useEffect(() => {
    if (cardId) {
      fetchCard();
    }
    return () => {
      cleanup();
    };
  }, [cardId]);

  const fetchCard = async () => {
    try {
      const res = await cardsAPI.getById(cardId!);
      const cardData = res.data;
      
      if (!cardData.isActive) {
        setError('This AR experience is currently inactive');
        setLoading(false);
        return;
      }
      
      setCard(cardData);
      cardsAPI.incrementScan(cardId!).catch(console.error);
    } catch (err) {
      setError('Failed to load AR experience');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cleanup = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
    // Stop camera stream
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (mindarRef.current) {
      try {
        mindarRef.current.stop();
      } catch {
        // The AR session may not have finished starting.
      }
      mindarRef.current = null;
    }
  };

  const startAR = async () => {
    setViewMode('ar');
    setArStarted(true);
    setStatus('Starting image tracking...');
    // The AR container is rendered only after arStarted becomes true. Wait for
    // React to commit that render before asking MindAR to append its video/canvas.
    requestAnimationFrame(() => {
      initImageTrackingAR();
    });
  };

  const start3DViewer = async () => {
    setViewMode('3d');
    setArStarted(true);
    setStatus('Loading 3D Viewer...');
    initThreeJS();
  };

  const initCamera = async (): Promise<boolean> => {
    setStatus('Checking camera...');
    
    console.log('=== Camera Debug ===');
    console.log('navigator:', navigator);
    console.log('navigator.mediaDevices:', navigator.mediaDevices);
    console.log('navigator.userAgent:', navigator.userAgent);
    
    // Check browser support
    const nav = navigator as any;
    const getUserMedia = nav.mediaDevices?.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia;
    
    console.log('getUserMedia function:', getUserMedia);
    
    if (!getUserMedia) {
      console.log('getUserMedia not supported in this browser');
      setHasCamera(false);
      setStatus('Camera not supported');
      return false;
    }
    
    try {
      setStatus('Requesting camera permission...');
      console.log('Requesting camera...');
      
      // Try different approaches
      let stream;
      if (nav.mediaDevices?.getUserMedia) {
        stream = await nav.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      } else {
        stream = await getUserMedia.call(nav, { video: true, audio: false });
      }
      
      console.log('Stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasCamera(true);
        setStatus('Camera active!');
        console.log('Camera ready!');
        return true;
      }
    } catch (err: any) {
      console.log('Camera error:', err.message);
      console.log('Error details:', err);
      setHasCamera(false);
      setStatus('Camera error: ' + err.message);
      return false;
    }
    
    return false;
  };

  const initImageTrackingAR = async () => {
    if (!card || !containerRef.current) return;

    // MindAR tracks a compiled target database, not a regular JPG/PNG preview.
    if (!/\.mind(?:$|[?#])/i.test(card.markerImage)) {
      setStatus('This card needs a compiled .mind marker target');
      setError('Upload a .mind target generated from the marker image. A PNG/JPG alone cannot be image-tracked.');
      return;
    }

    try {
      const { MindARThree } = await import('mind-ar/dist/mindar-image-three.prod.js');
      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: card.markerImage,
        maxTrack: 1,
        uiLoading: 'no',
        uiScanning: 'no',
        uiError: 'no',
      });
      mindarRef.current = mindarThree;

      mindarThree.scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 2));
      const anchor = mindarThree.addAnchor(0);
      anchor.onTargetFound = () => setStatus('Marker found');
      anchor.onTargetLost = () => setStatus('Point the camera at the marker');

      setStatus('Loading 3D model...');
      await new Promise<void>((resolve, reject) => {
        new GLTFLoader().load(card.targetModel, (gltf) => {
          const model = gltf.scene;
          model.scale.setScalar(card.modelScale || 1);
          const bounds = new THREE.Box3().setFromObject(model);
          model.position.sub(bounds.getCenter(new THREE.Vector3()));
          anchor.group.add(model);
          resolve();
        }, undefined, reject);
      });

      setStatus('Requesting rear camera...');
      await mindarThree.start();
      const render = () => {
        animationRef.current = requestAnimationFrame(render);
        mindarThree.renderer.render(mindarThree.scene, mindarThree.camera);
      };
      render();
      setStatus('Point the rear camera at the marker');
    } catch (err: any) {
      console.error('AR startup error:', err);
      setError(`Could not start AR: ${err?.message || 'Allow camera permission and open this page over HTTPS.'}`);
      setStatus('AR unavailable');
    }
  };

  const initThreeJS = () => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(0, 0, 3);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: viewMode === 'ar',
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    if (viewMode === '3d') {
      renderer.setClearColor(0x1a1a2e);
    } else {
      renderer.setClearColor(0x000000, 0);
    }
    
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Add particles for 3D mode
    if (viewMode === '3d') {
      addParticles(scene);
    }

    // Model group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Load model
    if (card?.targetModel) {
      loadModel(modelGroup);
    }

    // Mouse/touch controls
    setupControls(container);

    // Animation
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.003;
      }
      
      renderer.render(scene, camera);
    };
    animate();
    
    setStatus(viewMode === '3d' ? '3D Viewer - Drag to rotate' : hasCamera ? 'AR Mode - Point at marker' : 'Viewer Mode');
  };

  const setupControls = (container: HTMLElement) => {
    let isDragging = false;
    let previousPosition = { x: 0, y: 0 };

    const onStart = (x: number, y: number) => {
      isDragging = true;
      previousPosition = { x, y };
    };

    const onMove = (x: number, y: number) => {
      if (!isDragging || !modelRef.current) return;
      
      const deltaX = x - previousPosition.x;
      const deltaY = y - previousPosition.y;
      
      modelRef.current.rotation.y += deltaX * 0.01;
      modelRef.current.rotation.x += deltaY * 0.01;
      
      previousPosition = { x, y };
    };

    const onEnd = () => {
      isDragging = false;
    };

    // Mouse events
    container.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
    container.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
    container.addEventListener('mouseup', onEnd);
    container.addEventListener('mouseleave', onEnd);

    // Touch events
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onStart(e.touches[0].clientX, e.touches[0].clientY);
      }
    });
    container.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    });
    container.addEventListener('touchend', onEnd);
  };

  const addParticles = (scene: THREE.Scene) => {
    const geometry = new THREE.BufferGeometry();
    const count = 300;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 15;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: 0x4fc3f7,
      transparent: true,
      opacity: 0.6
    });
    
    scene.add(new THREE.Points(geometry, material));
  };

  const loadModel = (parent: THREE.Group) => {
    if (!card?.targetModel) return;

    setStatus('Loading model...');
    
    const loader = new GLTFLoader();
    loader.load(
      card.targetModel,
      (gltf) => {
        const model = gltf.scene;

        const scale = card?.modelScale || 1;
        model.scale.set(scale, scale, scale);

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y = 0;

        parent.add(model);
        modelRef.current = model;
        
        setStatus(viewMode === '3d' ? '3D Viewer Ready' : 'Model loaded!');
      },
      (progress) => {
        const percent = (progress.loaded / progress.total * 100).toFixed(0);
        setStatus(`Loading: ${percent}%`);
      },
      (err) => {
        console.error('Model error:', err);
        setStatus('Failed to load model');
      }
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      rendererRef.current.setSize(width, height);
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white p-4">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/" className="underline">Go Home</a>
        </div>
      </div>
    );
  }

  if (!arStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <h1 className="text-3xl font-bold mb-3">{card?.title}</h1>
          <p className="mb-6 text-blue-200">{card?.description}</p>
          
          {card?.markerImage && (
            <div className="mb-6">
              <p className="text-sm mb-2">Marker:</p>
              <img 
                src={card.markerImage} 
                alt="Marker" 
                className="w-32 h-32 object-contain mx-auto rounded-lg border-2 border-white/30"
              />
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={startAR}
              className="w-full bg-white text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition"
            >
              Start AR
            </button>
            
            <button
              onClick={start3DViewer}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
            >
              View 3D Model
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Camera video background */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover ${viewMode === 'ar' && hasCamera ? 'block' : 'hidden'}`}
        playsInline
        muted
        autoPlay
      />
      
      {/* Fallback background for AR without camera */}
      {viewMode === 'ar' && !hasCamera && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
      )}
      
      {/* Three.js canvas */}
      <div ref={containerRef} className="absolute inset-0" />
      
      {/* Status */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-black/60 text-white px-4 py-2 rounded-full text-sm">
          {status}
        </div>
      </div>
      
      {/* Marker for AR mode */}
      {viewMode === 'ar' && card?.markerImage && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-black/50 rounded-lg p-2">
            <img src={card.markerImage} alt="Marker" className="w-16 h-16 object-contain" />
          </div>
          <p className="text-white text-xs text-center mt-1">Show marker</p>
        </div>
      )}
      
      {/* Title */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
        <div className="bg-black/50 text-white inline-block px-4 py-2 rounded-full text-sm">
          {card?.title}
        </div>
      </div>
    </div>
  );
}
