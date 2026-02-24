import { useRef, useState, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Decal } from "@react-three/drei";
import * as THREE from "three";

function createBottleProfile(radius: number): THREE.Vector2[] {
  const r = radius;
  const h = radius * 3.5;
  const pts: THREE.Vector2[] = [];

  // Bottom cap center
  pts.push(new THREE.Vector2(0, 0));
  // Base edge
  pts.push(new THREE.Vector2(r, 0));
  // Body cylinder
  pts.push(new THREE.Vector2(r, h * 0.1));
  pts.push(new THREE.Vector2(r, h * 0.2));
  pts.push(new THREE.Vector2(r, h * 0.35));
  pts.push(new THREE.Vector2(r, h * 0.45));
  pts.push(new THREE.Vector2(r, h * 0.55));
  // Shoulder curve (smooth transition inward)
  pts.push(new THREE.Vector2(r * 0.92, h * 0.58));
  pts.push(new THREE.Vector2(r * 0.8, h * 0.61));
  pts.push(new THREE.Vector2(r * 0.65, h * 0.64));
  pts.push(new THREE.Vector2(r * 0.5, h * 0.67));
  pts.push(new THREE.Vector2(r * 0.38, h * 0.69));
  pts.push(new THREE.Vector2(r * 0.3, h * 0.71));
  // Neck
  pts.push(new THREE.Vector2(r * 0.28, h * 0.75));
  pts.push(new THREE.Vector2(r * 0.26, h * 0.8));
  pts.push(new THREE.Vector2(r * 0.25, h * 0.85));
  pts.push(new THREE.Vector2(r * 0.25, h * 0.9));
  // Lip
  pts.push(new THREE.Vector2(r * 0.28, h * 0.92));
  pts.push(new THREE.Vector2(r * 0.3, h * 0.94));
  pts.push(new THREE.Vector2(r * 0.3, h * 0.97));
  pts.push(new THREE.Vector2(r * 0.28, h * 0.99));
  // Top cap center
  pts.push(new THREE.Vector2(0, h));

  return pts;
}

interface LogoOrbitProps {
  orbitSpeed: number;
  directionChangeSpeed: number;
  tiltAngle: number;
  logoScale: number;
  logoCount: number;
  sphereRadius: number;
  sphereColor: string;
  sphereOpacity: number;
  showWireframe: boolean;
  meshShape: "sphere" | "bottle";
}

export function LogoOrbit({
  orbitSpeed,
  directionChangeSpeed,
  tiltAngle,
  logoScale,
  logoCount,
  sphereRadius,
  sphereColor,
  sphereOpacity,
  showWireframe,
  meshShape,
}: LogoOrbitProps) {
  const tiltRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const precessionAngle = useRef(0);
  const angleRef = useRef(0);
  const [angle, setAngle] = useState(0);
  const [logoTexture, setLogoTexture] = useState<THREE.CanvasTexture | null>(
    null
  );

  const bottlePoints = useMemo(
    () => createBottleProfile(sphereRadius),
    [sphereRadius]
  );

  // Single-logo texture (white on transparent, matching logo aspect ratio)
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const w = 1024;
      const h = Math.round(w * (310 / 1219));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      ctx.drawImage(img, 0, 0, w, h);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, w, h);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      setLogoTexture(texture);
    };
    img.src = "/logo.svg";
  }, []);

  useFrame((_state, delta) => {
    // Animate orbital angle — mesh stays static, only decal positions change
    angleRef.current += orbitSpeed * delta;
    setAngle(angleRef.current);

    // Precession tilt on outer group
    precessionAngle.current += directionChangeSpeed * delta;
    if (tiltRef.current) {
      tiltRef.current.rotation.x =
        tiltAngle * Math.sin(precessionAngle.current);
      tiltRef.current.rotation.z =
        tiltAngle * Math.cos(precessionAngle.current);
    }
  });

  const r = sphereRadius;
  // Bottle body extends from y=0 to y=h*0.55; midpoint at h*0.275
  const bodyMidY = sphereRadius * 3.5 * 0.275;
  const decalW = logoScale * 0.3;
  const decalH = decalW * (310 / 1219);

  return (
    <group ref={tiltRef}>
      <mesh ref={meshRef}>
        {meshShape === "sphere" ? (
          <sphereGeometry args={[sphereRadius, 64, 64]} />
        ) : (
          <latheGeometry args={[bottlePoints, 64]} />
        )}
        <meshStandardMaterial
          color={sphereColor}
          transparent
          opacity={sphereOpacity}
          wireframe={showWireframe}
        />
        {logoTexture &&
          Array.from({ length: logoCount }, (_, i) => {
            const theta = angle + (i * Math.PI * 2) / logoCount;
            const pos: [number, number, number] =
              meshShape === "sphere"
                ? [r * Math.sin(theta), 0, r * Math.cos(theta)]
                : [r * Math.sin(theta), bodyMidY, r * Math.cos(theta)];
            return (
              <Decal
                key={i}
                position={pos}
                rotation={[0, theta, 0]}
                scale={[decalW, decalH, 1]}
              >
                <meshBasicMaterial
                  map={logoTexture}
                  transparent
                  polygonOffset
                  polygonOffsetFactor={-1}
                />
              </Decal>
            );
          })}
      </mesh>
    </group>
  );
}
