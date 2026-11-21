/*__CHUNK4__*/
/* ============================== shared facade helpers ============================== */
/* grid of windows as instanced-ish merged quads sunk into a wall */
function addWindowGrid(bag, x0,y0,z0, cols,rows, dx,dy, wz,wy, rotY, mat){
  const m0=new THREE.Matrix4().makeRotationY(rotY);
  for(let c=0;c<cols;c++) for(let r=0;r<rows;r++){
    const lx=(c-(cols-1)/2)*dx, ly=y0+r*dy;
    const m=new THREE.Matrix4().multiplyMatrices(m0,new THREE.Matrix4().makeTranslation(lx,ly,z0));
    bag.add(new THREE.PlaneGeometry(wz,wy), mat, m);
  }
}
/* parapet / crenellation run */
function crenels(bag, len, y, z, mat, axis, x, step, h){
  step=step||3.2; h=h||1.6;
  const n=Math.floor(len/step);
  for(let i=0;i<n;i+=2){
    const p=-len/2+i*step+step/2;
    if(axis==='z') bag.add(new THREE.BoxGeometry(1.9,h,1.4), mat, mat4(x, y+h/2, z+p));
    else bag.add(new THREE.BoxGeometry(step*0.9,h,1.4), mat, mat4(x+p, y+h/2, z));
  }
}
/* hipped / gambrel roof prism */
function roofGeo(w,d,h,type){
  if(type==='hip'){
    const g=new THREE.ConeGeometry(Math.max(w,d)*0.72,h,4,1);
    g.rotateY(Math.PI/4); g.scale(w/Math.max(w,d),1,d/Math.max(w,d));
    return g;
  }
  const g=new THREE.CylinderGeometry(0.001,1,1,3,1);
  return g;
}
/* tiled pitched roof (two slopes) */
function pitchRoof(bag, w,d,h, mat, x,y,z, rotY){
  const half=d/2;
  const sh=new THREE.Shape(); sh.moveTo(-half,0); sh.lineTo(0,h); sh.lineTo(half,0); sh.closePath();
  const g=new THREE.ExtrudeGeometry(sh,{depth:w,bevelEnabled:false});
  g.rotateY(Math.PI/2); g.translate(-w/2,0,0);
  bag.add(g, mat, mat4(x,y,z, rotY||0));
}

