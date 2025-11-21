import { useDroppable } from '@dnd-kit/core';


function Nutcracker({ state = 'idle' }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'nutcracker',
  });

  const droppableClass = isOver ? 'droppable-active' : '';

  return (
    <div
      ref={setNodeRef}
      className={`nutcracker nutcracker-${state} ${droppableClass}`}
      aria-label={`Nutcracker ${state}`}
    >
      <div className="nutcracker-figure stardew-style">
        <div className="hat-layer">
          <div className="hat-top">
            <div className="hat-shading"></div>
            <div className="hat-badge"></div>
          </div>
          <div className="hat-brim">
            <div className="hat-brim-shading"></div>
          </div>
        </div>

        <div className="head-layer">
          <div className="hair-back"></div>
          <div className="face-base">
            <div className="face-shading"></div>
            <div className="hair-side left"></div>
            <div className="hair-side right"></div>
            <div className="eyes-row">
              <div className="eye left"></div>
              <div className="eye right"></div>
            </div>
            <div className="cheeks-row">
              <div className="cheek left"></div>
              <div className="cheek right"></div>
            </div>
            <div className="nose"></div>
            <div className="mustache-container">
              <div className="mustache left"></div>
              <div className="mustache right"></div>
            </div>
            <div className="beard-container">
              <div className="beard"></div>
            </div>
            <div className="mouth-container">
              <div className="jaw">
                <div className="jaw-shading"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="body-layer">
          <div className="collar"></div>
          <div className="torso-base">
            <div className="torso-shading"></div>
            <div className="buttons-column">
              <div className="button"></div>
              <div className="button"></div>
              <div className="button"></div>
            </div>
            <div className="belt-container">
              <div className="belt-buckle"></div>
            </div>
          </div>
          <div className="shoulders-row">
            <div className="epaulette left"></div>
            <div className="epaulette right"></div>
          </div>
          <div className="arms-layer">
            <div className="arm left"><div className="cuff"></div></div>
            <div className="arm right"><div className="cuff"></div></div>
          </div>
        </div>

        <div className="legs-layer">
          <div className="pants">
            <div className="pants-shading"></div>
          </div>
          <div className="boots-row">
            <div className="boot left"><div className="boot-highlight"></div></div>
            <div className="boot right"><div className="boot-highlight"></div></div>
          </div>
        </div>
      </div>

      {/* Nut (shown during cracking animation) */}
      {state === 'cracking' && (
        <div className="nut cracking">
          <div className="nut-half left"></div>
          <div className="nut-half right"></div>
        </div>
      )}

      {/* Broken pieces (shown during broken animation) */}
      {state === 'broken' && (
        <div className="broken-pieces">
          <div className="piece piece1">×</div>
          <div className="piece piece2">×</div>
          <div className="piece piece3">×</div>
        </div>
      )}
    </div>
  );
}

export default Nutcracker;
