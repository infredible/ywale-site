import { useEffect, useRef, useState } from "react";
import "./App.css";
import { StoryModal } from "./components/StoryModal";

const bottles = [
  {
    src: "/images/carignan-25-cutout.png",
    alt: "Carignan '25",
    name: "Carignan '25",
    details: "Santa Clara County, California",
    type: "Red wine",
    description: "Nice out of the fridge. Light-bodied old vine Carignan with some grip and brambly fruit. Blackberry, cracked pepper, a wisp of smoke.",
  },
  {
    src: "/images/malvasia-25-cutout.png",
    alt: "Malvasia '25",
    name: "Malvasia '25",
    details: "Suisun Valley, California",
    type: "Orange wine",
    description: "Two days on skins. Dried apricot, lemon peel, ripe pineapple, and hints of white flower. Unfiltered.",
  },
  {
    src: "/images/malvasia-petnat-25-cutout.png",
    alt: "Malvasia Pét-nat '25",
    name: "Malvasia Pét-nat '25",
    details: "Anderson Valley, California",
    type: "Pétillant naturel · Special edition",
    description: "A week on skins — this one has a little color, a little texture, and a lot of summer. Watermelon, cantaloupe, fine bubbles.",
    badge: true,
  },
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
  const [isMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const grainRef = useRef<SVGFETurbulenceElement>(null);

  useEffect(() => {
    let frame: number;
    let seed = 0;
    const tick = () => {
      seed = (seed + 1) % 1000;
      grainRef.current?.setAttribute("seed", String(seed));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.play().catch(() => {
      const startOnInteraction = () => {
        audio.play();
        window.removeEventListener("click", startOnInteraction);
        window.removeEventListener("touchstart", startOnInteraction);
      };
      window.addEventListener("click", startOnInteraction);
      window.addEventListener("touchstart", startOnInteraction);
    });
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  }
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

      {/* SVG filter definition */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="grain-filter" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={grainRef} type="fractalNoise" baseFrequency="0.2" numOctaves="3" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="overlay" />
          </filter>
        </defs>
      </svg>

      {/* Grain overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,
          pointerEvents: "none",
          opacity: 0.12,
          filter: "url(#grain-filter)",
          background: "white",
        }}
      />

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
      <div className={`carousel${isBottleActive ? " carousel--active" : ""}`}>
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
              {bottle.badge && (
                <svg className="bottle-badge" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon
                    points="50,0 59.1,16.2 75,6.7 74.7,25.3 93.3,25 83.8,40.9 100,50 83.8,59.1 93.3,75 74.7,74.7 75,93.3 59.1,83.8 50,100 40.9,83.8 25,93.3 25.3,74.7 6.7,75 16.2,59.1 0,50 16.2,40.9 6.7,25 25.3,25.3 25,6.7 40.9,16.2"
                    fill="#ff4d8e"
                  />
                  <text x="50" y="48" textAnchor="middle" fontFamily="Gaya, serif" fontStyle="italic" fontSize="14" fill="white">Special</text>
                  <text x="50" y="64" textAnchor="middle" fontFamily="Gaya, serif" fontStyle="italic" fontSize="14" fill="white">edition</text>
                </svg>
              )}
            </div>
          );
        })}
      </div>

      <p className={`tagline${isBottleActive ? " tagline--hidden" : ""}`}>
        Ywalé (ywa-lay) means "little village" in Burmese. We make natural wine in the spirit of that: simple, honest, and made for sharing with the people around you.
      </p>

      <div className={`side-nav${isBottleActive ? " side-nav--hidden" : ""}`}>
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
      {isBottleActive && (
        <div className="wine-info" key={activeIndex}>
          <p className="wine-info__name">{bottles[activeIndex].name}</p>
          <p className="wine-info__details">{bottles[activeIndex].details}</p>
          <p className="wine-info__details">{bottles[activeIndex].type}</p>
          <p className="wine-info__description">{bottles[activeIndex].description}</p>
        </div>
      )}
      {!isMobile && <audio ref={audioRef} src="/sounds/Domenique Dumont - La Bataille de Neige.mp3" loop autoPlay />}
      {!isMobile && <div className="player-wrap">
        <div className="player__label">
          <span className="player__track">La Bataille de Neige</span>
          <span className="player__artist">Domenique Dumont</span>
        </div>
        <button className={`player${playing ? " player--playing" : ""}`} onClick={togglePlay} aria-label={playing ? "Pause" : "Play"}>
          <img src="/images/comme-ca.jpg" alt="" className="player__art" />
          <div className="player__overlay">
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="4" width="4" height="16" rx="1" />
                <rect x="15" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6,3 20,12 6,21" />
              </svg>
            )}
          </div>
        </button>
      </div>}
      <StoryModal open={storyOpen} onClose={() => setStoryOpen(false)} />
    </div>
  );
}

export default App;
