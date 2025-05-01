'use client';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Add these interfaces before the SolarSystemSimulator component
interface Tutorial {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface KeyboardShortcut {
  key: string;
  description: string;
}

interface AboutSectionProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [children]);

  return (
    <div className="cosmic-glass rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between text-left transition-colors hover:bg-[var(--color-accent-cosmic-purple)]/10"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <svg
          className={`w-4 h-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? contentHeight : 0 }}
      >
        <div ref={contentRef} className="p-3 text-sm text-[var(--color-text-starlight-white)]/80">
          {children}
        </div>
      </div>
    </div>
  );
};

// Update GlobalStyles with custom scrollbar styles
const GlobalStyles = () => (
  <style>{`
    :root {
      --color-bg-deep-space: #0B1021;
      --color-bg-space-gradient: linear-gradient(135deg, #0B1021 0%, #1A1B46 100%);
      --color-accent-cosmic-purple: #5D4BEE;
      --color-accent-cosmic-glow: #7A6AFF;
      --color-text-starlight-white: #F1F7FF;
      --color-star-dust: rgba(241, 247, 255, 0.05);
    }

    /* Base responsive font sizes */
    html {
      font-size: 14px;
    }
    @media (min-width: 640px) {
      html {
        font-size: 15px;
      }
    }
    @media (min-width: 1024px) {
      html {
        font-size: 16px;
      }
    }

    /* Improved button styles for touch devices */
    @media (hover: none) {
      .cosmic-button {
        min-height: 44px;
        min-width: 44px;
        padding: 0.75rem;
      }
      
      .cosmic-button:active {
        background: rgba(122, 106, 255, 0.8);
        transform: scale(0.98);
      }
    }

    /* Safe area insets for modern mobile devices */
    @supports (padding: env(safe-area-inset-top)) {
      header {
        padding-top: env(safe-area-inset-top);
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
      }
    }

    /* Reduced motion preferences */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(93, 75, 238, 0.1);
      border-radius: 2px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: var(--color-accent-cosmic-purple);
      border-radius: 2px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: var(--color-accent-cosmic-glow);
    }

    /* Enhanced button focus styles */
    .cosmic-button:focus-visible {
      outline: none;
      ring: 2px;
      ring-color: var(--color-accent-cosmic-glow);
      ring-offset: 2px;
    }

    /* Improved touch targets for mobile */
    @media (max-width: 640px) {
      button, 
      [role="button"],
      a {
        min-height: 44px;
        min-width: 44px;
        padding: 0.5rem;
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .side-menu {
      animation: slideDown 0.3s ease-out;
    }
    
    body {
      background: var(--color-bg-space-gradient);
      color: var(--color-text-starlight-white);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      overflow: hidden;
      position: relative;
    }
    
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: radial-gradient(var(--color-star-dust) 1px, transparent 1px);
      background-size: 50px 50px;
      z-index: -1;
    }
    
    .cosmic-glass {
      background: rgba(11, 16, 33, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(93, 75, 238, 0.3);
      box-shadow: 0 0 20px rgba(93, 75, 238, 0.2), 
                  inset 0 0 8px rgba(93, 75, 238, 0.1);
      border-radius: 1rem;
      color: var(--color-text-starlight-white);
      transition: all 0.3s ease;
    }
    
    .cosmic-glass:hover {
      border-color: rgba(93, 75, 238, 0.5);
      box-shadow: 0 0 25px rgba(93, 75, 238, 0.3), 
                  inset 0 0 12px rgba(93, 75, 238, 0.2);
    }
    
    .cosmic-button {
      background: rgba(93, 75, 238, 0.7);
      color: var(--color-text-starlight-white);
      border: none;
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      position: relative;
      overflow: hidden;
      box-shadow: 0 0 10px rgba(93, 75, 238, 0.5);
    }
    
    .cosmic-button:hover {
      background: rgba(122, 106, 255, 0.8);
      transform: translateY(-2px);
      box-shadow: 0 0 15px rgba(93, 75, 238, 0.7);
    }
    
    .cosmic-button:active {
      transform: translateY(1px);
    }
    
    .cosmic-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
      transition: 0.5s;
    }
    
    .cosmic-button:hover::before {
      left: 100%;
    }
    
    .planet-card {
      transform: translateY(5px);
      opacity: 0;
      animation: fadeInUp 0.3s forwards;
    }
    
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 15px rgba(93, 75, 238, 0.5); }
      50% { box-shadow: 0 0 25px rgba(93, 75, 238, 0.8); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .glow-effect {
      animation: glow 3s infinite ease-in-out;
    }
    
    /* Custom scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
    }
    
    ::-webkit-scrollbar-track {
      background: rgba(11, 16, 33, 0.5);
      border-radius: 3px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: var(--color-accent-cosmic-purple);
      border-radius: 3px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: var(--color-accent-cosmic-glow);
    }
    
    /* Slider styles */
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 6px;
      background: rgba(93, 75, 238, 0.2);
      border-radius: 3px;
      outline: none;
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.3);
    }
    
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 18px;
      height: 18px;
      background: var(--color-accent-cosmic-purple);
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid var(--color-text-starlight-white);
      box-shadow: 0 0 8px rgba(93, 75, 238, 0.8);
      transition: all 0.2s ease;
    }
    
    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 0 12px rgba(93, 75, 238, 1);
    }
    
    input[type="range"]::-moz-range-thumb {
      width: 18px;
      height: 18px;
      background: var(--color-accent-cosmic-purple);
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid var(--color-text-starlight-white);
      box-shadow: 0 0 8px rgba(93, 75, 238, 0.8);
      transition: all 0.2s ease;
    }
    
    input[type="range"]::-moz-range-thumb:hover {
      transform: scale(1.1);
      box-shadow: 0 0 12px rgba(93, 75, 238, 1);
    }

    /* Side menu styles for mobile */
    .side-menu {
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
    }

    .side-menu-open {
      transform: translateX(0);
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(93, 75, 238, 0.1);
      border-radius: 2px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: var(--color-accent-cosmic-purple);
      border-radius: 2px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: var(--color-accent-cosmic-glow);
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .side-menu {
      animation: slideDown 0.3s ease-out;
    }
  `}</style>
);

interface PlanetData {
  id: string;
  name: string;
  mass: number;
  radius: number;
  color: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  mesh?: THREE.Mesh;
  isSun?: boolean;
  description?: string;
  temperature: string;
  distanceFromEarth: string;
  orbitalDistance: number;
  image?: string;
}

interface DrawnPath {
  id: string;
  points: THREE.Vector2[];
  color: string;
  timestamp: number;
  width?: number;
  attachedToPlanet?: string;
  initialPlanetPosition?: THREE.Vector2;
  isPermanent?: boolean;
  type: 'free' | 'orbit';
  attachmentPoint?: 'start' | 'end';
  isVisible?: boolean;
}

interface PlanetOrbit {
  planetId: string;
  path: THREE.Vector2[];
  color: string;
  width: number;
  isVisible: boolean;
  id: string;
}

type Star = {
  id: number;
  width: number;
  height: number;
  opacity: number;
  top: number;
  left: number;
  duration: number;
  delay: number;
}

const G = 10;
const PHYSICS_TIMESTEP = 0.016;

const initialPlanets: PlanetData[] = [
  {
    id: 'sun',
    name: 'Sun',
    mass: 1000,
    radius: 25,
    color: '#FFD700',
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    isSun: true,
    description: 'The star at the center of our solar system. Its gravity holds the solar system together.',
    temperature: '5,500°C (surface)',
    distanceFromEarth: '150 million km (1 AU)',
    orbitalDistance: 0,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100801.jpg/320px-The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100801.jpg'
  },
  {
    id: 'mercury',
    name: 'Mercury',
    mass: 0.1,
    radius: 4,
    color: '#b1b1b1',
    orbitalDistance: 50,
    description: 'The smallest and innermost planet with extreme temperature variations.',
    temperature: '-173°C to 427°C',
    distanceFromEarth: '77-222 million km',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Mercury_in_color_-_Prockter07-edit1.jpg/320px-Mercury_in_color_-_Prockter07-edit1.jpg'
  },
  {
    id: 'venus',
    name: 'Venus',
    mass: 0.8,
    radius: 6,
    color: '#e4c07b',
    orbitalDistance: 80,
    description: "Earth's sister planet with a dense, toxic atmosphere and surface hot enough to melt lead.",
    temperature: '462°C',
    distanceFromEarth: '108 million km',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/320px-Venus-real_color.jpg'
  },
  {
    id: 'earth',
    name: 'Earth',
    mass: 1.0,
    radius: 6.5,
    color: '#2a75f3',
    orbitalDistance: 120,
    description: 'Our home planet, the only known place in the universe with life.',
    temperature: '15°C (average)',
    distanceFromEarth: '0 km (You are here)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Blue_Marble_%28remastered%29.jpg/320px-The_Blue_Marble_%28remastered%29.jpg'
  },
  {
    id: 'mars',
    name: 'Mars',
    mass: 0.5,
    radius: 5.5,
    color: '#ff4f2e',
    orbitalDistance: 180,
    description: 'Known as the Red Planet, home to the tallest volcano in the solar system.',
    temperature: '-63°C (average)',
    distanceFromEarth: '225 million km',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/320px-OSIRIS_Mars_true_color.jpg'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    mass: 5,
    radius: 11,
    color: '#d9a066',
    orbitalDistance: 250,
    description: 'The largest planet with massive storms like the Great Red Spot.',
    temperature: '-145°C',
    distanceFromEarth: '588-968 million km',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/320px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg'
  },
  {
    id: 'saturn',
    name: 'Saturn',
    mass: 4,
    radius: 10,
    color: '#f7d488',
    orbitalDistance: 350,
    description: 'Famous for its stunning ring system made of ice and rock.',
    temperature: '-178°C',
    distanceFromEarth: '1.2 billion km',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/320px-Saturn_during_Equinox.jpg'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    mass: 3,
    radius: 8.5,
    color: '#7df9ff',
    orbitalDistance: 450,
    description: 'An ice giant that rotates on its side with pale blue color.',
    temperature: '-224°C',
    distanceFromEarth: '2.6 billion km',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/320px-Uranus2.jpg'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    mass: 3.2,
    radius: 8.3,
    color: '#4169e1',
    orbitalDistance: 520,
    description: 'Dark, cold and whipped by supersonic winds.',
    temperature: '-214°C',
    distanceFromEarth: '4.3 billion km',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%282938%29_animated.gif/320px-Neptune_-_Voyager_2_%282938%29_animated.gif'
  }
].map(planet => {
  const angle = Math.random() * Math.PI * 2;
  const distance = planet.orbitalDistance;

  const x = Math.cos(angle) * distance;
  const y = Math.sin(angle) * distance;

  const velocityMagnitude = Math.sqrt(G * 1000 / distance);
  const vx = -Math.sin(angle) * velocityMagnitude;
  const vy = Math.cos(angle) * velocityMagnitude;

  return {
    ...planet,
    position: new THREE.Vector3(x, y, 0),
    velocity: new THREE.Vector3(vx, vy, 0)
  };
});

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  planets: PlanetData[];
  onSelectPlanet: (planet: PlanetData) => void;
  drawnPaths?: DrawnPath[];
  planetOrbits?: PlanetOrbit[];
  onSelectPath?: (path: DrawnPath) => void;
  onSelectOrbit?: (orbit: PlanetOrbit) => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ 
  isOpen, 
  onClose, 
  planets, 
  onSelectPlanet, 
  drawnPaths = [], 
  planetOrbits = [],
  onSelectPath,
  onSelectOrbit
}) => {
  const [activeTab, setActiveTab] = useState<'planets' | 'paths' | 'orbits'>('planets');
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!isOpen) return null;

  const filteredPlanets = planets.filter(planet => 
    planet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPaths = drawnPaths.filter(path => 
    path.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(path.timestamp).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrbits = planetOrbits.filter(orbit => {
    const planet = planets.find(p => p.id === orbit.planetId);
    return planet && planet.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="cosmic-glass w-[calc(100%-1rem)] sm:w-auto sm:min-w-[320px] max-w-4xl relative z-10 max-h-[90vh] flex flex-col rounded-lg overflow-hidden">
        <div className="p-3 sm:p-4 border-b border-[var(--color-accent-cosmic-purple)]/30">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg sm:text-2xl font-bold">Cosmic Gallery</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[var(--color-text-starlight-white)]/70 hover:text-[var(--color-text-starlight-white)] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[var(--color-bg-deep-space)] text-[var(--color-text-starlight-white)] border border-[var(--color-accent-cosmic-purple)]/30 rounded-lg px-3 py-1.5 text-sm sm:text-base focus:outline-none focus:border-[var(--color-accent-cosmic-purple)]"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-starlight-white)]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex rounded-lg overflow-hidden border border-[var(--color-accent-cosmic-purple)]/30">
              <button
                onClick={() => setActiveTab('planets')}
                className={`flex-1 px-3 py-1.5 text-sm sm:text-base transition-colors ${
                  activeTab === 'planets' 
                    ? 'bg-[var(--color-accent-cosmic-purple)] text-[var(--color-text-starlight-white)]'
                    : 'bg-[var(--color-bg-deep-space)] text-[var(--color-text-starlight-white)]/70 hover:text-[var(--color-text-starlight-white)]'
                }`}
              >
                Planets
              </button>
              <button
                onClick={() => setActiveTab('paths')}
                className={`flex-1 px-3 py-1.5 text-sm sm:text-base transition-colors ${
                  activeTab === 'paths'
                    ? 'bg-[var(--color-accent-cosmic-purple)] text-[var(--color-text-starlight-white)]'
                    : 'bg-[var(--color-bg-deep-space)] text-[var(--color-text-starlight-white)]/70 hover:text-[var(--color-text-starlight-white)]'
                }`}
              >
                Paths
              </button>
              <button
                onClick={() => setActiveTab('orbits')}
                className={`flex-1 px-3 py-1.5 text-sm sm:text-base transition-colors ${
                  activeTab === 'orbits'
                    ? 'bg-[var(--color-accent-cosmic-purple)] text-[var(--color-text-starlight-white)]'
                    : 'bg-[var(--color-bg-deep-space)] text-[var(--color-text-starlight-white)]/70 hover:text-[var(--color-text-starlight-white)]'
                }`}
              >
                Orbits
              </button>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 overflow-y-auto">
          {activeTab === 'planets' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredPlanets.map(planet => (
                  <button
                    key={planet.id}
                    onClick={() => {
                      onSelectPlanet(planet);
                      onClose();
                    }}
                    className="cosmic-glass p-3 sm:p-4 text-left transition-all hover:scale-102 group"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full relative overflow-hidden glow-effect"
                        style={{ background: planet.color }}
                      >
                        <div className="absolute inset-0 opacity-70" style={{
                          background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, ${planet.color}33 60%, transparent 100%)`
                        }}></div>
                        </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base">{planet.name}</h3>
                        <p className="text-xs sm:text-sm text-[var(--color-text-starlight-white)]/70">
                          {planet.distanceFromEarth}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-[var(--color-text-starlight-white)]/70 line-clamp-2 group-hover:text-[var(--color-text-starlight-white)] transition-colors">
                        {planet.description}
                      </p>
                  </button>
                ))}
              </div>
          ) : activeTab === 'paths' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filteredPaths.map(path => (
                    <button
                      key={path.id}
                      onClick={() => {
                        onSelectPath?.(path);
                        onClose();
                      }}
                      className={`cosmic-glass p-3 sm:p-4 text-left transition-all hover:scale-102 ${
                        path.isVisible ? 'ring-2 ring-[var(--color-accent-cosmic-purple)]' : ''
                      }`}
                    >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ background: path.color }}
                        ></div>
                        <span className="text-sm sm:text-base font-medium">
                          {path.type === 'orbit' ? 'Orbital Path' : 'Free Draw'}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-text-starlight-white)]/50">
                        {new Date(path.timestamp).toLocaleTimeString()}
                      </span>
                        </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-[var(--color-text-starlight-white)]/70">
                      <span>Width: {path.width}</span>
                      <span>Points: {path.points.length}</span>
                      <span className="text-[var(--color-accent-cosmic-purple)]">
                        {path.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                      </div>
                    </button>
                ))}
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {filteredOrbits.map(orbit => {
                  const planet = planets.find(p => p.id === orbit.planetId);
                  return (
                    <button
                      key={orbit.id}
                      onClick={() => {
                        onSelectOrbit?.(orbit);
                        onClose();
                      }}
                      className={`cosmic-glass p-3 sm:p-4 text-left transition-all hover:scale-102 ${
                        orbit.isVisible ? 'ring-2 ring-[var(--color-accent-cosmic-purple)]' : ''
                      }`}
                    >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ background: orbit.color }}
                        ></div>
                        <span className="text-sm sm:text-base font-medium">
                          {planet ? planet.name : 'Unknown'} Orbit
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm text-[var(--color-text-starlight-white)]/70">
                      <span>Width: {orbit.width}</span>
                      <span>Points: {orbit.path.length}</span>
                      <span className="text-[var(--color-accent-cosmic-purple)]">
                        {orbit.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    </button>
                  );
                })}
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SolarSystemSimulator: React.FC = () => {
	const [is3DView, setIs3DView] = useState(true);
	const [timeSpeed, setTimeSpeed] = useState(1);
	const [hoveredPlanet, setHoveredPlanet] = useState<PlanetData | null>(null);
	const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
	const [drawnPaths, setDrawnPaths] = useState<DrawnPath[]>([]);
	const [planetOrbits, setPlanetOrbits] = useState<PlanetOrbit[]>([]);
	const [drawingMode, setDrawingMode] = useState<"free" | "orbit">("free");
	const [isDrawingOrbit, setIsDrawingOrbit] = useState(false);
	const [orbitStartPoint, setOrbitStartPoint] = useState<THREE.Vector2 | null>(
		null
	);
	const [showDrawingControls, setShowDrawingControls] = useState(false);
	const [pathColor, setPathColor] = useState("#F1F7FF");
	const [pathWidth, setPathWidth] = useState(2);
	const [stars, setStars] = useState<Star[]>([]);
	const [isClient, setIsClient] = useState(false);
	const [showTitle, setShowTitle] = useState(true);
	const [showOrbitCircles, setShowOrbitCircles] = useState(true);
	const [showSideMenu, setShowSideMenu] = useState(false);
	const [showGallery, setShowGallery] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);
	const [showShortcuts, setShowShortcuts] = useState(false);
	const [showTooltip, setShowTooltip] = useState(false);
	const [tooltipMessage, setTooltipMessage] = useState("");
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
	const [selectedTutorialId, setSelectedTutorialId] = useState<string | null>(
		null
	);
	const [pathType, setPathType] = useState<"free" | "orbit">("free");
	const [pathOpacity, setPathOpacity] = useState(0.8);
	const [forceUpdate, setForceUpdate] = useState(0); // Added to force canvas updates
	const attachmentRadiusRef = useRef(5); // Radius multiplier for path attachment
	const [selectedPath, setSelectedPath] = useState<DrawnPath | null>(null);
	const [selectedOrbit, setSelectedOrbit] = useState<PlanetOrbit | null>(null);

	const threeCanvasRef = useRef<HTMLCanvasElement>(null);
	const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

	const planetsRef = useRef<PlanetData[]>(
		JSON.parse(JSON.stringify(initialPlanets)).map((p: any) => ({
			...p,
			position: new THREE.Vector3(p.position.x, p.position.y, p.position.z),
			velocity: new THREE.Vector3(p.velocity.x, p.velocity.y, p.velocity.z),
		})) as PlanetData[]
	);

	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const controlsRef = useRef<OrbitControls | null>(null);
	const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster());
	const mousePosRef = useRef<THREE.Vector2>(new THREE.Vector2());

	const isDrawingRef = useRef(false);
	const currentPathRef = useRef<THREE.Vector2[]>([]);
	const viewTransformRef = useRef({
		scale: 1.5,
		offset: new THREE.Vector2(0, 0),
	});
	const isPanningRef = useRef(false);
	const lastPanPointRef = useRef<THREE.Vector2 | null>(null);
	const animationFrameIdRef = useRef<number | null>(null);

	// Add state for button functionality tracking
	const [isDrawingEnabled, setIsDrawingEnabled] = useState(true);
	const [lastClickTime, setLastClickTime] = useState(0);

	// Add debounce function for button clicks
	const handleButtonClick = useCallback(
		(action: () => void) => {
			const now = Date.now();
			if (now - lastClickTime > 300) {
				// 300ms debounce
				setLastClickTime(now);
				action();
			}
		},
		[lastClickTime]
	);

	const worldToScreen = useCallback(
		(worldPos: THREE.Vector2, canvas: HTMLCanvasElement) => {
			const { scale, offset } = viewTransformRef.current;
			return new THREE.Vector2(
				(worldPos.x - offset.x) * scale + canvas.width / 2,
				(worldPos.y - offset.y) * scale + canvas.height / 2
			);
		},
		[]
	);

	const screenToWorld = useCallback(
		(screenPos: THREE.Vector2, canvas: HTMLCanvasElement) => {
			const { scale, offset } = viewTransformRef.current;
			return new THREE.Vector2(
				(screenPos.x - canvas.width / 2) / scale + offset.x,
				(screenPos.y - canvas.height / 2) / scale + offset.y
			);
		},
		[]
	);

	const calculateGravity = useCallback((p1: PlanetData, p2: PlanetData) => {
		const distanceVec = new THREE.Vector3().subVectors(
			p2.position,
			p1.position
		);
		const distanceSq = distanceVec.lengthSq();

		if (distanceSq < 1) return null;

		const forceMagnitude = (G * p1.mass * p2.mass) / distanceSq;
		return distanceVec.normalize().multiplyScalar(forceMagnitude);
	}, []);

	const updateVelocities = useCallback(
		(planets: PlanetData[], forces: THREE.Vector3[], deltaTime: number) => {
			planets.forEach((planet, i) => {
				if (planet.isSun) return;
				const acceleration = forces[i].divideScalar(planet.mass);
				planet.velocity.add(acceleration.multiplyScalar(deltaTime));
			});
		},
		[]
	);

	const updatePositions = useCallback(
		(planets: PlanetData[], deltaTime: number) => {
			planets.forEach((planet) => {
				if (planet.isSun) return;
				planet.position.add(
					new THREE.Vector3().copy(planet.velocity).multiplyScalar(deltaTime)
				);
			});
		},
		[]
	);

	const updatePhysics = useCallback(
		(deltaTime: number) => {
			const planets = planetsRef.current;
			const forces = planets.map(() => new THREE.Vector3(0, 0, 0));

			for (let i = 0; i < planets.length; i++) {
				for (let j = i + 1; j < planets.length; j++) {
					const force = calculateGravity(planets[i], planets[j]);
					if (force) {
						forces[i].add(force);
						forces[j].sub(force);
					}
				}
			}

			updateVelocities(planets, forces, deltaTime);
			updatePositions(planets, deltaTime);
		},
		[calculateGravity, updateVelocities, updatePositions]
	);

	const drawPlanetGlow = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			planet: PlanetData,
			screenPos: THREE.Vector2,
			radius: number
		) => {
			ctx.beginPath();
			const glowRadius = radius * 1.5;
			const glowGradient = ctx.createRadialGradient(
				screenPos.x,
				screenPos.y,
				radius * 0.5,
				screenPos.x,
				screenPos.y,
				glowRadius
			);

			if (planet.isSun) {
				glowGradient.addColorStop(0, planet.color);
				glowGradient.addColorStop(0.3, "rgba(255, 215, 0, 0.6)");
				glowGradient.addColorStop(0.7, "rgba(255, 150, 0, 0.3)");
				glowGradient.addColorStop(1, "rgba(255, 100, 0, 0)");

				ctx.arc(screenPos.x, screenPos.y, glowRadius * 1.5, 0, 2 * Math.PI);
			} else {
				glowGradient.addColorStop(0, planet.color);
				glowGradient.addColorStop(0.7, `${planet.color}40`);
				glowGradient.addColorStop(1, `${planet.color}00`);

				ctx.arc(screenPos.x, screenPos.y, glowRadius, 0, 2 * Math.PI);
			}

			ctx.fillStyle = glowGradient;
			ctx.fill();
		},
		[]
	);

	const drawPlanetBody = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			planet: PlanetData,
			screenPos: THREE.Vector2,
			radius: number
		) => {
			ctx.beginPath();
			ctx.arc(screenPos.x, screenPos.y, radius, 0, 2 * Math.PI);

			const planetGradient = ctx.createRadialGradient(
				screenPos.x - radius * 0.3,
				screenPos.y - radius * 0.3,
				radius * 0.1,
				screenPos.x,
				screenPos.y,
				radius
			);

			if (planet.isSun) {
				planetGradient.addColorStop(0, "#FFFFFF");
				planetGradient.addColorStop(0.2, "#FFFAF0");
				planetGradient.addColorStop(0.5, planet.color);
				planetGradient.addColorStop(1, "#FFA500");
			} else {
				const brighterColor = planet.color.replace(/^#/, "");
				const r = parseInt(brighterColor.substring(0, 2), 16);
				const g = parseInt(brighterColor.substring(2, 4), 16);
				const b = parseInt(brighterColor.substring(4, 6), 16);

				const brighterShade = `rgb(${Math.min(255, r + 50)}, ${Math.min(
					255,
					g + 50
				)}, ${Math.min(255, b + 50)})`;
				const darkerShade = `rgb(${Math.max(0, r - 30)}, ${Math.max(
					0,
					g - 30
				)}, ${Math.max(0, b - 30)})`;

				planetGradient.addColorStop(0, brighterShade);
				planetGradient.addColorStop(0.7, planet.color);
				planetGradient.addColorStop(1, darkerShade);
			}

			ctx.fillStyle = planetGradient;
			ctx.fill();
		},
		[]
	);

	const drawOrbitCircle = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			planet: PlanetData,
			canvas: HTMLCanvasElement
		) => {
			ctx.beginPath();
			const distanceFromSun = Math.sqrt(
				planet.position.x * planet.position.x +
					planet.position.y * planet.position.y
			);
			const sunScreenPos = worldToScreen(new THREE.Vector2(0, 0), canvas);
			ctx.arc(
				sunScreenPos.x,
				sunScreenPos.y,
				distanceFromSun * viewTransformRef.current.scale,
				0,
				2 * Math.PI
			);
			ctx.strokeStyle = "rgba(93, 75, 238, 0.1)";
			ctx.lineWidth = 1;
			ctx.stroke();
		},
		[worldToScreen]
	);

	const drawPlanet = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			planet: PlanetData,
			canvas: HTMLCanvasElement
		) => {
			const screenPos = worldToScreen(
				new THREE.Vector2(planet.position.x, planet.position.y),
				canvas
			);
			const scaledRadius = planet.radius * viewTransformRef.current.scale;
			const radius = Math.max(1, scaledRadius);

			drawPlanetGlow(ctx, planet, screenPos, radius);
			drawPlanetBody(ctx, planet, screenPos, radius);

			if (!planet.isSun && showOrbitCircles) {
				drawOrbitCircle(ctx, planet, canvas);
			}
		},
		[
			worldToScreen,
			drawPlanetGlow,
			drawPlanetBody,
			drawOrbitCircle,
			showOrbitCircles,
		]
	);

	const drawOrbit = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			orbit: PlanetOrbit,
			canvas: HTMLCanvasElement
		) => {
			if (orbit.isVisible) {
				const planet = planetsRef.current.find((p) => p.id === orbit.planetId);

				// Draw the orbit path
				ctx.beginPath();
				const startPoint = worldToScreen(orbit.path[0], canvas);
				ctx.moveTo(startPoint.x, startPoint.y);

				for (let i = 1; i < orbit.path.length; i++) {
					const point = worldToScreen(orbit.path[i], canvas);
					ctx.lineTo(point.x, point.y);
				}

				// Close the path
				ctx.closePath();

				// Style the orbit
				ctx.strokeStyle = orbit.color;
				ctx.lineWidth = orbit.width * viewTransformRef.current.scale;
				ctx.setLineDash([5, 3]); // Dashed line for orbits
				ctx.stroke();
				ctx.setLineDash([]); // Reset to solid line

				// If there's an attached planet, mark its position on the orbit
				if (planet) {
					const planetPos = new THREE.Vector2(
						planet.position.x,
						planet.position.y
					);
					const sunPos = new THREE.Vector2(0, 0);
					const currentAngle = Math.atan2(
						planetPos.y - sunPos.y,
						planetPos.x - sunPos.x
					);
					const distanceFromSun = planetPos.distanceTo(sunPos);

					// Calculate the point on the orbit path
					const orbitX = Math.cos(currentAngle) * distanceFromSun;
					const orbitY = Math.sin(currentAngle) * distanceFromSun;
					const orbitPoint = worldToScreen(
						new THREE.Vector2(orbitX, orbitY),
						canvas
					);

					// Draw the marker
					ctx.beginPath();
					ctx.arc(
						orbitPoint.x,
						orbitPoint.y,
						4 * viewTransformRef.current.scale,
						0,
						Math.PI * 2
					);
					ctx.fillStyle = orbit.color;
					ctx.fill();
				}
			}
		},
		[worldToScreen]
	);

	const drawPath = useCallback(
		(
			ctx: CanvasRenderingContext2D,
			path: DrawnPath,
			canvas: HTMLCanvasElement
		) => {
			// Draw the path if it's visible or no path is specifically set as visible
			if (!drawnPaths.some((p) => p.isVisible) || path.isVisible) {
				if (path.points.length < 2) return;

				let points = [...path.points];

				// Update points if path is attached to a planet
				if (path.attachedToPlanet && path.initialPlanetPosition) {
					const attachedPlanet = planetsRef.current.find(
						(p) => p.id === path.attachedToPlanet
					);
					if (attachedPlanet) {
						const currentPlanetPos = new THREE.Vector2(
							attachedPlanet.position.x,
							attachedPlanet.position.y
						);

						// Update the attached point
						if (path.attachmentPoint === "end") {
							points[points.length - 1] = currentPlanetPos;
						} else if (path.attachmentPoint === "start") {
							points[0] = currentPlanetPos;
						}
					}
				}

				ctx.beginPath();
				const startScreenPos = worldToScreen(points[0], canvas);
				ctx.moveTo(startScreenPos.x, startScreenPos.y);

				for (let i = 1; i < points.length; i++) {
					const screenPos = worldToScreen(points[i], canvas);
					ctx.lineTo(screenPos.x, screenPos.y);
				}

				// Enhanced path styling
				ctx.shadowColor = path.color;
				ctx.shadowBlur = path.isVisible ? 25 : 15;

				const gradient = ctx.createLinearGradient(
					startScreenPos.x,
					startScreenPos.y,
					worldToScreen(points[points.length - 1], canvas).x,
					worldToScreen(points[points.length - 1], canvas).y
				);

				const baseColor = path.color.startsWith("#") ? path.color : "#F1F7FF";
				const opacity = path.isVisible ? 1 : pathOpacity;
				gradient.addColorStop(
					0,
					`${baseColor}${Math.floor(opacity * 255)
						.toString(16)
						.padStart(2, "0")}`
				);
				gradient.addColorStop(
					1,
					`${baseColor}${Math.floor(opacity * 0.7 * 255)
						.toString(16)
						.padStart(2, "0")}`
				);

				ctx.strokeStyle = gradient;
				ctx.lineWidth =
					(path.width || 2) *
					(path.isVisible ? 1.5 : 1) *
					viewTransformRef.current.scale;
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.stroke();

				// Draw attachment indicators
				if (path.attachedToPlanet) {
					const attachedPlanet = planetsRef.current.find(
						(p) => p.id === path.attachedToPlanet
					);
					if (attachedPlanet) {
						const planetPos = worldToScreen(
							new THREE.Vector2(
								attachedPlanet.position.x,
								attachedPlanet.position.y
							),
							canvas
						);

						ctx.beginPath();
						ctx.arc(
							planetPos.x,
							planetPos.y,
							attachedPlanet.radius * viewTransformRef.current.scale * 1.2,
							0,
							Math.PI * 2
						);

						const glowGradient = ctx.createRadialGradient(
							planetPos.x,
							planetPos.y,
							attachedPlanet.radius * viewTransformRef.current.scale,
							planetPos.x,
							planetPos.y,
							attachedPlanet.radius * viewTransformRef.current.scale * 1.5
						);

						glowGradient.addColorStop(0, `${path.color}40`);
						glowGradient.addColorStop(1, `${path.color}00`);

						ctx.strokeStyle = glowGradient;
						ctx.lineWidth = 2;
						ctx.stroke();
					}
				}
			}
		},
		[worldToScreen, pathOpacity, drawnPaths]
	);

	const drawActivePath = useCallback(
		(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
			if (!isDrawingRef.current || currentPathRef.current.length < 2) return;

			ctx.shadowColor = pathColor;
			ctx.shadowBlur = 10;

			ctx.beginPath();
			const startScreenPos = worldToScreen(currentPathRef.current[0], canvas);
			ctx.moveTo(startScreenPos.x, startScreenPos.y);

			for (let i = 1; i < currentPathRef.current.length; i++) {
				const screenPos = worldToScreen(currentPathRef.current[i], canvas);
				ctx.lineTo(screenPos.x, screenPos.y);
			}

			const lastPoint = worldToScreen(
				currentPathRef.current[currentPathRef.current.length - 1],
				canvas
			);
			const firstPoint = worldToScreen(currentPathRef.current[0], canvas);

			try {
				const gradient = ctx.createLinearGradient(
					firstPoint.x,
					firstPoint.y,
					lastPoint.x,
					lastPoint.y
				);
				gradient.addColorStop(0, "rgba(241, 247, 255, 0.7)");
				gradient.addColorStop(1, "rgba(93, 75, 238, 1)");
				ctx.strokeStyle = gradient;
			} catch (e) {
				ctx.strokeStyle = pathColor;
			}

			ctx.lineWidth = 3 * viewTransformRef.current.scale;
			ctx.lineCap = "round";
			ctx.lineJoin = "round";
			ctx.stroke();

			const endPos = worldToScreen(
				currentPathRef.current[currentPathRef.current.length - 1],
				canvas
			);
			ctx.beginPath();
			ctx.arc(
				endPos.x,
				endPos.y,
				4 * viewTransformRef.current.scale,
				0,
				Math.PI * 2
			);
			ctx.fillStyle = "rgba(241, 247, 255, 0.9)";
			ctx.fill();

			ctx.shadowBlur = 0;
		},
		[pathColor, worldToScreen]
	);

	const getMousePosition = useCallback(
		(e: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
			if (!canvas) return new THREE.Vector2();

			const rect = canvas.getBoundingClientRect();
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			return new THREE.Vector2(clientX - rect.left, clientY - rect.top);
		},
		[]
	);

	const triggerCanvasUpdate = useCallback(() => {
		// Force a canvas update
		setForceUpdate((prev) => prev + 1);
		if (overlayCanvasRef.current && !is3DView) {
			renderOverlay2D(overlayCanvasRef.current);
		}
	}, [is3DView]);

	const createOrbitForPlanet = useCallback(
		(planet: PlanetData) => {
			// Create a circular orbit path
			const sunPos = new THREE.Vector2(0, 0); // Sun is at center
			const planetPos = new THREE.Vector2(planet.position.x, planet.position.y);
			const distanceFromSun = planetPos.distanceTo(sunPos);

			// Create a perfect circular orbit
			const numPoints = 64; // number of points in the orbit
			const orbitPoints: THREE.Vector2[] = [];

			for (let i = 0; i < numPoints; i++) {
				const angle = (i / numPoints) * Math.PI * 2;
				const x = Math.cos(angle) * distanceFromSun;
				const y = Math.sin(angle) * distanceFromSun;
				orbitPoints.push(new THREE.Vector2(x, y));
			}

			// Add the orbit
			const newOrbit: PlanetOrbit = {
				planetId: planet.id,
				path: orbitPoints,
				color: pathColor,
				width: pathWidth,
				isVisible: true,
				id: `orbit-${Date.now()}`,
			};

			setPlanetOrbits((prev) => [...prev, newOrbit]);
			triggerCanvasUpdate();
		},
		[pathColor, pathWidth, triggerCanvasUpdate]
	);

	const finishDrawing = useCallback(() => {
		isDrawingRef.current = false;
		if (currentPathRef.current.length < 2) {
			currentPathRef.current = [];
			return;
		}

		// Regular free-form path drawing
		const lastPoint = currentPathRef.current[currentPathRef.current.length - 1];
		const firstPoint = currentPathRef.current[0];
		let nearestPlanet: PlanetData | null = null;
		let minDistance = Infinity;
		let attachmentPoint: "start" | "end" | undefined = undefined;

		// Find nearest planet for path attachment
		for (const planet of planetsRef.current) {
			if (!planet.isSun) {
				const planetPos = new THREE.Vector2(
					planet.position.x,
					planet.position.y
				);
				const distanceToEnd = planetPos.distanceTo(lastPoint);
				const distanceToStart = planetPos.distanceTo(firstPoint);

				const currentMin = Math.min(distanceToEnd, distanceToStart);
				if (currentMin < minDistance) {
					minDistance = currentMin;
					nearestPlanet = planet;
					attachmentPoint = distanceToEnd < distanceToStart ? "end" : "start";
				}
			}
		}

		const pathData: DrawnPath = {
			id: `path-${Date.now()}`,
			points: [...currentPathRef.current],
			color: pathColor,
			timestamp: Date.now(),
			width: pathWidth,
			type: "free",
			isPermanent: true,
			isVisible: true,
		};

		// For free mode paths, we can attach endpoints to planets
		if (
			nearestPlanet &&
			minDistance < nearestPlanet.radius * attachmentRadiusRef.current
		) {
			const planetPos = new THREE.Vector2(
				nearestPlanet.position.x,
				nearestPlanet.position.y
			);

			if (attachmentPoint === "end") {
				pathData.points[pathData.points.length - 1] = planetPos.clone();
			} else if (attachmentPoint === "start") {
				pathData.points[0] = planetPos.clone();
			}

			pathData.attachedToPlanet = nearestPlanet.id;
			pathData.initialPlanetPosition = planetPos.clone();
			pathData.attachmentPoint = attachmentPoint;
		}

		setDrawnPaths((prev) => [...prev, pathData]);
		currentPathRef.current = [];

		// Force render the canvas after adding the path
		triggerCanvasUpdate();
	}, [pathColor, pathWidth, triggerCanvasUpdate]);

	const handlePointerEnd = useCallback(
		(e: MouseEvent | TouchEvent) => {
			// Handle orbit creation
			if (isDrawingOrbit && orbitStartPoint) {
				const planet = planetsRef.current.find((p) => {
					const planetPos = new THREE.Vector2(p.position.x, p.position.y);
					return (
						!p.isSun && planetPos.distanceTo(orbitStartPoint) < p.radius * 2
					);
				});

				if (planet) {
					createOrbitForPlanet(planet);
				}

				setIsDrawingOrbit(false);
				setOrbitStartPoint(null);
				triggerCanvasUpdate();
			}

			// Handle free drawing completion
			if (isDrawingRef.current) {
				finishDrawing();
			}

			if (isPanningRef.current) {
				isPanningRef.current = false;
				lastPanPointRef.current = null;
			}
		},
		[
			finishDrawing,
			isDrawingOrbit,
			orbitStartPoint,
			createOrbitForPlanet,
			triggerCanvasUpdate,
		]
	);

	const handleZoom = useCallback(
		(e: WheelEvent) => {
			if (is3DView) return;
			e.preventDefault();
			const canvas = overlayCanvasRef.current;
			if (!canvas) return;

			const zoomAmount = 1.1;
			const mousePos = getMousePosition(e as any, canvas);
			const worldPosBeforeZoom = screenToWorld(mousePos, canvas);

			if (e.deltaY < 0) {
				viewTransformRef.current.scale *= zoomAmount;
			} else {
				viewTransformRef.current.scale /= zoomAmount;
			}

			viewTransformRef.current.scale = Math.max(
				0.1,
				Math.min(viewTransformRef.current.scale, 20)
			);

			const worldPosAfterZoom = screenToWorld(mousePos, canvas);
			viewTransformRef.current.offset.x +=
				worldPosBeforeZoom.x - worldPosAfterZoom.x;
			viewTransformRef.current.offset.y +=
				worldPosBeforeZoom.y - worldPosAfterZoom.y;

			// Force a canvas update after zooming
			triggerCanvasUpdate();
		},
		[is3DView, screenToWorld, getMousePosition, triggerCanvasUpdate]
	);

	const handlePanning = useCallback(
		(currentPos: THREE.Vector2) => {
			if (!lastPanPointRef.current) return;

			const dx =
				(currentPos.x - lastPanPointRef.current.x) /
				viewTransformRef.current.scale;
			const dy =
				(currentPos.y - lastPanPointRef.current.y) /
				viewTransformRef.current.scale;
			viewTransformRef.current.offset.x -= dx;
			viewTransformRef.current.offset.y -= dy;
			lastPanPointRef.current = currentPos;

			// Force a canvas update after panning
			triggerCanvasUpdate();
		},
		[triggerCanvasUpdate]
	);

	const handleDrawing = useCallback(
		(currentPos: THREE.Vector2) => {
			if (!overlayCanvasRef.current) return;
			currentPathRef.current.push(
				screenToWorld(currentPos, overlayCanvasRef.current)
			);

			// Force a canvas update while drawing
			triggerCanvasUpdate();
		},
		[screenToWorld, triggerCanvasUpdate]
	);

	const handleHover = useCallback(
		(e: MouseEvent) => {
			if (isDrawingRef.current || isPanningRef.current) return;

			if (
				is3DView &&
				threeCanvasRef.current &&
				cameraRef.current &&
				sceneRef.current
			) {
				const pos = getMousePosition(e, threeCanvasRef.current);
				mousePosRef.current.set(
					(pos.x / window.innerWidth) * 2 - 1,
					-(pos.y / window.innerHeight) * 2 + 1
				);
				raycasterRef.current.setFromCamera(
					mousePosRef.current,
					cameraRef.current
				);
				const intersects = raycasterRef.current.intersectObjects(
					sceneRef.current.children
				);
				if (intersects.length > 0) {
					const intersectedObject = intersects[0].object;
					const planet = planetsRef.current.find(
						(p) => p.mesh === intersectedObject
					);
					setHoveredPlanet(planet || null);
				} else {
					setHoveredPlanet(null);
				}
			} else if (!is3DView && overlayCanvasRef.current) {
				const pos = getMousePosition(e, overlayCanvasRef.current);
				const worldMousePos = screenToWorld(pos, overlayCanvasRef.current);
				let foundPlanet = null;
				let minDistanceSq = Infinity;

				planetsRef.current.forEach((planet) => {
					const planetWorldPos = new THREE.Vector2(
						planet.position.x,
						planet.position.y
					);
					const distanceSq = planetWorldPos.distanceToSquared(worldMousePos);
					const hoverRadius = planet.radius * 2;
					if (
						distanceSq < hoverRadius * hoverRadius &&
						distanceSq < minDistanceSq
					) {
						minDistanceSq = distanceSq;
						foundPlanet = planet;
					}
				});

				setHoveredPlanet(foundPlanet);
			}
		},
		[is3DView, screenToWorld, getMousePosition]
	);

	const handleClick = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (isDrawingRef.current || isPanningRef.current) return;

			if (is3DView && threeCanvasRef.current) {
				const pos = getMousePosition(e, threeCanvasRef.current);
				mousePosRef.current.set(
					(pos.x / window.innerWidth) * 2 - 1,
					-(pos.y / window.innerHeight) * 2 + 1
				);
				if (cameraRef.current && sceneRef.current) {
					raycasterRef.current.setFromCamera(
						mousePosRef.current,
						cameraRef.current
					);
					const intersects = raycasterRef.current.intersectObjects(
						sceneRef.current.children
					);
					if (intersects.length > 0) {
						const intersectedObject = intersects[0].object;
						const planet = planetsRef.current.find(
							(p) => p.mesh === intersectedObject
						);
						setSelectedPlanet(planet || null);
					} else {
						setSelectedPlanet(null);
					}
				}
			} else if (!is3DView && overlayCanvasRef.current) {
				const pos = getMousePosition(e, overlayCanvasRef.current);
				const worldMousePos = screenToWorld(pos, overlayCanvasRef.current);
				let foundPlanet = null;
				let minDistanceSq = Infinity;

				planetsRef.current.forEach((planet) => {
					const planetWorldPos = new THREE.Vector2(
						planet.position.x,
						planet.position.y
					);
					const distanceSq = planetWorldPos.distanceToSquared(worldMousePos);
					const clickRadius = planet.radius * 2;
					if (
						distanceSq < clickRadius * clickRadius &&
						distanceSq < minDistanceSq
					) {
						minDistanceSq = distanceSq;
						foundPlanet = planet;
					}
				});

				if (foundPlanet) {
					setSelectedPlanet(foundPlanet);
				} else if (drawingMode === "orbit") {
					// If in orbit mode and clicked away from planets, do nothing
					// This prevents creating unwanted paths
				} else {
					setSelectedPlanet(null);
				}
			}
		},
		[is3DView, screenToWorld, getMousePosition, drawingMode]
	);

	const renderOverlay2D = useCallback(
		(canvas: HTMLCanvasElement) => {
			const ctx = canvas.getContext("2d");
			if (!ctx || is3DView) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			// Draw orbit circles first
			if (showOrbitCircles) {
				planetsRef.current.forEach((planet) => {
					if (!planet.isSun) {
						drawOrbitCircle(ctx, planet, canvas);
					}
				});
			}

			// Draw custom orbits
			planetOrbits.forEach((orbit) => drawOrbit(ctx, orbit, canvas));

			// Draw paths
			drawnPaths.forEach((path) => drawPath(ctx, path, canvas));

			// Draw planets
			planetsRef.current.forEach((planet) => drawPlanet(ctx, planet, canvas));

			// Draw the active path last
			drawActivePath(ctx, canvas);
		},
		[
			is3DView,
			showOrbitCircles,
			planetOrbits,
			drawnPaths,
			drawOrbit,
			drawPath,
			drawPlanet,
			drawActivePath,
			drawOrbitCircle,
		]
	);

	const handlePointerStart = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (is3DView || !isDrawingEnabled) return;
			e.preventDefault();

			if (!overlayCanvasRef.current) return;
			const pos = getMousePosition(e, overlayCanvasRef.current);
			const worldPos = screenToWorld(pos, overlayCanvasRef.current);

			if (
				(e.type === "mousedown" && (e as MouseEvent).button === 2) ||
				(e.type === "touchstart" && (e as TouchEvent).touches.length === 2)
			) {
				isPanningRef.current = true;
				lastPanPointRef.current = pos;
				return;
			}

			// Check if we're starting near a planet for orbit drawing
			if (drawingMode === "orbit") {
				let nearestPlanet: PlanetData | null = null;
				let minDistance = Infinity;

				// Find nearest planet to start orbit drawing
				for (const planet of planetsRef.current) {
					if (!planet.isSun) {
						const planetPos = new THREE.Vector2(
							planet.position.x,
							planet.position.y
						);
						const distance = planetPos.distanceTo(worldPos);

						if (distance < planet.radius * 2 && distance < minDistance) {
							minDistance = distance;
							nearestPlanet = planet;
						}
					}
				}

				if (nearestPlanet) {
					// Start orbit drawing mode
					setIsDrawingOrbit(true);
					// Use current planet position as orbit start point
					setOrbitStartPoint(
						new THREE.Vector2(
							nearestPlanet.position.x,
							nearestPlanet.position.y
						)
					);
					// We'll create the orbit when the pointer is released

					// Create the orbit immediately
					createOrbitForPlanet(nearestPlanet);
				} else {
					// Regular free drawing
					isDrawingRef.current = true;
					currentPathRef.current = [worldPos];
				}
			} else {
				// Regular free drawing for non-orbit mode
				isDrawingRef.current = true;
				currentPathRef.current = [worldPos];
			}

			triggerCanvasUpdate();
		},
		[
			is3DView,
			isDrawingEnabled,
			drawingMode,
			screenToWorld,
			getMousePosition,
			triggerCanvasUpdate,
			createOrbitForPlanet,
		]
	);

	const handlePointerMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			if (!overlayCanvasRef.current) return;
			const currentMousePos = getMousePosition(e, overlayCanvasRef.current);

			mousePosRef.current.set(
				(currentMousePos.x / window.innerWidth) * 2 - 1,
				-(currentMousePos.y / window.innerHeight) * 2 + 1
			);

			if (is3DView) return;
			e.preventDefault();

			if (isPanningRef.current && lastPanPointRef.current) {
				handlePanning(currentMousePos);
			} else if (isDrawingRef.current) {
				handleDrawing(currentMousePos);
			}
		},
		[is3DView, getMousePosition, handlePanning, handleDrawing]
	);

	// Function to clear all drawn paths and orbits
	const clearAllDrawings = useCallback(() => {
		setDrawnPaths([]);
		setPlanetOrbits([]);
		setSelectedPath(null);
		setSelectedOrbit(null);
		// Force a canvas update after clearing paths
		triggerCanvasUpdate();
	}, [triggerCanvasUpdate]);

	useEffect(() => {
		const canvas = overlayCanvasRef.current;
		if (!canvas) return;

		const disableContextMenu = (e: Event) => e.preventDefault();

		canvas.addEventListener("mousedown", handlePointerStart as any);
		canvas.addEventListener("mousemove", handlePointerMove as any);
		canvas.addEventListener("mouseup", handlePointerEnd as any);
		canvas.addEventListener("wheel", handleZoom);
		canvas.addEventListener("touchstart", handlePointerStart as any);
		canvas.addEventListener("touchmove", handlePointerMove as any);
		canvas.addEventListener("touchend", handlePointerEnd as any);
		canvas.addEventListener("touchcancel", handlePointerEnd as any);
		canvas.addEventListener("contextmenu", disableContextMenu);
		canvas.addEventListener("click", handleClick as any);
		canvas.addEventListener("mousemove", handleHover);

		return () => {
			canvas.removeEventListener("mousedown", handlePointerStart as any);
			canvas.removeEventListener("mousemove", handlePointerMove as any);
			canvas.removeEventListener("mouseup", handlePointerEnd as any);
			canvas.removeEventListener("wheel", handleZoom);
			canvas.removeEventListener("touchstart", handlePointerStart as any);
			canvas.removeEventListener("touchmove", handlePointerMove as any);
			canvas.removeEventListener("touchend", handlePointerEnd as any);
			canvas.removeEventListener("touchcancel", handlePointerEnd as any);
			canvas.removeEventListener("contextmenu", disableContextMenu);
			canvas.removeEventListener("click", handleClick as any);
			canvas.removeEventListener("mousemove", handleHover);
		};
	}, [
		handlePointerStart,
		handlePointerMove,
		handlePointerEnd,
		handleZoom,
		handleClick,
		handleHover,
	]);

	useEffect(() => {
		const canvas = threeCanvasRef.current;
		if (!canvas) return;

		canvas.addEventListener("click", handleClick as any);
		canvas.addEventListener("mousemove", handleHover);

		return () => {
			canvas.removeEventListener("click", handleClick as any);
			canvas.removeEventListener("mousemove", handleHover);
		};
	}, [handleClick, handleHover]);

	useEffect(() => {
		if (!threeCanvasRef.current) return;

		const scene = new THREE.Scene();
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			2000
		);
		camera.position.set(0, 150, 250);
		cameraRef.current = camera;

		const renderer = new THREE.WebGLRenderer({
			canvas: threeCanvasRef.current,
			antialias: true,
			alpha: true,
		});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		rendererRef.current = renderer;

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		scene.add(ambientLight);
		const sunLight = new THREE.PointLight(0xffffff, 2, 2000);
		scene.add(sunLight);

		planetsRef.current.forEach((p) => {
			const geometry = new THREE.SphereGeometry(p.radius, 42, 42);
			let material;

			if (p.isSun) {
				material = new THREE.MeshStandardMaterial({
					emissive: p.color,
					emissiveIntensity: 1.2,
					roughness: 0.3,
					metalness: 0,
				});

				const sunGlow = new THREE.PointLight(p.color, 5, 150);
				sunGlow.position.copy(p.position);
				scene.add(sunGlow);

				sunLight.position.copy(p.position);
				sunLight.color = new THREE.Color(p.color);
			} else {
				material = new THREE.MeshStandardMaterial({
					color: p.color,
					emissiveIntensity: 1.2,
					roughness: 0.3,
					metalness: 0,
				});
			}

			p.mesh = new THREE.Mesh(geometry, material);
			p.mesh.position.copy(p.position);
			scene.add(p.mesh);
		});

		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controlsRef.current = controls;

		const clock = new THREE.Clock();

		const animate = () => {
			animationFrameIdRef.current = requestAnimationFrame(animate);
			const deltaTime = clock.getDelta() * timeSpeed;

			const effectiveDeltaTime = Math.min(deltaTime, PHYSICS_TIMESTEP * 3);
			if (effectiveDeltaTime > 0) {
				for (let i = 0; i < Math.max(1, timeSpeed / 2); ++i)
					updatePhysics(
						PHYSICS_TIMESTEP *
							(timeSpeed > 0 ? timeSpeed / Math.max(1, timeSpeed / 2) : 0) *
							(effectiveDeltaTime / deltaTime)
					);
			}

			planetsRef.current.forEach((p) => {
				if (p.mesh) {
					p.mesh.position.copy(p.position);
					if (p.isSun && sunLight) {
						sunLight.position.copy(p.position);
					}
				}
			});

			if (controlsRef.current) controlsRef.current.update();

			renderer.render(scene, camera);

			if (overlayCanvasRef.current && !is3DView) {
				renderOverlay2D(overlayCanvasRef.current);
			}
		};

		if (animationFrameIdRef.current) {
			cancelAnimationFrame(animationFrameIdRef.current);
		}

		animate();

		const handleResize = () => {
			if (
				cameraRef.current &&
				rendererRef.current &&
				overlayCanvasRef.current
			) {
				const width = window.innerWidth;
				const height = window.innerHeight;
				cameraRef.current.aspect = width / height;
				cameraRef.current.updateProjectionMatrix();
				rendererRef.current.setSize(width, height);
				overlayCanvasRef.current.width = width;
				overlayCanvasRef.current.height = height;
				triggerCanvasUpdate();
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			if (animationFrameIdRef.current) {
				cancelAnimationFrame(animationFrameIdRef.current);
				animationFrameIdRef.current = null;
			}

			window.removeEventListener("resize", handleResize);

			if (controls) {
				controls.dispose();
			}

			if (renderer) {
				renderer.dispose();
			}

			planetsRef.current.forEach((p) => {
				if (p.mesh) {
					if (p.mesh.geometry) p.mesh.geometry.dispose();
					if (p.mesh.material) {
						if (Array.isArray(p.mesh.material)) {
							p.mesh.material.forEach((material) => material.dispose());
						} else {
							p.mesh.material.dispose();
						}
					}
					if (p.mesh.parent) {
						p.mesh.parent.remove(p.mesh);
					}
				}
			});

			if (sceneRef.current) {
				while (sceneRef.current.children.length > 0) {
					const object = sceneRef.current.children[0];
					sceneRef.current.remove(object);
				}
			}
		};
	}, [
		timeSpeed,
		updatePhysics,
		is3DView,
		renderOverlay2D,
		triggerCanvasUpdate,
	]);

	// Force canvas updates when relevant state changes
	useEffect(() => {
		if (overlayCanvasRef.current && !is3DView) {
			renderOverlay2D(overlayCanvasRef.current);
		}
	}, [
		renderOverlay2D,
		is3DView,
		drawnPaths,
		planetOrbits,
		showOrbitCircles,
		forceUpdate,
	]);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		const newStars = Array.from({ length: 50 }).map((_, i) => ({
			id: i,
			width: Math.random() * 2 + 1,
			height: Math.random() * 2 + 1,
			opacity: Math.random() * 0.7 + 0.3,
			top: Math.random() * 100,
			left: Math.random() * 100,
			duration: Math.random() * 3 + 2,
			delay: Math.random() * 2,
		}));
		setStars(newStars);
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowTitle(false);
		}, 4000);

		return () => clearTimeout(timer);
	}, []);

	// Add drawing controls component
	const DrawingControls = () => (
		<div className="cosmic-glass fixed bottom-28 right-2 xs:right-4 p-2 xs:p-3 rounded-lg z-40">
			<div className="flex flex-col gap-1 xs:gap-2">
				<button
					onClick={() => {
						setDrawingMode("free");
						setPathType("free");
					}}
					className={`cosmic-button p-1.5 xs:p-2 rounded-lg text-[8px] xs:text-[10px] sm:text-xs ${
						drawingMode === "free"
							? "bg-[var(--color-accent-cosmic-purple)]"
							: ""
					}`}
					title="Free drawing mode"
				>
					Free Draw
				</button>
				<button
					onClick={() => {
						setDrawingMode("orbit");
						setPathType("orbit");
					}}
					className={`cosmic-button p-1.5 xs:p-2 rounded-lg text-[8px] xs:text-[10px] sm:text-xs ${
						drawingMode === "orbit"
							? "bg-[var(--color-accent-cosmic-purple)]"
							: ""
					}`}
					title="Orbit drawing mode"
				>
					Draw Orbit
				</button>
				<button
					onClick={clearAllDrawings}
					className="cosmic-button p-1.5 xs:p-2 rounded-lg text-[8px] xs:text-[10px] sm:text-xs"
					title="Clear drawing"
				>
					Clear All
				</button>
			</div>
		</div>
	);

	// Add a floating action button for drawing controls
	const FloatingActionButton = () => (
		<div className="fixed bottom-16 right-2 xs:right-4 z-40 flex flex-col gap-1 xs:gap-2">
			<button
				onClick={() => setShowDrawingControls(!showDrawingControls)}
				className="cosmic-button p-1.5 xs:p-2 rounded-full hover:scale-110 transition-transform"
				title="Toggle drawing controls"
			>
				<svg
					className="w-4 h-4 xs:w-5 xs:h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
					/>
				</svg>
			</button>
			<button
				onClick={() => toggleAllVisibility(!areSomeItemsVisible())}
				className="cosmic-button p-1.5 xs:p-2 rounded-full hover:scale-110 transition-transform"
				title={areSomeItemsVisible() ? "Hide All Paths" : "Show All Paths"}
			>
				<svg
					className="w-4 h-4 xs:w-5 xs:h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d={
							areSomeItemsVisible()
								? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
								: "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
						}
					/>
				</svg>
			</button>
		</div>
	);

	// Check if some paths or orbits are visible
	const areSomeItemsVisible = useCallback(() => {
		return (
			drawnPaths.some((p) => p.isVisible) ||
			planetOrbits.some((o) => o.isVisible)
		);
	}, [drawnPaths, planetOrbits]);

	// Add cleanup function for drawing state
	const cleanupDrawing = useCallback(() => {
		isDrawingRef.current = false;
		currentPathRef.current = [];
		setIsDrawingEnabled(true);
	}, []);

	// Add effect for cleaning up drawing state
	useEffect(() => {
		return () => {
			cleanupDrawing();
		};
	}, [cleanupDrawing]);

	const tutorials = [
		{
			id: "view-mode",
			title: "2D/3D View Modes",
			description:
				"Switch between 2D and 3D views to explore the solar system from different perspectives.",
			icon: "🔄",
		},
		{
			id: "drawing",
			title: "Draw Orbital Paths",
			description:
				"In 2D mode, draw paths that planets will follow. Attach them to planets for synchronized movement.",
			icon: "✏️",
		},
		{
			id: "planets",
			title: "Planet Information",
			description:
				"Click on any planet to view detailed information about its mass, temperature, and distance.",
			icon: "🌍",
		},
		{
			id: "gallery",
			title: "Planet Gallery",
			description:
				"Explore all planets in our solar system through the beautiful gallery view.",
			icon: "🖼️",
		},
	] as Tutorial[];

	const shortcuts = [
		{ key: "Space", description: "Pause/Resume simulation" },
		{ key: "R", description: "Reset view" },
		{ key: "D", description: "Toggle drawing mode" },
		{ key: "G", description: "Open gallery" },
		{ key: "1-9", description: "Focus on specific planet" },
		{ key: "Esc", description: "Close any open modal" },
		{ key: "?", description: "Show keyboard shortcuts" },
		{ key: "C", description: "Clear all paths" },
	] as KeyboardShortcut[];

	// Add keyboard shortcuts handler
	useEffect(() => {
		const handleKeyPress = (e: KeyboardEvent) => {
			if (e.target instanceof HTMLInputElement) return;

			switch (e.key.toLowerCase()) {
				case " ":
					setTimeSpeed((prev) => (prev === 0 ? 1 : 0));
					break;
				case "r":
					if (controlsRef.current) {
						controlsRef.current.reset();
					}
					break;
				case "d":
					if (!is3DView) {
						setShowDrawingControls((prev) => !prev);
					}
					break;
				case "g":
					setShowGallery(true);
					break;
				case "escape":
					setShowGallery(false);
					setShowSideMenu(false);
					setShowTutorial(false);
					setShowShortcuts(false);
					break;
				case "?":
					setShowShortcuts((prev) => !prev);
					break;
				case "c":
					if (!is3DView) {
						clearAllDrawings();
					}
					break;
				default:
					// Number keys 1-9 for planet focus
					const num = parseInt(e.key);
					if (num >= 1 && num <= 9 && planetsRef.current[num - 1]) {
						setSelectedPlanet(planetsRef.current[num - 1]);
					}
			}
		};

		window.addEventListener("keydown", handleKeyPress);
		return () => window.removeEventListener("keydown", handleKeyPress);
	}, [is3DView, setTimeSpeed, setShowDrawingControls, clearAllDrawings]);

	// Add Tutorial Modal Component
	const TutorialModal: React.FC = () => (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm"
				onClick={() => setShowTutorial(false)}
			/>
			<div className="cosmic-glass p-4 w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto">
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg sm:text-2xl font-bold">
						Welcome to CosmicOrbit
					</h2>
					<button
						onClick={() => setShowTutorial(false)}
						className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-accent-cosmic-purple)]/20"
					>
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
					{tutorials.map((tutorial) => (
						<button
							key={tutorial.id}
							className={`cosmic-glass p-3 sm:p-4 text-left transition-all hover:scale-102 ${
								selectedTutorialId === tutorial.id
									? "ring-2 ring-[var(--color-accent-cosmic-purple)]"
									: ""
							}`}
							onClick={() => setSelectedTutorialId(tutorial.id)}
						>
							<div className="flex items-center gap-2 mb-2">
								<span className="text-xl sm:text-2xl">{tutorial.icon}</span>
								<h3 className="font-bold text-sm sm:text-base">
									{tutorial.title}
								</h3>
							</div>
							<p className="text-xs sm:text-sm text-[var(--color-text-starlight-white)]/70">
								{tutorial.description}
							</p>
						</button>
					))}
				</div>
				<button
					className="cosmic-button w-full mt-4 text-sm sm:text-base"
					onClick={() => setShowTutorial(false)}
				>
					Got it!
				</button>
			</div>
		</div>
	);

	// Update the Shortcuts Modal for better responsiveness at 320px
	const ShortcutsModal: React.FC = () => (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-2">
			<div
				className="absolute inset-0 bg-black/70 backdrop-blur-sm"
				onClick={() => setShowShortcuts(false)}
			/>
			<div className="cosmic-glass w-[calc(100%-1rem)] sm:w-auto sm:min-w-[320px] max-w-sm relative z-10 max-h-[90vh] overflow-y-auto rounded-lg">
				<div className="p-3 sm:p-4 border-b border-[var(--color-accent-cosmic-purple)]/30">
					<div className="flex items-center justify-between">
						<h2 className="text-base sm:text-lg font-bold">
							Keyboard Shortcuts
						</h2>
						<button
							onClick={() => setShowShortcuts(false)}
							className="w-8 h-8 flex items-center justify-center text-[var(--color-text-starlight-white)]/70 hover:text-[var(--color-text-starlight-white)] transition-colors"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>

				<div className="p-3 sm:p-4 space-y-2">
					{shortcuts.map((shortcut) => (
						<div
							key={shortcut.key}
							className="flex items-center gap-2 sm:gap-3 cosmic-glass p-2 rounded-lg"
						>
							<kbd className="min-w-[32px] sm:min-w-[40px] h-6 sm:h-7 flex items-center justify-center bg-[var(--color-bg-deep-space)] text-[var(--color-text-starlight-white)] text-[10px] sm:text-xs font-mono rounded border border-[var(--color-accent-cosmic-purple)]/30">
								{shortcut.key}
							</kbd>
							<span className="text-[11px] sm:text-sm text-[var(--color-text-starlight-white)]/90 flex-1">
								{shortcut.description}
							</span>
						</div>
					))}
				</div>

				<div className="p-3 sm:p-4 pt-0">
					<button
						className="cosmic-button w-full text-xs sm:text-sm h-8 sm:h-9"
						onClick={() => setShowShortcuts(false)}
					>
						Got it
					</button>
				</div>
			</div>
		</div>
	);

	// Add Tooltip Component
	const Tooltip: React.FC = () =>
		showTooltip && (
			<div
				className="fixed z-[100] px-2 py-1 text-xs sm:text-sm bg-black/80 text-white rounded pointer-events-none transform -translate-x-1/2 -translate-y-full"
				style={{
					left: tooltipPosition.x,
					top: tooltipPosition.y - 8,
				}}
			>
				{tooltipMessage}
				<div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
					<div className="border-4 border-transparent border-t-black/80" />
				</div>
			</div>
		);

	// Add Header component back with new features
	const Header: React.FC<{
		onOpenSideMenu: () => void;
		onOpenGallery: () => void;
	}> = ({ onOpenSideMenu, onOpenGallery }) => (
		<header className="fixed top-0 left-0 right-0 z-50 p-1 xs:p-2 sm:p-4">
			<nav className="cosmic-glass max-w-7xl mx-auto flex items-center justify-between px-1.5 xs:px-2 sm:px-4 py-1.5 xs:py-2 rounded-lg">
				<div className="flex items-center gap-1 xs:gap-2">
					<button
						onClick={onOpenSideMenu}
						className="cosmic-button p-2 xs:p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cosmic-purple)] focus:ring-opacity-50 hover:scale-105 transition-transform relative group"
						aria-label="Open menu"
					>
						<svg
							className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
						<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							Menu
						</span>
					</button>
					<div className="flex items-center">
						<div className="w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 rounded-full bg-yellow-400 glow-effect mr-1" />
						<h1 className="text-sm xs:text-base sm:text-xl font-bold whitespace-nowrap">
							COSMIC
							<span className="text-[var(--color-accent-cosmic-purple)]">
								ORBIT
							</span>
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-2 xs:gap-3">
					<button
						onClick={() => setShowTutorial(true)}
						className="cosmic-button p-2 xs:p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cosmic-purple)] focus:ring-opacity-50 hover:scale-105 transition-transform relative group"
						aria-label="Show tutorial"
					>
						<svg
							className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
						<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							Tutorial
						</span>
					</button>
					<button
						onClick={() => setShowShortcuts(true)}
						className="cosmic-button p-2 xs:p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cosmic-purple)] focus:ring-opacity-50 hover:scale-105 transition-transform relative group"
						aria-label="Show shortcuts"
					>
						<svg
							className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
							/>
						</svg>
						<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							Shortcuts
						</span>
					</button>
					<button
						onClick={onOpenGallery}
						className="cosmic-button p-2 xs:p-2.5 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-cosmic-purple)] focus:ring-opacity-50 hover:scale-105 transition-transform relative group"
						aria-label="Open gallery"
					>
						<svg
							className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
							Gallery
						</span>
					</button>
				</div>
			</nav>
		</header>
	);

	// Toggle visibility for all paths and orbits
	const toggleAllVisibility = useCallback(
		(show: boolean) => {
			setDrawnPaths((prevPaths) =>
				prevPaths.map((path) => ({
					...path,
					isVisible: show,
				}))
			);

			setPlanetOrbits((prevOrbits) =>
				prevOrbits.map((orbit) => ({
					...orbit,
					isVisible: show,
				}))
			);

			triggerCanvasUpdate();
		},
		[triggerCanvasUpdate]
	);

	// Update the gallery modal to handle path and orbit selection
	const handlePathSelect = useCallback(
		(selectedPath: DrawnPath) => {
			setDrawnPaths((prevPaths) =>
				prevPaths.map((path) => ({
					...path,
					isVisible: path.id === selectedPath.id,
				}))
			);

			// Hide all orbits when a path is selected
			setPlanetOrbits((prevOrbits) =>
				prevOrbits.map((orbit) => ({
					...orbit,
					isVisible: false,
				}))
			);

			setSelectedPath(selectedPath);
			setSelectedOrbit(null);

			// Force canvas update after selecting a path
			triggerCanvasUpdate();
		},
		[triggerCanvasUpdate]
	);

	// Handle orbit selection
	const handleOrbitSelect = useCallback(
		(selectedOrbit: PlanetOrbit) => {
			setPlanetOrbits((prevOrbits) =>
				prevOrbits.map((orbit) => ({
					...orbit,
					isVisible: orbit.id === selectedOrbit.id,
				}))
			);

			// Hide all paths when an orbit is selected
			setDrawnPaths((prevPaths) =>
				prevPaths.map((path) => ({
					...path,
					isVisible: false,
				}))
			);

			setSelectedOrbit(selectedOrbit);
			setSelectedPath(null);

			// Force canvas update after selecting an orbit
			triggerCanvasUpdate();
		},
		[triggerCanvasUpdate]
	);

	return (
		<>
			<GlobalStyles />
			{isClient && (
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{stars.map((star) => (
						<div
							key={`star-${star.id}`}
							className="absolute rounded-full animate-pulse"
							style={{
								width: `${star.width}px`,
								height: `${star.height}px`,
								backgroundColor: `rgba(241, 247, 255, ${star.opacity})`,
								top: `${star.top}%`,
								left: `${star.left}%`,
								animationDuration: `${star.duration}s`,
								animationDelay: `${star.delay}s`,
							}}
						/>
					))}
				</div>
			)}

			{showTitle && isClient && (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none z-10 opacity-0 animate-[fadeIn_2s_ease-in-out_forwards]">
					<div className="flex items-center justify-center gap-2 mb-2">
						<div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-yellow-400 glow-effect" />
						<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text-starlight-white)] tracking-wider">
							COSMIC
							<span className="text-[var(--color-accent-cosmic-purple)]">
								ORBIT
							</span>
						</h1>
					</div>
					<p className="text-xs sm:text-sm md:text-base text-[var(--color-text-starlight-white)]/70 mt-2">
						INTERACTIVE SOLAR SYSTEM SIMULATOR
					</p>
				</div>
			)}

			<div style={{ position: "relative", width: "100vw", height: "100vh" }}>
				<canvas
					ref={threeCanvasRef}
					style={{
						width: "100%",
						height: "100%",
						display: is3DView ? "block" : "none",
						pointerEvents: is3DView ? "auto" : "none",
					}}
				/>
				<canvas
					ref={overlayCanvasRef}
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						display: is3DView ? "none" : "block",
						pointerEvents: is3DView ? "none" : "auto",
					}}
				/>

				{(hoveredPlanet || selectedPlanet) && (
					<div className="cosmic-glass fixed top-12 xs:top-14 sm:top-20 right-2 xs:right-4 p-2 xs:p-3 sm:p-4 w-[calc(100%-1rem)] sm:w-80 max-h-[60vh] overflow-y-auto glow-effect">
						<div
							className="absolute top-0 left-0 w-full h-1"
							style={{
								background: `linear-gradient(90deg, transparent, ${
									(hoveredPlanet || selectedPlanet)!.color
								}, transparent)`,
							}}
						></div>

						<div className="flex items-center mb-2 xs:mb-3">
							<div
								className="w-6 h-6 xs:w-8 xs:h-8 rounded-full mr-2 xs:mr-3"
								style={{
									background: (hoveredPlanet || selectedPlanet)!.color,
									boxShadow: `0 0 10px ${
										(hoveredPlanet || selectedPlanet)!.color
									}, 0 0 20px rgba(93, 75, 238, 0.4)`,
								}}
							></div>
							<div>
								<h3 className="text-lg xs:text-xl font-bold text-[var(--color-text-starlight-white)]">
									{(hoveredPlanet || selectedPlanet)!.name}
								</h3>
							</div>
						</div>

						{(hoveredPlanet || selectedPlanet)!.description && (
							<div className="mb-3 text-sm italic text-[var(--color-text-starlight-white)]/80 border-l-2 pl-3 border-[var(--color-accent-cosmic-purple)]/30">
								{(hoveredPlanet || selectedPlanet)!.description}
							</div>
						)}

						<div className="grid grid-cols-2 gap-2">
							<div className="bg-[var(--color-bg-deep-space)]/50 rounded-lg p-2">
								<div className="text-xs text-[var(--color-text-starlight-white)]/60">
									Mass
								</div>
								<div className="font-medium">
									{(hoveredPlanet || selectedPlanet)!.mass.toExponential(2)}{" "}
									units
								</div>
							</div>

							<div className="bg-[var(--color-bg-deep-space)]/50 rounded-lg p-2">
								<div className="text-xs text-[var(--color-text-starlight-white)]/60">
									Radius
								</div>
								<div className="font-medium">
									{(hoveredPlanet || selectedPlanet)!.radius.toFixed(1)} units
								</div>
							</div>

							<div className="bg-[var(--color-bg-deep-space)]/50 rounded-lg p-2">
								<div className="text-xs text-[var(--color-text-starlight-white)]/60">
									Temperature
								</div>
								<div className="font-medium">
									{(hoveredPlanet || selectedPlanet)!.temperature}
								</div>
							</div>

							<div className="bg-[var(--color-bg-deep-space)]/50 rounded-lg p-2">
								<div className="text-xs text-[var(--color-text-starlight-white)]/60">
									Distance from Earth
								</div>
								<div className="font-medium">
									{(hoveredPlanet || selectedPlanet)!.distanceFromEarth}
								</div>
							</div>

							<div className="bg-[var(--color-bg-deep-space)]/50 rounded-lg p-2">
								<div className="text-xs text-[var(--color-text-starlight-white)]/60">
									Velocity
								</div>
								<div className="font-medium">
									{(hoveredPlanet || selectedPlanet)!.velocity
										.length()
										.toFixed(2)}{" "}
									units/sec
								</div>
							</div>

							<div className="bg-[var(--color-bg-deep-space)]/50 rounded-lg p-2">
								<div className="text-xs text-[var(--color-text-starlight-white)]/60">
									Position
								</div>
								<div className="font-medium text-xs">
									{(hoveredPlanet || selectedPlanet)!.position.x.toFixed(0)},{" "}
									{(hoveredPlanet || selectedPlanet)!.position.y.toFixed(0)},{" "}
									{(hoveredPlanet || selectedPlanet)!.position.z.toFixed(0)}
								</div>
							</div>
						</div>

						{selectedPlanet && (
							<div className="pt-4 mt-4 border-t border-[var(--color-accent-cosmic-purple)]/20">
								{!is3DView && (
									<button
										onClick={() => createOrbitForPlanet(selectedPlanet)}
										className="cosmic-button w-full py-2 mb-2"
									>
										Create Orbit Path
									</button>
								)}
								<button
									onClick={() => setSelectedPlanet(null)}
									className="cosmic-button w-full py-2"
								>
									Close
								</button>
							</div>
						)}
					</div>
				)}
			</div>

			<Header
				onOpenSideMenu={() => handleButtonClick(() => setShowSideMenu(true))}
				onOpenGallery={() => handleButtonClick(() => setShowGallery(true))}
			/>

			<div
				className={`fixed top-0 left-0 h-full w-64 sm:w-80 cosmic-glass z-50 side-menu ${
					showSideMenu ? "side-menu-open" : ""
				}`}
			>
				<div className="h-full flex flex-col">
					<div className="p-4 sm:p-6 border-b border-[var(--color-accent-cosmic-purple)]/20">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-bold text-[var(--color-text-starlight-white)]">
								CosmicOrbit
							</h2>
							<button
								onClick={() => setShowSideMenu(false)}
								className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--color-accent-cosmic-purple)]/20"
							>
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							</button>
						</div>
						<p className="text-sm text-[var(--color-text-starlight-white)]/70">
							Welcome to your cosmic journey through the solar system
						</p>
					</div>

					<div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
						<AboutSection title="Overview" icon="🌌" defaultOpen={true}>
							<p className="mb-3">
								CosmicOrbit is an interactive simulator that lets you explore
								our solar system in both 2D and 3D views. Experience realistic
								gravitational interactions and visualize planetary orbits in
								real-time.
							</p>
							<p>
								Built with advanced physics calculations and modern web
								technologies, CosmicOrbit provides an immersive educational
								experience for astronomy enthusiasts of all levels.
							</p>
						</AboutSection>

						<AboutSection title="Features" icon="⭐">
							<ul className="space-y-2">
								<li className="flex items-start gap-2">
									<span className="text-[var(--color-accent-cosmic-purple)]">
										•
									</span>
									<span>
										Switch between 2D and 3D views for different perspectives
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-[var(--color-accent-cosmic-purple)]">
										•
									</span>
									<span>Draw and attach orbital paths to planets</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-[var(--color-accent-cosmic-purple)]">
										•
									</span>
									<span>
										View detailed information about each celestial body
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-[var(--color-accent-cosmic-purple)]">
										•
									</span>
									<span>Control simulation speed and time flow</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="text-[var(--color-accent-cosmic-purple)]">
										•
									</span>
									<span>Interactive tutorials and keyboard shortcuts</span>
								</li>
							</ul>
						</AboutSection>

						<AboutSection title="Controls" icon="🎮">
							<div className="space-y-3">
								<div>
									<h4 className="font-medium mb-1">Mouse Controls</h4>
									<ul className="space-y-1 text-xs">
										<li>• Click and drag to rotate (3D) or pan (2D)</li>
										<li>• Scroll to zoom in/out</li>
										<li>• Click on planets for detailed information</li>
									</ul>
								</div>
								<div>
									<h4 className="font-medium mb-1">Touch Controls</h4>
									<ul className="space-y-1 text-xs">
										<li>• One finger drag to draw or pan</li>
										<li>• Pinch to zoom in/out</li>
										<li>• Tap on planets for information</li>
									</ul>
								</div>
								<div>
									<h4 className="font-medium mb-1">Keyboard</h4>
									<ul className="space-y-1 text-xs">
										<li>• Space - Pause/Resume simulation</li>
										<li>• R - Reset view</li>
										<li>• 1-9 - Focus on planets</li>
										<li>• ? - Show all shortcuts</li>
									</ul>
								</div>
							</div>
						</AboutSection>

						<AboutSection title="Settings" icon="⚙️">
							<div className="space-y-4">
								<div>
									<div className="flex justify-between items-center mb-2">
										<label
											htmlFor="settingsTimeSpeed"
											className="text-sm font-medium"
										>
											Simulation Speed
										</label>
										<span className="text-sm font-bold text-[var(--color-accent-cosmic-glow)]">
											{timeSpeed.toFixed(1)}x
										</span>
									</div>
									<input
										type="range"
										id="settingsTimeSpeed"
										min="0.1"
										max="10"
										step="0.1"
										value={timeSpeed}
										onChange={(e) => setTimeSpeed(parseFloat(e.target.value))}
										className="w-full rounded-lg appearance-none cursor-pointer"
									/>
								</div>

								<div className="flex items-center justify-between">
									<label className="text-sm font-medium">View Mode</label>
									<div className="flex p-1 bg-[var(--color-bg-deep-space)]/50 rounded-lg">
										<button
											onClick={() => setIs3DView(true)}
											className={`px-3 py-1 text-xs rounded-md transition ${
												is3DView
													? "bg-[var(--color-accent-cosmic-purple)] text-white"
													: "text-[var(--color-text-starlight-white)]/70"
											}`}
										>
											3D
										</button>
										<button
											onClick={() => setIs3DView(false)}
											className={`px-3 py-1 text-xs rounded-md transition ${
												!is3DView
													? "bg-[var(--color-accent-cosmic-purple)] text-white"
													: "text-[var(--color-text-starlight-white)]/70"
											}`}
										>
											2D
										</button>
									</div>
								</div>

								<div className="flex items-center justify-between">
									<label className="text-sm font-medium">Orbit Paths</label>
									<div className="flex p-1 bg-[var(--color-bg-deep-space)]/50 rounded-lg">
										<button
											onClick={() => setShowOrbitCircles(true)}
											className={`px-3 py-1 text-xs rounded-md transition ${
												showOrbitCircles
													? "bg-[var(--color-accent-cosmic-purple)] text-white"
													: "text-[var(--color-text-starlight-white)]/70"
											}`}
										>
											On
										</button>
										<button
											onClick={() => setShowOrbitCircles(false)}
											className={`px-3 py-1 text-xs rounded-md transition ${
												!showOrbitCircles
													? "bg-[var(--color-accent-cosmic-purple)] text-white"
													: "text-[var(--color-text-starlight-white)]/70"
											}`}
										>
											Off
										</button>
									</div>
								</div>
							</div>
						</AboutSection>

						<AboutSection title="Credits" icon="💫">
							<div className="space-y-2">
								<p>Created with passion by the CosmicOrbit team.</p>
								<p className="text-xs text-[var(--color-text-starlight-white)]/60">
									Planet data and images courtesy of NASA and ESA.
								</p>
								<div className="flex gap-2 mt-3">
									<a
										href="#"
										className="text-xs text-[var(--color-accent-cosmic-purple)] hover:text-[var(--color-accent-cosmic-glow)] transition-colors"
									>
										Terms
									</a>
									<span className="text-xs text-[var(--color-text-starlight-white)]/40">
										•
									</span>
									<a
										href="#"
										className="text-xs text-[var(--color-accent-cosmic-purple)] hover:text-[var(--color-accent-cosmic-glow)] transition-colors"
									>
										Privacy
									</a>
								</div>
							</div>
						</AboutSection>
					</div>
				</div>
			</div>

			<footer className="cosmic-glass fixed bottom-0 left-0 right-0 z-30 py-1.5 xs:py-2 px-2 xs:px-3 sm:px-4 rounded-lg text-center sm:text-left">
				<div className="flex flex-col xs:flex-row justify-between items-center gap-1 xs:gap-2 sm:gap-0">
					<div className="text-[8px] xs:text-[10px] sm:text-xs text-[var(--color-text-starlight-white)]/70">
						© 2025 CosmicOrbit • Interactive Solar System Simulator
					</div>
					<div className="flex items-center gap-3 sm:gap-4">
						<span className="text-[10px] sm:text-xs text-[var(--color-accent-cosmic-glow)]">
							Universe
						</span>
						<button
							onClick={() => setShowSideMenu(true)}
							className="text-[10px] sm:text-xs text-[var(--color-text-starlight-white)]/70 hover:text-[var(--color-accent-cosmic-glow)] transition-colors"
						>
							Terms
						</button>
						<button
							onClick={() => setShowSideMenu(true)}
							className="text-[10px] sm:text-xs text-[var(--color-text-starlight-white)]/70 hover:text-[var(--color-accent-cosmic-glow)] transition-colors"
						>
							Privacy
						</button>
					</div>
				</div>
			</footer>

			{showSideMenu && (
				<div
					className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
					onClick={() => setShowSideMenu(false)}
				></div>
			)}

			<GalleryModal
				isOpen={showGallery}
				onClose={() => setShowGallery(false)}
				planets={planetsRef.current}
				drawnPaths={drawnPaths}
				planetOrbits={planetOrbits}
				onSelectPlanet={(planet) => {
					setSelectedPlanet(planet);
					// Clear all path visibility when selecting a planet
					toggleAllVisibility(false);
					setShowGallery(false);
				}}
				onSelectPath={handlePathSelect}
				onSelectOrbit={handleOrbitSelect}
			/>

			{!is3DView && <FloatingActionButton />}

			{!is3DView && showDrawingControls && <DrawingControls />}

			{showTutorial && <TutorialModal />}
			{showShortcuts && <ShortcutsModal />}
			<Tooltip />

			{(selectedPath || selectedOrbit) && !is3DView && (
				<button
					onClick={() => {
						setSelectedPath(null);
						setSelectedOrbit(null);
						// Hide all paths when clearing selection
						toggleAllVisibility(false);
					}}
					className="cosmic-button fixed bottom-16 left-2 sm:left-4 p-2 rounded-full z-40 hover:scale-110 transition-transform"
					title="Clear Selection"
				>
					<svg
						className="w-5 h-5 sm:w-6 sm:h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			)}
		</>
	);
};

export default SolarSystemSimulator;