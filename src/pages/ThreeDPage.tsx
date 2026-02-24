import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls } from "leva";
import { LogoOrbit } from "../components/LogoOrbit";

export default function ThreeDPage() {
  const {
    meshShape,
    orbitSpeed,
    directionChangeSpeed,
    tiltAngle,
    logoScale,
    logoCount,
    sphereRadius,
    sphereColor,
    sphereOpacity,
    showWireframe,
  } = useControls({
    meshShape: { options: ["sphere", "bottle"] as const, value: "sphere" as const, label: "Mesh Shape" },
    orbitSpeed: { value: 0.6, min: 0, max: 5, step: 0.05, label: "Orbit Speed" },
    directionChangeSpeed: {
      value: 0.15,
      min: 0,
      max: 2,
      step: 0.01,
      label: "Direction Change Speed",
    },
    tiltAngle: { value: 0.8, min: 0, max: Math.PI / 2, step: 0.05, label: "Tilt Angle" },
    logoScale: { value: 3, min: 0.5, max: 10, step: 0.1, label: "Logo Scale" },
    logoCount: { value: 3, min: 1, max: 8, step: 1, label: "Logo Count" },
    sphereRadius: { value: 1.5, min: 0.5, max: 5, step: 0.1, label: "Sphere Radius" },
    sphereColor: { value: "#333333", label: "Sphere Color" },
    sphereOpacity: { value: 0.3, min: 0, max: 1, step: 0.05, label: "Sphere Opacity" },
    showWireframe: { value: false, label: "Show Wireframe" },
  });

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#111" }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <LogoOrbit
          meshShape={meshShape}
          orbitSpeed={orbitSpeed}
          directionChangeSpeed={directionChangeSpeed}
          tiltAngle={tiltAngle}
          logoScale={logoScale}
          logoCount={logoCount}
          sphereRadius={sphereRadius}
          sphereColor={sphereColor}
          sphereOpacity={sphereOpacity}
          showWireframe={showWireframe}
        />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