/* ============================== 1. RED FORT ============================== */
function buildRedFort(){
  const {g,rec}=newMon('redfort', -Math.PI/2);
  const bag=new GeoBag();
  const RS=M.sandstone, RS2=M.sandstone2;
  /* ramparts: long curtain walls with battered base */
  const wallH=22, wallT=9;
  const plan=[[0,0,150,0],[0,0,150,0]];
  /* river face */
  bag.add(new THREE.BoxGeometry(150,wallH,wallT), RS, mat4(0,wallH/2,26));
  bag.add(new THREE.BoxGeometry(150,3.4,wallT+2.4), M.redSand, mat4(0,1.7,26));
  crenels(bag,150,wallH,26,RS2,'x',0,3.4,2.2);
  /* bastion towers */
  for(let i=-2;i<=2;i++){
    const bx=i*34;
    bag.add(new THREE.CylinderGeometry(8.5,9.6,wallH+5,14), RS, mat4(bx, (wallH+5)/2, 26));
    bag.add(new THREE.CylinderGeometry(9.6,9.6,1.2,14), RS2, mat4(bx, wallH+5.4, 26));
    for(let q=0;q<10;q++){ const a=q/10*Math.PI*2; bag.add(new THREE.BoxGeometry(1.6,2.2,1.2), RS2, mat4(bx+Math.cos(a)*9.2, wallH+5.8, 26+Math.sin(a)*9.2, -a)); }
  }
  /* return walls */
  for(const sx of [-1,1]){
    bag.add(new THREE.BoxGeometry(wallT,wallH,66), RS, mat4(sx*72,wallH/2,-7));
    crenels(bag,66,wallH,-7,RS2,'z',sx*72,3.4,2.2);
  }
  /* water gate + ghat steps down to the river */
  bag.add(new THREE.BoxGeometry(26,8,7), RS2, mat4(4,4,32));
  bag.add(archFrameGeo(11,9,4,3,1.1), M.marbleSoft, mat4(4,3.2,34));
  for(let i=0;i<7;i++) bag.add(new THREE.BoxGeometry(30,0.85,3.2), M.paleSand, mat4(4, -0.4-i*0.55, 40+i*3.0));
  /* Lahori-style gate: massive arched portal with a row of kiosks */
  bag.add(new THREE.BoxGeometry(40,30,14), RS, mat4(-34,15,22));
  bag.add(archFrameGeo(17,18,8,3.4,2.2), M.redSand, mat4(-34,0,30));
  bag.add(new THREE.BoxGeometry(44,2.4,17), RS2, mat4(-34,30,22));
  for(const bx of [-13,-4.4,4.4,13]) addChhatri(bag, -34+bx, 31.2, 22, 2.1, M.marbleSoft, M.marbleSoft);
  /* marble pavilions (Diwan-i-Khas) along the river side */
  for(const px of [24,42]){
    bag.add(new THREE.BoxGeometry(15,10,13), M.marble, mat4(px,wallH+5,0));
    for(const cx of [-5.4,0,5.4]) for(const cz of [-4.6,4.6])
      bag.add(columnGeo(0.42,5.4), M.marble, mat4(px+cx,wallH+10,cz));
    bag.add(new THREE.BoxGeometry(17,1.1,15), M.marble, mat4(px,wallH+16,0));
    addChhatri(bag, px, wallH+16.4, 0, 2.4, M.marble, M.marble);
    bag.add(new THREE.PlaneGeometry(11,3.0), M.jali, mat4(px,wallH+12.5,6.7));
  }
  /* inner court: arcaded hall visible over the wall */
  for(let i=0;i<10;i++) bag.add(new THREE.BoxGeometry(4.4,12,4.4), M.marbleSoft, mat4(-20+i*9, wallH+6, -30));
  bag.add(new THREE.BoxGeometry(96,2.0,6), M.marble, mat4(20, wallH+13, -30));
  addWindowGrid(bag, 0, 6, 30.6, 12,2, 10, 6.4, 1.5,3.0, 0, M.windowLit);
  bag.build(g);
  rec.ornament.push({obj:g,tier:2});
  return rec;
}

