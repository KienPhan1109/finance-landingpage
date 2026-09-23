// ── WebGL Shaders for Interactive 3D Volumetric Wave Blocks ──────

export const VERTEX_SHADER_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const FRAGMENT_SHADER_SRC = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_mouse_hover;
uniform float u_mouse_vel;
uniform float u_intro;

// ── Analytical 3D Crest Functions (Elevated 3D Wave Proportions) ──

// Block 1: Foreground Silk Dune — heightened presence with grand sweeping peaks
float getCrest1(float x, float t, vec2 mouse, float hover) {
  float px = (mouse.x - 0.5) * 0.020 * hover;
  float py = (mouse.y - 0.5) * 0.012 * hover;
  float sx = x - px;

  // Crest left: tall dramatic swell reaching ~0.67
  float crestL = exp(-pow((sx - 0.11) / 0.18, 2.0)) * 0.34;
  // Crest right: rising majestically to ~0.61
  float crestR = exp(-pow((sx - 0.88) / 0.20, 2.0)) * 0.28;
  // Base elevation: 0.33 (elevated for taller silhouette)
  float base = 0.33 + py;

  // Gentle oceanic breathing motion
  float wave = sin(sx * 3.4 + t * 0.38) * 0.016 + cos(sx * 2.0 - t * 0.26) * 0.012;

  return base + crestL + crestR + wave;
}

// Block 2: Midground Cyan/Teal Ribbon (Tall complementary layer)
float getCrest2(float x, float t, vec2 mouse, float hover) {
  float px = (mouse.x - 0.5) * 0.010 * hover;
  float py = (mouse.y - 0.5) * 0.006 * hover;
  float sx = x - px;

  float crestL = exp(-pow((sx - 0.26) / 0.22, 2.0)) * 0.27;
  float crestR = exp(-pow((sx - 0.94) / 0.16, 2.0)) * 0.31;
  float base = 0.40 + py;
  float wave = sin(sx * 2.8 - t * 0.32) * 0.014;

  return base + crestL + crestR + wave;
}

// Block 3: Deep Ambient Horizon (Atmospheric backdrop ridge reaching ~0.67)
float getCrest3(float x, float t, vec2 mouse, float hover) {
  float px = (mouse.x - 0.5) * 0.004 * hover;
  float sx = x - px;

  float crest = exp(-pow((sx - 0.52) / 0.35, 2.0)) * 0.20;
  float base = 0.47;
  float wave = cos(sx * 2.2 + t * 0.22) * 0.014;

  return base + crest + wave;
}

