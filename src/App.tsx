import { GrainGradient } from "@paper-design/shaders-react";
import { Instagram } from "lucide-react";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* SVG filter for grain/noise effect */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              type="saturate"
              values="0"
              in="noise"
              result="monoNoise"
            />
            <feBlend
              in="SourceGraphic"
              in2="monoNoise"
              mode="multiply"
              result="blended"
            />
            {/* Clip the result to only the visible parts of the original image */}
            <feComposite in="blended" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      <GrainGradient
        colors={["#fbff00", "#b42e08", "#f29e5a", "#af3704"]}
        colorBack="#3e413e"
        softness={0.43}
        intensity={0.67}
        noise={0.25}
        shape="blob"
        speed={0.62}
        scale={2.32}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <div className="logo-container">
        <img src="/logo.svg" alt="Ywalé" className="logo" />
        <p className="tagline">Handmade natural wine</p>
      </div>
      <a
        href="https://www.instagram.com/ywale.wine"
        target="_blank"
        rel="noopener noreferrer"
        className="instagram-link"
      >
        <Instagram size={32} />
      </a>
    </div>
  );
}

export default App;
