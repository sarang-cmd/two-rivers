/*__CHUNK6__*/
/* ============================== vegetation ============================== */
/* one instanced mesh per species; placement rejects water, slopes, monuments */
const VEG_TYPES=[
  /* Indian side: mango / neem / banyan, palms, and the cypress rows of the Taj */
  {id:'mango',  side:'in', trunkH:3.0, crown:'sphere', r:4.6, c1:0x3d6b32, c2:0x6b9440, n:1500, dmin:26, dmax:900},
  {id:'palm',   side:'in', trunkH:8.5, crown:'palm',   r:3.4, c1:0x4a7a38, c2:0x81a84c, n:420,  dmin:24, dmax:700},
  {id:'banyan', side:'in', trunkH:4.0, crown:'wide',   r:7.4, c1:0x335c2c, c2:0x557f36, n:340,  dmin:30, dmax:800},
  /* German side: beech, spruce, poplar, and limes along the boulevards */
  {id:'beech',  side:'de', trunkH:4.6, crown:'sphere', r:5.2, c1:0x33582f, c2:0x5a7f3a, n:1700, dmin:26, dmax:1000},
  {id:'spruce', side:'de', trunkH:6.0, crown:'cone',   r:3.6, c1:0x24462b, c2:0x355e34, n:1500, dmin:30, dmax:1300},
  {id:'poplar', side:'de', trunkH:7.0, crown:'tall',   r:2.8, c1:0x46693a, c2:0x6d9048, n:520,  dmin:26, dmax:800},
];
function crownGeo(kind,r){
  if(kind==='cone')  return new THREE.ConeGeometry(r, r*3.0, 7, 2);
  if(kind==='tall')  return new THREE.SphereGeometry(r,7,6).scale(1,2.4,1);
  if(kind==='wide')  return new THREE.SphereGeometry(r,8,6).scale(1.25,0.62,1.25);
  if(kind==='palm'){
    const parts=[];
    for(let i=0;i<8;i++){
      const f=new THREE.BoxGeometry(0.34,r*2.1,0.7);
      f.translate(0,r*1.0,0);
      f.rotateZ(0.85); f.rotateY(i/8*Math.PI*2);
      parts.push(f.toNonIndexed());
    }
    parts.push(new THREE.SphereGeometry(r*0.32,6,5).toNonIndexed());
    return mergeGeometries(parts,false);
  }
  return new THREE.SphereGeometry(r,8,6).scale(1,0.92,1);
}
function buildVegetation(){
  const dummy=new THREE.Object3D();
  const col=new THREE.Color();
  const built=[];
  for(const t of VEG_TYPES){
    const crownList=[], trunkList=[];
    const trunkG=new THREE.CylinderGeometry(0.26,0.42,t.trunkH,6);
    trunkG.translate(0,t.trunkH/2,0);
    const cg=crownGeo(t.crown,t.r);
    const yOff = t.crown==='cone' ? t.trunkH*0.55 : t.trunkH + (t.crown==='tall'?t.r*1.6:0);
    let placed=0, tries=0, fails=0;
    while(placed<t.n && tries<t.n*26){
      tries++;
      /* bias placement near the valley floor, thinning with distance */
      const zz=rand(-1500,3100);
      const side=t.side==='in' ? rand(-40,2600) : rand(-2600,240);
      const x=side + (t.side==='in'?Math.max(0,zz)*0.16:-Math.max(0,zz)*0.24);
      const rn=rivers.near(x,zz);
      if(rn.d < t.dmin || rn.d > t.dmax){ fails++; if(fails>10 && placed>60){} continue; }
      const y=terrainH(x,zz);
      if(y<1.2 || y>420) continue;
      let bad=false;
      for(const s of SITES){ const dx=x-s.x, dz=zz-s.z; if(!s.water && dx*dx+dz*dz < (s.r*0.92)*(s.r*0.92)){ bad=true; break; } }
      if(bad) continue;
      /* slope rejection */
      const h1=terrainH(x+7,zz), h2=terrainH(x,zz+7);
      if(Math.abs(h1-y)>4.2 || Math.abs(h2-y)>4.2) continue;
      const sc=0.72+hash2(x,zz)*0.62;
      dummy.position.set(x,y-0.4,zz);
      dummy.rotation.set(0,hash2(zz,x)*6.283,0);
      dummy.scale.set(sc,sc*(0.88+hash2(x*1.7,zz)*0.34),sc);
      dummy.updateMatrix();
      trunkList.push(dummy.matrix.clone());
      dummy.position.y=y-0.4+yOff*sc;
      dummy.updateMatrix();
      crownList.push(dummy.matrix.clone());
      placed++;
    }
    if(!crownList.length) continue;
    const cm=new THREE.MeshStandardMaterial({color:0xffffff, roughness:0.95, vertexColors:false});
    const inst=new THREE.InstancedMesh(cg, cm, crownList.length);
    const im=new THREE.InstancedMesh(trunkG, M.trunk, trunkList.length);
    for(let i=0;i<crownList.length;i++){
      inst.setMatrixAt(i,crownList[i]);
      col.setHex(t.c1).lerp(new THREE.Color(t.c2), hash2(i,3));
      inst.setColorAt(i,col);
      im.setMatrixAt(i,trunkList[i]);
    }
    inst.instanceMatrix.needsUpdate=true; im.instanceMatrix.needsUpdate=true;
    if(inst.instanceColor) inst.instanceColor.needsUpdate=true;
    inst.castShadow=true; inst.receiveShadow=true; im.castShadow=false; im.receiveShadow=true;
    inst.frustumCulled=false; im.frustumCulled=false;
    scene.add(inst); scene.add(im);
    built.push({inst,im,type:t.id});
  }
  return built;
}
/* vineyards: terraced rows on the German slopes */
function buildVineyards(){
  const rowG=new THREE.BoxGeometry(23,1.5,1.3);
  rowG.translate(0,0.75,0);
  const list=[];
  const dummy=new THREE.Object3D();
  for(let i=0;i<520;i++){
    const zz=rand(150,2500), x=-90-rand(0,420);
    const y=terrainH(x,zz);
    if(y<10||y>170) continue;
    const rn=rivers.near(x,zz); if(rn.d<70) continue;
    let bad=false;
    for(const s of SITES){ const dx=x-s.x, dz=zz-s.z; if(dx*dx+dz*dz<s.r*s.r) { bad=true; break; } }
    if(bad) continue;
    for(let k=0;k<3;k++){
      dummy.position.set(x+rand(-4,4), y, zz+k*3.4);
      dummy.rotation.set(0, -0.42+rand(-0.1,0.1), 0);
      dummy.scale.set(0.7+rand(0.6),1,1);
      dummy.updateMatrix(); list.push(dummy.matrix.clone());
    }
  }
  const mat=new THREE.MeshStandardMaterial({color:0x6b8a44, roughness:0.95});
  const inst=new THREE.InstancedMesh(rowG, mat, list.length);
  for(let i=0;i<list.length;i++) inst.setMatrixAt(i,list[i]);
  inst.instanceMatrix.needsUpdate=true;
  inst.castShadow=false; inst.receiveShadow=true; inst.frustumCulled=false;
  scene.add(inst);
}
/* ============================== settlements ============================== */
/* clustered houses with pitched roofs, ghats beside the Indian river,
   quays and market squares beside the German one */