/* ============================== 2. QUTUB MINAR ============================== */
function buildQutub(){
  const {g,rec}=newMon('qutub', -Math.PI/2);
  const bag=new GeoBag();
  const RS=M.sandstone, MB=M.marble;
  /* five storeys, alternating fluting, tapering, projecting balconies */
  const storeys=[
    {h:14.0, r0:7.4, r1:6.5, fl:24, mat:RS,  bal:true},
    {h:12.5, r0:6.2, r1:5.3, fl:0,  mat:RS,  bal:true},
    {h:11.0, r0:5.1, r1:4.4, fl:24, mat:RS,  bal:true},
    {h:9.0,  r0:4.2, r1:3.6, fl:0,  mat:MB,  bal:true},
    {h:7.5,  r0:3.4, r1:2.9, fl:24, mat:MB,  bal:true},
  ];
  let y=4.4;
  bag.add(new THREE.CylinderGeometry(9.6,10.6,4.4,28), M.redSand, mat4(0,2.2,0));
  bag.add(new THREE.CylinderGeometry(11.6,12.2,1.6,28), RS, mat4(0,0.8,0));
  for(const s of storeys){
    const geo = s.fl ? flutedCylinder(s.r1,s.r0,s.h,s.fl,0.075) : new THREE.CylinderGeometry(s.r1,s.r0,s.h,28);
    bag.add(geo, s.mat, mat4(0,y+s.h/2,0));
    /* inscription bands */
    for(const f of [0.22,0.62]){
      bag.add(new THREE.CylinderGeometry(lerp(s.r0,s.r1,f)+0.16, lerp(s.r0,s.r1,f)+0.16, 0.85, 28), s.mat===RS?MB:RS, mat4(0,y+s.h*f,0));
    }
    y+=s.h;
    /* balcony with railing */
    if(s.bal){
      bag.add(new THREE.CylinderGeometry(s.r1+1.7, s.r1+1.7, 0.75, 30), MB, mat4(0,y+0.35,0));
      for(let q=0;q<26;q++){ const a=q/26*Math.PI*2; bag.add(new THREE.BoxGeometry(0.2,1.4,0.2), MB, mat4(Math.cos(a)*(s.r1+1.45), y+1.4, Math.sin(a)*(s.r1+1.45))); }
      bag.add(new THREE.TorusGeometry(s.r1+1.45,0.11,4,32), MB, mat4(0,y+2.1,0,0,1,1,1,Math.PI/2,0));
    }
  }
  /* top: cupola + finial */
  bag.add(new THREE.CylinderGeometry(3.5,3.9,1.1,18), MB, mat4(0,y+0.55,0));
  bag.add(onionDomeGeo(3.5,4.2,18), RS, mat4(0,y+1.1,0));
  bag.add(finialGeo(4.6), M.goldDim, mat4(0,y+5.0,0));
  /* the plain Alai Minar stump and arcaded ruins around */
  bag.add(new THREE.CylinderGeometry(11,12,18,20), RS, mat4(-46,-2,-40));
  for(let i=0;i<12;i++){
    const a=i/12*Math.PI*2;
    const px=Math.cos(a)*44, pz=Math.sin(a)*40;
    const hh=4+hash2(i,3)*7;
    for(let c=0;c<3;c++){
      bag.add(new THREE.BoxGeometry(1.3,hh,1.3), RS, mat4(px+Math.cos(a)*c*3.2, hh/2-1, pz+Math.sin(a)*c*3.2));
    }
    bag.add(new THREE.BoxGeometry(9,1.1,1.6), RS, mat4(px+Math.cos(a)*3.2, hh-0.6, pz+Math.sin(a)*3.2, -a));
    for(let c=0;c<2;c++) bag.add(archFrameGeo(4.4,hh*0.8,2,0.7,0.45), RS, mat4(px+Math.cos(a)*(c*3.2+1.6), -1, pz+Math.sin(a)*(c*3.2+1.6), -a+Math.PI/2));
  }
  /* Iron Pillar in the courtyard */
  bag.add(new THREE.CylinderGeometry(0.28,0.32,7.2,10), M.basalt, mat4(20,2.6,20));
  bag.build(g);
  rec.ornament.push({obj:g,tier:2});
  return rec;
}

/* ============================== 3. GOLDEN TEMPLE ============================== */
function buildGolden(){
  const {g,rec}=newMon('golden', -Math.PI/2);
  const bag=new GeoBag();
  const MB=M.marble;
  /* marble surround + sacred pool (square, lower than ground) */
  bag.add(new THREE.BoxGeometry(120,1.2,120), M.marbleSoft, mat4(0,0.2,0));
  /* pool basin walls */
  for(const [px,pz,w,d] of [[0,52,100,5],[0,-52,100,5],[52,0,5,100],[-52,0,5,100]]){
    bag.add(new THREE.BoxGeometry(w,2.4,d), MB, mat4(px,0.7,pz));
  }
  /* causeway to the sanctum */
  bag.add(new THREE.BoxGeometry(7,1.0,46), MB, mat4(0,1.5,26));
  bag.add(new THREE.BoxGeometry(7,0.9,46), M.goldDim, mat4(0,2.1,26));
  /* gilded sanctum (Harmandir Sahib): lower marble storey, gilded upper with dome */
  bag.add(new THREE.BoxGeometry(26,7,26), MB, mat4(0,4.5,0));
  bag.add(new THREE.BoxGeometry(24,1.1,24), M.marbleSoft, mat4(0,8.5,0));
  bag.add(new THREE.BoxGeometry(22,9,22), M.gold, mat4(0,13,0));
  /* corner pavilions */
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    bag.add(new THREE.BoxGeometry(5,11,5), M.gold, mat4(sx*11,14.4,sz*11));
    bag.add(onionDomeGeo(3.4,4.0,16), M.gold, mat4(sx*11,19.6,sz*11));
    bag.add(finialGeo(3.0), M.gold, mat4(sx*11,23.4,sz*11));
  }
  /* main dome + small kiosks */
  bag.add(new THREE.CylinderGeometry(9.0,9.6,4.0,24), M.gold, mat4(0,19.5,0));
  bag.add(onionDomeGeo(10.2,10.4,28), M.gold, mat4(0,23.4,0));
  bag.add(finialGeo(6.0), M.gold, mat4(0,33.2,0));
  for(const sx of [-1,1]){
    addChhatri(bag, sx*9.5, 22.4, 0, 1.9, M.gold, M.gold);
  }
  /* arched openings, gilded frames, dark shaded interiors */
  for(let k=0;k<4;k++){
    const m=new THREE.Matrix4().makeRotationY(k*Math.PI/2);
    bag.add(archFrameGeo(8.2,8.0,3.4,1.5,0.7), M.goldDim,
      new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation(0,9.0,11.2)));
    bag.add(archGeo(6.6,6.8,2.8,1.0), M.woodDark,
      new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation(0,9.0,11.5)));
    bag.add(new THREE.PlaneGeometry(16,2.2), M.script,
      new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation(0,16.6,11.3)));
  }
  /* marble perimeter arcade with domed corner towers, and the clock-tower gate behind */
  for(let i=0;i<40;i++){
    const a=i/40*Math.PI*2;
    const r=57;
    const px=Math.cos(a)*r, pz=Math.sin(a)*r;
    if(Math.abs(px)<26 && pz>40) continue;    // entrance gap
    bag.add(new THREE.BoxGeometry(2.0,8,2.0), MB, mat4(px,4,pz,-a));
    if(i%2===0) bag.add(new THREE.BoxGeometry(2.2,1.0,2.2), M.marbleSoft, mat4(px,8.4,pz,-a));
  }
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    bag.add(new THREE.BoxGeometry(9,16,9), MB, mat4(sx*56,8,sz*56));
    bag.add(onionDomeGeo(4.4,5.0,14), M.marbleSoft, mat4(sx*56,16.4,sz*56));
  }
  bag.build(g);
  rec.ornament.push({obj:g,tier:2});
  return rec;
}

