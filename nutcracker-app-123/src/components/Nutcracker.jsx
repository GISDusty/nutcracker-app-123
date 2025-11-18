// Nutcracker character component with CSS-based pixel art
// States: idle, cracking (correct), broken (incorrect)

function Nutcracker({ state = 'idle' }) {
  return (
    <div className={`nutcracker nutcracker-${state}`} aria-label={`Nutcracker ${state}`}>
      {/* Head */}
      <div className="nutcracker-head">
        <div className="nutcracker-hat"></div>
        <div className="nutcracker-face">
          <div className="nutcracker-eyes">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
          <div className={`nutcracker-jaw ${state === 'broken' ? 'broken' : ''}`}>
            <div className="teeth"></div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="nutcracker-body">
        <div className="nutcracker-coat"></div>
        <div className="nutcracker-buttons">
          <div className="button-decoration"></div>
          <div className="button-decoration"></div>
          <div className="button-decoration"></div>
        </div>
      </div>

      {/* Arms */}
      <div className="nutcracker-arms">
        <div className="arm left"></div>
        <div className="arm right"></div>
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
