import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { GemSmoke } from '@paper-design/shaders-react';
import flowxShaderLogo from '../../assets/flowx-shader-logo.png';

const SHADER_HIDDEN_MS = 500;
const SHADER_FADE_IN_MS = 800;
const SHADER_HOLD_MS = 1000;
const FADE_OUT_MS = 500;
const SHADER_ANIMATION_SPEED = 2;

const STARTUP_OVERLAY_DURATION_MS =
  SHADER_HIDDEN_MS + SHADER_FADE_IN_MS + SHADER_HOLD_MS + FADE_OUT_MS;

const startupOverlayStyle = {
  '--startup-shader-hidden': `${SHADER_HIDDEN_MS}ms`,
  '--startup-fade-in': `${SHADER_FADE_IN_MS}ms`,
  '--startup-fade-out': `${FADE_OUT_MS}ms`,
  '--startup-fade-out-delay': `${SHADER_HIDDEN_MS + SHADER_FADE_IN_MS + SHADER_HOLD_MS}ms`,
} as CSSProperties;
const SHADER_LOGO_WIDTH = 1280;
const SHADER_LOGO_HEIGHT = 720;

export function StartupOverlay() {
  const [isVisible, setIsVisible] = useState(true);
  const [shaderFrame, setShaderFrame] = useState(0);
  const mountTimeRef = useRef(performance.now());

  useEffect(() => {
    let animationFrameId = 0;

    const tick = () => {
      const elapsedMs = performance.now() - mountTimeRef.current;
      setShaderFrame(elapsedMs * SHADER_ANIMATION_SPEED);
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, STARTUP_OVERLAY_DURATION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="startup-overlay" style={startupOverlayStyle} aria-hidden="true">
      <div className="startup-overlay__shader">
        <GemSmoke
          width={SHADER_LOGO_WIDTH}
          height={SHADER_LOGO_HEIGHT}
          image={flowxShaderLogo}
          fit="contain"
          frame={shaderFrame}
          colors={['#06b270', '#cdff61', '#ffffff']}
          colorBack="#000000"
          colorInner="#000000"
          innerDistortion={1}
          outerDistortion={1}
          outerGlow={0}
          innerGlow={1}
          offset={1}
          angle={0}
          size={1}
          speed={0}
          scale={0.24}
        />
      </div>
    </div>
  );
}
