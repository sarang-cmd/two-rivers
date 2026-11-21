/*__CHUNK3__*/
/* ============================== site helpers ============================== */
const SITE={};
for(const s of SITES) SITE[s.id]=s;
const _v1=new THREE.Vector3();
/* flat ground height at a site (with a small river-bank allowance) */
function groundY(x,z){ return terrainH(x,z); }
/* builds a monument group: local +z faces the river, terrace sits at y=0 */
function newMon(id, rotY){
  const s=SITE[id];
  const g=new THREE.Group();
  g.position.set(s.x, s.h+0.05, s.z);
  if(rotY) g.rotation.y=rotY;
  scene.add(g);
  const rec={id, name:id, group:g, x:s.x, z:s.z, h:s.h, ornament:[]};
  MONS.push(rec);
  return {g, rec, s};
}
/* stone platform with a slight batter, optional marble rim */
function platform(bag,x,y,z,w,d,h,mat,rimMat){
  bag.add(new THREE.BoxGeometry(w,h,d), mat, mat4(x,y+h/2,z));
  if(rimMat) bag.add(new THREE.BoxGeometry(w+0.9,h*0.28,d+0.9), rimMat, mat4(x,y+h*0.14,z));
}
/* a row of arches: returns nothing, adds piers + arches to bag */
function arcade(bag,x,y,z,w,h,n,depth,mat,archMat,axis){
  const step=w/n;
  for(let i=0;i<=n;i++){
    const p=-w/2+i*step;
    const px = axis==='x' ? x+p : x;
    const pz = axis==='x' ? z : z+p;
    bag.add(new THREE.BoxGeometry(axis==='x'?step*0.3:depth*1.1, h, axis==='x'?depth*1.1:step*0.3), mat, mat4(px,y+h/2,pz));
  }
  for(let i=0;i<n;i++){
    const p=-w/2+(i+0.5)*step;
    const px = axis==='x' ? x+p : x;
    const pz = axis==='x' ? z : z+p;
    const m=mat4(px,y,pz, axis==='x'?0:Math.PI/2);
    bag.add(archFrameGeo(step*0.86,h*0.8,h*0.34,depth*0.5,step*0.09), archMat||mat, m);
  }
}

