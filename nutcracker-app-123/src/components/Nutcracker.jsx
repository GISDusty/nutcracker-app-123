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
      <div className="nutcracker-figure">
        <div className="hat">
          <div className="hat-top"></div>
          <div className="hat-brim"></div>
        </div>
        <div className="face">
          <div className="eyes">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
          <div className="cheeks">
            <div className="cheek left"></div>
            <div className="cheek right"></div>
          </div>
          <div className="nose"></div>
          <div className="mustache">
            <div className="mustache-part left"></div>
            <div className="mustache-part right"></div>
          </div>
          <div className="beard"></div>
          <div className="mouth-area">
            <div className="jaw"></div>
          </div>
        </div>
        <div className="body">
          <div className="shoulders"></div>
          <div className="torso">
            <div className="buttons"></div>
            <div className="belt"></div>
          </div>
          <div className="arms">
            <div className="arm left"></div>
            <div className="arm right"></div>
          </div>
        </div>
        <div className="legs">
          <div className="leg left"></div>
          <div className="leg right"></div>
        </div>
        <div className="boots">
          <div className="boot left"></div>
          <div className="boot right"></div>
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
