/*__CHUNK9__*/
/* ============================== the Taj garden and its world ============================== */
function buildTajGarden(){
  const rec=MONS.find(m=>m.id==='taj');
  if(!rec) return;
  const g=rec.group;
  const bag=new GeoBag();
  const RS=M.sandstone, MB=M.marble, MS=M.marbleSoft;
  /* the char-bagh platform: local +z faces the river, so the garden lies at -z */
  const GZ0=-14, GZ1=-146, GW=104;
  bag.add(new THREE.BoxGeometry(GW,1.5,(GZ0-GZ1)), RS, mat4(0,0.75,(GZ0+GZ1)/2));
  bag.add(new THREE.BoxGeometry(GW+2,0.35,(GZ0-GZ1)+2), MS, mat4(0,1.6,(GZ0+GZ1)/2));
  /* four parterres, each quartered again: raised beds with marble kerbs */
  for(const sx of [-1,1]) for(let q=0;q<3;q++){
    const zc=GZ0-22-q*40;
    const bx=sx*27;
    bag.add(new THREE.BoxGeometry(44,0.5,33), M.leafDark, mat4(bx,1.85,zc));
    bag.add(new THREE.BoxGeometry(45.6,0.24,34.6), MS, mat4(bx,1.62,zc));
    /* low hedge rows inside each bed */
    for(let r=0;r<5;r++) bag.add(new THREE.BoxGeometry(41,0.55,1.1), M.leafMid, mat4(bx,2.2,zc-13+r*6.6));
  }
  /* the long reflecting channel with its raised marble tank */
  bag.add(new THREE.BoxGeometry(6.2,0.3,(GZ0-GZ1)-16), MB, mat4(0,1.72,(GZ0+GZ1)/2));
  bag.add(new THREE.BoxGeometry(4.8,0.16,(GZ0-GZ1)-18), M.waterPool, mat4(0,1.98,(GZ0+GZ1)/2));
  for(const sx of [-1,1]) bag.add(new THREE.BoxGeometry(0.42,0.5,(GZ0-GZ1)-16), MS, mat4(sx*3.1,1.95,(GZ0+GZ1)/2));
  const TANKZ=-74;
  bag.add(new THREE.BoxGeometry(20,1.4,20), MB, mat4(0,2.3,TANKZ));
  bag.add(new THREE.BoxGeometry(17,0.3,17), M.waterPool, mat4(0,2.95,TANKZ));
  for(const sx of [-1,1]) for(const sz of [-1,1]) bag.add(new THREE.BoxGeometry(1.4,1.0,1.4), MS, mat4(sx*9.2,3.0,TANKZ+sz*9.2));
  /* fountain jets: thin white columns of water */
  for(let i=0;i<5;i++){
    const z=GZ0-14-i*20;
    bag.add(new THREE.CylinderGeometry(0.10,0.16,2.4,6), M.whitePaint, mat4(0,3.2,z));
    bag.add(new THREE.SphereGeometry(0.34,7,5), M.whitePaint, mat4(0,4.5,z));
  }
  /* cypress avenues: dark narrow columns either side of the channel */
  for(let i=0;i<11;i++){
    const z=GZ0-8-i*12.6;
    for(const sx of [-1,1]){
      bag.add(new THREE.CylinderGeometry(0.24,0.34,2.4,5), M.trunk, mat4(sx*8.6,2.9,z));
      const cy=new THREE.ConeGeometry(2.05,11.5,7); cy.translate(0,7.6,0);
      bag.add(cy, M.leafDark, mat4(sx*8.6,2.4,z));
    }
  }
  /* marble benches at the classic viewpoint, half way down */
  for(const sx of [-1,1]) bag.add(new THREE.BoxGeometry(4.2,0.5,1.4), MS, mat4(sx*6.6,2.4,TANKZ+16));
  /* the great gate: red sandstone with a row of white kiosks */
  const GZ=GZ1-12;
  bag.add(new THREE.BoxGeometry(46,3.0,18), RS, mat4(0,1.5,GZ));
  bag.add(new THREE.BoxGeometry(40,19,14), RS, mat4(0,11.0,GZ));
  bag.add(new THREE.BoxGeometry(42,1.6,16), MS, mat4(0,21.0,GZ));
  bag.add(archFrameGeo(12.5,14.0,7.4,3.4,1.7), M.redSand, mat4(0,3.0,GZ+7.2));
  bag.add(archGeo(11,12.6,6.6,3.2), M.woodDark, mat4(0,3.0,GZ+6.4));
  for(const sx of [-1,1]){
    bag.add(archFrameGeo(6.0,8.0,4.2,1.2,0.6), M.redSand, mat4(sx*15,3.0,GZ+7.2));
    bag.add(new THREE.BoxGeometry(9,11,14), RS, mat4(sx*21,12,GZ));
    addChhatri(bag, sx*21, 18.0, GZ, 1.9, MS, MB);
  }
  for(let i=-3;i<=3;i++) addChhatri(bag, i*5.2, 22.0, GZ, 1.35, MS, MB);
  /* the mosque and its mirror-image jawab, red sandstone with white domes */
  for(const sx of [-1,1]){
    const mx=sx*52, mz=14;
    bag.add(new THREE.BoxGeometry(26,12,20), RS, mat4(mx,7.4,mz));
    bag.add(new THREE.BoxGeometry(28,1.1,22), MS, mat4(mx,13.5,mz));
    for(let k=-1;k<=1;k++) bag.add(onionDomeGeo(3.9,4.4,16), MB, mat4(mx+k*8.2,14.6,mz));
    for(let k=-1;k<=1;k++) bag.add(finialGeo(2.4), M.goldDim, mat4(mx+k*8.2,18.9,mz));
    bag.add(archFrameGeo(9,9.4,5.0,1.6,0.9), M.redSand, mat4(mx,3.4,mz+10.2));
    bag.add(archGeo(7.6,8.2,4.4,1.4), M.woodDark, mat4(mx,3.4,mz+9.6));
    for(const dx of [-9,9]) bag.add(new THREE.CylinderGeometry(1.05,1.15,11,10), MS, mat4(mx+dx,6.4,mz+7.6));
    bag.add(new THREE.PlaneGeometry(15,1.7), M.script, mat4(mx,12.2,mz+10.3));
    /* outer arcade wall along the terrace edge */
    bag.add(new THREE.BoxGeometry(22,7.5,3.0), RS, mat4(sx*40,4.4,mz+16));
  }
  /* boundary wall with corner pavilions, and the river terrace parapet */
  for(const sx of [-1,1]){
    bag.add(new THREE.BoxGeometry(3.4,5.4,(GZ0-GZ1)+22), RS, mat4(sx*(GW/2+2.0),2.6,(GZ0+GZ1)/2-6));
    for(const cq of [GZ0+2, GZ0-46, GZ0-94, GZ1-8]){
      bag.add(new THREE.BoxGeometry(7,7.5,7), RS, mat4(sx*(GW/2+2.0),3.8,cq));
      bag.add(onionDomeGeo(3.4,3.6,12), MS, mat4(sx*(GW/2+2.0),7.2,cq));
    }
  }
  /* the river terrace parapet, seen from the water */
  bag.add(new THREE.BoxGeometry(120,1.5,1.4), MS, mat4(0,4.0,52));
  for(let i=-6;i<=6;i++) bag.add(new THREE.BoxGeometry(1.6,1.1,1.6), MS, mat4(i*9.0,5.0,52));
  bag.build(g);
}
buildTajGarden();
//__CHUNK10__