function buildSettlements(){
  const wallBag=new GeoBag();
  const dummy=new THREE.Object3D();
  const roofBag=new GeoBag();
  const towns=SITES.filter(s=>s.id.startsWith('t_'));
  const indianHouse=[0xe6d7b8,0xdcc8a2,0xf0e4c8,0xcfae88,0xe8c9a0];
  const germanHouse=[0xe4dccb,0xd8cbb2,0xc9b79b,0xece4d4,0xb99f86];
  for(const t of towns){
    const isIn = t.id!=='t_harbourDe' && (t.id==='t_harbourIn'||t.x>0);
    let placed=0, tries=0;
    const want=isIn?34:30;
    while(placed<want && tries<420){
      tries++;
      const a=rand(Math.PI*2), rad=t.r*(0.25+rand(0.75));
      const x=t.x+Math.cos(a)*rad, z=t.z+Math.sin(a)*rad*0.8;
      const y=terrainH(x,z);
      if(y<1.4) continue;
      const rn=rivers.near(x,z); if(rn.d<rn.w*0.62+7) continue;
      const hh=5.5+hash2(x,z)*8.5;
      const w=6+hash2(z,x)*7, d=6+hash2(x*1.3,z)*7;
      const ry=Math.round(hash2(x*0.7,z*0.7)*4)*Math.PI/2 + (isIn?0:0.12*hash2(x,z));
      const mat = hash2(x,z)>0.5 ? M.plaster : M.whitePaint;
      wallBag.add(new THREE.BoxGeometry(w,hh,d), mat, mat4(x,y-0.6,z,ry));
      const roofM = isIn ? M.paleSand : (hash2(z,x)>0.55 ? M.roofRed : M.roofGrey);
      pitchRoof(roofBag, w*1.06, d*1.06, isIn?2.2:3.4, roofM, x, y-0.6+hh, z, ry);
      /* a couple of windows each */
      for(let k=0;k<3;k++){
        wallBag.add(new THREE.PlaneGeometry(0.9,1.3), M.windowLit,
          RT(ry, x+(k-1)*w*0.28, y-0.6+hh*0.62, z+d/2*Math.cos(0)+0.06));
      }
      placed++;
      if(placed>10) { /* keep loop bounded */ }
    }
    /* a small landmark in each town: temple shikhara or church spire */
    if(isIn){
      wallBag.add(new THREE.BoxGeometry(9,7,9), M.paleSand, mat4(t.x+18,terrainH(t.x+18,t.z-14)+3,t.z-14));
      wallBag.add(new THREE.ConeGeometry(6.4,16,6), M.paleSand, mat4(t.x+18,terrainH(t.x+18,t.z-14)+14.4,t.z-14));
      wallBag.add(new THREE.SphereGeometry(0.9,8,6), M.gold, mat4(t.x+18,terrainH(t.x+18,t.z-14)+23,t.z-14));
    } else {
      const bx=t.x-20, bz=t.z-12, by=terrainH(bx,bz);
      wallBag.add(new THREE.BoxGeometry(10,16,12), M.plaster, mat4(bx,by+7.4,bz));
      pitchRoof(roofBag,10,12,5,M.roofRed,bx,by+15.4,bz);
      wallBag.add(new THREE.BoxGeometry(5,24,5), M.plaster, mat4(bx+6,by+11.4,bz+5));
      wallBag.add(new THREE.ConeGeometry(3.6,9,6), M.copper, mat4(bx+6,by+27.9,bz+5));
    }
  }
  wallBag.build(scene);
  roofBag.build(scene);
}
/* ============================== roads, quays, ghats ============================== */
function buildWays(){
  const bag=new GeoBag();
  const line=[];
  /* a road tracing each bank, ghats every hundred metres on the Indian side */
  function traceBank(poly, sideSign, width, mat, lift){
    const pts=[];
    for(let i=0;i<poly.length-1;i++){
      const [x0,z0]=poly[i], [x1,z1]=poly[i+1];
      const dx=x1-x0, dz=z1-z0, len=Math.hypot(dx,dz);
      const nx=-dz/len, nz=dx/len;
      const n=Math.max(1,Math.round(len/18));
      for(let j=0;j<n;j++){
        const t=j/n;
        pts.push([x0+dx*t+nx*sideSign*width, z0+dz*t+nz*sideSign*width]);
      }
    }
    for(let i=0;i<pts.length-1;i++){
      const [ax,az]=pts[i], [bx,bz]=pts[i+1];
      const mx=(ax+bx)/2, mz=(az+bz)/2;
      const y=terrainH(mx,mz)+lift;
      const ang=Math.atan2(bx-ax, bz-az);
      const len=Math.hypot(bx-ax,bz-az);
      bag.add(new THREE.BoxGeometry(9,0.35,len*1.05), mat, mat4(mx,y,mz,ang));
      if(i%7===0) bag.add(new THREE.BoxGeometry(1.0,4.4,1.0), M.woodDark, mat4(mx+2,y+2.2,mz));
    }
    return pts;
  }
  traceBank(R_INDIAN, 1, 78, M.paleSand, 0.4);
  traceBank(R_INDIAN, -1, 78, M.plaster, 0.4);
  traceBank(R_GERMAN, 1, 72, M.roofGrey, 0.4);
  traceBank(R_GERMAN, -1, 72, M.roofGrey, 0.4);
  traceBank(R_SHARED, 1, 84, M.plaster, 0.4);
  traceBank(R_SHARED, -1, 84, M.plaster, 0.4);
  /* ghats: stone flights down to the Indian water at intervals */
  for(let i=1;i<R_INDIAN.length-1;i++){
    const [x,z]=R_INDIAN[i];
    for(const side of [-1,1]){
      const px=x+side*44, pz=z;
      const y=terrainH(px,pz);
      for(let k=0;k<5;k++){
        bag.add(new THREE.BoxGeometry(24,0.6,3.0), M.paleSand, mat4(px - side*(k*2.4), y-k*0.55+0.4, pz));
      }
      for(let k=0;k<4;k++) bag.add(new THREE.BoxGeometry(1.0,3.0,1.0), M.paleSand, mat4(px-side*12+k*0.0, y+1.5, pz-13+k*8.6));
    }
  }
  /* harbour quays at the confluence, plus cranes and warehouses */
  for(const sx of [-1,1]){
    for(let i=0;i<5;i++){
      const z=-60-i*40, x=sx*70;
      const y=terrainH(x,z)+0.5;
      bag.add(new THREE.BoxGeometry(26,1.6,36), M.plaster, mat4(x,y,z));
      bag.add(new THREE.BoxGeometry(22,8,30), M.brick, mat4(x+sx*16,y+4,z));
      pitchRoof(bag,22,30,5,M.roofGrey,x+sx*16,y+8,z);
      if(i%2===0){
        bag.add(new THREE.BoxGeometry(0.9,17,0.9), M.slate, mat4(x,y+8.5,z+8));
        bag.add(new THREE.BoxGeometry(13,0.7,0.7), M.slate, mat4(x-sx*6,y+16.6,z+8));
      }
    }
  }
  bag.build(scene);
}
buildVegetation();
buildVineyards();
buildSettlements();
buildWays();
//__CHUNK7__