/* ============================== 4. KONARK ============================== */
function buildKonark(){
  const {g,rec}=newMon('konark', -Math.PI/2);
  const bag=new GeoBag();
  const ST=M.darkStone, ST2=M.rock;
  /* jagamohana (audience hall): tiered pyramidal roof, weathered */
  bag.add(new THREE.BoxGeometry(34,9,34), ST, mat4(0,4.5,-6));
  bag.add(new THREE.BoxGeometry(36,1.0,36), ST2, mat4(0,9.2,-6));
  for(let t=0;t<3;t++){
    const s=31-t*7.5, yy=9.7+t*5.4;
    bag.add(new THREE.BoxGeometry(s,s,5.4), ST, mat4(0,yy+2.7,-6));
    bag.add(new THREE.BoxGeometry(s-1.2,s-1.2,1.0), ST2, mat4(0,yy+5.2,-6));
  }
  bag.add(new THREE.CylinderGeometry(3.6,4.2,2.4,16), ST, mat4(0,26.6,-6));
  bag.add(onionDomeGeo(4.0,4.4,16), ST2, mat4(0,28.6,-6));
  /* the chariot platform with 24 carved wheels */
  bag.add(new THREE.BoxGeometry(40,10,46), ST, mat4(0,5,20));
  for(const sx of [-1,1]) for(let i=0;i<12;i++){
    const wz=-8+i*4.2;
    const wheel=new THREE.TorusGeometry(2.5,0.55,6,18);
    bag.add(wheel, ST2, mat4(sx*20.4, 4.6, wz, Math.PI/2));
    for(let k=0;k<8;k++){ const a=k/8*Math.PI*2;
      bag.add(new THREE.BoxGeometry(0.22,4.2,0.22), ST2, mat4(sx*20.4+Math.sin(a)*0.0, 4.6+Math.cos(a)*2.0, wz+Math.sin(a)*2.0, 0));
    }
  }
  /* seven horses in front, worn and broken */
  for(let i=0;i<7;i++){
    const px=-19+i*6.4, hh=4.2+hash2(i,4)*1.4;
    bag.add(new THREE.BoxGeometry(2.2,hh,6.0), ST, mat4(px,hh/2,45));
    bag.add(new THREE.BoxGeometry(1.7,2.2,2.4), ST, mat4(px,hh+0.9,47.2,0,1,1,1,-0.2));
    bag.add(new THREE.BoxGeometry(2.4,1.2,1.8), ST2, mat4(px,hh+2.2,46.6));
    for(const lz of [43.4,47.6]) for(const lx of [-0.7,0.7]) bag.add(new THREE.BoxGeometry(0.5,hh,0.5), ST, mat4(px+lx,hh/2,lz));
    if(i===3) bag.add(new THREE.BoxGeometry(2.2,hh*0.5,6.0), ST, mat4(px,-1,45));  // ruined
  }
  /* carved base friezes */
  for(let i=0;i<40;i++){
    bag.add(new THREE.BoxGeometry(0.9,2.2,0.5), ST2, mat4(-20+i*1.0, 2.2, 43.2));
  }
  addWindowGrid(bag, 0, 2.0, 11.1, 6, 2, 5.2, 3.4, 2.2, 3.0, 0, M.windowLit);
  bag.build(g);
  rec.ornament.push({obj:g,tier:2});
  return rec;
}

