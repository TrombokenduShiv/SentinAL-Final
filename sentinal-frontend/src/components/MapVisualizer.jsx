import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Globe } from "./ui/Globe";

// Demo coordinates
const COUNTRY_COORDS = {
  RU: { lat: 61.524, lng: 105.3188 },
  CN: { lat: 35.8617, lng: 104.1954 },
  US: { lat: 37.0902, lng: -95.7129 },   // USA
  BR: { lat: -14.2350, lng: -51.9253 },  // Brazil
  AU: { lat: -25.2744, lng: 133.7751 },  // Australia
  DE: { lat: 51.1657, lng: 10.4515 },
};

const INDIA = { lat: 20.5937, lng: 78.9629 };

const MapVisualizer = ({ violations, loading }) => {
  
  const globeConfig = {
    pointSize: 4,
    globeColor: "#062056",            // 🔵 Deep Navy Blue Ocean
    showAtmosphere: true,
    atmosphereColor: "#3b82f6",       // 🔵 Blue Atmosphere
    atmosphereAltitude: 0.1,
    emissive: "#062056",              // 🔵 Deep Blue Night Glow
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(255, 255, 255, 1.0)", // ⚪ Solid Bright White Countries
    ambientLight: "#38bdf8",          // 💡 Bright Blue/White Ambient
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const arcs = useMemo(() => {
    if (!violations) return [];
    
    return violations
      .map((v) => {
        const code = v.location_code || (v.location === "RU" ? "RU" : "CN");
        const coords = COUNTRY_COORDS[code] || COUNTRY_COORDS["CN"]; 

        return {
          order: 1,
          startLat: INDIA.lat,
          startLng: INDIA.lng,
          endLat: coords.lat,
          endLng: coords.lng,
          lat: coords.lat,
          lng: coords.lng,
          arcAlt: 0.4,
          color: "#ffffff", // White lines
        };
      })
      .filter(Boolean);
  }, [violations]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="px-4 py-2 bg-black/70 text-sm text-zinc-300 rounded border border-zinc-700 animate-pulse">
            Scanning global web...
          </div>
        </div>
      )}

      <div className="w-full h-full relative">
        <Canvas
          camera={{ position: [0, 0, 600], fov: 45 }}
        >
          {/* Lighting: High Intensity to make White Dots Pop */}
          <ambientLight intensity={3.0} color="#38bdf8" />
          <pointLight position={[100, 100, 100]} intensity={4.0} color="#ffffff" />
          <pointLight position={[-100, -100, -100]} intensity={2.0} color="#1d4ed8" />

          <Globe data={arcs} globeConfig={globeConfig} />
          
          <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
    </div>
  );
};

export default MapVisualizer;