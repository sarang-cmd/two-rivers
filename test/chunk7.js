/*__CHUNK7__*/
/* ============================== river courses for vessels ============================== */
function riverCurve(poly, lane, lift){
  const pts=[];
  for(let i=0;i<poly.length;i++){
    const [x,z]=poly[i];
    const prev=poly[Math.max(0,i-1)], next=poly[Math.min(poly.length-1,i+1)];
    const dx=next[0]-prev[0], dz=next[1]-prev[1], len=Math.hypot(dx,dz)||1;
    pts.push(V3(x - dz/len*lane, 0.6+(lift||0), z + dx/len*lane));
  }
  const c=new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  return c;
}
const COURSES={
  inN: riverCurve(R_INDIAN, 12), inS: riverCurve(R_INDIAN, -12),
  deN: riverCurve(R_GERMAN, 11), deS: riverCurve(R_GERMAN, -11),
  shW: riverCurve(R_SHARED, 16), shE: riverCurve(R_SHARED, -16),
};

/* ============================== boat shapes ============================== */
function boatGeo(kind){
  const parts=[];
  const push=(geo,mat)=>{ parts.push({g:geo, m:mat}); };
  if(kind==='country'){
    const hull=new THREE.CylinderGeometry(1.5,0.9,9,8,1,false);
    hull.rotateZ(Math.PI/2); hull.scale(1,1,0.55); hull.translate(0,0.35,0);
    push(hull,M.wood);
    const mast=new THREE.CylinderGeometry(0.10,0.14,7,6); mast.translate(0,4,0); push(mast,M.woodDark);
    const sail=new THREE.ConeGeometry(2.6,5.4,3); sail.rotateY(0.4); sail.scale(0.35,1,1); sail.translate(0,4.6,0);
    push(sail,M.whitePaint);
  } else if(kind==='row'){
    const hull=new THREE.CylinderGeometry(1.1,0.6,6.5,8); hull.rotateZ(Math.PI/2); hull.scale(1,1,0.5); hull.translate(0,0.3,0);
    push(hull,M.wood);
    push(new THREE.BoxGeometry(1.6,0.28,1.6).translate(0,0.9,0),M.woodDark);
  } else if(kind==='steamer'){
    const hull=new THREE.BoxGeometry(7,2.2,22); hull.translate(0,0.5,0); push(hull,M.whitePaint);
    const bow=new THREE.ConeGeometry(3.5,5,4); bow.rotateX(Math.PI/2); bow.scale(1,1,0.62); bow.translate(0,0.5,13.4); push(bow,M.whitePaint);
    push(new THREE.BoxGeometry(6,2.4,10).translate(0,2.6,-2),M.wood);
    push(new THREE.BoxGeometry(6.6,0.3,11).translate(0,3.9,-2),M.roofGrey);
    push(new THREE.CylinderGeometry(0.9,0.9,4.4,10).translate(0,5.4,3),M.roofRed);
    push(new THREE.CylinderGeometry(0.75,0.95,1.2,10).translate(0,7.6,3),M.woodDark);
    push(new THREE.BoxGeometry(5.4,1.8,5).translate(0,1.9,6),M.woodDark);
    for(const sx of [-1,1]) push(new THREE.CylinderGeometry(1.7,1.7,1.4,14).translate(sx*2.6,0.9,-7),M.whitePaint);
  } else if(kind==='ferry'){
    push(new THREE.BoxGeometry(6.2,1.8,17).translate(0,0.4,0),M.whitePaint);
    push(new THREE.BoxGeometry(5.2,2.2,9).translate(0,2.4,-1),M.glass);
    push(new THREE.BoxGeometry(5.8,0.3,10).translate(0,3.6,-1),M.roofGrey);
    push(new THREE.BoxGeometry(3.6,1.6,3.4).translate(0,1.6,5.4),M.paleSand);
  } else if(kind==='barge'){
    push(new THREE.BoxGeometry(8.6,2.0,34).translate(0,0.3,0),M.brick);
    push(new THREE.BoxGeometry(8.6,0.5,34).translate(0,1.5,0),M.woodDark);
    for(let i=0;i<4;i++) push(new THREE.BoxGeometry(3.4,2.4,4).translate(0,2.6,-12+i*8),M.slate);
    push(new THREE.BoxGeometry(4.4,3.0,4.4).translate(0,3.2,13),M.whitePaint);
  } else {
    push(new THREE.BoxGeometry(5.4,1.6,14).translate(0,0.4,0),M.whitePaint);
    push(new THREE.BoxGeometry(4.6,1.6,7).translate(0,2.0,-1),M.glass);
    push(new THREE.BoxGeometry(5.0,0.24,8).translate(0,2.9,-1),M.roofGrey);
  }
  const bag=new GeoBag();
  for(const p of parts) bag.add(p.g, p.m);
  const grp=new THREE.Group();
  for(const [mat,list] of bag.map){
    const merged=mergeGeometries(list,false);
    const mesh=new THREE.Mesh(merged,mat);
    mesh.castShadow=true; mesh.receiveShadow=true;
    grp.add(mesh);
  }
  return grp;
}
/* wake: a stretched soft quad that trails the hull */
function makeWake(){
  const g=new THREE.PlaneGeometry(1,1);
  g.rotateX(-Math.PI/2);
  const m=new THREE.Mesh(g, new THREE.MeshBasicMaterial({map:blobTex, transparent:true, opacity:0.30, depthWrite:false, color:0xf4f8ff, blending:THREE.AdditiveBlending}));
  m.renderOrder=3;
  scene.add(m);
  return m;
}
/* ============================== boats ============================== */
function buildBoats(){
  const specs=[
    {kind:'country', course:'inN', n:7, sp:5.2, s:1.0},
    {kind:'country', course:'inS', n:6, sp:4.6, s:0.95},
    {kind:'row',     course:'inN', n:5, sp:3.4, s:1.0},
    {kind:'tour',    course:'inS', n:3, sp:7.0, s:1.0},
    {kind:'ferry',   course:'shW', n:3, sp:6.2, s:1.1},
    {kind:'ferry',   course:'shE', n:2, sp:5.4, s:1.0},
    {kind:'barge',   course:'shW', n:2, sp:4.0, s:1.0},
    {kind:'barge',   course:'deS', n:3, sp:4.4, s:1.0},
    {kind:'row',     course:'deS', n:5, sp:3.0, s:0.9},
    {kind:'tour',    course:'deN', n:4, sp:6.6, s:0.95},
    {kind:'country', course:'deN', n:3, sp:4.2, s:0.85},
    {kind:'steamer', course:'shE', n:2, sp:5.6, s:1.0},
  ];
  const geoCache={};
  for(const sp of specs){
    const key=sp.kind+sp.s;
    if(!geoCache[key]) geoCache[key]=boatGeo(sp.kind);
    const curve=COURSES[sp.course];
    const len=curve.getLength();
    for(let i=0;i<sp.n;i++){
      const obj=(i===0&&sp.kind!=='row') ? geoCache[key].clone(true) : geoCache[key].clone(true);
      obj.scale.setScalar(sp.s);
      obj.rotation.order='YXZ';
      scene.add(obj);
      const dir = (i%2===0)?1:-1;
      ANIM.boats.push({
        obj, kind:sp.kind, curve, len,
        u:(i+0.5)/sp.n + rand(0.03),
        dir, sp:sp.sp*(0.85+rand(0.3)), lane:sp.course,
        bob:rand(6.283), wake:makeWake()
      });
    }
  }
}
/* ============================== people ============================== */
/* One instanced mesh of bodies + one of heads; agents walk real routes */
const PPL={};
function buildPeople(){
  const bodyG=new THREE.CylinderGeometry(0.30,0.22,1.2,5);
  bodyG.translate(0,0.6,0);
  const headG=new THREE.SphereGeometry(0.23,6,5);
  headG.translate(0,1.42,0);
  const bodyM=new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.85});
  const headM=new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.8});
  const N=520;
  PPL.body=new THREE.InstancedMesh(bodyG, bodyM, N);
  PPL.head=new THREE.InstancedMesh(headG, headM, N);
  PPL.body.castShadow=true; PPL.head.castShadow=false;
  PPL.body.frustumCulled=false; PPL.head.frustumCulled=false;
  const white=new THREE.Color(1,1,1);
  for(let i=0;i<N;i++){ PPL.body.setColorAt(i,white); PPL.head.setColorAt(i,white); }
  scene.add(PPL.body); scene.add(PPL.head);
  PPL.agents=[];
  PPL.N=N;
  /* routes: local promenades around sites and along quays */
  const routes=[];
  const pushLoop=(cx,cz,r,n,rot)=>{
    const pts=[];
    for(let i=0;i<n;i++){
      const a=rot+i/n*Math.PI*2;
      pts.push(V3(cx+Math.cos(a)*r, 0, cz+Math.sin(a)*r*0.75));
    }
    routes.push(pts);
  };
  pushLoop(SITE.taj.x-40, SITE.taj.z-46, 26, 14, 0.4);       // queue at the great gate
  pushLoop(SITE.taj.x, SITE.taj.z+96, 34, 16, 0.9);          // far-bank viewpoint
  pushLoop(SITE.gateway.x+8, SITE.gateway.z+30, 16, 10, 0.2);
  pushLoop(SITE.holstentor.x-8, SITE.holstentor.z+26, 14, 10, 1.1);
  pushLoop(SITE.cologne.x-52, SITE.cologne.z+30, 20, 12, 0.3);
  pushLoop(SITE.golden.x-58, SITE.golden.z-20, 22, 12, 2.0);
  pushLoop(SITE.meenakshi.x, SITE.meenakshi.z+52, 24, 12, 1.4);
  pushLoop(SITE.brandenburg.x, SITE.brandenburg.z-30, 26, 12, 0.0);
  pushLoop(SITE.zwinger.x, SITE.zwinger.z+4, 22, 14, 1.7);
  pushLoop(SITE.rathaus.x-28, SITE.rathaus.z-30, 20, 12, 0.6);
  pushLoop(SITE.indiagate.x, SITE.indiagate.z-50, 26, 12, 0.0);
  pushLoop(SITE.hawamahal.x, SITE.hawamahal.z+26, 16, 10, 1.2);
  pushLoop(SITE.elphi.x, SITE.elphi.z+34, 18, 10, 0.7);
  pushLoop(SITE.mysore.x, SITE.mysore.z+40, 22, 12, 0.5);
  pushLoop(SITE.lotus.x, SITE.lotus.z+46, 24, 12, 0.9);
  pushLoop(SITE.amber.x, SITE.amber.z+62, 26, 12, 0.2);
  pushLoop(96, 40, 26, 14, 0.5);                             // harbour promenade, Indian quay
  pushLoop(-96, 40, 26, 14, 2.1);                            // harbour promenade, German quay
  pushLoop(0, -300, 40, 16, 0.0);                            // sea lock / landing stage
  /* build agents */
  const clothes=[0xe8e2d2,0xd9c9a7,0xc4a06a,0xb5573c,0x8d3f4f,0x4f6d86,0x6d7b52,0xf0f0ea,0x2e3a46,0xc9b28a];
  for(let i=0;i<N;i++){
    const route=routes[i%routes.length];
    const t=rand(1);
    PPL.agents.push({
      route, t, sp:(0.9+rand(1.5))/route.length*10,
      state: rng()<0.18?'stand':'walk', wait:rand(1,7),
      y:0, phase:rand(6.283), sc:0.92+rand(0.22),
      col:new THREE.Color(clothes[Math.floor(rand(clothes.length))%clothes.length]),
      headCol:new THREE.Color().setHSL(0.07+rand(0.03), 0.35, 0.38+rand(0.18))
    });
  }
  updatePeopleColors();
}
function updatePeopleColors(){
  for(let i=0;i<PPL.agents.length;i++){
    const a=PPL.agents[i];
    PPL.body.setColorAt(i,a.col);
    PPL.head.setColorAt(i,a.headCol);
  }
  if(PPL.body.instanceColor) PPL.body.instanceColor.needsUpdate=true;
  if(PPL.head.instanceColor) PPL.head.instanceColor.needsUpdate=true;
}
const _pm=new THREE.Object3D();
function updatePeople(dt,t){
  if(!PPL.agents) return;
  const dens=state.density;
  for(let i=0;i<PPL.agents.length;i++){
    const a=PPL.agents[i], route=a.route;
    const visible = i < PPL.N*Math.min(1,dens*0.72);
    if(!visible){ _pm.position.set(0,-500,0); _pm.scale.setScalar(0.001); _pm.updateMatrix();
      PPL.body.setMatrixAt(i,_pm.matrix); PPL.head.setMatrixAt(i,_pm.matrix); continue; }
    if(a.state==='walk'){
      const seg=Math.floor(a.t*route.length)%route.length;
      const nxt=(seg+1)%route.length;
      const A=route[seg], B=route[nxt];
      a.t += dt*a.sp/route.length*4.0;
      if(a.t>1){ a.t-=1; if(rng()<0.35){ a.state='stand'; a.wait=rand(1.5,6.5); } }
      const pos=A.clone().lerp(B, (a.t*route.length)%1);
      a.x=pos.x; a.z=pos.z;
      a.dir=Math.atan2(B.x-A.x,B.z-A.z);
    } else {
      a.wait-=dt;
      if(a.wait<=0){ a.state='walk'; }
    }
    const y=terrainH(a.x||0,a.z||0);
    const bob=Math.sin(t*4.2+a.phase)*0.045;
    _pm.position.set(a.x||0, y+bob, a.z||0);
    _pm.rotation.set(0, a.dir||0, 0);
    _pm.scale.setScalar(a.sc);
    _pm.updateMatrix();
    PPL.body.setMatrixAt(i,_pm.matrix);
    PPL.head.setMatrixAt(i,_pm.matrix);
  }
  PPL.body.instanceMatrix.needsUpdate=true;
  PPL.head.instanceMatrix.needsUpdate=true;
}
/* ============================== birds ============================== */
function buildBirds(){
  const g=new THREE.BufferGeometry();
  const v=new Float32Array([ -1.1,0,0,  0,0.12,0.35,  0,0.12,-0.35,   1.1,0,0,  0,0.12,-0.35,  0,0.12,0.35 ]);
  g.setAttribute('position',new THREE.BufferAttribute(v,3));
  g.computeVertexNormals();
  const m=new THREE.MeshStandardMaterial({color:0x2b2f33, roughness:0.9, side:THREE.DoubleSide});
  const N=260;
  BIRDS.inst=new THREE.InstancedMesh(g,m,N);
  BIRDS.inst.frustumCulled=false;
  scene.add(BIRDS.inst);
  const flocks=[
    {c:V3(150,40,520), r:70, n:26},  {c:V3(-140,45,300), r:60, n:22},
    {c:V3(0,30,60), r:80, n:30},     {c:V3(430,30,1400), r:70, n:20},
    {c:V3(-300,50,800), r:80, n:24}, {c:V3(600,40,2200), r:90, n:20},
    {c:V3(-176,35,-200), r:55, n:26},{c:V3(120,32,-500), r:70, n:24},
    {c:V3(-700,60,2200), r:70, n:18},{c:V3(840,32,-1200), r:70, n:18},
  ];
  let k=0;
  BIRDS.agents=[];
  for(const f of flocks){
    for(let i=0;i<f.n && k<N;i++){
      BIRDS.agents.push({c:f.c, r:f.r*(0.55+rand(0.8)), h:f.r*0.34*(rand(0.6,1.2)),
        ph:rand(6.283), sp:0.20+rand(0.22), fl:6+rand(4), sc:0.7+rand(0.8)});
      k++;
    }
  }
  BIRDS.inst.count=k;
}
function updateBirds(t){
  if(!BIRDS.agents) return;
  for(let i=0;i<BIRDS.agents.length;i++){
    const b=BIRDS.agents[i], a=t*b.sp+b.ph;
    const x=b.c.x+Math.cos(a)*b.r, z=b.c.z+Math.sin(a)*b.r*0.85;
    const y=b.c.y+Math.sin(a*1.7)*b.h*0.4+Math.sin(t*0.7+b.ph)*2.0;
    const flap=Math.sin(t*b.fl+b.ph)*0.55;
    _pm.position.set(x,y,z);
    _pm.rotation.set(0, -a+Math.PI/2, flap);
    _pm.scale.setScalar(b.sc);
    _pm.updateMatrix();
    BIRDS.inst.setMatrixAt(i,_pm.matrix);
  }
  BIRDS.inst.instanceMatrix.needsUpdate=true;
}
/* ============================== boats update ============================== */
const _bq=new THREE.Quaternion(), _be=new THREE.Euler();
function updateBoats(dt,t){
  for(const b of ANIM.boats){
    b.u += dt*b.sp*b.dir/b.len;
    if(b.u>1){ b.u-=1; } if(b.u<0){ b.u+=1; }
    const p=b.curve.getPointAt(clamp(b.u,0.001,0.999));
    const tan=b.curve.getTangentAt(clamp(b.u,0.001,0.999));
    const yaw=Math.atan2(tan.x*b.dir,tan.z*b.dir);
    b.obj.position.set(p.x, 0.35+Math.sin(t*1.3+b.bob)*0.16, p.z);
    _be.set(Math.sin(t*0.9+b.bob)*0.022, yaw, Math.sin(t*1.1+b.bob)*0.03,'YXZ');
    b.obj.quaternion.setFromEuler(_be);
    /* wake trails behind, length scaled by speed */
    const wl=(b.kind==='barge'?46:b.kind==='steamer'?30:20);
    b.wake.position.set(p.x-tan.x*b.dir*wl*0.42, 0.72, p.z-tan.z*b.dir*wl*0.42);
    b.wake.rotation.set(0,yaw,0);
    b.wake.scale.set(wl*0.5*(b.kind==='barge'?1.5:1), 1, wl*0.34);
    b.wake.material.opacity = 0.22*Math.min(1,Math.abs(b.sp)/6);
  }
}
/* ============================== ground vehicles & trains ============================== */
function buildVehicles(){
  const carG=new THREE.BoxGeometry(1.9,1.5,4.2);
  carG.translate(0,0.75,0);
  const cols=[0x3b4a5a,0x8a3b34,0xd8d2c4,0x2f4034,0x6b6a63,0xa8834a];
  const N=44;
  const inst=new THREE.InstancedMesh(carG, new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.6}), N);
  inst.frustumCulled=false; inst.castShadow=true;
  scene.add(inst);
  const c=new THREE.Color();
  const lanes=[];
  for(const id of ['t_delhi','t_berlin','t_jaipur','t_dresden','t_amritsar','t_munich']){
    const s=SITE[id];
    lanes.push({a:V3(s.x-SITES.find(q=>q.id===id).r,0,s.z-s.r*0.5), b:V3(s.x+s.r,0,s.z+s.r*0.6)});
  }
  lanes.push({a:V3(150,0,240), b:V3(150,0,470)});
  lanes.push({a:V3(-160,0,200), b:V3(-160,0,600)});
  ANIM.vehicles=[];
  for(let i=0;i<N;i++){
    const ln=lanes[i%lanes.length];
    ANIM.vehicles.push({ln, u:rand(1), sp:(0.03+rand(0.04)), dir:i%2?1:-1, i});
    c.setHex(cols[i%cols.length]); inst.setColorAt(i,c);
  }
  if(inst.instanceColor) inst.instanceColor.needsUpdate=true;
  ANIM.vehInst=inst;
}
function updateVehicles(dt){
  if(!ANIM.vehicles.length) return;
  for(const v of ANIM.vehicles){
    v.u += dt*v.sp*v.dir;
    if(v.u>1) v.u-=1; if(v.u<0) v.u+=1;
    const p=v.ln.a.clone().lerp(v.ln.b,v.u);
    const dirp=v.ln.b.clone().sub(v.ln.a);
    p.y=terrainH(p.x,p.z)+0.2;
    _pm.position.copy(p);
    _pm.rotation.set(0, Math.atan2(dirp.x*v.dir,dirp.z*v.dir), 0);
    _pm.scale.setScalar(1);
    _pm.updateMatrix();
    ANIM.vehInst.setMatrixAt(v.i,_pm.matrix);
  }
  ANIM.vehInst.instanceMatrix.needsUpdate=true;
}
function updateTrains(dt,t){
  for(const tr of ANIM.trains){
    tr.phase=(tr.phase+dt)%(tr.len*2/tr.speed);
    const span=tr.to-tr.from;
    const u=(tr.phase*tr.speed)/span;
    const z=tr.from+((u%2)<1 ? (u%1)*span : (1-(u%1))*span);
    tr.obj.position.z=tr.z0+z;
  }
  if(ANIM.glock){
    /* glockenspiel performs for twenty seconds on each simulated hour */
    const hour=(t/120)%1;
    const n=ANIM.glock.obj.children[0];
    const playing = hour<0.055;
    ANIM.glock.obj.rotation.y = playing ? Math.sin(t*2.2)*0.12 : 0;
    ANIM.glock.obj.position.y = playing ? Math.abs(Math.sin(t*3.1))*0.10 : 0;
  }
}
buildBoats();
buildPeople();
buildBirds();
buildVehicles();
//__CHUNK8__