/* ============================== 5. COLOGNE CATHEDRAL ============================== */
function buildCologne(){
  const {g,rec}=newMon('cologne', -Math.PI/2);
  const bag=new GeoBag();
  const DK=M.darkStone;
  /* nave body */
  bag.add(new THREE.BoxGeometry(42,48,86), DK, mat4(0,24,0));
  pitchRoof(bag, 42, 22, 12, M.slate, 0, 48, 0);
  /* twin west towers: square shafts to 100m, then openwork spires */
  for(const sx of [-1,1]){
    const bx=sx*15;
    bag.add(new THREE.BoxGeometry(17,100,17), DK, mat4(bx,50,43));
    /* buttress corners */
    for(const cx of [-1,1]) for(const cz of [-1,1])
      bag.add(new THREE.BoxGeometry(3.2,100,3.2), DK, mat4(bx+cx*8.4,50,43+cz*8.4));
    /* belfry stage with tall lancets */
    bag.add(new THREE.BoxGeometry(15,22,15), DK, mat4(bx,105,43));
    for(let k=0;k<4;k++){
      const m=new THREE.Matrix4().multiplyMatrices(new THREE.Matrix4().makeRotationY(k*Math.PI/2), new THREE.Matrix4().makeTranslation(bx,92,43+7.6));
      bag.add(new THREE.PlaneGeometry(11,18), M.openwork, m);
    }
    for(let k=0;k<4;k++){
      const m=new THREE.Matrix4().multiplyMatrices(new THREE.Matrix4().makeRotationY(k*Math.PI/2), new THREE.Matrix4().makeTranslation(bx,106,43+7.7));
      bag.add(new THREE.PlaneGeometry(9.6,15), M.openwork, m);
    }
    /* openwork octagonal spire to 157m */
    const sp=new THREE.ConeGeometry(9.0,38,8,3,true);
    bag.add(sp, M.openwork, mat4(bx, 116+19, 43));
    bag.add(new THREE.ConeGeometry(8.4,37.4,8,1,true), DK, mat4(bx,116+18.7,43));
    bag.add(new THREE.CylinderGeometry(0.5,0.9,5.0,8), M.goldDim, mat4(bx,157.5,43));
    /* corner pinnacles on the tower */
    for(const cx of [-1,1]) for(const cz of [-1,1]){
      bag.add(new THREE.ConeGeometry(1.5,11,6), DK, mat4(bx+cx*8.4, 121.5, 43+cz*8.4));
    }
    /* flying buttresses along the nave */
    for(let i=0;i<5;i++){
      const z=-38+i*19;
      bag.add(new THREE.BoxGeometry(2.2,30,3.0), DK, mat4(bx-sx*0.0,15,z));
      const fb=new THREE.BoxGeometry(16,2.2,2.4);
      fb.rotateZ(sx*0.22);
      bag.add(fb, DK, mat4(sx*25,38,z));
    }
  }
  /* transept + choir, apse */
  bag.add(new THREE.BoxGeometry(72,44,20), DK, mat4(0,22,-34));
  bag.add(new THREE.CylinderGeometry(15,15,44,16,1,false,0,Math.PI), DK, mat4(0,22,-44,Math.PI/2));
  /* west portal: three arched doors and rose window */
  bag.add(archFrameGeo(13,26,12,2.2,1.6), M.paleSand, mat4(0,0,52.2));
  addWindowGrid(bag, 0, 30, 52.4, 1,1, 0,0, 20, 20, 0, M.glass);
  for(const sx of [-1,1]) bag.add(archFrameGeo(7,14,6,1.6,1.0), M.paleSand, mat4(sx*15,0,52.2));
  /* stained glass front windows */
  addWindowGrid(bag, 0, 8, 52.6, 3, 4, 12, 10, 4.0, 8.0, 0, M.windowLit);
  /* railway bridge with a train (Hochbahn) — separate animated group */
  const bridge=new THREE.Group();
  bridge.position.set(0,0,-70);
  const bb=new GeoBag();
  for(const sx of [-1,1]){
    bb.add(new THREE.BoxGeometry(4.0,7.0,124), M.darkStone, mat4(sx*34,7,0));
  }
  bb.add(new THREE.BoxGeometry(72,2.2,124), M.darkStone, mat4(0,8.5,0));
  for(let i=0;i<9;i++){
    bb.add(new THREE.BoxGeometry(72,7.6,1.4), M.slate, mat4(0,4.6,-56+i*14));
  }
  /* iron arches */
  for(let i=0;i<9;i++){
    const a=new THREE.TorusGeometry(9,0.55,4,12,Math.PI);
    bb.add(a, M.basalt, mat4(0,10.0,-56+i*14,0,1,1,1,0,0));
  }
  bb.build(bridge);
  g.add(bridge);
  /* the train itself */
  const train=new THREE.Group();
  const tb=new GeoBag();
  for(let i=0;i<7;i++){
    tb.add(new THREE.BoxGeometry(3.4,3.6,13.5), i<2?M.slate:M.copper, mat4(0,2.4,-i*15));
    tb.add(new THREE.BoxGeometry(3.0,0.5,12.8), M.roofGrey, mat4(0,4.3,-i*15));
  }
  tb.build(train,false);
  train.position.set(4,10.6,-70);
  g.add(train);
  ANIM.trains.push({obj:train, x0:4, z0:-70, axis:'z', from:-62, to:62, speed:16, phase:rand(60), len:105});
  bag.build(g);
  rec.ornament.push({obj:g,tier:2});
  return rec;
}

