"use client";

import { useEffect, useRef } from "react";

type Renderer = {
  draw: (video: HTMLVideoElement) => void;
  dispose: () => void;
};

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  // vUv.y = 0 คือขอบบนของภาพ (ไม่ใช้ UNPACK_FLIP_Y)
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform float uHalfTexel; // ครึ่งพิกเซลแนวตั้ง (หน่วย uv ของทั้งเฟรม)
varying vec2 vUv;
void main() {
  // ครึ่งบน = สี premultiplied, ครึ่งล่าง = mask alpha
  // clamp ห่างรอยต่อครึ่งพิกเซล กัน LINEAR ดึงสีข้ามครึ่ง
  float yc = min(vUv.y * 0.5, 0.5 - uHalfTexel);
  float ym = max(0.5 + vUv.y * 0.5, 0.5 + uHalfTexel);
  vec3 c = texture2D(uTex, vec2(vUv.x, yc)).rgb;
  float a = texture2D(uTex, vec2(vUv.x, ym)).r;
  // rgb / a แล้วคูณ a กลับ = min(c, a) → ผลลัพธ์ premultiplied สำหรับ canvas โปร่งใส
  gl_FragColor = a <= 0.0 ? vec4(0.0) : vec4(min(c, vec3(a)), a);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
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

/** ประกอบ RGBA ด้วย WebGL (quad เดียว + fragment shader) — เบากว่า getImageData มาก */
function createGlRenderer(canvas: HTMLCanvasElement): Renderer | null {
  const gl = canvas.getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
  });
  if (!gl) return null;

  let program: WebGLProgram | null = null;
  let texture: WebGLTexture | null = null;
  let buffer: WebGLBuffer | null = null;
  let halfTexelLoc: WebGLUniformLocation | null = null;
  let lost = false;
  let ready = false;

  const setup = () => {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    program = gl.createProgram();
    if (!vs || !fs || !program) return false;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);

    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // เฟรมวิดีโอเป็น NPOT → ต้อง CLAMP_TO_EDGE และไม่ใช้ mipmap
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(gl.getUniformLocation(program, "uTex"), 0);
    halfTexelLoc = gl.getUniformLocation(program, "uHalfTexel");

    gl.disable(gl.BLEND); // ผลลัพธ์ premultiplied อยู่แล้ว
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.clearColor(0, 0, 0, 0);
    return true;
  };

  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    ready = false;
  };
  const onRestored = () => {
    lost = false;
    ready = setup();
  };
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  ready = setup();
  if (!ready) {
    canvas.removeEventListener("webglcontextlost", onLost);
    canvas.removeEventListener("webglcontextrestored", onRestored);
    return null;
  }

  return {
    draw(video) {
      if (lost || !ready) return;
      const w = video.videoWidth;
      const h = video.videoHeight / 2;
      if (!w || !h) return;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform1f(halfTexelLoc, 0.5 / (h * 2));
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose() {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
      if (!lost) {
        gl.deleteTexture(texture);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      }
    },
  };
}

/** Fallback: 2D canvas + วนพิกเซลด้วย JS (ช้ากว่า ใช้เมื่อ WebGL ใช้ไม่ได้) */
function create2dRenderer(canvas: HTMLCanvasElement): Renderer | null {
  const scratch = document.createElement("canvas");
  const sctx = scratch.getContext("2d", { willReadFrequently: true });
  const ctx = canvas.getContext("2d");
  if (!sctx || !ctx) return null;
  return {
    draw(video) {
      const w = video.videoWidth;
      const h = video.videoHeight / 2;
      if (!w || !h) return;
      if (scratch.width !== w || scratch.height !== h * 2) {
        scratch.width = w;
        scratch.height = h * 2;
        canvas.width = w;
        canvas.height = h;
      }
      sctx.drawImage(video, 0, 0);
      const color = sctx.getImageData(0, 0, w, h);
      const mask = sctx.getImageData(0, h, w, h).data;
      const px = color.data;
      for (let i = 0; i < px.length; i += 4) {
        const a = mask[i] ?? 0;
        if (a === 0) {
          px[i + 3] = 0;
          continue;
        }
        // ภาพสี premultiplied บนดำ → คืนเป็น straight alpha
        const k = 255 / a;
        px[i] = Math.min(255, (px[i] ?? 0) * k);
        px[i + 1] = Math.min(255, (px[i + 1] ?? 0) * k);
        px[i + 2] = Math.min(255, (px[i + 2] ?? 0) * k);
        px[i + 3] = a;
      }
      ctx.putImageData(color, 0, 0);
    },
    dispose() {},
  };
}

/**
 * วิดีโอโปร่งใสสำหรับ Safari/iOS ที่ไม่รองรับ alpha ใน WebM
 * ไฟล์ MP4 วางภาพสี (premultiplied บนดำ) ไว้ครึ่งบน และ mask alpha (ขาวดำ) ไว้ครึ่งล่าง
 * ประกอบเป็น RGBA ใน canvas (WebGL, fallback 2D) — สร้างไฟล์ด้วย ffmpeg (ดู design.md § VIP rank video)
 */
export function StackedAlphaVideo({
  src,
  playing,
  className,
}: {
  src: string;
  playing: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const renderer = createGlRenderer(canvas) ?? create2dRenderer(canvas);
    if (!renderer) return;

    const draw = () => {
      if (video.readyState < 2) return;
      renderer.draw(video);
    };

    // วาดเฉพาะเมื่อมีเฟรมวิดีโอใหม่ (rVFC) — ถ้าไม่รองรับใช้ rAF แทน
    const hasRvfc = typeof video.requestVideoFrameCallback === "function";
    let handle = 0;
    const loop = () => {
      draw();
      handle = hasRvfc ? video.requestVideoFrameCallback(loop) : requestAnimationFrame(loop);
    };
    const stop = () => {
      if (hasRvfc) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
    };
    const start = () => {
      stop();
      handle = hasRvfc ? video.requestVideoFrameCallback(loop) : requestAnimationFrame(loop);
    };

    video.addEventListener("loadeddata", draw);
    video.addEventListener("seeked", draw);
    video.addEventListener("play", start);
    video.addEventListener("pause", stop);
    if (!video.paused) start();
    else draw();
    return () => {
      stop();
      video.removeEventListener("loadeddata", draw);
      video.removeEventListener("seeked", draw);
      video.removeEventListener("play", start);
      video.removeEventListener("pause", stop);
      renderer.dispose();
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => undefined);
    else video.pause();
  }, [playing, src]);

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        className="pointer-events-none absolute h-px w-px opacity-0"
      />
      <canvas ref={canvasRef} className={className} aria-hidden="true" />
    </>
  );
}

/** Safari (macOS/iOS) และเบราว์เซอร์ iOS ทุกตัว (WebKit) — ไม่อ่าน alpha ของ WebM */
export function needsStackedAlpha(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /^((?!chrome|chromium|android|crios|fxios|edg).)*safari/i.test(ua);
  return isIOS || isSafari;
}
