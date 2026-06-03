import { useEffect, useState } from 'react';
import { GemSmoke } from '@paper-design/shaders-react';
import flowxShaderLogo from '../../assets/flowx-shader-logo.png';

const STARTUP_OVERLAY_DURATION_MS = 2000;
const SHADER_LOGO_WIDTH = 1280;
const SHADER_LOGO_HEIGHT = 720;

export function StartupOverlay() {
  const [isVisible, setIsVisible] = useState(true);

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
    <div className="startup-overlay" aria-hidden="true">
      <div className="startup-overlay__shader">
        <GemSmoke
          width={SHADER_LOGO_WIDTH}
          height={SHADER_LOGO_HEIGHT}
          image={flowxShaderLogo}
          fit="contain"
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
          speed={2}
          scale={0.24}
        />
      </div>
    </div>
  );
}
