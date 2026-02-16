import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface LogoOrbitProps {
  orbitSpeed: number;
  directionChangeSpeed: number;
  tiltAngle: number;
  logoScale: number;
  sphereRadius: number;
  sphereColor: string;
  sphereOpacity: number;
  showWireframe: boolean;
}

export function LogoOrbit({
  orbitSpeed,
  directionChangeSpeed,
  tiltAngle,
  logoScale,
  sphereRadius,
  sphereColor,
  sphereOpacity,
  showWireframe,
}: LogoOrbitProps) {
  const tiltRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const logoMeshRef = useRef<THREE.Mesh>(null);
  const precessionAngle = useRef(0);
  const [logoTexture, setLogoTexture] = useState<THREE.CanvasTexture | null>(
    null
  );

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 4096;
      canvas.height = 2048;
      const ctx = canvas.getContext("2d")!;

      // Draw logo white on transparent, centered on equirectangular canvas
      // Logo aspect ratio: 1219:310
      const logoW = canvas.width * logoScale * 0.1;
      const logoH = logoW * (310 / 1219);
      const x = (canvas.width - logoW) / 2;
      const y = (canvas.height - logoH) / 2;

      // Draw original SVG then composite to white
      ctx.drawImage(img, x, y, logoW, logoH);
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "source-over";

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
      setLogoTexture(texture);
    };
    img.src = "/logo.svg";
  }, [logoScale]);

  useFrame((_state, delta) => {
    // Scroll both meshes along the tilted axis via local Y rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += orbitSpeed * delta;
    }
    if (logoMeshRef.current) {
      logoMeshRef.current.rotation.y += orbitSpeed * delta;
    }

    // Precession tilt
    precessionAngle.current += directionChangeSpeed * delta;
    if (tiltRef.current) {
      tiltRef.current.rotation.x =
        tiltAngle * Math.sin(precessionAngle.current);
      tiltRef.current.rotation.z =
        tiltAngle * Math.cos(precessionAngle.current);
    }
  });

  return (
    <group ref={tiltRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[sphereRadius, 64, 64]} />
        <meshStandardMaterial
          color={sphereColor}
          transparent
          opacity={sphereOpacity}
          wireframe={showWireframe}
        />
      </mesh>
      {logoTexture && (
        <mesh ref={logoMeshRef}>
          <sphereGeometry args={[sphereRadius * 1.001, 64, 64]} />
          <meshStandardMaterial
            map={logoTexture}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
