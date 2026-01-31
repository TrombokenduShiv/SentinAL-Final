import { useEffect, useRef, memo } from "react";
import { useThree } from "@react-three/fiber";
import ThreeGlobe from "three-globe";
import { MeshPhongMaterial } from "three";
import worldData from "../../assets/globe.json"; 

export const Globe = memo(({ data, globeConfig }) => {
  const globeRef = useRef();
  const { scene } = useThree();

  useEffect(() => {
    if (!globeRef.current) {
      const globe = new ThreeGlobe()
        .globeImageUrl(null)
        .globeMaterial(new MeshPhongMaterial({
          color: globeConfig?.globeColor || "#000000",
          emissive: globeConfig?.emissive || "#000000",
          emissiveIntensity: globeConfig?.emissiveIntensity || 0.1,
          shininess: globeConfig?.shininess || 0.9,
        }))
        .hexPolygonsData(worldData.features)
        .hexPolygonResolution(3)
        .hexPolygonMargin(0.5) 
        // Keep continents White so they contrast with the Red lines
        .hexPolygonColor(() => globeConfig?.polygonColor || "rgba(255, 255, 255, 1.0)")
        .showAtmosphere(true)
        .atmosphereColor(globeConfig?.atmosphereColor || "#FFFFFF") 
        .atmosphereAltitude(globeConfig?.atmosphereAltitude || 0.1);

      // Rotate to center on India/Asia
      globe.rotation.y = Math.PI / 1.8;

      globeRef.current = globe;
      scene.add(globe);
    }
  }, [scene, globeConfig]);

  useEffect(() => {
    if (globeRef.current && data) {
      // 1. The Neon Red Laser Beam (Threat Detected)
      globeRef.current
        .arcsData(data)
        // ✅ CHANGED: Bright Neon Red
        .arcColor(() => "#ff2a2a") 
        .arcAltitude((d) => d.arcAlt)
        .arcDashLength(0.9)  
        .arcDashGap(0.05)     
        .arcDashAnimateTime(1500); // Faster speed for urgency
      
      // 2. The Crimson Ripples (Impact)
      globeRef.current
        .ringsData(data)
        // ✅ CHANGED: Deep Red Ripple
        .ringColor(() => "#ff0000") 
        .ringMaxRadius(8) // Bigger impact
        .ringPropagationSpeed(4) // Faster expansion
        .ringRepeatPeriod(600); // Frequent pulses

      // 3. The Hot Core Dot
      globeRef.current
        .pointsData(data)
        // ✅ CHANGED: Bright White/Red hot core
        .pointColor(() => "#ffffff") 
        .pointAltitude(0)
        .pointRadius(0.8);
    }
  }, [data]);

  return null;
});