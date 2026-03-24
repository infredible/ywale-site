import { GrainGradient } from "@paper-design/shaders-react";
import { Instagram } from "lucide-react";
import "./App.css";

function App() {
  return (
    <div className="app">
      {/* Layer 1: blurred video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          filter: "blur(8px)",
          transform: "scale(1.05)",
          zIndex: 0,
        }}
      >
        <source src="/videos/white-flower.mp4" type="video/mp4" />
      </video>

      {/* Layer 2: GrainGradient grain overlay.
          White base + multiply blend: white is neutral in multiply so only
          the dark noise patches show through as visible grain on the video. */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
          mixBlendMode: "multiply",
        }}
      >
        <GrainGradient
          colorBack="#ffffff"
          colors={["#ffffff"]}
          noise={0.6}
          softness={1}
          speed={0}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div className="logo-container">
        <img src="/logo.svg" alt="Ywalé" className="logo" />
      </div>

      <div className="bottom-fade" />

      <p className="tagline">(Ywa-lay) means little village in Burmese. We make wine in the spirit of that: simple, honest, and made for sharing with the people around you.</p>

      <div className="bottom-right">
        <div className="bottom-links">
          <a href="mailto:yo@ywale.wine" className="contact-link">
            Contact
          </a>
          <a
            href="https://www.instagram.com/ywale.wine"
            target="_blank"
            rel="noopener noreferrer"
            className="instagram-link"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