// ── Ultra-Fast Vectorized Quant Bokeh Particles with Magnetic Physics (Zero-Lag) ──
float getParticles(vec2 uv, float t, vec2 m, float hvr) {
  // Vectorized 4 drifting celestial bokeh particles
  vec2 p1 = vec2(fract(t * 0.014 + 0.15 + (m.x - 0.5) * 0.02 * hvr), fract(t * 0.018 + 0.48 + (m.y - 0.5) * 0.015 * hvr));
  vec2 p2 = vec2(fract(t * 0.011 + 0.72 - (m.x - 0.5) * 0.015 * hvr), fract(t * 0.016 + 0.85 + (m.y - 0.5) * 0.012 * hvr));
  vec2 p3 = vec2(fract(t * 0.015 + 0.38 + (m.x - 0.5) * 0.025 * hvr), fract(t * 0.020 + 0.22 - (m.y - 0.5) * 0.018 * hvr));
  vec2 p4 = vec2(fract(t * 0.012 + 0.88 - (m.x - 0.5) * 0.018 * hvr), fract(t * 0.015 + 0.62 + (m.y - 0.5) * 0.014 * hvr));

  // Magnetic cursor repulsion: particles gently part away from cursor
  vec2 to1 = p1 - m; float d1 = length(to1); if (d1 < 0.20 && d1 > 0.001) p1 += (to1 / d1) * (0.20 - d1) * 0.35 * hvr;
  vec2 to2 = p2 - m; float d2 = length(to2); if (d2 < 0.20 && d2 > 0.001) p2 += (to2 / d2) * (0.20 - d2) * 0.35 * hvr;
  vec2 to3 = p3 - m; float d3 = length(to3); if (d3 < 0.20 && d3 > 0.001) p3 += (to3 / d3) * (0.20 - d3) * 0.35 * hvr;
  vec2 to4 = p4 - m; float d4 = length(to4); if (d4 < 0.20 && d4 > 0.001) p4 += (to4 / d4) * (0.20 - d4) * 0.35 * hvr;

  float b1 = exp(-length((uv - p1) * vec2(1.0, 1.4)) * 26.0) * (0.26 + 0.08 * sin(t * 1.5));
  float b2 = exp(-length((uv - p2) * vec2(1.0, 1.4)) * 26.0) * (0.24 + 0.08 * cos(t * 1.7));
  float b3 = exp(-length((uv - p3) * vec2(1.0, 1.4)) * 26.0) * (0.22 + 0.08 * sin(t * 1.3));
  float b4 = exp(-length((uv - p4) * vec2(1.0, 1.4)) * 26.0) * (0.25 + 0.08 * cos(t * 1.9));

  // 4 pinpoint sparkling stars
  vec2 s1 = vec2(fract(t * 0.006 + 0.23), fract(t * 0.009 + 0.74));
  vec2 s2 = vec2(fract(t * 0.005 + 0.61), fract(t * 0.008 + 0.32));
  vec2 s3 = vec2(fract(t * 0.007 + 0.88), fract(t * 0.006 + 0.65));
  vec2 s4 = vec2(fract(t * 0.004 + 0.42), fract(t * 0.007 + 0.18));

  float st1 = exp(-length(uv - s1) * 220.0) * (0.16 + 0.10 * sin(t * 2.5));
  float st2 = exp(-length(uv - s2) * 220.0) * (0.14 + 0.10 * cos(t * 2.8));
  float st3 = exp(-length(uv - s3) * 220.0) * (0.15 + 0.10 * sin(t * 3.1));
  float st4 = exp(-length(uv - s4) * 220.0) * (0.14 + 0.10 * cos(t * 2.2));

  return b1 + b2 + b3 + b4 + st1 + st2 + st3 + st4;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = u_time;
  vec2 m = u_mouse;
  float hvr = u_mouse_hover;

  // ── 1. Cosmic Deep Midnight Sky & Atmospheric Aura ─────────
  vec3 bgBase = mix(vec3(0.016, 0.024, 0.045), vec3(0.008, 0.012, 0.022), uv.y);
  vec2 auraCenter = vec2(0.50, 0.52) + (m - 0.5) * 0.02 * hvr;
  float aura = exp(-length((uv - auraCenter) * vec2(1.1, 1.7)) * 2.2);
  vec3 col = bgBase + vec3(0.10, 0.55, 0.42) * aura * (0.24 * u_intro);

  // Floating quant particles (scaled with intro entrance)
  float particles = getParticles(uv, t, m, hvr) * u_intro;
  col += vec3(0.50, 0.90, 0.98) * particles;

  // Quantum Light Sweep during Intro Awakening (completely fades out when intro finishes)
  float sweepPos = u_intro * 1.5 - 0.25;
  float sweepBeam = exp(-pow((uv.x - sweepPos) / 0.14, 2.0)) * max(0.0, 1.0 - u_intro) * 1.6;
  vec3 sweepCol = mix(vec3(0.64, 1.0, 0.30), vec3(0.15, 0.85, 1.0), uv.x) * sweepBeam * 1.4;

  // Dynamic Crest Heights with Cinematic Rise
  float h3 = getCrest3(uv.x, t, m, hvr) * u_intro;
  float h2 = getCrest2(uv.x, t, m, hvr) * u_intro;
  float h1 = getCrest1(uv.x, t, m, hvr) * u_intro;

  // ── 2. Block 3: Deep Background Ridge ───────────────────────
  if (uv.y < h3) {
    float d3 = h3 - uv.y;
    float slope3 = (getCrest3(uv.x + 0.005, t, m, hvr) - getCrest3(uv.x - 0.005, t, m, hvr)) / 0.01;
    
    // Smooth C-infinity 3D curvature (Zero creases or seams)
    float dZdd3 = 0.32 * exp(-d3 * 2.5);
    vec3 N3 = normalize(vec3(-slope3 * 0.45 * exp(-d3 * 1.8), dZdd3, 1.0));
    
    vec3 L = normalize(vec3(0.25, 0.85, 0.55));
    float diff3 = max(dot(N3, L) * 0.6 + 0.4, 0.0);
    
    float bodyBlend3 = exp(-d3 * 2.4);
    vec3 b3Body = mix(vec3(0.008, 0.012, 0.022), vec3(0.028, 0.058, 0.090), bodyBlend3);
    float rim3 = exp(-d3 * 32.0) * 0.60;
    col = b3Body * diff3 + vec3(0.12, 0.72, 0.82) * rim3;
  }

  // Soft atmospheric shadow from Block 2 onto Block 3
  if (uv.y < h3 && uv.y >= h2 && uv.y < h2 + 0.07) {
    float shadow2 = smoothstep(h2 + 0.07, h2, uv.y) * 0.40;
    col *= (1.0 - shadow2);
  }

  // ── 3. Block 2: Midground Sculpted Ribbon ───────────────────
  if (uv.y < h2) {
    float d2 = h2 - uv.y;
    float slope2 = (getCrest2(uv.x + 0.005, t, m, hvr) - getCrest2(uv.x - 0.005, t, m, hvr)) / 0.01;

    // Smooth C-infinity 3D volumetric curvature (Zero creases, soft diffused surface)
    float dZdd2 = 0.38 * exp(-d2 * 2.6) - 0.05;
    vec3 N2 = normalize(vec3(-slope2 * 0.52 * exp(-d2 * 1.8), dZdd2, 1.0));

    vec3 L = normalize(vec3(0.28, 0.80, 0.60));
    float diff2 = max(dot(N2, L) * 0.62 + 0.38, 0.0);
    vec3 H2 = normalize(L + vec3(0.0, 0.0, 1.0));
    float spec2 = pow(max(dot(N2, H2), 0.0), 22.0) * 0.22;

    // Dynamic 3D cursor point light on Block 2
    float zHeight2 = exp(-d2 * 2.8) * 0.24;
    vec3 mouseLightPos2 = vec3(m.x, m.y, 0.45);
    vec3 L_m2 = normalize(mouseLightPos2 - vec3(uv, zHeight2));
    float mouseDist2 = length(uv - m);
    float mouseAtten2 = 1.0 / (1.0 + mouseDist2 * mouseDist2 * 8.0);
    vec3 H_m2 = normalize(L_m2 + vec3(0.0, 0.0, 1.0));
    float specMouse2 = pow(max(dot(N2, H_m2), 0.0), 16.0) * 0.24 * hvr * mouseAtten2;

    // Tangential Crest Streak on Block 2
    float cursorDx2 = abs(uv.x - m.x);
    float streak2 = exp(-pow(cursorDx2 / (0.16 + u_mouse_vel * 0.18), 2.0)) * exp(-d2 * 40.0) * hvr * 0.38;

    // Subsurface Scattering (SSS) inside translucent emerald-teal ribbon (soft foggy blur)
    float sss2 = exp(-d2 * 34.0) * 0.80;
    float sssGlow2 = exp(-d2 * 12.0) * 0.32;
    float softBodyGlow2 = exp(-d2 * 3.8) * 0.20;
    vec3 sss2Col = mix(vec3(0.22, 0.85, 0.65), vec3(0.12, 0.78, 0.92), uv.x);

    // Fresnel Velvet Sheen
    float fresnel2 = pow(1.0 - max(dot(N2, vec3(0.0, 0.0, 1.0)), 0.0), 2.6) * 0.32 * exp(-d2 * 3.2);

    float bodyBlend2 = exp(-d2 * 2.4);
    vec3 b2Body = mix(vec3(0.008, 0.012, 0.022), vec3(0.038, 0.078, 0.115), bodyBlend2);
    col = b2Body * diff2
        + (spec2 + specMouse2) * vec3(0.40, 0.92, 0.80)
        + vec3(0.20, 0.85, 0.95) * streak2
        + sss2Col * (sss2 + sssGlow2 + softBodyGlow2)
        + vec3(0.15, 0.80, 0.90) * fresnel2;
  }

  // Soft atmospheric shadow from Block 1 onto Block 2
  if (uv.y < h2 && uv.y >= h1 && uv.y < h1 + 0.09) {
    float shadow1 = smoothstep(h1 + 0.09, h1, uv.y) * 0.50;
    col *= (1.0 - shadow1);
  }

  // ── 4. Block 1: Foreground Majestic Silk Dune (Volumetric 3D) ─
  if (uv.y < h1) {
    float d1 = h1 - uv.y;
    float slope1 = (getCrest1(uv.x + 0.005, t, m, hvr) - getCrest1(uv.x - 0.005, t, m, hvr)) / 0.01;

    // Pure C-infinity Volumetric Surface (Zero Creases, Continuous Normal Gradient)
    float dZdd1 = 0.42 * exp(-d1 * 2.6) - 0.06;
    float slopeAtten1 = exp(-d1 * 1.8);
    vec3 N1 = normalize(vec3(-slope1 * 0.58 * slopeAtten1, dZdd1, 1.0));

    // Directional Key Light & Soft Chiaroscuro
    vec3 L1 = normalize(vec3(0.26, 0.78, 0.62));
    float diff1 = max(dot(N1, L1) * 0.62 + 0.38, 0.0);
    vec3 H1 = normalize(L1 + vec3(0.0, 0.0, 1.0));
    float spec1 = pow(max(dot(N1, H1), 0.0), 24.0) * 0.32;

    // Dynamic 3D Point Light Sheen from cursor (Continuous Depth Manifold)
    float cursorDist = length(uv - m);
    vec3 mouseLightPos = vec3(m.x, m.y, 0.38);
    float zHeight1 = exp(-d1 * 2.8) * 0.28;
    vec3 L_m = normalize(mouseLightPos - vec3(uv, zHeight1));
    float mouseAtten = 1.0 / (1.0 + cursorDist * cursorDist * 6.5);
    vec3 H_m = normalize(L_m + vec3(0.0, 0.0, 1.0));
    float specPower = mix(24.0, 14.0, clamp(u_mouse_vel * 2.0, 0.0, 1.0));
    float specMouse = pow(max(dot(N1, H_m), 0.0), specPower) * (0.45 + u_mouse_vel * 0.35) * hvr * mouseAtten;

    // Tangential Laser Streak along Razor Crest (High-speed optical fiber pulse)
    float cursorDx = abs(uv.x - m.x);
    float streakSpan = 0.16 + u_mouse_vel * 0.22;
    float tangentStreak = exp(-pow(cursorDx / streakSpan, 2.0)) * exp(-d1 * 40.0) * hvr;
    vec3 streakCol = mix(vec3(0.95, 1.0, 0.60), vec3(0.35, 0.95, 1.0), uv.x) * tangentStreak * (0.85 + u_mouse_vel * 0.60);

    // Soft Blurred Volumetric Glow ("hiệu ứng mờ" - silky diffuse translucency)
    float sss1 = exp(-d1 * 35.0) * 1.05;
    float sssGlow1 = exp(-d1 * 12.0) * 0.36;
    float softDuneFog = exp(-d1 * 3.8) * 0.24;
    vec3 sss1Col = mix(vec3(0.68, 0.92, 0.20), vec3(0.08, 0.82, 0.68), uv.x * 0.85 + 0.1);

    // Fresnel Velvet Sheen across curved 3D silhouettes (Smooth falloff)
    float fresnel1 = pow(1.0 - max(dot(N1, vec3(0.0, 0.0, 1.0)), 0.0), 2.5) * 0.36 * exp(-d1 * 3.2);
    vec3 fresnelCol = mix(vec3(0.64, 0.90, 0.21), vec3(0.13, 0.83, 0.93), uv.x);

    // Deep Obsidian Body Chiaroscuro (Infinitely smooth exponential dissolve, no hard clamping)
    float bodyBlend = exp(-d1 * 2.4);
    vec3 b1Body = mix(vec3(0.008, 0.012, 0.022), vec3(0.046, 0.084, 0.125), bodyBlend);

    // Sculpted Razor-Crest Highlight (Subtle Anti-Aliased Bevel)
    float crestEdge = smoothstep(0.004, 0.0, d1) * 0.88;
    vec3 crestEdgeCol = mix(vec3(0.92, 1.0, 0.68), vec3(0.65, 0.98, 1.0), uv.x);

    // Composite Final Foreground Color with Multi-Layered Interactive Physics & Intro Light Sweep
    vec3 block1Col = b1Body * diff1
                   + spec1 * vec3(0.85, 0.98, 0.70)
                   + specMouse * vec3(0.78, 1.0, 0.50)
                   + streakCol
                   + sweepCol * exp(-d1 * 25.0)
                   + sss1Col * (sss1 + sssGlow1 + softDuneFog)
                   + fresnelCol * fresnel1
                   + crestEdgeCol * crestEdge;

    col = block1Col;
  }

  // ── 5. Atmospheric Rim Bloom Above Block 1 ──────────────────
  if (uv.y >= h1 && uv.y < h1 + 0.10) {
    float distAbove = (uv.y - h1);
    float skyBloom = exp(-distAbove * 32.0) * 0.45;
    vec3 bloomCol = mix(vec3(0.64, 0.90, 0.21), vec3(0.13, 0.83, 0.93), uv.x);
    col += bloomCol * skyBloom + sweepCol * skyBloom * 1.2;
  }

  // ── 6. Bottom Seamless Velvet Fade (No Straight Cutoff Line) ──
  // Dissolves the wave body and glow organically into pure deep midnight
  float bottomFade = smoothstep(0.01, 0.30, uv.y);
  col = mix(bgBase, col, bottomFade);

  gl_FragColor = vec4(col, 1.0);
}
`;
