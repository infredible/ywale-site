import { GrainGradient } from "@paper-design/shaders-react";
import { useState } from "react";
import "./App.css";
import { StoryModal } from "./components/StoryModal";

const bottles = [
  { src: "/images/malvasia-25-cutout.png", alt: "Malvasia '25" },
  { src: "/images/carignan-25-cutout.png", alt: "Carignan '25" },
];

function getBottleClass(i: number, activeIndex: number): string {
  if (i < activeIndex - 1) return "bottle bottle--left";
  if (i === activeIndex - 1) return "bottle bottle--left-peek";
  if (i === activeIndex) return "bottle bottle--center";
  if (i === activeIndex + 1) return "bottle bottle--peek";
  return "bottle bottle--right";
}

function App() {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [storyOpen, setStoryOpen] = useState(false);
  const isBottleActive = activeIndex >= 0;

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

      {/* Layer 2: GrainGradient grain overlay */}
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
        <img
          src="/logo.svg"
          alt="Ywalé"
          className="logo"
          onClick={() => setActiveIndex(-1)}
        />
      </div>

      <div className={`bottom-fade${isBottleActive ? " bottom-fade--active" : ""}`} />
      <div className={`vignette${isBottleActive ? " vignette--active" : ""}`} />

      {/* Bottle carousel */}
      <div className="carousel">
        {bottles.map((bottle, i) => {
          const isCenter = i === activeIndex;
          const isPeek = i === activeIndex + 1;
          const isLeftPeek = i === activeIndex - 1;
          const onClick = isCenter || isLeftPeek
            ? () => setActiveIndex((i) => i - 1)
            : isPeek
            ? () => setActiveIndex((i) => i + 1)
            : undefined;
          return (
            <div
              key={bottle.src}
              className={getBottleClass(i, activeIndex)}
              onClick={onClick}
            >
              <img src={bottle.src} alt={bottle.alt} />
            </div>
          );
        })}
      </div>

      <p className={`tagline${isBottleActive ? " tagline--hidden" : ""}`}>
        (Ywa-lay) means little village in Burmese. We make wine in the spirit of that: simple, honest, and made for sharing with the people around you.
      </p>

      <div className="side-nav">
        <button className="nav-icon-item" onClick={() => setStoryOpen(true)}>
          <img src="/icons/flower.svg" alt="Our story" className="nav-icon-img" />
          <span className="nav-icon-label">Our story</span>
        </button>
        <a
          href="https://www.instagram.com/ywale.wine"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-icon-item"
        >
          <img src="/icons/spiral.svg" alt="Instagram" className="nav-icon-img" />
          <span className="nav-icon-label">Instagram</span>
        </a>
        <a href="mailto:yo@ywale.wine" className="nav-icon-item">
          <img src="/icons/chat.svg" alt="Contact" className="nav-icon-img" />
          <span className="nav-icon-label">Contact</span>
        </a>
      </div>
      <StoryModal open={storyOpen} onClose={() => setStoryOpen(false)} />
    </div>
  );
}

export default App;