/* ============================== TAJ MAHAL ============================== */
function buildTaj(){
  const {g,rec,s}=newMon('taj', -Math.PI/2);
  const bag=new GeoBag();
  const W=0xf6f2ea;
  const MB=M.marble;
  /* --- river terrace + plinth --- */
  platform(bag,0,0,0, 118,104,3.2, M.marbleSoft);
  platform(bag,0,3.2,0, 104,92,1.5, MB);
  /* stepped plinth (takhtgah) */
  platform(bag,0,4.7,0, 92,82,2.0, MB);
  platform(bag,0,6.7,0, 88,78,1.4, MB, M.marbleSoft);
  const PY=8.1;                       // main terrace level
  /* --- lower storey block (7 bays wide, 15 deep) --- */
  const BW=56, BD=56, BH=22;
  const body=new THREE.BoxGeometry(BW,BH,BD);
  bag.add(body, MB, mat4(0,PY+BH/2,0));
  /* recessed corners: chamfer strips */
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    bag.add(new THREE.BoxGeometry(9,BH,9), MB, mat4(sx*(BW/2-3.2), PY+BH/2, sz*(BD/2-3.2), Math.PI/4));
  }
  /* mouldings */
  bag.add(new THREE.BoxGeometry(BW+2.2,1.3,BD+2.2), M.marbleSoft, mat4(0,PY+0.7,0));
  bag.add(new THREE.BoxGeometry(BW+1.6,0.9,BD+1.6), M.marbleSoft, mat4(0,PY+BH-0.5,0));
  bag.add(new THREE.BoxGeometry(BW+2.8,0.5,BD+2.8), MB, mat4(0,PY+BH-1.6,0));
  /* pishtaq iwans: big arched portals, one per face */
  const iwanW=22, iwanH=20;
  for(let k=0;k<4;k++){
    const a=k*Math.PI/2;
    const m=new THREE.Matrix4().makeRotationY(a);
    const off=new THREE.Matrix4().makeTranslation(0, PY, BD/2+0.1);
    const frame=new THREE.Matrix4().multiplyMatrices(m,off);
    bag.add(archFrameGeo(iwanW+7, iwanH+4.4, 9.5, 2.6, 2.0), MB, new THREE.Matrix4().multiplyMatrices(frame,new THREE.Matrix4().makeTranslation(0,0,0)));
    /* recessed arch interior: darker marble in shade */
    bag.add(archGeo(iwanW, iwanH, 8.5, 3.2), M.marbleSoft, new THREE.Matrix4().multiplyMatrices(frame,new THREE.Matrix4().makeTranslation(0,0,-1.2)));
    /* side arcades flanking the iwan */
    for(const sd of [-1,1]){
      const px=sd*(iwanW/2+3.4);
      bag.add(archFrameGeo(9.2, iwanH*0.74, 5.2, 1.6, 1.1), MB,
        new THREE.Matrix4().multiplyMatrices(new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation(px,PY,BD/2+0.1)),new THREE.Matrix4()));
    }
    /* calligraphy band above the iwan (abstract strokes, wraps the portal) */
    const bandMat=M.script;
    bag.add(new THREE.PlaneGeometry(iwanW+6.4, 2.5), bandMat,
      new THREE.Matrix4().multiplyMatrices(m, new THREE.Matrix4().makeTranslation(0, PY+iwanH+5.0, BD/2+2.0)));
  }
  /* --- upper storey --- */
  const UY=PY+BH+0.4, UW=44, UD=44, UH=9.5;
  bag.add(new THREE.BoxGeometry(UW,UH,UD), MB, mat4(0,UY+UH/2,0));
  bag.add(new THREE.BoxGeometry(UW+1.4,0.7,UD+1.4), M.marbleSoft, mat4(0,UY+UH-0.35,0));
  for(let k=0;k<4;k++){
    const a=k*Math.PI/2;
    const m=new THREE.Matrix4().makeRotationY(a);
    bag.add(archFrameGeo(15,9.2,4.2,1.4,1.0), MB,
      new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation(0,UY,UD/2+0.05)));
    for(const sd of [-1,1]){
      bag.add(archFrameGeo(5.4,6.2,2.9,1.0,0.7), MB,
        new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation(sd*11,UY,UD/2+0.05)));
    }
    bag.add(new THREE.PlaneGeometry(UW*0.86,1.7), M.script,
      new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation(0,UY+UY*0+7.4,UD/2+0.62)));
  }
  /* chamfered corner octagons of upper storey */
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    bag.add(new THREE.CylinderGeometry(5.6,5.6,UH,8), MB, mat4(sx*(UW/2-1.6),UY+UH/2,sz*(UD/2-1.6)));
  }
  /* --- main dome: bulbous double dome on a high drum --- */
  const DY=UY+UH+0.6;
  bag.add(new THREE.CylinderGeometry(16.6,17.4,7.4,32), MB, mat4(0,DY+3.7,0));
  /* drum windows */
  for(let i=0;i<24;i++){
    const a=i/24*Math.PI*2;
    bag.add(archFrameGeo(2.5,3.8,1.8,0.7,0.35), M.marbleSoft, mat4(Math.cos(a)*16.9, DY+0.9, Math.sin(a)*16.9, -a+Math.PI/2));
  }
  const domeR=20.4, domeH=25.0;
  bag.add(onionDomeGeo(domeR, domeH, 40), MB, mat4(0,DY+7.2,0));
  /* inner shell (visible through the double-dome gap on the river side is subtle; keep for silhouette) */
  bag.add(new THREE.SphereGeometry(domeR*0.8, 24, 12, 0, Math.PI*2, 0, Math.PI*0.5), M.marbleSoft, mat4(0,DY+7.4,0));
  /* dome ribs: thin raised ridges */
  for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2;
    const rib=new THREE.CylinderGeometry(0.22,0.34,domeH*0.94,5);
    bag.add(rib, M.marbleSoft, mat4(Math.cos(a)*domeR*0.36, DY+7.2+domeH*0.47, Math.sin(a)*domeR*0.36, 0, 1,1,1, Math.sin(a)*0.0, 0));
  }
  /* golden finial */
  const finY=DY+7.2+domeH*0.985;
  bag.add(finialGeo(11.5), M.gold, mat4(0,finY,0));
  bag.add(new THREE.SphereGeometry(1.15,12,8), M.gold, mat4(0,finY+8.0,0));
  /* --- four kiosks (chhatris) around the dome --- */
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    addChhatri(bag, sx*17.5, DY+0.2, sz*17.5, 4.4, MB, MB);
  }
  /* --- four minarets, leaning slightly outward --- */
  const minH=48, minR=3.5;
  const minr=[[0,3.5],[0.22,3.25],[0.24,3.3],[0.46,3.05],[0.48,3.1],[0.72,2.9],[0.74,2.95],[0.9,2.72],[0.92,2.78],[1,2.6]];
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    const bx=sx*(BW/2+5.0), bz=sz*(BD/2+5.0);
    const lean=0.016;
    const grpM=new THREE.Matrix4().compose(
      V3(bx,PY,bz),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(-sz*lean,0,sx*lean,'XYZ')),
      V3(1,1,1));
    /* build minaret parts into a temporary bag then bake with group matrix */
    const mb=new GeoBag();
    let y=0;
    for(let i=0;i<minr.length-1;i+=2){
      const y0=minr[i][0]*minH, r0=minr[i][1], y1=minr[i+1][0]*minH, r1=minr[i+1][1];
      mb.add(new THREE.CylinderGeometry(r1,r0,y1-y0,18), MB, mat4(0,y0+(y1-y0)/2,0));
      if(i+2<minr.length){
        mb.add(new THREE.CylinderGeometry(r0*1.5,r0*1.5,0.9,18), M.marbleSoft, mat4(0,y1+0.45,0));
        /* balcony railing */
        for(let q=0;q<16;q++){
          const a=q/16*Math.PI*2;
          mb.add(new THREE.BoxGeometry(0.22,1.5,0.22), M.marbleSoft, mat4(Math.cos(a)*r0*1.42, y1+1.65, Math.sin(a)*r0*1.42));
        }
        mb.add(new THREE.TorusGeometry(r0*1.42,0.11,4,20), M.marbleSoft, mat4(0,y1+2.4,0,0,1,1,1,Math.PI/2,0));
      }
      y=y1;
    }
    mb.add(new THREE.CylinderGeometry(3.9,3.9,1.2,18), M.marbleSoft, mat4(0,minH+0.6,0));
    mb.add(onionDomeGeo(3.9,4.4,16), MB, mat4(0,minH+1.2,0));
    mb.add(finialGeo(3.4), M.gold, mat4(0,minH+5.3,0));
    for(const [mat,list] of mb.map){
      const merged=mergeGeometries(list,false);
      merged.applyMatrix4(grpM);
      bag.add(merged, mat);
    }
  }
  /* --- jali screens: pierced marble windows in the chamfered corners --- */
  const jaliMat=M.jali;
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    for(let lvl=0;lvl<2;lvl++){
      const yy=PY+6+lvl*10.5;
      bag.add(new THREE.PlaneGeometry(7.6,8.2), jaliMat,
        mat4(sx*(BW/2-5.5), yy+4.1, sz*(BD/2+0.7), sx*sz>0? Math.PI/2:-Math.PI/2));
    }
  }
  /* inlaid dado band: dark pietra dura strip at eye height */
  for(let k=0;k<4;k++){
    const a=k*Math.PI/2;
    const m=new THREE.Matrix4().makeRotationY(a);
    bag.add(new THREE.PlaneGeometry(BW-2, 3.2), M.script,
      new THREE.Matrix4().multiplyMatrices(m,new THREE.Matrix4().makeTranslation(0,PY+3.4,BD/2+0.62)));
  }
  bag.build(g);
  /* wet marble sheen helper: subtle specular plane across the plinth */
  rec.ornament.push({obj:g, tier:2});
  return rec;
}
