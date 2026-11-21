/*__CHUNK8__*/
/* ============================== camera presets ============================== */
const VIEWS=[
  {id:'hero',    name:'Steamer deck',    pos:[-2,12.5,-196],  tgt:[10,62,470]},
  {id:'tajBank', name:'Taj, far bank',   pos:[152,22,660],    tgt:[152,58,470]},
  {id:'tajGate', name:'Garden, from gate', pos:[152,30,352],  tgt:[152,50,540]},
  {id:'inAerial',name:'India aerial',    pos:[-250,430,1700], tgt:[420,10,1100]},
  {id:'deAerial',name:'Germany aerial',  pos:[700,420,1500],  tgt:[-330,30,760]},
  {id:'gates',   name:'Harbour gates',   pos:[6,120,-430],    tgt:[4,20,140]},
  {id:'valley',  name:'Whole valley',    pos:[-1450,1450,-820], tgt:[-80,40,1500]},
];
const PAIRS=[
  {id:'domes',   name:'Domes',      pos:[-40,300,120],  tgt:[-46,70,556]},
  {id:'towers',  name:'Towers',     pos:[70,60,-230],   tgt:[60,70,540]},
  {id:'gatesP',  name:'Gates',      pos:[0,170,-320],   tgt:[0,35,320]},
  {id:'hills',   name:'Hilltop palaces', pos:[220,680,-420], tgt:[0,10,1500]},
  {id:'lattice', name:'Latticed façades', pos:[150,320,300], tgt:[140,55,1500]},
  {id:'modern',  name:'Modern icons', pos:[210,230,-600], tgt:[220,50,900]},
];
let tween=null;
function goTo(pos,tgt,dur){
  tween={p0:camera.position.clone(), t0:controls.target.clone(),
         p1:V3(pos[0],pos[1],pos[2]), t1:V3(tgt[0],tgt[1],tgt[2]),
         k:0, dur:dur||1.7};
  state.sail=false;
  el('btnSail').classList.remove('on');
}
function stepTween(dt){
  if(!tween) return;
  tween.k=Math.min(1,tween.k+dt/tween.dur);
  const e=tween.k<0.5 ? 4*tween.k*tween.k*tween.k : 1-Math.pow(-2*tween.k+2,3)/2;
  camera.position.lerpVectors(tween.p0,tween.p1,e);
  controls.target.lerpVectors(tween.t0,tween.t1,e);
  if(tween.k>=1) tween=null;
}
const HERO={pos:[-2,12.5,-196], tgt:[10,62,470]};

