import { useEffect, useRef } from "react";

export interface OrbColorConfig {
  readonly primary: readonly [number, number, number];
  readonly secondary: readonly [number, number, number];
  readonly dark: readonly [number, number, number];
  readonly glow: readonly [number, number, number];
  readonly light: readonly [number, number, number];
  readonly badgeColor: string;
  readonly auraCSS: string;
}

interface JellySphereProps {
  readonly config: OrbColorConfig;
  readonly step: string;
  readonly title: string;
  readonly stageIndex: number;
}

const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SRC = `
precision highp float;
uniform vec2 u_resolution;
uniform vec2 u_mouse;       // [0, 1] cursor coordinates (Y inverted to match WebGL)
uniform float u_hover;      // smoothed 0.0 to 1.0 hover state
uniform float u_mouse_vel;  // cursor speed 0.0 to 1.0
uniform float u_time;
uniform float u_stage_idx;  // 0.0 to 4.0 for distinct organic deformed shape
uniform vec3 u_col_primary;
uniform vec3 u_col_secondary;
uniform vec3 u_col_dark;
uniform vec3 u_col_glow;
uniform vec3 u_col_light;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 rawP = uv - vec2(0.5);

  // Strict perimeter cushion: ensure clean fade-out within canvas bounds
  float lenRaw = length(rawP);
  if (lenRaw > 0.495) {
    gl_FragColor = vec4(0.0);
    return;
  }
  float perimeterFade = smoothstep(0.495, 0.465, lenRaw);

  // ── Faster Fluid Idle Movement & Gentle Floating Drift ──
  // Accelerated dynamic tempo (~45% faster) for a living, fluid presence
  float t = u_time * 0.6;
  float phase = u_stage_idx * 1.382;

  // Gentle idle floating levitation drift (subtle 2D motion that calms on hover)
  vec2 idleFloat = vec2(
    sin(t * 0.75 + phase) * 0.012,
    cos(t * 0.90 + phase * 1.25) * 0.014
  ) * (1.0 - u_hover * 0.80);

  vec2 p = rawP - idleFloat;
  vec2 m = (u_mouse - vec2(0.5)) - idleFloat;

  float R = 0.435; // Enlarged radius (no outer halo taking space)
  float angle = atan(p.y, p.x);

  // ── 1. Smooth Rounded Contour Bulge towards Cursor ("bo tròn") ──
  float mouseAngle = atan(m.y, m.x);
  float mouseDist = length(m);
  
  float angleDiff = abs(angle - mouseAngle);
  if (angleDiff > 3.14159265) angleDiff = 6.2831853 - angleDiff;
  
  float roundArc = exp(-pow(angleDiff / 0.65, 2.0));
  float rimProximity = exp(-pow((mouseDist - R) / 0.16, 2.0)) * u_hover;
  float smoothBulge = roundArc * rimProximity * 0.034;

  // ── 2. Smooth Non-Singular Interior Surface Displacement ──
  float dMouse = length(p - m);
  float innerInfluence = exp(-pow(dMouse / 0.16, 2.0)) * 0.14 * u_hover;
  p += (p - m) * innerInfluence;

  // Subtle 3D Parallax shift tracking mouse smoothly
  p -= m * 0.015 * u_hover;

  // ── 3. Elegant Organic Curvature & Fluid Surface Ripples ──
  float organicWarp = sin(angle * 2.0 + phase + t * 1.15) * 0.017
                    + cos(angle * 3.0 - phase * 1.2 - t * 0.95) * 0.013
                    + sin(angle * 4.0 + phase * 2.1 + t * 1.35) * 0.007;
  
  // Dynamic rhythmic breathing pulse
  float breath = sin(t * 1.15 + phase) * 0.008;

  float stretchX = 1.0 + sin(phase * 1.5 + t * 0.70) * 0.024;
  float stretchY = 1.0 - sin(phase * 1.5 + t * 0.70) * 0.024;
  vec2 warpedP = vec2(p.x * stretchX, p.y * stretchY);

  // Total radius with dynamic idle wave and rounded bulge
  float r = length(warpedP) - organicWarp - breath - smoothBulge;

  // ── 4. STRICT ZERO OUTER BORDER — No halo, no rim shell ──
  if (r > R) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // ── 5. Enhanced 3D Volumetric Depth & Thick Normals ──
  float d = R - r; // Depth inside sphere
  float z = sqrt(max(0.0, R * R - r * r));
  vec3 N = normalize(vec3(p.x * 1.35, p.y * 1.35, z * 0.95));

  // ── 6. Studio 3D Lighting Setup (Key Light with subtle idle drift, Fill/Bounce Light) ──
  vec3 L1 = normalize(vec3(0.35 + sin(t * 0.65 + phase) * 0.10, 0.72 + cos(t * 0.55 + phase) * 0.08, 0.60));
  float diff1 = max(dot(N, L1) * 0.62 + 0.38, 0.0);
  vec3 H1 = normalize(L1 + vec3(0.0, 0.0, 1.0));
  float spec1 = pow(max(dot(N, H1), 0.0), 22.0) * 0.30;

  // Fill / Bounce Light (Bottom-Right)
  vec3 L2 = normalize(vec3(-0.45, -0.70, 0.35));
  float diff2 = max(dot(N, L2) * 0.50 + 0.50, 0.0);
  vec3 bounceCol = u_col_secondary * diff2 * 0.30;

  // ── 7. Luminous Core & Radial Brightening ──
  // A. Vùng trung tâm: Sáng nhẹ nhàng, có ánh sắc ngọc thay vì tối đen
  vec3 coreColor = mix(u_col_dark * 1.85, u_col_primary * 0.42, 0.38);

  // B. Càng ra xa càng sáng: Gradient tăng dần độ sáng từ tâm ra mép
  float normR = clamp(r / R, 0.0, 1.0);
  float radialGlow = pow(normR, 1.45);
  vec3 bodyColor = mix(coreColor, u_col_primary, radialGlow);

  // C. Tụ sáng mạnh dần về phía vành ngoài (giữ nguyên phong cách cũ)
  vec3 rimColor = mix(u_col_glow, u_col_light, 0.68) * 1.25;
  float rimFactor = smoothstep(0.35, 1.0, normR);
  float rimIntensity = pow(rimFactor, 1.8);
  bodyColor = mix(bodyColor, rimColor, rimIntensity * 0.82);

  // ── 8. Soft Velvet Fresnel Rim Sheen (giữ nguyên phong cách cũ) ──
  float fresnel = pow(1.0 - max(dot(N, vec3(0.0, 0.0, 1.0)), 0.0), 2.2) * 0.45;
  vec3 fresnelCol = mix(u_col_glow, u_col_light, 0.60) * fresnel;

  // ── 9. DYNAMIC 3D POINT LIGHT SHEEN AT CURSOR ──
  float cursorDist = length(p - m);
  vec3 mouseLightPos = vec3(m.x, m.y, 0.38);
  vec3 L_m = normalize(mouseLightPos - vec3(p, z));
  float mouseAtten = 1.0 / (1.0 + cursorDist * cursorDist * 16.0);
  vec3 H_m = normalize(L_m + vec3(0.0, 0.0, 1.0));
  float specPower = mix(24.0, 14.0, clamp(u_mouse_vel * 2.0, 0.0, 1.0));
  float specMouse = pow(max(dot(N, H_m), 0.0), specPower) * (0.65 + u_mouse_vel * 0.35) * u_hover * mouseAtten;

  // Local soft illumination ("đổi màu sáng hơn nhẹ" right where mouse is)
  float localLight = exp(-cursorDist * 6.5) * u_hover;
  vec3 localLightCol = mix(u_col_primary, u_col_light, 0.70) * localLight * 0.55;

  // ── 10. Composite Final Clean 3D Volumetric Color ──
  vec3 col = bodyColor * diff1
           + bounceCol
           + spec1 * u_col_light * 0.30
           + specMouse * u_col_light
           + localLightCol
           + fresnelCol;

  // Smooth anti-aliased edge (mép mượt, không viền màu)
  float edgeAA = smoothstep(0.0, 0.008, d) * perimeterFade;

  gl_FragColor = vec4(col, edgeAA);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function JellySphere({ config, step, title, stageIndex }: JellySphereProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: false }) ||
      (canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      }) as WebGLRenderingContext | null);

    if (!gl) return;

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uHover = gl.getUniformLocation(program, "u_hover");
    const uMouseVel = gl.getUniformLocation(program, "u_mouse_vel");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uStageIdx = gl.getUniformLocation(program, "u_stage_idx");
    const uColPrimary = gl.getUniformLocation(program, "u_col_primary");
    const uColSecondary = gl.getUniformLocation(program, "u_col_secondary");
    const uColDark = gl.getUniformLocation(program, "u_col_dark");
    const uColGlow = gl.getUniformLocation(program, "u_col_glow");
    const uColLight = gl.getUniformLocation(program, "u_col_light");

    let width = 0;
    let height = 0;

    // Cached stable bounding rect to eliminate jitter
    let cachedRect: DOMRect | null = null;
    const updateRect = () => {
      if (canvas) {
        cachedRect = canvas.getBoundingClientRect();
      }
    };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      cachedRect = rect;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.floor(rect.width * dpr);
      height = Math.floor(rect.height * dpr);
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    // Mouse tracking state
    const targetMouse = { x: 0.5, y: 0.5 };
    const currentMouse = { x: 0.5, y: 0.5 };
    let lastMoveX = 0.5;
    let lastMoveY = 0.5;
    let targetHover = 0.0;
    let currentHover = 0.0;
    let targetVel = 0.0;
    let currentVel = 0.0;

    const handleMouseEnter = () => {
      updateRect();
      targetHover = 1.0;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!cachedRect) updateRect();
      if (!cachedRect) return;

      const nx = (e.clientX - cachedRect.left) / cachedRect.width;
      const ny = 1.0 - (e.clientY - cachedRect.top) / cachedRect.height;
      const dx = nx - lastMoveX;
      const dy = ny - lastMoveY;
      lastMoveX = nx;
      lastMoveY = ny;

      targetMouse.x = Math.max(0.0, Math.min(1.0, nx));
      targetMouse.y = Math.max(0.0, Math.min(1.0, ny));
      targetHover = 1.0;

      const speed = Math.sqrt(dx * dx + dy * dy);
      targetVel = Math.min(speed * 12.0, 1.0);
    };

    const handleMouseLeave = () => {
      targetHover = 0.0;
      targetVel = 0.0;
      targetMouse.x = 0.5;
      targetMouse.y = 0.5;
      cachedRect = null;
    };

    wrapper.addEventListener("mouseenter", handleMouseEnter, { passive: true });
    wrapper.addEventListener("mousemove", handleMouseMove, { passive: true });
    wrapper.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("scroll", updateRect, { passive: true });

    const startTime = performance.now();
    let lastTime = performance.now();
    let rafId = 0;

    const render = (now: number) => {
      if (width === 0 || height === 0) {
        rafId = requestAnimationFrame(render);
        return;
      }

      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;
      const elapsed = (now - startTime) * 0.001;

      // Exponential smoothing for fluid, jitter-free inertia
      const mouseDamp = 1.0 - Math.exp(-10.0 * dt);
      const hoverDamp = 1.0 - Math.exp(-7.0 * dt);
      const velDamp = 1.0 - Math.exp(-10.0 * dt);

      currentMouse.x += (targetMouse.x - currentMouse.x) * mouseDamp;
      currentMouse.y += (targetMouse.y - currentMouse.y) * mouseDamp;
      currentHover += (targetHover - currentHover) * hoverDamp;
      currentVel += (targetVel - currentVel) * velDamp;
      targetVel *= Math.exp(-4.5 * dt);

      gl.useProgram(program);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uResolution, width, height);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.uniform1f(uHover, currentHover);
      gl.uniform1f(uMouseVel, currentVel);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uStageIdx, stageIndex);

      gl.uniform3f(uColPrimary, config.primary[0], config.primary[1], config.primary[2]);
      gl.uniform3f(uColSecondary, config.secondary[0], config.secondary[1], config.secondary[2]);
      gl.uniform3f(uColDark, config.dark[0], config.dark[1], config.dark[2]);
      gl.uniform3f(uColGlow, config.glow[0], config.glow[1], config.glow[2]);
      gl.uniform3f(uColLight, config.light[0], config.light[1], config.light[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateRect);
      wrapper.removeEventListener("mouseenter", handleMouseEnter);
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, [config, stageIndex]);

  return (
    <div className="jelly-sphere-card" ref={wrapperRef}>
      {/* Outer Volumetric Blur Aura matching background atmosphere */}
      <div
        className="jelly-sphere-aura"
        style={{
          background: `radial-gradient(circle, ${config.auraCSS} 0%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Interactive WebGL Volumetric Liquid Sphere */}
      <canvas ref={canvasRef} className="jelly-sphere-canvas" />

      {/* Centered Typography Overlay */}
      <div className="jelly-sphere-content" aria-hidden="true">
        <span
          className="jelly-sphere-badge"
          style={{
            color: config.badgeColor,
            background: "rgba(0, 0, 0, 0.45)",
          }}
        >
          STAGE {step}
        </span>
        <h3 className="jelly-sphere-title">{title}</h3>
      </div>

      {/* Soft Ground Ambient Shadow */}
      <div className="jelly-sphere-shadow" aria-hidden="true" />
    </div>
  );
}
