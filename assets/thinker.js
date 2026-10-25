/* LeoAnalyst — clay "thinker" character (three.js r160, global THREE).
   window.LeoThinker.mount(canvas, {reduced}) -> {look(clientX, clientY), focus(el|null), render()} */
(function () {
  'use strict';
  const T = window.THREE;

  function mat(color, opts) {
    return new T.MeshPhysicalMaterial(Object.assign({
      color, roughness: 0.82, metalness: 0, sheen: 0.6, sheenRoughness: 0.8, sheenColor: new T.Color('#ffffff'),
      clearcoat: 0.06, clearcoatRoughness: 0.7
    }, opts || {}));
  }

  function knitTexture() {
    const c = document.createElement('canvas'); c.width = 256; c.height = 64;
    const g = c.getContext('2d'); g.fillStyle = '#808080'; g.fillRect(0, 0, 256, 64);
    for (let x = 0; x < 256; x += 8) {
      const grd = g.createLinearGradient(x, 0, x + 8, 0);
      grd.addColorStop(0, '#5a5a5a'); grd.addColorStop(.5, '#d0d0d0'); grd.addColorStop(1, '#5a5a5a');
      g.fillStyle = grd; g.fillRect(x, 0, 8, 64);
    }
    const t = new T.CanvasTexture(c); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(6, 2);
    return t;
  }

  function screenTexture() {
    const c = document.createElement('canvas'); c.width = 512; c.height = 360;
    const g = c.getContext('2d');
    g.fillStyle = '#141826'; g.fillRect(0, 0, 512, 360);
    // header
    g.fillStyle = '#2a3045'; roundRect(g, 26, 24, 150, 18, 9); g.fill();
    g.fillStyle = '#84F0E0'; roundRect(g, 420, 22, 66, 22, 11); g.fill();
    // kpi tiles
    const kc = ['#84F0E0', '#9fb7ff', '#ffb58a'];
    for (let i = 0; i < 3; i++) {
      g.fillStyle = '#1f2436'; roundRect(g, 26 + i * 158, 62, 144, 74, 14); g.fill();
      g.fillStyle = kc[i]; roundRect(g, 42 + i * 158, 80, 70, 14, 7); g.fill();
      g.fillStyle = '#3a4158'; roundRect(g, 42 + i * 158, 104, 96, 10, 5); g.fill();
    }
    // bars
    g.fillStyle = '#1f2436'; roundRect(g, 26, 150, 460, 186, 16); g.fill();
    const h = [52, 78, 64, 98, 86, 120, 108, 140];
    h.forEach((v, i) => {
      g.fillStyle = i === h.length - 1 ? '#84F0E0' : '#4a5a8a';
      roundRect(g, 52 + i * 52, 316 - v, 28, v, 7); g.fill();
    });
    g.strokeStyle = '#ffb58a'; g.lineWidth = 5; g.lineJoin = 'round'; g.beginPath();
    h.forEach((v, i) => { const x = 66 + i * 52, y = 296 - v * 1.05; i ? g.lineTo(x, y) : g.moveTo(x, y); });
    g.stroke();
    const t = new T.CanvasTexture(c); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  function roundedSlab(w, h, d, r) {
    const s = new T.Shape(); const x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    const geo = new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: true, bevelThickness: d * .35, bevelSize: d * .35, bevelSegments: 4, curveSegments: 10 });
    geo.translate(0, 0, -d / 2); return geo;
  }

  function limb(a, b, r, material) {
    const len = a.distanceTo(b);
    const m = new T.Mesh(new T.CapsuleGeometry(r, len, 8, 20), material);
    m.position.copy(a).add(b).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), b.clone().sub(a).normalize());
    m.castShadow = m.receiveShadow = true; return m;
  }

  function sp(r, material, x, y, z, sx, sy, sz) {
    const m = new T.Mesh(new T.SphereGeometry(r, 40, 32), material);
    m.position.set(x || 0, y || 0, z || 0); m.scale.set(sx || 1, sy || 1, sz || 1);
    m.castShadow = m.receiveShadow = true; return m;
  }

  function build() {
    const C = {
      skin: mat('#f3c5a2'), skinDeep: mat('#e9ad88'), hoodie: mat('#f1e7d6'), hoodieShade: mat('#e4d6c0'),
      beanie: mat('#b9835a', { bumpMap: knitTexture(), bumpScale: 2.2 }), hair: mat('#6b4632'),
      eye: new T.MeshStandardMaterial({ color: '#1d1a1f', roughness: .25 }), white: new T.MeshStandardMaterial({ color: '#ffffff', roughness: .3 }),
      brow: mat('#5a3a29'), cheek: new T.MeshStandardMaterial({ color: '#f39a8d', roughness: .9, transparent: true, opacity: .55 }),
      mouth: mat('#7a3b33'), cup: mat('#fbf8f2'), sleeve: mat('#c99a6b'), lid: mat('#ece6dc'),
      tablet: mat('#2b2f3a', { roughness: .5 }), string: mat('#d9cab2')
    };
    const root = new T.Group();

    // torso (hoodie)
    const torsoPts = [];
    [[0, -2.6], [1.32, -2.6], [1.38, -1.6], [1.33, -.6], [1.14, .1], [.78, .48], [.32, .62], [0, .64]].forEach(p => torsoPts.push(new T.Vector2(p[0], p[1])));
    const torsoGeo = new T.LatheGeometry(new T.SplineCurve(torsoPts).getPoints(40), 64);
    const torso = new T.Mesh(torsoGeo, C.hoodie); torso.scale.set(1, 1, .74); torso.castShadow = torso.receiveShadow = true;
    const body = new T.Group(); body.add(torso); root.add(body);
    // hood around the neck
    const hood = new T.Mesh(new T.TorusGeometry(.62, .25, 24, 48), C.hoodieShade);
    hood.rotation.x = Math.PI / 2 + .25; hood.position.set(0, .56, -.12); hood.scale.set(1.12, 1, .9); hood.castShadow = hood.receiveShadow = true; body.add(hood);
    // pocket seam & strings
    [-.17, .17].forEach(x => {
      body.add(limb(new T.Vector3(x, .42, .6), new T.Vector3(x * 1.25, -.28, .78), .028, C.string));
      body.add(sp(.05, C.string, x * 1.25, -.33, .79));
    });
    // neck
    const neck = new T.Mesh(new T.CylinderGeometry(.3, .34, .42, 24), C.skin); neck.position.y = .74; body.add(neck);

    // head
    const head = new T.Group(); head.position.set(0, 1.74, 0); root.add(head);
    head.add(sp(1, C.skin, 0, 0, 0, 1.02, .97, .93));
    head.add(sp(.2, C.skin, -.98, -.08, -.02, .6, 1, .9)); head.add(sp(.2, C.skin, .98, -.08, -.02, .6, 1, .9));
    head.add(sp(.12, C.skinDeep, 0, -.12, .92, 1.1, .9, .8));
    head.add(sp(.15, C.cheek, -.48, -.3, .78, 1.2, .7, .5)); head.add(sp(.15, C.cheek, .48, -.3, .78, 1.2, .7, .5));
    const smile = new T.Mesh(new T.TorusGeometry(.14, .028, 10, 28, Math.PI), C.mouth);
    smile.rotation.z = Math.PI; smile.position.set(0, -.38, .86); smile.rotation.x = -.35; head.add(smile);
    // eyes
    const eyes = new T.Group(); head.add(eyes);
    const eyeL = new T.Group(), eyeR = new T.Group();
    [[eyeL, -.33], [eyeR, .33]].forEach(([g, x]) => {
      g.position.set(x, -.04, .87); g.add(sp(.115, C.eye, 0, 0, 0, .9, 1.15, .6)); g.add(sp(.032, C.white, .03, .045, .06)); eyes.add(g);
    });
    // brows
    const browL = limb(new T.Vector3(-.47, .2, .85), new T.Vector3(-.22, .24, .9), .032, C.brow);
    const browR = limb(new T.Vector3(.22, .24, .9), new T.Vector3(.47, .2, .85), .032, C.brow);
    head.add(browL, browR);
    // hair peeking out
    [[-.5, .36, .78, .2], [-.2, .42, .86, .17], [.42, .38, .8, .19], [-.82, .28, .45, .17], [.82, .28, .45, .17]].forEach(h => head.add(sp(h[3], C.hair, h[0], h[1], h[2], 1.1, .8, .8)));
    // beanie
    const beanie = new T.Group(); beanie.position.set(0, .46, -.04); beanie.rotation.x = -.16; head.add(beanie);
    const dome = new T.Mesh(new T.SphereGeometry(1.06, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2), C.beanie);
    dome.scale.set(1, 1.08, .98); dome.position.y = .14; dome.castShadow = true; beanie.add(dome);
    const cuff = new T.Mesh(new T.CylinderGeometry(1.1, 1.12, .42, 56, 1, true), C.beanie); cuff.position.y = .02; cuff.castShadow = true; beanie.add(cuff);
    const cuffRoll = new T.Mesh(new T.TorusGeometry(1.1, .09, 16, 64), C.beanie); cuffRoll.rotation.x = Math.PI / 2; cuffRoll.position.y = -.18; beanie.add(cuffRoll);
    const top = new T.Mesh(new T.TorusGeometry(1.06, .06, 12, 64), C.beanie); top.rotation.x = Math.PI / 2; top.position.y = .22; beanie.add(top);
    // little tab on the cuff
    const tab = new T.Mesh(new T.BoxGeometry(.24, .14, .04), mat('#3a3f4c')); tab.position.set(.42, .0, 1.04); tab.rotation.y = .38; beanie.add(tab);

    // arms: left (viewer right) holds the tablet, right holds the cup
    const shoulderL = new T.Vector3(1.12, .05, 0), elbowL = new T.Vector3(1.32, -1.15, .3), handL = new T.Vector3(.52, -.78, 1.15);
    body.add(limb(shoulderL, elbowL, .3, C.hoodie)); body.add(limb(elbowL, handL, .27, C.hoodie));
    body.add(sp(.2, C.skin, handL.x - .06, handL.y + .05, handL.z + .1));
    const shoulderR = new T.Vector3(-1.12, .05, 0), elbowR = new T.Vector3(-1.38, -1.05, .4), handR = new T.Vector3(-.92, -.16, 1.0);
    body.add(limb(shoulderR, elbowR, .3, C.hoodie)); body.add(limb(elbowR, handR, .27, C.hoodie));
    body.add(sp(.21, C.skin, handR.x + .06, handR.y + .02, handR.z + .16));

    // tablet
    const tablet = new T.Group(); tablet.position.set(.08, -.86, 1.28); tablet.rotation.set(-.32, .22, -.1); body.add(tablet);
    const slab = new T.Mesh(roundedSlab(1.5, 1.08, .05, .1), C.tablet); slab.castShadow = true; tablet.add(slab);
    const screen = new T.Mesh(new T.PlaneGeometry(1.36, .95), new T.MeshBasicMaterial({ map: screenTexture(), toneMapped: false }));
    screen.position.z = .055; tablet.add(screen);
    // thumbs over the tablet edge
    tablet.add(sp(.09, C.skin, .58, .12, .08, 1, 1.3, .7));

    // coffee cup
    const cup = new T.Group(); cup.position.set(-.86, .28, 1.2); cup.rotation.set(.08, 0, .1); body.add(cup);
    const cupBody = new T.Mesh(new T.CylinderGeometry(.24, .18, .62, 36), C.cup); cupBody.castShadow = true; cup.add(cupBody);
    const sleeve = new T.Mesh(new T.CylinderGeometry(.232, .205, .24, 36), C.sleeve); sleeve.position.y = -.02; cup.add(sleeve);
    const lid = new T.Mesh(new T.CylinderGeometry(.25, .26, .08, 36), C.lid); lid.position.y = .34; cup.add(lid);
    const lidTop = new T.Mesh(new T.CylinderGeometry(.2, .25, .07, 36), C.lid); lidTop.position.y = .41; cup.add(lidTop);
    // fingers wrapped around the cup
    [-.09, .02, .13].forEach((y, i) => cup.add(sp(.075, C.skin, .08, y - .12, .22, 1.3, .8, .8)));

    root.position.y = -.35;
    return { root, body, head, eyes, eyeL, eyeR, browL, browR, cup };
  }

  function mount(canvas, opts) {
    opts = opts || {};
    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace; renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(26, 1, .1, 60);
    camera.position.set(0, .9, 13.5); camera.lookAt(0, .55, 0);

    scene.add(new T.HemisphereLight('#ffffff', '#e8d9c6', 1.35));
    const key = new T.DirectionalLight('#fff4e6', 2.1); key.position.set(-4, 6, 7); key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024); key.shadow.camera.left = -4; key.shadow.camera.right = 4; key.shadow.camera.top = 5; key.shadow.camera.bottom = -4;
    key.shadow.radius = 6; key.shadow.bias = -.0006; key.shadow.normalBias = .02; scene.add(key);
    const rim = new T.DirectionalLight('#cfe3ff', 1.1); rim.position.set(5, 3, -4); scene.add(rim);
    const fill = new T.DirectionalLight('#ffe9d6', .45); fill.position.set(4, -1, 6); scene.add(fill);

    const R = build(); scene.add(R.root);

    const target = { x: 0, y: 0, brow: 0 }, cur = { x: 0, y: 0, brow: 0 };
    let focusEl = null, running = false, raf = 0, t0 = performance.now(), nextBlink = 2.2, blinkT = -1;
    const reduced = !!opts.reduced;

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
      renderer.setSize(w, h, false); camera.aspect = w / h;
      // keep the whole figure in frame on narrow canvases
      camera.position.z = w / h < .78 ? 13.5 * (.78 / (w / h)) * .92 : 13.5;
      camera.updateProjectionMatrix();
    }
    function headScreen() {
      const r = canvas.getBoundingClientRect();
      const v = new T.Vector3(); R.head.getWorldPosition(v); v.project(camera);
      return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
    }
    function look(cx, cy) {
      if (focusEl) return;
      aim(cx, cy, 0);
    }
    function aim(cx, cy, brow) {
      const h = headScreen();
      const dx = (cx - h.x) / Math.max(innerWidth * .4, 300), dy = (cy - h.y) / Math.max(innerHeight * .5, 320);
      target.x = Math.max(-1, Math.min(1, dx)); target.y = Math.max(-1, Math.min(1, dy)); target.brow = brow;
      if (reduced) render();
    }
    function focus(el) {
      focusEl = el || null;
      if (el) { const r = el.getBoundingClientRect(); aim(r.left + r.width / 2, r.top + r.height / 2, 1); }
      else { target.brow = 0; }
    }
    function step(now) {
      const t = (now - t0) / 1000;
      const k = reduced ? 1 : .085;
      cur.x += (target.x - cur.x) * k; cur.y += (target.y - cur.y) * k; cur.brow += (target.brow - cur.brow) * k;
      R.head.rotation.y = cur.x * .7; R.head.rotation.x = cur.y * .32; R.head.rotation.z = -cur.x * .06;
      R.body.rotation.y = cur.x * .16;
      R.eyes.position.x = cur.x * .07; R.eyes.position.y = -cur.y * .05;
      R.browL.position.y = cur.brow * .07; R.browR.position.y = cur.brow * .07;
      if (!reduced) {
        R.root.position.y = -.35 + Math.sin(t * 1.6) * .025;
        R.body.scale.set(1, 1 + Math.sin(t * 1.6) * .006, 1);
        R.cup.rotation.z = .1 + Math.sin(t * .9) * .02;
        if (t > nextBlink && blinkT < 0) blinkT = t;
        if (blinkT >= 0) {
          const p = (t - blinkT) / .16; const s = p < 1 ? Math.max(.08, Math.abs(1 - p * 2)) : 1;
          R.eyeL.scale.y = R.eyeR.scale.y = s;
          if (p >= 1) { blinkT = -1; nextBlink = t + 2.4 + Math.random() * 3; }
        }
      }
      renderer.render(scene, camera);
    }
    function loop(now) { step(now); raf = running ? requestAnimationFrame(loop) : 0; }
    function render() { step(performance.now()); }
    function start() { if (reduced) { render(); return; } if (!running) { running = true; raf = requestAnimationFrame(loop); } }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

    resize(); render();
    new ResizeObserver(() => { resize(); render(); }).observe(canvas);
    return { look, focus, start, stop, render };
  }

  window.LeoThinker = { mount };
})();