/* ============================== river sail path ============================== */
const SAIL=(()=>{
  const pts=[];
  const add=(poly,lane,lift,from,to)=>{
    for(let i=from;i<=to;i++){
      const [x,z]=poly[i];
      pts.push(V3(x+lane, lift, z));
    }
  };
  /* up the Indian arm and back, then up the German arm — one continuous voyage */
  const rev=R_INDIAN.slice().reverse();
  add(rev,-16,26,0,3);
  add(rev,16,24,3,1);
  add(R_SHARED,-14,30,1,R_SHARED.length-1);
  const vals=[];
  for(let i=0;i<pts.length;i++) vals.push(pts[i]);
  const curve=new THREE.CatmullRomCurve3(vals,false,'catmullrom',0.25);
  return {curve, len:curve.getLength()};
})();
const sailLook=new THREE.Vector3();
function updateSail(dt){
  if(!state.sail) return;
  if(state.sailPlay) state.sailT=(state.sailT+dt*0.010)%1;
  const u=clamp(state.sailT,0.001,0.999);
  sailLook.copy(SAIL.curve.getPointAt(u));
  const ahead=SAIL.curve.getPointAt(Math.min(0.999,u+0.02));
  camera.position.copy(sailLook);
  controls.target.copy(ahead).setY(ahead.y+16);
  const rng=el('sailRange');
  if(rng && document.activeElement!==rng) rng.value=String(Math.round(state.sailT*1000));
}
/* ============================== light modes ============================== */
const LIGHT_MODES=[
  { name:'golden',
    sun:0xffd0a0, sunI:4.3, sunDir:V3(-0.70,0.315,0.36),
    skyTop:0x4b86c8, skyHor:0xf6ddb4, fog:0xe6d2b0, fogDen:0.00019,
    hemiSky:0x9dbde0, hemiGround:0x6a5636, hemiI:0.30, ambI:0.08, exp:1.04,
    waterDeep:0x2e5d6e, waterSky:0x9fc2e0, bloom:0.55, lamps:0, windows:0, bulbs:0, night:0 },
  { name:'dawn',
    sun:0xffe8d2, sunI:2.2, sunDir:V3(0.62,0.10,-0.28),
    skyTop:0x9fc0d8, skyHor:0xf3d9cd, fog:0xe9dcd6, fogDen:0.00034,
    hemiSky:0xc8d8e6, hemiGround:0x7a6a58, hemiI:0.55, ambI:0.16, exp:1.0,
    waterDeep:0x4a6f7c, waterSky:0xc9d8e2, bloom:0.40, lamps:0, windows:0, bulbs:0, night:0 },
  { name:'moon',
    sun:0xa9c0e8, sunI:0.85, sunDir:V3(0.36,0.42,-0.55),
    skyTop:0x11203c, skyHor:0x2b3f5e, fog:0x2c3c56, fogDen:0.00026,
    hemiSky:0x33486a, hemiGround:0x1b2230, hemiI:0.42, ambI:0.12, exp:1.16,
    waterDeep:0x142433, waterSky:0x3b567a, bloom:0.9, lamps:1, windows:1, bulbs:0, night:1 },
  { name:'festival',
    sun:0xff9d63, sunI:2.1, sunDir:V3(-0.62,0.13,0.30),
    skyTop:0x3b4f7e, skyHor:0xe9a173, fog:0xd9a582, fogDen:0.00023,
    hemiSky:0x7a8cb0, hemiGround:0x6a4426, hemiI:0.40, ambI:0.14, exp:1.10,
    waterDeep:0x274457, waterSky:0xa9869a, bloom:1.15, lamps:1, windows:1, bulbs:1, night:1 },
];
function applyLight(i){
  state.light=i;
  const m=LIGHT_MODES[i];
  sun.color.setHex(m.sun); sun.intensity=m.sunI;
  SUN_DIR.copy(m.sunDir).normalize();
  skyUni.uTop.value.setHex(m.skyTop); skyUni.uHor.value.setHex(m.skyHor);
  skyUni.uSunDir.value.copy(SUN_DIR); skyUni.uSunCol.value.setHex(m.sun);
  skyUni.uNight.value=m.night;
  scene.fog.color.setHex(m.fog); scene.fog.density=m.fogDen;
  hemi.color.setHex(m.hemiSky); hemi.groundColor.setHex(m.hemiGround); hemi.intensity=m.hemiI;
  amb.intensity=m.ambI;
  renderer.toneMappingExposure=m.exp;
  waterUni.uDeep.value.setHex(m.waterDeep); waterUni.uSky.value.setHex(m.waterSky);
  waterUni.uSunDir.value.copy(SUN_DIR); waterUni.uSunCol.value.setHex(m.sun);
  waterUni.uFogCol.value.setHex(m.fog); waterUni.uFogDen.value=m.fogDen;
  bloomPass.strength=m.bloom;
  M.windowLit.color.setHex(m.windows?0xffc36a:0x2a3542);
  M.bulb.color.setHex(m.bulbs?0xffd98f:0x6b5a3a);
  M.lampWarm.color.setHex(m.lamps?0xffc978:0xb9a684);
  /* mist thickens at dawn, thins at night */
  for(const mi of mists) mi.m.material.opacity = (i===1?0.11:i===2?0.03:i===3?0.05:0.045);
  for(const b of ANIM.boats){ if(b.wake) b.wake.material.color.setHex(i>=2?0xbfd4f0:0xf4f8ff); }
  /* Taj colour shift: pearl-pink at dawn, white at noon, gold at sunset, blue-silver at night */
  const tajTip=[[0xfff2e4,0xffe8c8],[0xffe4da,0xf7e2d2],[0xc9d6ee,0xbcd0ee],[0xffd8a4,0xffcaa0],[0xffc892,0xffb489]][i];
  M.marble.color.setHex(i===3?0xfff4e2:(i===1?0xf0e6de:(i===2?0xbfcbe0:0xf6f2ea)));
  if(M.marbleInlay) M.marbleInlay.color.setHex(tajTip[0]);
  M.marbleSoft.color.setHex(i===2?0xa9b8d2:(i===1?0xe6dcd2:0xece5d8));
  M.gold.color.setHex(i===2?0xb9b06a:0xd9a83e);
  M.gold.envMapIntensity = i===2?1.9:1.3;
  document.getElementById('lightRow').querySelectorAll('button').forEach((b,k)=>b.classList.toggle('on',k===i));
}
/* ============================== quality & density ============================== */
const QUALITY={
  2:{px:2, shadow:2048, mist:true, veg:1.0, ornament:3},
  1:{px:1.35, shadow:1024, mist:false, veg:0.62, ornament:2},
  0:{px:1.0, shadow:0, mist:false, veg:0.38, ornament:1},
};
function applyQuality(q){
  state.quality=q;
  const Q=QUALITY[q];
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, Q.px));
  composer.setPixelRatio(Math.min(window.devicePixelRatio||1, Q.px));
  sun.castShadow = Q.shadow>0;
  if(Q.shadow>0){
    sun.shadow.mapSize.set(Q.shadow,Q.shadow);
    if(sun.shadow.map){ sun.shadow.map.dispose(); sun.shadow.map=null; }
  }
  mistGroup.visible=Q.mist;
  if(VEG) for(const v of VEG){
    if(!v.total) continue;
    const keep=Math.max(24,Math.floor(v.total*Q.veg));
    v.inst.count=keep; v.im.count=keep;
  }
  for(const rec of MONS){
    for(const o of rec.ornament){ if(o.tier) o.obj.visible = (q>=2) || o.tier<=Q.ornament; }
  }
  el('qRow').querySelectorAll('button').forEach(b=>b.classList.toggle('on',+b.dataset.q===q));
  renderer.shadowMap.needsUpdate=true;
}
let VEG=null;
function applyDensity(d){
  state.density=d;
  el('dRow').querySelectorAll('button').forEach(b=>b.classList.toggle('on',Math.abs(+b.dataset.d-d)<0.01));
  for(const v of ANIM.vehicles) v.obj=null;
}
/* ============================== UI wiring ============================== */
function buildUI(){
  const pr=el('presetRow');
  for(const v of VIEWS){
    const b=document.createElement('button');
    b.textContent=v.name;
    b.onclick=()=>{ goTo(v.pos,v.tgt); sb(); };
    pr.appendChild(b);
  }
  const pp=el('pairRow');
  for(const p of PAIRS){
    const b=document.createElement('button');
    b.textContent=p.name;
    b.onclick=()=>{ goTo(p.pos,p.tgt); sb(); };
    pp.appendChild(b);
  }
  el('lightRow').querySelectorAll('button').forEach(b=>{ b.onclick=()=>applyLight(+b.dataset.l); });
  el('qRow').querySelectorAll('button').forEach(b=>{ b.onclick=()=>applyQuality(+b.dataset.q); });
  el('dRow').querySelectorAll('button').forEach(b=>{ b.onclick=()=>applyDensity(+b.dataset.d); });
  el('btnReset').onclick=()=>{ goTo(HERO.pos,HERO.tgt); state.sail=false; el('btnSail').classList.remove('on'); sb(); };
  el('btnPhoto').onclick=()=>{ state.photo=!state.photo; document.body.classList.toggle('photo',state.photo); };
  el('btnCol').onclick=()=>{ el('panel').classList.toggle('min'); };
  el('btnSail').onclick=()=>{
    state.sail=true; state.sailPlay=true; state.sailT=0;
    el('btnSail').classList.add('on'); tween=null; sb();
  };
  el('btnSailPlay').onclick=()=>{ state.sailPlay=!state.sailPlay; el('btnSailPlay').classList.toggle('on',!state.sailPlay); };
  el('sailRange').oninput=e=>{ state.sail=true; state.sailT=+e.target.value/1000; el('btnSail').classList.add('on'); };
  el('btnSailExit').onclick=()=>{ state.sail=false; el('btnSail').classList.remove('on'); };
  /* free orbit cancels the sail */
  const cancelSail=()=>{ if(state.sail){ state.sail=false; el('btnSail').classList.remove('on'); } if(tween) tween=null; };
  renderer.domElement.addEventListener('pointerdown',cancelSail);
  renderer.domElement.addEventListener('wheel',cancelSail,{passive:true});
  window.addEventListener('keydown',e=>{
    if(e.key>='1'&&e.key<='4') applyLight(+e.key-1);
    else if(e.key==='h'||e.key==='H'){ state.photo=!state.photo; document.body.classList.toggle('photo',state.photo); }
    else if(e.key==='r'||e.key==='R'){ goTo(HERO.pos,HERO.tgt); }
    else if(e.code==='Space'){ e.preventDefault(); if(!state.sail){ state.sail=true; state.sailPlay=true; } else state.sailPlay=!state.sailPlay; el('btnSail').classList.toggle('on',state.sail); }
  });
  window.addEventListener('resize',()=>{
    camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    composer.setSize(window.innerWidth,window.innerHeight);
    bloomPass.setSize(window.innerWidth,window.innerHeight);
  });
}
let sbT=0;
function sb(){ /* tiny screen transition: exposure dip */ sbT=0.45; }
buildUI();
applyLight(0);
//__CHUNK9__
