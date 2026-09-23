import { useEffect, useRef, useState } from "react";
import { FRAGMENT_SHADER_SRC, VERTEX_SHADER_SRC } from "./shaders";

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

/** Custom hook encapsulated for the 3D WebGL Silk Dune Canvas Lifecycle */
export function useChartWebGL() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const [renderError, setRenderError] = useState<Error | null>(null);

  if (renderError !== null) {
    throw renderError;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      setRenderError(new Error("WebGL is not supported on this device."));
      return;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) {
      setRenderError(new Error("Failed to compile WebGL shaders."));
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setRenderError(new Error("Failed to link WebGL program."));
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad buffer
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const aPosition = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uMouseHover = gl.getUniformLocation(program, "u_mouse_hover");
    const uMouseVel = gl.getUniformLocation(program, "u_mouse_vel");
    const uIntro = gl.getUniformLocation(program, "u_intro");

    let width = 0;
    let height = 0;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.floor(rect.width * dpr);
      height = Math.floor(rect.height * dpr);
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Mouse Interaction State
    const targetMouse = { x: 0.5, y: 0.5 };
    const currentMouse = { x: 0.5, y: 0.5 };
    let lastMoveX = 0.5;
    let lastMoveY = 0.5;
    let targetActive = 0.0;
    let currentActive = 0.0;
    let targetVel = 0.0;
    let currentVel = 0.0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = 1.0 - (e.clientY - rect.top) / rect.height;
      const dx = nx - lastMoveX;
      const dy = ny - lastMoveY;
      lastMoveX = nx;
      lastMoveY = ny;
      targetMouse.x = nx;
      targetMouse.y = ny;
      targetActive = 1.0;
      const speed = Math.sqrt(dx * dx + dy * dy);
      targetVel = Math.min(speed * 18.0, 1.0);
    };

    const handleMouseLeave = () => {
      targetActive = 0.0;
      targetVel = 0.0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const startTime = performance.now();
    let lastTime = performance.now();

    const render = () => {
      if (width === 0 || height === 0) {
        rafRef.current = requestAnimationFrame(render);
        return;
      }

      const now = performance.now();
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;
      const elapsed = (now - startTime) * 0.001;

      // 1.8s luxury cubic ease-out intro entrance curve
      const introRaw = Math.min(elapsed / 1.8, 1.0);
      const introProgress = 1.0 - Math.pow(1.0 - introRaw, 3.0);

      // Frame-rate independent exponential smoothing
      const mouseDamp = 1.0 - Math.exp(-9.0 * dt);
      const hoverDamp = 1.0 - Math.exp(-6.0 * dt);
      const velDamp = 1.0 - Math.exp(-12.0 * dt);

      currentMouse.x += (targetMouse.x - currentMouse.x) * mouseDamp;
      currentMouse.y += (targetMouse.y - currentMouse.y) * mouseDamp;
      currentActive += (targetActive - currentActive) * hoverDamp;
      currentVel += (targetVel - currentVel) * velDamp;
      targetVel *= Math.exp(-4.5 * dt);

      gl.uniform2f(uResolution, width, height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, currentMouse.x, currentMouse.y);
      gl.uniform1f(uMouseHover, currentActive);
      gl.uniform1f(uMouseVel, currentVel);
      gl.uniform1f(uIntro, introProgress);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(positionBuffer);
    };
  }, []);

  return { canvasRef };
}
