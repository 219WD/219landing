import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * useLiquidEther
 * Returns a ref to attach to the container div.
 * Initialises only after the element has non-zero dimensions
 * (fixes the "black screen" issue caused by mounting before layout).
 */
export function useLiquidEther(config) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cleanup = null;

    // Wait until the element has real dimensions before booting Three.js.
    // Uses ResizeObserver so it fires as soon as the browser paints a size.
    const bootObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        bootObserver.disconnect();
        cleanup = bootFluid(el, config);
      }
    });
    bootObserver.observe(el);

    return () => {
      bootObserver.disconnect();
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Core fluid simulation — called once dimensions are known                  */
/* ─────────────────────────────────────────────────────────────────────────── */
function bootFluid(container, cfg) {
  const {
    colors, mouseForce, cursorSize, isViscous, viscous,
    iterationsViscous, iterationsPoisson, resolution,
    isBounce, dt, BFECC,
    autoDemo, autoSpeed, autoIntensity,
    takeoverDuration, autoResumeDelay, autoRampDuration,
  } = cfg;

  // ── Palette texture ────────────────────────────────────────────────────────
  function makePalette(stops) {
    const arr = Array.isArray(stops) && stops.length > 1 ? stops
              : stops?.length === 1 ? [stops[0], stops[0]]
              : ['#ffffff', '#ffffff'];
    const data = new Uint8Array(arr.length * 4);
    arr.forEach((hex, i) => {
      const c = new THREE.Color(hex);
      data[i*4]   = Math.round(c.r * 255);
      data[i*4+1] = Math.round(c.g * 255);
      data[i*4+2] = Math.round(c.b * 255);
      data[i*4+3] = 255;
    });
    const t = new THREE.DataTexture(data, arr.length, 1, THREE.RGBAFormat);
    t.magFilter = t.minFilter = THREE.LinearFilter;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  }

  const paletteTex = makePalette(colors);
  const bgVec4     = new THREE.Vector4(0, 0, 0, 0); // transparent bg

  // ── GLSL ──────────────────────────────────────────────────────────────────
  const GL = {
    faceVert: `attribute vec3 position;uniform vec2 px;uniform vec2 boundarySpace;varying vec2 uv;precision highp float;void main(){vec3 p=position;vec2 s=1.0-boundarySpace*2.0;p.xy*=s;uv=vec2(0.5)+p.xy*0.5;gl_Position=vec4(p,1.0);}`,
    lineVert: `attribute vec3 position;uniform vec2 px;precision highp float;varying vec2 uv;void main(){vec3 p=position;uv=0.5+p.xy*0.5;vec2 n=sign(p.xy);p.xy=abs(p.xy)-px;p.xy*=n;gl_Position=vec4(p,1.0);}`,
    mouseVert:`precision highp float;attribute vec3 position;attribute vec2 uv;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 pos=position.xy*scale*2.0*px+center;vUv=uv;gl_Position=vec4(pos,0.0,1.0);}`,
    advect:   `precision highp float;uniform sampler2D velocity;uniform float dt;uniform bool isBFECC;uniform vec2 fboSize;uniform vec2 px;varying vec2 uv;void main(){vec2 r=max(fboSize.x,fboSize.y)/fboSize;if(!isBFECC){vec2 v=texture2D(velocity,uv).xy;gl_FragColor=vec4(texture2D(velocity,uv-v*dt*r).xy,0,0);}else{vec2 vo=texture2D(velocity,uv).xy;vec2 so=uv-vo*dt*r;vec2 vn=texture2D(velocity,so).xy;vec2 sn2=so+vn*dt*r;vec2 s3=uv-(sn2-uv)/2.0;vec2 v2=texture2D(velocity,s3).xy;gl_FragColor=vec4(texture2D(velocity,s3-v2*dt*r).xy,0,0);}}`,
    color:    `precision highp float;uniform sampler2D velocity;uniform sampler2D palette;uniform vec4 bgColor;varying vec2 uv;void main(){vec2 v=texture2D(velocity,uv).xy;float l=clamp(length(v),0.0,1.0);vec3 c=texture2D(palette,vec2(l,0.5)).rgb;gl_FragColor=vec4(mix(bgColor.rgb,c,l),mix(bgColor.a,1.0,l));}`,
    div:      `precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 px;varying vec2 uv;void main(){float x0=texture2D(velocity,uv-vec2(px.x,0)).x;float x1=texture2D(velocity,uv+vec2(px.x,0)).x;float y0=texture2D(velocity,uv-vec2(0,px.y)).y;float y1=texture2D(velocity,uv+vec2(0,px.y)).y;gl_FragColor=vec4((x1-x0+y1-y0)*0.5/dt);}`,
    extF:     `precision highp float;uniform vec2 force;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 c=(vUv-0.5)*2.0;float d=1.0-min(length(c),1.0);d*=d;gl_FragColor=vec4(force*d,0.0,1.0);}`,
    poisson:  `precision highp float;uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 px;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x*2.0,0)).r;float p1=texture2D(pressure,uv-vec2(px.x*2.0,0)).r;float p2=texture2D(pressure,uv+vec2(0,px.y*2.0)).r;float p3=texture2D(pressure,uv-vec2(0,px.y*2.0)).r;float d=texture2D(divergence,uv).r;gl_FragColor=vec4((p0+p1+p2+p3)*0.25-d);}`,
    pressure: `precision highp float;uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x,0)).r;float p1=texture2D(pressure,uv-vec2(px.x,0)).r;float p2=texture2D(pressure,uv+vec2(0,px.y)).r;float p3=texture2D(pressure,uv-vec2(0,px.y)).r;vec2 v=texture2D(velocity,uv).xy-vec2(p0-p1,p2-p3)*0.5*dt;gl_FragColor=vec4(v,0.0,1.0);}`,
    viscous:  `precision highp float;uniform sampler2D velocity;uniform sampler2D velocity_new;uniform float v;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){vec2 o=texture2D(velocity,uv).xy;vec2 n0=texture2D(velocity_new,uv+vec2(px.x*2.0,0)).xy;vec2 n1=texture2D(velocity_new,uv-vec2(px.x*2.0,0)).xy;vec2 n2=texture2D(velocity_new,uv+vec2(0,px.y*2.0)).xy;vec2 n3=texture2D(velocity_new,uv-vec2(0,px.y*2.0)).xy;gl_FragColor=vec4((4.0*o+v*dt*(n0+n1+n2+n3))/(4.0*(1.0+v*dt)),0,0);}`,
  };

  // ── Renderer ───────────────────────────────────────────────────────────────
  const pr  = Math.min(window.devicePixelRatio || 1, 2);
  const rect = container.getBoundingClientRect();
  let W = Math.max(1, Math.floor(rect.width));
  let H = Math.max(1, Math.floor(rect.height));

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(pr);
  renderer.setSize(W, H);
  Object.assign(renderer.domElement.style, {
    position: 'absolute', top: '0', left: '0',
    width: '100%', height: '100%', display: 'block', pointerEvents: 'none',
  });
  container.appendChild(renderer.domElement);

  const clock = new THREE.Clock();
  clock.start();

  // ── FBO factory ───────────────────────────────────────────────────────────
  const floatType = /(iPad|iPhone|iPod)/i.test(navigator.userAgent)
    ? THREE.HalfFloatType : THREE.FloatType;

  function makeFBO(w, h) {
    return new THREE.WebGLRenderTarget(w, h, {
      type: floatType, depthBuffer: false, stencilBuffer: false,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping,
    });
  }

  // ── Sim size helpers ──────────────────────────────────────────────────────
  function simSize() {
    return {
      sw: Math.max(1, Math.round(resolution * W)),
      sh: Math.max(1, Math.round(resolution * H)),
    };
  }

  let { sw, sh } = simSize();
  const fboSize   = new THREE.Vector2(sw, sh);
  const cellScale = new THREE.Vector2(1 / sw, 1 / sh);
  const boundary  = new THREE.Vector2();

  // ── FBOs ─────────────────────────────────────────────────────────────────
  let fbo = {
    vel0: makeFBO(sw, sh), vel1: makeFBO(sw, sh),
    vis0: makeFBO(sw, sh), vis1: makeFBO(sw, sh),
    div:  makeFBO(sw, sh), pre0: makeFBO(sw, sh), pre1: makeFBO(sw, sh),
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  function makePass(frag, uniforms, outputFBO) {
    const scene  = new THREE.Scene();
    const camera = new THREE.Camera();
    const mat    = new THREE.RawShaderMaterial({
      vertexShader: GL.faceVert, fragmentShader: frag, uniforms,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
    return {
      scene, camera, uniforms,
      output: outputFBO,
      render(out) {
        renderer.setRenderTarget(out ?? this.output ?? null);
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);
      },
    };
  }

  // ── Build passes ──────────────────────────────────────────────────────────
  // Advection
  const advUni = {
    boundarySpace: { value: cellScale }, px: { value: cellScale },
    fboSize:       { value: fboSize  },
    velocity:      { value: fbo.vel0.texture },
    dt:            { value: dt }, isBFECC: { value: BFECC },
  };
  const advScene  = new THREE.Scene();
  const advCamera = new THREE.Camera();
  const advMat    = new THREE.RawShaderMaterial({ vertexShader: GL.faceVert, fragmentShader: GL.advect, uniforms: advUni });
  advScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), advMat));
  const bdGeo = new THREE.BufferGeometry();
  bdGeo.setAttribute('position', new THREE.BufferAttribute(
    new Float32Array([-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,1,0,1,-1,0,1,-1,0,-1,-1,0]), 3
  ));
  const advLine = new THREE.LineSegments(bdGeo, new THREE.RawShaderMaterial({ vertexShader: GL.lineVert, fragmentShader: GL.advect, uniforms: advUni }));
  advScene.add(advLine);

  // External force
  const efUni = {
    px:     { value: cellScale },
    force:  { value: new THREE.Vector2() },
    center: { value: new THREE.Vector2() },
    scale:  { value: new THREE.Vector2(cursorSize, cursorSize) },
  };
  const efScene  = new THREE.Scene();
  const efCamera = new THREE.Camera();
  const efMesh   = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.RawShaderMaterial({ vertexShader: GL.mouseVert, fragmentShader: GL.extF, blending: THREE.AdditiveBlending, depthWrite: false, uniforms: efUni })
  );
  efScene.add(efMesh);

  // Viscous
  const visUni = {
    boundarySpace: { value: boundary },
    velocity:      { value: fbo.vel1.texture },
    velocity_new:  { value: fbo.vis0.texture },
    v: { value: viscous }, px: { value: cellScale }, dt: { value: dt },
  };
  const visPass = makePass(GL.viscous, visUni, fbo.vis1);

  // Divergence
  const divUni = {
    boundarySpace: { value: boundary },
    velocity:      { value: fbo.vis0.texture },
    px: { value: cellScale }, dt: { value: dt },
  };
  const divPass = makePass(GL.div, divUni, fbo.div);

  // Poisson
  const poisUni = {
    boundarySpace: { value: boundary },
    pressure:   { value: fbo.pre0.texture },
    divergence: { value: fbo.div.texture  },
    px:         { value: cellScale },
  };
  const poisPass = makePass(GL.poisson, poisUni, fbo.pre1);

  // Pressure
  const preUni = {
    boundarySpace: { value: boundary },
    pressure: { value: fbo.pre0.texture },
    velocity: { value: fbo.vis0.texture },
    px: { value: cellScale }, dt: { value: dt },
  };
  const prePass = makePass(GL.pressure, preUni, fbo.vel0);

  // Output (color)
  const outUni = {
    velocity:      { value: fbo.vel0.texture },
    boundarySpace: { value: new THREE.Vector2() },
    palette:       { value: paletteTex },
    bgColor:       { value: bgVec4 },
  };
  const outScene  = new THREE.Scene();
  const outCamera = new THREE.Camera();
  outScene.add(new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.RawShaderMaterial({ vertexShader: GL.faceVert, fragmentShader: GL.color, transparent: true, depthWrite: false, uniforms: outUni })
  ));

  // ── Mouse ─────────────────────────────────────────────────────────────────
  const mouse = {
    coords: new THREE.Vector2(), coords_old: new THREE.Vector2(), diff: new THREE.Vector2(),
    isHoverInside: false, hasUserControl: false, isAutoActive: false,
    autoIntensity, takeoverDuration,
    takeoverActive: false, takeoverStartTime: 0,
    takeoverFrom: new THREE.Vector2(), takeoverTo: new THREE.Vector2(),
    onInteract: null, _timer: null,

    _rect() { return container.getBoundingClientRect(); },
    _inside(x, y) { const r = this._rect(); return r.width > 0 && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; },
    _set(x, y) {
      const r = this._rect(); if (!r.width) return;
      clearTimeout(this._timer);
      this.coords.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height * 2 - 1));
      this._timer = setTimeout(() => {}, 100);
    },
    setNorm(nx, ny) { this.coords.set(nx, ny); },
    _move(e) {
      if (!this._inside(e.clientX, e.clientY)) { this.isHoverInside = false; return; }
      this.isHoverInside = true; this.onInteract?.();
      if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
        const r = this._rect();
        this.takeoverFrom.copy(this.coords);
        this.takeoverTo.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height * 2 - 1));
        this.takeoverStartTime = performance.now(); this.takeoverActive = true;
        this.hasUserControl = true; this.isAutoActive = false; return;
      }
      this._set(e.clientX, e.clientY); this.hasUserControl = true;
    },
    _ts(e) { if (e.touches.length !== 1) return; const t = e.touches[0]; if (!this._inside(t.clientX, t.clientY)) return; this.isHoverInside = true; this.onInteract?.(); this._set(t.clientX, t.clientY); this.hasUserControl = true; },
    _tm(e) { if (e.touches.length !== 1) return; const t = e.touches[0]; if (!this._inside(t.clientX, t.clientY)) return; this.isHoverInside = true; this.onInteract?.(); this._set(t.clientX, t.clientY); },
    update() {
      if (this.takeoverActive) {
        const t = (performance.now() - this.takeoverStartTime) / (this.takeoverDuration * 1000);
        if (t >= 1) { this.takeoverActive = false; this.coords.copy(this.takeoverTo); this.coords_old.copy(this.coords); this.diff.set(0,0); }
        else { const k = t*t*(3-2*t); this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k); }
      }
      this.diff.subVectors(this.coords, this.coords_old);
      this.coords_old.copy(this.coords);
      if (this.coords_old.x === 0 && this.coords_old.y === 0) this.diff.set(0, 0);
      if (this.isAutoActive && !this.takeoverActive) this.diff.multiplyScalar(this.autoIntensity);
    },
  };

  const onMove = mouse._move.bind(mouse);
  const onTS   = mouse._ts.bind(mouse);
  const onTM   = mouse._tm.bind(mouse);
  const onTE   = () => { mouse.isHoverInside = false; };
  const onLeave= () => { mouse.isHoverInside = false; };
  window.addEventListener('mousemove', onMove);
  window.addEventListener('touchstart', onTS, { passive: true });
  window.addEventListener('touchmove',  onTM, { passive: true });
  window.addEventListener('touchend',   onTE);
  document.addEventListener('mouseleave', onLeave);

  // ── AutoDriver ────────────────────────────────────────────────────────────
  let lastInteraction = performance.now();
  mouse.onInteract = () => { lastInteraction = performance.now(); autoDriver.stop(); };

  const autoDriver = {
    enabled: autoDemo, speed: autoSpeed,
    resumeDelay: autoResumeDelay, rampMs: autoRampDuration * 1000,
    active: false, activationTime: 0, lastTime: performance.now(),
    cur: new THREE.Vector2(), tgt: new THREE.Vector2(), _dir: new THREE.Vector2(),
    stop() { this.active = false; mouse.isAutoActive = false; },
    _pick() { const m = 0.2; this.tgt.set((Math.random()*2-1)*(1-m), (Math.random()*2-1)*(1-m)); },
    update() {
      if (!this.enabled) return;
      const now = performance.now();
      if ((now - lastInteraction) < this.resumeDelay || mouse.isHoverInside) { if (this.active) this.stop(); return; }
      if (!this.active) { this.active = true; this.cur.copy(mouse.coords); this.lastTime = this.activationTime = now; this._pick(); }
      mouse.isAutoActive = true;
      const dts = Math.min((now - this.lastTime) / 1000, 0.05); this.lastTime = now;
      const dir = this._dir.subVectors(this.tgt, this.cur);
      const dist = dir.length();
      if (dist < 0.01) { this._pick(); return; }
      dir.normalize();
      const ramp = this.rampMs > 0 ? (() => { const t = Math.min(1,(now-this.activationTime)/this.rampMs); return t*t*(3-2*t); })() : 1;
      this.cur.addScaledVector(dir, Math.min(this.speed * dts * ramp, dist));
      mouse.setNorm(this.cur.x, this.cur.y);
    },
  };
  autoDriver._pick();

  // ── Render loop ───────────────────────────────────────────────────────────
  let raf = null;
  let running = false;

  function renderFrame() {
    if (!running) return;

    autoDriver.update();
    mouse.update();
    clock.getDelta(); // tick

    // boundary
    boundary.copy(isBounce ? new THREE.Vector2() : cellScale);

    // Advection
    advUni.dt.value = dt; advUni.isBFECC.value = BFECC; advLine.visible = isBounce;
    renderer.setRenderTarget(fbo.vel1); renderer.render(advScene, advCamera); renderer.setRenderTarget(null);

    // External force
    const fx = (mouse.diff.x / 2) * mouseForce;
    const fy = (mouse.diff.y / 2) * mouseForce;
    const csx = cursorSize * cellScale.x;
    const csy = cursorSize * cellScale.y;
    efUni.force.value.set(fx, fy);
    efUni.center.value.set(
      Math.min(Math.max(mouse.coords.x, -1 + csx + cellScale.x * 2), 1 - csx - cellScale.x * 2),
      Math.min(Math.max(mouse.coords.y, -1 + csy + cellScale.y * 2), 1 - csy - cellScale.y * 2),
    );
    efUni.scale.value.set(cursorSize, cursorSize);
    renderer.setRenderTarget(fbo.vel1); renderer.render(efScene, efCamera); renderer.setRenderTarget(null);

    // Viscous
    let vel = fbo.vel1;
    if (isViscous) {
      visUni.v.value = viscous; visUni.dt.value = dt;
      const visFBOs = [fbo.vis0, fbo.vis1];
      for (let i = 0; i < iterationsViscous; i++) {
        const [fi, fo] = i % 2 === 0 ? visFBOs : [visFBOs[1], visFBOs[0]];
        visUni.velocity_new.value = fi.texture;
        visPass.render(fo);
        vel = fo;
      }
    }

    // Divergence
    divUni.velocity.value = vel.texture;
    divPass.render(fbo.div);

    // Poisson
    let pressure = fbo.pre0;
    const preFBOs = [fbo.pre0, fbo.pre1];
    for (let i = 0; i < iterationsPoisson; i++) {
      const [pi, po] = i % 2 === 0 ? preFBOs : [preFBOs[1], preFBOs[0]];
      poisUni.pressure.value = pi.texture;
      poisPass.render(po);
      pressure = po;
    }

    // Pressure projection
    preUni.velocity.value = vel.texture;
    preUni.pressure.value = pressure.texture;
    prePass.render(fbo.vel0);

    // Output
    outUni.velocity.value = fbo.vel0.texture;
    renderer.setRenderTarget(null);
    renderer.render(outScene, outCamera);

    raf = requestAnimationFrame(renderFrame);
  }

  function start() { if (running) return; running = true; renderFrame(); }
  function pause() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

  // ── Resize ────────────────────────────────────────────────────────────────
  let resizeRaf = null;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      const r = container.getBoundingClientRect();
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      renderer.setSize(W, H, false);
      const s = simSize();
      sw = s.sw; sh = s.sh;
      fboSize.set(sw, sh); cellScale.set(1/sw, 1/sh);
      Object.values(fbo).forEach(f => f.setSize(sw, sh));
    });
  });
  ro.observe(container);

  // ── Visibility ────────────────────────────────────────────────────────────
  const io = new IntersectionObserver(([e]) => {
    e.isIntersecting && e.intersectionRatio > 0 && !document.hidden ? start() : pause();
  }, { threshold: [0, 0.01] });
  io.observe(container);

  const onVis = () => { document.hidden ? pause() : start(); };
  document.addEventListener('visibilitychange', onVis);

  start();

  // ── Cleanup ───────────────────────────────────────────────────────────────
  return () => {
    pause();
    ro.disconnect(); io.disconnect();
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchstart', onTS);
    window.removeEventListener('touchmove', onTM);
    window.removeEventListener('touchend', onTE);
    document.removeEventListener('mouseleave', onLeave);
    document.removeEventListener('visibilitychange', onVis);
    try {
      renderer.domElement.parentNode?.removeChild(renderer.domElement);
      renderer.dispose();
      renderer.forceContextLoss();
    } catch (_) {}
  };
}