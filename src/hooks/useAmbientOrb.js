import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useAmbientOrb
 * A lightweight ambient fluid orb — green, smaller, drifts on scroll.
 * Designed to float in a random/arbitrary position on the page.
 *
 * @param {object} opts
 * @param {'left'|'right'} opts.side        — which side to anchor
 * @param {string}         opts.topOffset   — CSS top value e.g. '20%'
 * @param {number}         opts.parallaxY   — how many vh to travel (positive = down)
 *
 * @returns {React.RefObject} — attach to an absolutely positioned wrapper div
 */
export function useAmbientOrb({ side = 'right', topOffset = '20%', parallaxY = 28 } = {}) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapRef.current;
    if (!wrapper) return;

    let cleanup = null;
    const boot = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 0 && height > 0) {
        boot.disconnect();
        cleanup = initAmbientFluid(wrapper, { parallaxY });
      }
    });
    boot.observe(wrapper);

    return () => {
      boot.disconnect();
      cleanup?.();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return wrapRef;
}

/* ─────────────────────────────────────────────────────────────────── */

function initAmbientFluid(wrapper, { parallaxY }) {
  const W  = wrapper.offsetWidth;
  const H  = wrapper.offsetHeight;
  const SR = 0.35;
  const sw = Math.max(1, Math.round(W * SR));
  const sh = Math.max(1, Math.round(H * SR));

  // Slightly different green palette — more teal/dark for variety
  const PALETTE = ['#001a0e', '#00994f', '#00cc6f', '#a8ffd4'];

  function makePalette(stops) {
    const data = new Uint8Array(stops.length * 4);
    stops.forEach((hex, i) => {
      const c = new THREE.Color(hex);
      data[i*4]   = Math.round(c.r * 255);
      data[i*4+1] = Math.round(c.g * 255);
      data[i*4+2] = Math.round(c.b * 255);
      data[i*4+3] = 255;
    });
    const t = new THREE.DataTexture(data, stops.length, 1, THREE.RGBAFormat);
    t.magFilter = t.minFilter = THREE.LinearFilter;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  }

  // ── Minimal shaders ───────────────────────────────────────────────────────
  const faceVert = `attribute vec3 position;uniform vec2 boundarySpace;varying vec2 uv;void main(){vec3 p=position;p.xy*=1.0-boundarySpace*2.0;uv=vec2(0.5)+p.xy*0.5;gl_Position=vec4(p,1.0);}`;
  const mouseVert= `attribute vec3 position;attribute vec2 uv;uniform vec2 center;uniform vec2 scale;uniform vec2 px;varying vec2 vUv;void main(){vec2 pos=position.xy*scale*2.0*px+center;vUv=uv;gl_Position=vec4(pos,0.0,1.0);}`;
  const advFrag  = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 fboSize;varying vec2 uv;void main(){vec2 r=max(fboSize.x,fboSize.y)/fboSize;vec2 v=texture2D(velocity,uv).xy;vec2 p=uv-v*dt*r;vec2 n1=texture2D(velocity,p).xy;vec2 p2=p+n1*dt*r;vec2 err=p2-uv;vec2 p3=uv-err*0.5;vec2 v2=texture2D(velocity,p3).xy;gl_FragColor=vec4(texture2D(velocity,p3-v2*dt*r).xy,0,0);}`;
  const colorFrag= `precision highp float;uniform sampler2D velocity;uniform sampler2D palette;varying vec2 uv;void main(){vec2 v=texture2D(velocity,uv).xy;float l=clamp(length(v)*1.6,0.0,1.0);vec3 c=texture2D(palette,vec2(l,0.5)).rgb;gl_FragColor=vec4(c,l*0.85);}`;
  const divFrag  = `precision highp float;uniform sampler2D velocity;uniform float dt;uniform vec2 px;varying vec2 uv;void main(){float x0=texture2D(velocity,uv-vec2(px.x,0)).x;float x1=texture2D(velocity,uv+vec2(px.x,0)).x;float y0=texture2D(velocity,uv-vec2(0,px.y)).y;float y1=texture2D(velocity,uv+vec2(0,px.y)).y;gl_FragColor=vec4((x1-x0+y1-y0)*0.5/dt);}`;
  const forFrag  = `precision highp float;uniform vec2 force;varying vec2 vUv;void main(){vec2 c=(vUv-0.5)*2.0;float d=1.0-min(length(c),1.0);d*=d;gl_FragColor=vec4(force*d,0.0,1.0);}`;
  const poisFrag = `precision highp float;uniform sampler2D pressure;uniform sampler2D divergence;uniform vec2 px;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x*2.0,0)).r;float p1=texture2D(pressure,uv-vec2(px.x*2.0,0)).r;float p2=texture2D(pressure,uv+vec2(0,px.y*2.0)).r;float p3=texture2D(pressure,uv-vec2(0,px.y*2.0)).r;float d=texture2D(divergence,uv).r;gl_FragColor=vec4((p0+p1+p2+p3)*0.25-d);}`;
  const preFrag  = `precision highp float;uniform sampler2D pressure;uniform sampler2D velocity;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){float p0=texture2D(pressure,uv+vec2(px.x,0)).r;float p1=texture2D(pressure,uv-vec2(px.x,0)).r;float p2=texture2D(pressure,uv+vec2(0,px.y)).r;float p3=texture2D(pressure,uv-vec2(0,px.y)).r;vec2 v=texture2D(velocity,uv).xy-vec2(p0-p1,p2-p3)*0.5*dt;gl_FragColor=vec4(v,0,1);}`;
  const viscFrag = `precision highp float;uniform sampler2D velocity;uniform sampler2D velocity_new;uniform float v;uniform vec2 px;uniform float dt;varying vec2 uv;void main(){vec2 o=texture2D(velocity,uv).xy;vec2 n0=texture2D(velocity_new,uv+vec2(px.x*2.0,0)).xy;vec2 n1=texture2D(velocity_new,uv-vec2(px.x*2.0,0)).xy;vec2 n2=texture2D(velocity_new,uv+vec2(0,px.y*2.0)).xy;vec2 n3=texture2D(velocity_new,uv-vec2(0,px.y*2.0)).xy;gl_FragColor=vec4((4.0*o+v*dt*(n0+n1+n2+n3))/(4.0*(1.0+v*dt)),0,0);}`;

  // ── Renderer ──────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  renderer.autoClear = false;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(1);
  renderer.setSize(W, H);
  wrapper.appendChild(renderer.domElement);

  const ft = /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType;
  function fbo() {
    return new THREE.WebGLRenderTarget(sw, sh, {
      type: ft, depthBuffer: false, stencilBuffer: false,
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping, wrapT: THREE.ClampToEdgeWrapping,
    });
  }

  const fbos = {
    vel0: fbo(), vel1: fbo(),
    vis0: fbo(), vis1: fbo(),
    div: fbo(), pre0: fbo(), pre1: fbo(),
  };

  const cell  = new THREE.Vector2(1/sw, 1/sh);
  const fboSz = new THREE.Vector2(sw, sh);
  const bound = new THREE.Vector2();

  function pass(frag, unis, out) {
    const sc = new THREE.Scene(), cam = new THREE.Camera();
    sc.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.RawShaderMaterial({
      vertexShader: faceVert, fragmentShader: frag,
      uniforms: { boundarySpace: { value: bound }, ...unis },
    })));
    return { sc, cam, unis, output: out, run(o) { renderer.setRenderTarget(o ?? this.output ?? null); renderer.render(this.sc, this.cam); renderer.setRenderTarget(null); } };
  }

  const paletteTex = makePalette(PALETTE);
  const DT = 0.014; const VISC = 24; const IV = 20; const IP = 20; const FORCE = 22; const CURSOR = 70;

  const advUni  = { boundarySpace:{value:bound}, px:{value:cell}, fboSize:{value:fboSz}, velocity:{value:fbos.vel0.texture}, dt:{value:DT} };
  const advPass = pass(advFrag, advUni, fbos.vel1);
  const efSc = new THREE.Scene(), efCam = new THREE.Camera();
  const efUni = { px:{value:cell}, force:{value:new THREE.Vector2()}, center:{value:new THREE.Vector2()}, scale:{value:new THREE.Vector2(CURSOR,CURSOR)} };
  efSc.add(new THREE.Mesh(new THREE.PlaneGeometry(1,1), new THREE.RawShaderMaterial({ vertexShader:mouseVert, fragmentShader:forFrag, blending:THREE.AdditiveBlending, depthWrite:false, uniforms:efUni })));
  const visUni  = { boundarySpace:{value:bound}, velocity:{value:fbos.vel1.texture}, velocity_new:{value:fbos.vis0.texture}, v:{value:VISC}, px:{value:cell}, dt:{value:DT} };
  const visPass = pass(viscFrag, visUni, fbos.vis1);
  const divUni  = { boundarySpace:{value:bound}, velocity:{value:fbos.vis0.texture}, px:{value:cell}, dt:{value:DT} };
  const divPass = pass(divFrag, divUni, fbos.div);
  const poisUni = { boundarySpace:{value:bound}, pressure:{value:fbos.pre0.texture}, divergence:{value:fbos.div.texture}, px:{value:cell} };
  const poisPass= pass(poisFrag, poisUni, fbos.pre1);
  const preUni  = { boundarySpace:{value:bound}, pressure:{value:fbos.pre0.texture}, velocity:{value:fbos.vis0.texture}, px:{value:cell}, dt:{value:DT} };
  const prePass = pass(preFrag, preUni, fbos.vel0);
  const outSc = new THREE.Scene(), outCam = new THREE.Camera();
  const outUni = { velocity:{value:fbos.vel0.texture}, boundarySpace:{value:new THREE.Vector2()}, palette:{value:paletteTex} };
  outSc.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.RawShaderMaterial({ vertexShader:faceVert, fragmentShader:colorFrag, transparent:true, depthWrite:false, uniforms:outUni })));

  // ── Auto-swirl — slower, more meditative than the main orb ───────────────
  const autoPos = new THREE.Vector2(), autoPrev = new THREE.Vector2(), autoDiff = new THREE.Vector2();
  let autoT = Math.random() * Math.PI * 2; // random phase so it differs from main orb

  function autoStep(dt) {
    autoT += dt * 0.22;
    autoPos.set(
      Math.sin(autoT * 1.3) * 0.6 + Math.cos(autoT * 0.7) * 0.2,
      Math.cos(autoT * 0.9) * 0.6 + Math.sin(autoT * 1.7) * 0.2,
    );
    autoDiff.subVectors(autoPos, autoPrev);
    autoPrev.copy(autoPos);
  }

  // ── GSAP parallax ─────────────────────────────────────────────────────────
  const gsapCtx = gsap.context(() => {
    gsap.fromTo(wrapper,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: wrapper, start: 'top 95%', toggleActions: 'play none none none' } }
    );
    gsap.to(wrapper, {
      y: `${parallaxY}vh`,
      ease: 'none',
      scrollTrigger: {
        trigger: wrapper.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });
  });

  // ── Loop ──────────────────────────────────────────────────────────────────
  let raf = null, running = false, lastTime = performance.now();

  function tick() {
    if (!running) return;
    const now = performance.now();
    const dt  = Math.min((now - lastTime) / 1000, 0.05);
    lastTime  = now;
    autoStep(dt);
    bound.copy(cell);
    advUni.dt.value = DT;
    advPass.run(fbos.vel1);
    efUni.force.value.set(autoDiff.x * FORCE * 0.5, autoDiff.y * FORCE * 0.5);
    efUni.center.value.set(
      Math.min(Math.max(autoPos.x, -1 + CURSOR*cell.x + cell.x*2), 1 - CURSOR*cell.x - cell.x*2),
      Math.min(Math.max(autoPos.y, -1 + CURSOR*cell.y + cell.y*2), 1 - CURSOR*cell.y - cell.y*2),
    );
    renderer.setRenderTarget(fbos.vel1); renderer.render(efSc, efCam); renderer.setRenderTarget(null);
    visUni.v.value = VISC; visUni.dt.value = DT;
    let vel = fbos.vel1;
    const vf = [fbos.vis0, fbos.vis1];
    for (let i = 0; i < IV; i++) { const [fi, fo] = i%2===0 ? vf : [vf[1],vf[0]]; visUni.velocity_new.value=fi.texture; visPass.run(fo); vel=fo; }
    divUni.velocity.value = vel.texture; divPass.run(fbos.div);
    let pressure = fbos.pre0;
    const pf = [fbos.pre0, fbos.pre1];
    for (let i = 0; i < IP; i++) { const [pi, po] = i%2===0 ? pf : [pf[1],pf[0]]; poisUni.pressure.value=pi.texture; poisPass.run(po); pressure=po; }
    preUni.velocity.value=vel.texture; preUni.pressure.value=pressure.texture; prePass.run(fbos.vel0);
    outUni.velocity.value=fbos.vel0.texture;
    renderer.setRenderTarget(null); renderer.render(outSc, outCam);
    raf = requestAnimationFrame(tick);
  }

  function start() { if (running) return; running=true; lastTime=performance.now(); tick(); }
  function stop()  { running=false; if (raf) { cancelAnimationFrame(raf); raf=null; } }

  const io = new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop(); }, { threshold: 0.01 });
  io.observe(wrapper);
  const onVis = () => { document.hidden ? stop() : start(); };
  document.addEventListener('visibilitychange', onVis);
  start();

  return () => {
    stop(); io.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    gsapCtx.revert();
    try { wrapper.removeChild(renderer.domElement); renderer.dispose(); renderer.forceContextLoss(); } catch(_) {}
  };
}