/* ============================== 6. NEUSCHWANSTEIN ============================== */
function buildNeuschwanstein(){
  const {g,rec}=newMon('neuschwanstein', -Math.PI/2);
  const bag=new GeoBag();
  const WH=M.marbleSoft;
  const baseY=0;                        // sits on the crag summit
  /* crag */
  const crag=new THREE.Mesh(new THREE.CylinderGeometry(26,54,52,14,4,false), M.rock);
  crag.position.set(0,-24,0);
  crag.castShadow=true; crag.receiveShadow=true;
  g.add(crag);
  /* gatehouse */
  bag.add(new THREE.BoxGeometry(16,17,13), WH, mat4(0,8.5,16));
  bag.add(gableGeo(16,7,13), M.slate, mat4(0,17,16,0));
  bag.add(new THREE.BoxGeometry(5,9,5), WH, mat4(-8,4.5,22));
  /* main palace: long body, tall thin, with the slender west tower */
  bag.add(new THREE.BoxGeometry(15,26,40), WH, mat4(-4,13,-4));
  pitchRoof(bag,15,40,7,M.slate,-4,26,-4);
  bag.add(new THREE.BoxGeometry(11,36,11), WH, mat4(-4,18,16));
  bag.add(gableGeo(11,9,11), M.slate, mat4(-4,36,16));
  bag.add(new THREE.ConeGeometry(8.4,8,4), M.slate, mat4(-4,40,16,Math.PI/4));
  /* octagonal court tower */
  bag.add(new THREE.CylinderGeometry(4.0,4.4,30,8), WH, mat4(6,15,-16));
  bag.add(new THREE.ConeGeometry(4.4,7,8), M.slate, mat4(6,33.5,-16));
  /* great hall + knights' house */
  bag.add(new THREE.BoxGeometry(13,20,26), WH, mat4(10,10,-34));
  pitchRoof(bag,13,26,6,M.slate,10,20,-34);
  bag.add(new THREE.CylinderGeometry(3.4,3.6,24,8), WH, mat4(15,12,-46));
  bag.add(new THREE.ConeGeometry(3.6,6,8), M.slate, mat4(15,27,-46));
  /* windows in rows; arched on the palace face */
  for(let i=0;i<7;i++){
    bag.add(archFrameGeo(2.4,4.6,2.0,0.7,0.28), M.paleSand, mat4(3.6,6+i*3.1,4));
    bag.add(new THREE.PlaneGeometry(1.7,3.2), M.windowLit, mat4(3.62,7.6+i*3.1,4));
  }
  for(let i=0;i<5;i++){
    bag.add(archFrameGeo(2.2,4.2,1.8,0.7,0.26), M.paleSand, mat4(-4,6+i*3.2,15.8));
    bag.add(new THREE.PlaneGeometry(1.6,3.0), M.windowLit, mat4(-4,7.5+i*3.2,15.82));
  }
  /* slender Marienbrücke over the gorge, west */
  const br=new GeoBag();
  for(const zz of [-9,9]) br.add(new THREE.BoxGeometry(52,1.2,2.6), M.woodDark, mat4(-30,25,zz));
  for(let i=0;i<9;i++) br.add(new THREE.BoxGeometry(1.0,26,1.0), M.woodDark, mat4(-54+i*6,12,0));
  br.add(new THREE.BoxGeometry(52,0.4,5.4), M.wood, mat4(-30,25.8,0));
  br.build(g,false);
  bag.build(g);
  rec.ornament.push({obj:g,tier:2});
  return rec;
}

