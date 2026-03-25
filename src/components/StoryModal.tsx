import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function StoryModal({ open, onClose }: Props) {
  const [closing, setClosing] = useState(false);

  if (!open && !closing) return null;

  function handleClose() {
    setClosing(true);
  }

  function handleAnimationEnd() {
    if (closing) {
      setClosing(false);
      onClose();
    }
  }

  return (
    <div
      className={`story-backdrop${closing ? " story-backdrop--closing" : ""}`}
      onClick={handleClose}
    >
      <div
        className={`story-modal${closing ? " story-modal--closing" : ""}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        <button className="story-close" onClick={handleClose} aria-label="Close">
          ✕
        </button>
        <div className="story-content">
          <h2 className="story-title">Our Story</h2>
          <p>
            The village of Thayagon — "peaceful hill" — sits just outside Yangon, Myanmar. It's where my family is from. Dirt roads, thatched roofs, mostly rice farmers. Life moves slowly there. Few people leave Myanmar. Fewer leave Thayagon.
          </p>
          <p>
            Over the years, my family has helped fund a water filtration system, and supported the local school and Buddhist monastery — the quiet centers of community life. You show up for your village. That's just what you do.
          </p>
          <p>
            Ywalé means "little village" in Burmese. We chose the name because we believe good things come from small places. From people who know each other. From communities that show up for one another.
          </p>
          <p>
            Winemaking has always been communal — farming, harvesting, fermenting, bottling, sharing. We work out of the Richmond Wine Collective in the Bay Area, surrounded by makers who share that same spirit. The wines we want to make are rooted in it too. Grown by small farming communities. Made with care and minimal intervention. Shared to foster more of the same.
          </p>
          <p>
            Our approach is simple: native fermentations, nothing taken, nothing added. Each release is intentionally small — expressive, food-friendly, and alive. Not about polish or perfection. About character.
          </p>
          <p>
            Poured generously. Without ceremony. For crowded tables.
          </p>
          <p className="story-signoff">— Fred</p>
        </div>
      </div>
    </div>
  );
}