/* ============================== 7. FRAUENKIRCHE ============================== */
function buildFrauenkirche(){
  const {g,rec}=newMon('frauenkirche', -Math.PI/2);
  const bag=new GeoBag();
  const PS=M.paleSand, DK=M.darkStone;
  /* square body */
  bag.add(new THREE.BoxGeometry(48,30,48), PS, mat4(0,15,0));
  bag.add(new THREE.BoxGeometry(50,2,50), M.plaster, mat4(0,30.4,0));
  /* four corner stair towers */
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    bag.add(new THREE.CylinderGeometry(4.6,5.0,36,8), PS, mat4(sx*22,18,sz*22));
    bag.add(new THREE.ConeGeometry(5.2,7,8), M.copper, mat4(sx*22,39.5,sz*22));
  }
  /* the great bell dome (stone) on a drum */
  bag.add(new THREE.CylinderGeometry(15.4,16.4,10,28), PS, mat4(0,36,0));
  for(let i=0;i<20;i++){
    const a=i/20*Math.PI*2;
    bag.add(archFrameGeo(2.4,6.0,3.4,0.9,0.4), M.paleSand, mat4(Math.cos(a)*15.8,31.4,Math.sin(a)*15.8,-a+Math.PI/2));
  }
  /* bell profile lathe */
  const pts=[];
  for(let i=0;i<=18;i++){
    const t=i/18;
    const r=16.0*Math.cos(t*1.28)*(1-t*0.06)+(t>0.86?(t-0.86)*6:0);
    pts.push(new THREE.Vector2(Math.max(0.4,r), 10+t*19));
  }
  bag.add(new THREE.LatheGeometry(pts,32), PS, mat4(0,41,0));
  bag.add(new THREE.CylinderGeometry(1.4,2.0,3.0,10), M.copper, mat4(0,70,0));
  bag.add(new THREE.SphereGeometry(1.0,10,8), M.goldDim, mat4(0,72,0));
  /* darker salvaged stones: sparse dark patches across the walls */
  for(let i=0;i<90;i++){
    const face=Math.floor(hash2(i,2)*4);
    const u=(hash2(i,5)-0.5)*44, v=2+hash2(i,7)*26;
    const m=new THREE.Matrix4().makeRotationY(face*Math.PI/2);
    const t=new THREE.Matrix4().makeTranslation(u,v,24.3);
    bag.add(new THREE.PlaneGeometry(1.2+hash2(i,11)*1.6,1.0+hash2(i,13)*1.4), M.darkStone,
      new THREE.Matrix4().multiplyMatrices(m,t));
  }
  /* windows and portal */
  for(let k=0;k<4;k++){
    const m=new THREE.Matrix4().makeRotationY(k*Math.PI/2);
    bag.add(archFrameGeo(9,14,5,1.4,0.9), M.plaster, new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation(0,0,24.1)));
    for(let c=0;c<3;c++){
      bag.add(new THREE.PlaneGeometry(3.4,9), M.windowLit,
        new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation((c-1)*13,12,24.2)));
    }
  }
  bag.build(g);
  rec.ornament.push({obj:g,tier:2});
  return rec;
}

/* ============================== 8. BRANDENBURG GATE ============================== */
function buildBrandenburg(){
  const {g,rec}=newMon('brandenburg', -Math.PI/2);
  const bag=new GeoBag();
  const SS=M.paleSand;
  /* stylobate and the six Doric pairs (12 columns) */
  bag.add(new THREE.BoxGeometry(66,2.2,26), M.plaster, mat4(0,1.1,0));
  bag.add(new THREE.BoxGeometry(64,3.0,23), SS, mat4(0,3.7,0));
  const colH=13.6;
  for(let i=0;i<6;i++){
    const px=-25+i*10;
    for(const pz of [-5.4,5.4]) bag.add(columnGeo(1.05,colH), SS, mat4(px,5.2,pz));
  }
  /* entablature + attic */
  bag.add(new THREE.BoxGeometry(66,2.6,24), SS, mat4(0,19.5,0));
  bag.add(new THREE.BoxGeometry(66,4.6,22), SS, mat4(0,23.1,0));
  bag.add(new THREE.BoxGeometry(68,1.0,24.4), M.plaster, mat4(0,25.8,0));
  /* side wings: solid stone with pilasters and relief panels */
  for(const sx of [-1,1]){
    bag.add(new THREE.BoxGeometry(13,20,16), SS, mat4(sx*36,13.6,0));
    bag.add(new THREE.BoxGeometry(14,1.4,17), M.plaster, mat4(sx*36,24.1,0));
    for(let i=0;i<4;i++) bag.add(new THREE.BoxGeometry(0.9,12,0.9), SS, mat4(sx*36-4.4+i*2.9, 12, 8.2));
  }
  /* quadriga: four horses and the chariot */
  const q=new GeoBag();
  for(let i=0;i<4;i++){
    const px=-3.6+i*2.4;
    q.add(new THREE.BoxGeometry(1.5,2.2,4.6), M.copper, mat4(px,1.6,2.4));
    q.add(new THREE.BoxGeometry(1.2,1.8,1.8), M.copper, mat4(px,3.3,4.4,0,1,1,1,-0.15));
    q.add(new THREE.BoxGeometry(0.9,0.8,1.2), M.copper, mat4(px,4.3,4.9));
    for(const lx of [-0.55,0.55]) for(const lz of [-1.6,1.4]) q.add(new THREE.BoxGeometry(0.34,1.7,0.34), M.copper, mat4(px+lx,0.85,lz+1.0));
    q.add(new THREE.BoxGeometry(0.3,0.9,0.3), M.copper, mat4(px,4.0,1.4,0,1,1,1,0.3));
  }
  q.add(new THREE.BoxGeometry(4.4,2.6,4.0), M.copper, mat4(0,1.3,-1.6));
  q.add(new THREE.TorusGeometry(2.4,0.22,4,14,Math.PI), M.copper, mat4(0,3.4,-1.6,0,1,1,1,Math.PI/2,0));
  q.add(new THREE.CylinderGeometry(0.35,0.35,3.4,8), M.copper, mat4(0,3.4,-1.6));
  q.add(new THREE.SphereGeometry(0.45,8,6), M.copper, mat4(0,5.2,-1.6));
  for(const [mat,list] of q.map){
    const mg=mergeGeometries(list,false); mg.applyMatrix4(new THREE.Matrix4().makeTranslation(0,26.4,0)); bag.add(mg,mat);
  }
  /* the boulevard: row of limes receding, and lamps */
  for(let i=0;i<9;i++){
    for(const sx of [-1,1]) bag.add(new THREE.BoxGeometry(0.5,5.5,0.5), M.woodDark, mat4(sx*10,27.6,-22-i*13));
  }
  bag.build(g);
  rec.ornament.push({obj:g,tier:2});
  return rec;
}

buildRedFort(); buildQutub(); buildGolden(); buildKonark();
buildCologne(); buildNeuschwanstein(); buildFrauenkirche(); buildBrandenburg();
//__CHUNK5__
