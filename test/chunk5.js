/*__CHUNK5__*/
/* ============================== India: 8 archetypes ============================== */
/* 1. Humayun's Tomb — red sandstone + white marble dome in a char-bagh */
function buildHumayun(){
  const {g,rec}=newMon('humayun', -Math.PI/2);
  const bag=new GeoBag();
  const RS=M.sandstone, MB=M.marble;
  bag.add(new THREE.BoxGeometry(96,1.6,96), M.sandstone2, mat4(0,0.8,0));   // garden platform
  bag.add(new THREE.BoxGeometry(58,3.4,58), RS, mat4(0,3.3,0));
  /* octagonal main mass with chamfered corners */
  bag.add(new THREE.CylinderGeometry(23,23,22,8), RS, mat4(0,16,0));
  bag.add(new THREE.CylinderGeometry(24,24,1.2,8), M.marbleSoft, mat4(0,26.6,0));
  bag.add(new THREE.CylinderGeometry(17,18,9,8), RS, mat4(0,30.5,0));
  /* white marble dome + finial */
  bag.add(new THREE.CylinderGeometry(13,13.6,4.0,24), M.marbleSoft, mat4(0,36.5,0));
  bag.add(onionDomeGeo(14.5,15.0,28), MB, mat4(0,39.5,0));
  bag.add(finialGeo(6.4), M.goldDim, mat4(0,54.0,0));
  /* four chhatris on the roof + four small corner kiosks */
  for(const sx of [-1,1]) for(const sz of [-1,1]) addChhatri(bag, sx*17, 27.2, sz*17, 2.6, M.marbleSoft, MB);
  /* arched iwans on each face */
  for(let k=0;k<4;k++){
    const a=k*Math.PI/2;
    bag.add(archFrameGeo(12,15,6,2.0,1.3), M.paleSand, RT(a,0,8,20.4));
    bag.add(archGeo(10,13,5,1.6), M.woodDark, RT(a,0,8,21.0));
  }
  /* the garden: parterres, channels, corner pavilions, gate */
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      const px=-33+i*22, pz=-33+j*22;
      bag.add(new THREE.BoxGeometry(16,0.9,16), M.leafDark, mat4(px,1.7,pz));
      bag.add(new THREE.BoxGeometry(17.4,0.4,17.4), M.marbleSoft, mat4(px,1.15,pz));
    }
  }
  bag.add(new THREE.BoxGeometry(5,0.5,88), M.waterPool, mat4(0,1.8,0));
  bag.add(new THREE.BoxGeometry(88,0.5,5), M.waterPool, mat4(0,1.8,0));
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    bag.add(new THREE.BoxGeometry(11,8,11), RS, mat4(sx*41,5.6,sz*41));
    bag.add(onionDomeGeo(5.2,5.4,14), MB, mat4(sx*41,9.6,sz*41));
  }
  bag.add(new THREE.BoxGeometry(26,13,8), RS, mat4(0,7.4,-52));
  bag.add(archFrameGeo(10,9,4,1.6,0.9), M.paleSand, mat4(0,1.8,-48.2));
  for(const sx of [-1,1]) addChhatri(bag, sx*9, 13.6, -52, 1.7, M.marbleSoft, MB);
  bag.build(g);
  rec.ornament.push({obj:g,tier:2});
  return rec;
}
/* 2. India Gate — basalt war arch at the head of a long boulevard */
function buildIndiaGate(){
  const {g,rec}=newMon('indiagate', -Math.PI/2);
  const bag=new GeoBag();
  const BS=M.basalt;
  bag.add(new THREE.BoxGeometry(64,12,34), BS, mat4(0,6,0));
  bag.add(new THREE.BoxGeometry(66,1.2,35), M.paleSand, mat4(0,12.4,0));
  /* the great arch: piers + archivolt */
  for(const sx of [-1,1]) bag.add(new THREE.BoxGeometry(17,26,18), BS, mat4(sx*17,25,0));
  bag.add(archFrameGeo(22,26,16,18,5.6), BS, mat4(0,12,0));
  bag.add(new THREE.BoxGeometry(56,9,17), BS, mat4(0,43,0));
  bag.add(new THREE.BoxGeometry(58,1.6,18.5), M.paleSand, mat4(0,48.2,0));
  /* shallow dome + small bowl on the attic */
  bag.add(new THREE.CylinderGeometry(13,13,1.2,20), BS, mat4(0,49.0,0));
  bag.add(onionDomeGeo(11.6,7.4,22), BS, mat4(0,49.4,0));
  bag.add(new THREE.SphereGeometry(1.5,10,8), M.goldDim, mat4(0,57.4,0));
  /* soffit coffers, inscription band, and the lamps flanking */
  for(let i=0;i<9;i++) bag.add(new THREE.BoxGeometry(2.4,1.0,1.2), M.paleSand, mat4(0,29.5,-8.6+i*0.0));
  for(const sx of [-1,1]){
    bag.add(new THREE.CylinderGeometry(0.35,0.5,9,8), M.basalt, mat4(sx*30,24,20));
    bag.add(new THREE.SphereGeometry(1.1,10,8), M.lampWarm, mat4(sx*30,29,20));
  }
  /* canopy-lined ceremonial avenue */
  for(let i=0;i<14;i++){
    for(const sx of [-1,1]){
      bag.add(new THREE.CylinderGeometry(0.5,0.7,9,7), M.trunk, mat4(sx*30, 4.5, -40-i*20));
      bag.add(new THREE.SphereGeometry(7.5,8,6), M.leafDark, mat4(sx*30, 12, -40-i*20));
    }
  }
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 3. Lotus Temple — 27 marble petals in nine groups, ringed by pools */
function buildLotus(){
  const {g,rec}=newMon('lotus', -Math.PI/2);
  const bag=new GeoBag();
  const MB=M.marble;
  bag.add(new THREE.CylinderGeometry(46,48,2.0,40), M.marbleSoft, mat4(0,1,0));
  /* nine pools around the plinth */
  for(let i=0;i<9;i++){
    const a=i/9*Math.PI*2;
    const px=Math.cos(a)*40, pz=Math.sin(a)*40;
    bag.add(new THREE.CircleGeometry(8.6,18).rotateX(-Math.PI/2), M.waterPool, mat4(px,2.2,pz));
  }
  /* petals: three rings of 9 shells */
  for(let ring=0;ring<3;ring++){
    const n=9, R=6+ring*3.2, tilt=0.30+ring*0.10, H=13+ring*5.0;
    for(let i=0;i<n;i++){
      const a=i/n*Math.PI*2+ring*0.13;
      const geo=new THREE.SphereGeometry(H,7,5,0,Math.PI*0.46,0,Math.PI*0.5);
      const m=new THREE.Matrix4().compose(
        V3(Math.cos(a)*R, 2.4+ring*1.2, Math.sin(a)*R),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0,-a+Math.PI/2,tilt,'YXZ')),
        V3(1,1.05,0.9));
      bag.add(geo, MB, m);
    }
  }
  bag.add(new THREE.CylinderGeometry(4.5,6.0,7,16), M.marbleSoft, mat4(0,5,0));
  /* the nine doors, dark under the petals */
  for(let i=0;i<9;i++){
    const a=i/9*Math.PI*2;
    bag.add(archGeo(4.4,7,3,1.0), M.woodDark, RT(a+Math.PI, Math.cos(a)*12.4, 2.6, Math.sin(a)*12.4));
  }
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 4. Hawa Mahal — pink sandstone facade of ~1000 latticed windows */
function buildHawa(){
  const {g,rec}=newMon('hawamahal', -Math.PI/2);
  const bag=new GeoBag();
  const PK=M.pinkSand;
  bag.add(new THREE.BoxGeometry(56,3.0,20), M.sandstone2, mat4(0,1.5,0));
  for(let lvl=0;lvl<5;lvl++){
    const y=3.0+lvl*4.5, inset=lvl*1.1;
    bag.add(new THREE.BoxGeometry(52-inset*2,4.5,16-inset), PK, mat4(0,y+2.25,lvl*0.5));
    /* arcaded rows of jali windows */
    const cols=17-lvl;
    for(let c=0;c<cols;c++){
      const px=(c-(cols-1)/2)*(48/cols);
      bag.add(archFrameGeo(2.6,3.6,1.4,0.6,0.24), M.sandstone, mat4(px,y+0.5,7.2-inset*0.5+lvl*0.5));
      bag.add(new THREE.PlaneGeometry(2.0,3.0), M.jali, mat4(px,y+1.6,7.5-inset*0.5+lvl*0.5));
    }
    /* chhatri crowns on the top */
    if(lvl===4){
      for(let c=0;c<5;c++) addChhatri(bag, -18+c*9, y+4.5, 1, 1.5, M.paleSand, PK);
    }
  }
  /* cusped cornices */
  for(let lvl=0;lvl<5;lvl++) bag.add(new THREE.BoxGeometry(53-lvl*2,0.5,17.5-lvl), M.sandstone2, mat4(0,3.4+lvl*4.5,lvl*0.5));
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 5. Amber Fort — ridge palace above the lake */
function buildAmber(){
  const {g,rec}=newMon('amber', -Math.PI/2);
  const bag=new GeoBag();
  const RS=M.sandstone, PS=M.paleSand;
  /* long rampart walls along both flanks going down the ridge */
  for(const sx of [-1,1]){
    for(let i=0;i<10;i++){
      const z=-70+i*16, x=sx*(30+i*2.2);
      bag.add(new THREE.BoxGeometry(7,10,16), RS, mat4(x,3+i*1.4,z));
      crenels(bag,16,8+i*1.4,z,RS,'z',x,3.0,1.6);
    }
  }
  /* main palace: double courtyard block with flat roofs and chhatris */
  bag.add(new THREE.BoxGeometry(64,16,44), RS, mat4(0,8,0));
  bag.add(new THREE.BoxGeometry(66,1.4,46), PS, mat4(0,16.6,0));
  bag.add(new THREE.BoxGeometry(34,12,30), PS, mat4(0,22,4));
  bag.add(new THREE.BoxGeometry(36,1.0,32), M.marbleSoft, mat4(0,28.4,4));
  for(const sx of [-1,1]) for(const sz of [-1,1]) addChhatri(bag, sx*13, 28.6, 4+sz*12, 2.2, M.marbleSoft, M.marble);
  addChhatri(bag,0,28.6,4,3.0,M.marble,M.marble);
  /* jali arcades and the mirrored hall */
  for(let c=0;c<11;c++){
    bag.add(archFrameGeo(4.4,7.0,3.0,0.9,0.4), PS, mat4(-30+c*6,1.4,22.2));
    bag.add(new THREE.PlaneGeometry(3.4,5.4), M.jali, mat4(-30+c*6,1.4+1.2,22.6));
  }
  for(let c=0;c<7;c++) bag.add(archFrameGeo(4.0,6.4,2.8,0.8,0.35), PS, mat4(-24+c*8,16.6,22.4));
  /* gate with a steep stepped roof */
  bag.add(new THREE.BoxGeometry(20,18,14), RS, mat4(-34,9,26));
  bag.add(gableGeo(20,7,14), M.sandstone2, mat4(-34,18,26));
  bag.add(archFrameGeo(11,12,5,1.6,0.9), PS, mat4(-34,1.4,33.2));
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 6. Meenakshi Temple — painted gopurams and the golden lotus tank */
function buildMeenakshi(){
  const {g,rec}=newMon('meenakshi', -Math.PI/2);
  const bag=new GeoBag();
  bag.add(new THREE.BoxGeometry(88,1.4,88), M.paleSand, mat4(0,0.7,0));
  /* gopuram: tapering tiered tower of painted figures */
  function gopuram(x,z,w,h,base,rot){
    const tiers=7;
    for(let t=0;t<tiers;t++){
      const s=w*(1-t*0.10), y=base+t*(h/tiers);
      bag.add(new THREE.BoxGeometry(s,s*0.7,h/tiers*0.92), t%2? M.pinkSand : M.sandstone2, mat4(x,y+h/tiers/2,z,rot));
      bag.add(new THREE.BoxGeometry(s*1.06,s*0.74,0.7), M.plaster, mat4(x,y+h/tiers*0.96,z,rot));
      /* rows of little painted figures */
      for(let c=0;c<Math.floor(s/2.2);c++){
        const px=(c-(Math.floor(s/2.2)-1)/2)*2.2;
        bag.add(new THREE.BoxGeometry(1.4,1.4,0.5), (c+t)%3===0? M.paleSand : M.goldDim,
          RT(rot, x+px, y+h/tiers*0.45, z+s*0.36));
      }
    }
    const topY=base+h;
    bag.add(new THREE.CylinderGeometry(w*0.30,w*0.34,2.4,4), M.plaster, mat4(x,topY+1.2,z,rot));
    for(const sx of [-1,1]) bag.add(new THREE.CylinderGeometry(0.6,0.8,3.0,7), M.gold, mat4(x+sx*w*0.26,topY+3,z,rot));
    bag.add(new THREE.CylinderGeometry(0.2,0.9,w*0.5,12), M.gold, mat4(x,topY+4.4,z,rot));
  }
  gopuram(0,-34,22,40,1.4,0);
  gopuram(-34,0,18,30,1.4,Math.PI/2);
  gopuram(34,0,18,30,1.4,Math.PI/2);
  gopuram(0,34,20,34,1.4,0);
  /* inner shrine with gilded vimana */
  bag.add(new THREE.BoxGeometry(30,10,26), M.sandstone, mat4(0,5,0));
  bag.add(new THREE.BoxGeometry(18,9,16), M.plaster, mat4(0,14,0));
  bag.add(onionDomeGeo(9.4,9.0,18), M.gold, mat4(0,23.4,0));
  bag.add(finialGeo(4.4), M.gold, mat4(0,32.0,0));
  /* the temple tank (golden lotus) in front */
  bag.add(new THREE.BoxGeometry(34,0.4,34), M.waterPool, mat4(0,1.2,52));
  for(const [px,pz,w,d] of [[0,35,36,3],[0,69,36,3],[17,52,3,34],[-17,52,3,34]])
    bag.add(new THREE.BoxGeometry(w,3.4,d), M.paleSand, mat4(px,1.4,pz));
  for(let i=0;i<18;i++) bag.add(new THREE.BoxGeometry(2.0,2.0,0.4), M.plaster, mat4(-14+i*1.6,3.6,52.8));
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 7. Gateway of India — basalt arch on the harbour front */
function buildGateway(){
  const {g,rec}=newMon('gateway', -Math.PI/2);
  const bag=new GeoBag();
  const BS=M.basalt;
  bag.add(new THREE.BoxGeometry(44,3.0,30), M.paleSand, mat4(0,1.5,0));
  for(const sx of [-1,1]) bag.add(new THREE.BoxGeometry(14,22,20), BS, mat4(sx*13,14,0));
  bag.add(archFrameGeo(18,23,13,20,4.0), BS, mat4(0,3,0));
  bag.add(new THREE.BoxGeometry(42,7,20), BS, mat4(0,28.5,0));
  bag.add(new THREE.BoxGeometry(44,1.2,21), M.paleSand, mat4(0,32.3,0));
  /* four corner turrets with small domes */
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    bag.add(new THREE.CylinderGeometry(2.8,3.1,4.0,8), BS, mat4(sx*19,34.6,sz*8.4));
    bag.add(onionDomeGeo(3.0,3.2,10), BS, mat4(sx*19,38.4,sz*8.4));
  }
  bag.add(new THREE.CylinderGeometry(6.0,6.4,3.0,20), BS, mat4(0,33.6,0));
  bag.add(onionDomeGeo(6.2,5.2,18), BS, mat4(0,36.2,0));
  /* harbour steps, bollards, benches */
  for(let i=0;i<5;i++) bag.add(new THREE.BoxGeometry(54,0.8,2.6), M.paleSand, mat4(0,0.4-i*0.5,17+i*2.4));
  for(let i=0;i<7;i++) bag.add(new THREE.CylinderGeometry(0.6,0.7,1.6,8), M.basalt, mat4(-27+i*9,0.8,15));
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 8. Mysore Palace — arcades and domes outlined in bulbs */
function buildMysore(){
  const {g,rec}=newMon('mysore', -Math.PI/2);
  const bag=new GeoBag();
  const PS=M.paleSand;
  bag.add(new THREE.BoxGeometry(84,2.4,60), M.sandstone2, mat4(0,1.2,0));
  /* main block, arcaded, with a projecting central porch */
  bag.add(new THREE.BoxGeometry(64,16,34), PS, mat4(0,10,0));
  bag.add(new THREE.BoxGeometry(66,1.2,36), M.marbleSoft, mat4(0,18.6,0));
  for(let c=0;c<13;c++){
    bag.add(archFrameGeo(3.6,7.4,4.6,0.9,0.4), M.pinkSand, mat4(-30+c*5,2.4,17.2));
    bag.add(new THREE.PlaneGeometry(2.8,5.6), M.bulb, mat4(-30+c*5,4.4,17.4));
  }
  bag.add(new THREE.BoxGeometry(22,18,12), PS, mat4(0,11,21));
  bag.add(archFrameGeo(11,12,7,1.2,0.6), M.pinkSand, mat4(0,2.4,27.2));
  /* the tall central dome with its golden finial */
  bag.add(new THREE.CylinderGeometry(9.6,10.4,7,20), PS, mat4(0,24,0));
  bag.add(onionDomeGeo(10.6,11.0,24), PS, mat4(0,30.6,0));
  bag.add(finialGeo(6.0), M.gold, mat4(0,41.2,0));
  /* flanking towers and small domes */
  for(const sx of [-1,1]){
    bag.add(new THREE.BoxGeometry(11,22,11), PS, mat4(sx*24,13,-4));
    bag.add(onionDomeGeo(5.4,6.0,14), PS, mat4(sx*24,23.6,-4));
    bag.add(finialGeo(3.0), M.gold, mat4(sx*24,29.4,-4));
    for(const sz of [-1,1]){
      bag.add(new THREE.BoxGeometry(7,13,7), PS, mat4(sx*31,8.4,sz*12));
      bag.add(onionDomeGeo(3.6,4.2,12), PS, mat4(sx*31,14.8,sz*12));
    }
  }
  bag.build(g);
  /* bulb strings: emissive beads along every cornice and arch (on at dusk) */
  const bulbs=new THREE.Group();
  const bbag=new GeoBag();
  for(let c=0;c<66;c++){
    bbag.add(new THREE.SphereGeometry(0.30,6,4), M.bulb, mat4(-32+c,19.4,17.6));
    bbag.add(new THREE.SphereGeometry(0.30,6,4), M.bulb, mat4(-32+c,19.4,-17.6));
  }
  for(let c=0;c<44;c++){
    bbag.add(new THREE.SphereGeometry(0.28,6,4), M.bulb, mat4(17.6,19.4,-21+c));
    bbag.add(new THREE.SphereGeometry(0.28,6,4), M.bulb, mat4(-17.6,19.4,-21+c));
  }
  bbag.build(bulbs,false);
  g.add(bulbs);
  LIGHTS.bulbs.push({obj:bulbs});
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}

/* ============================== Germany: 9 archetypes ============================== */
/* 1. Heidelberg Castle ruins on the hillside above the bridge */
function buildHeidelberg(){
  const {g,rec}=newMon('heidelberg', -Math.PI/2);
  const bag=new GeoBag();
  const RS=M.sandstone;
  /* ragged curtain wall following the slope */
  for(let i=0;i<12;i++){
    const a=i/12*Math.PI*2, r=44;
    const px=Math.cos(a)*r, pz=Math.sin(a)*r*0.7;
    const hh=12+hash2(i,3)*10;
    bag.add(new THREE.BoxGeometry(6,hh,14), RS, mat4(px,hh/2-2,pz,-a));
  }
  /* the Friedrichsbau with its ornate facade */
  bag.add(new THREE.BoxGeometry(30,22,18), RS, mat4(-18,9,-6));
  bag.add(gableGeo(18,7,30), M.roofRed, mat4(-18,20,-6));
  for(let r=0;r<3;r++) for(let c=0;c<5;c++){
    bag.add(new THREE.PlaneGeometry(2.4,3.2), M.windowLit, mat4(-30+c*6,4+r*6,2.3));
    bag.add(new THREE.BoxGeometry(3.4,1.0,0.6), M.paleSand, mat4(-30+c*6,6.2+r*6,2.3));
  }
  /* the collapsed tower: broken cylinder of red stone */
  bag.add(new THREE.CylinderGeometry(9,9.6,26,16,1,true,0,Math.PI*1.55), RS, mat4(24,7,4));
  bag.add(new THREE.CylinderGeometry(9,9.6,4,16,1,true,Math.PI*1.55,Math.PI*0.45), RS, mat4(24,-7,4));
  for(let i=0;i<9;i++) bag.add(new THREE.BoxGeometry(2.2,2.4,2.2), RS, mat4(24+Math.cos(i)*9,22+i*0.6,4+Math.sin(i)*9));
  /* the great barrel vault hall: long low block */
  bag.add(new THREE.BoxGeometry(40,14,16), RS, mat4(6,5,-22));
  pitchRoof(bag,40,16,6,M.roofRed,6,12,-22);
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 2. Hohenzollern — many-turreted castle crown on a conical hill */
function buildHohenzollern(){
  const {g,rec}=newMon('hohenzollern', -Math.PI/2);
  const bag=new GeoBag();
  const PS=M.paleSand, RF=M.roofGrey;
  /* ring of walls following the summit */
  for(let i=0;i<16;i++){
    const a=i/16*Math.PI*2, r=27;
    bag.add(new THREE.BoxGeometry(11,16,6), PS, mat4(Math.cos(a)*r, 6, Math.sin(a)*r, -a+Math.PI/2));
    crenels(bag,11,14,Math.sin(a)*r,PS,'x',Math.cos(a)*r,2.6,1.4);
  }
  /* keep, chapel, and the tall spike turrets */
  bag.add(new THREE.BoxGeometry(20,26,16), PS, mat4(-4,13,-2));
  pitchRoof(bag,20,16,9,RF,-4,26,-2);
  bag.add(new THREE.CylinderGeometry(4.4,4.8,32,8), PS, mat4(12,16,8));
  bag.add(new THREE.ConeGeometry(5.0,10,8), RF, mat4(12,37,8));
  bag.add(new THREE.CylinderGeometry(2.4,2.8,24,8), PS, mat4(-16,12,10));
  bag.add(new THREE.ConeGeometry(3.0,8,8), RF, mat4(-16,28,10));
  for(let i=0;i<6;i++){
    const a=i/6*Math.PI*2+0.4;
    bag.add(new THREE.CylinderGeometry(2.0,2.3,18,7), PS, mat4(Math.cos(a)*19,9,Math.sin(a)*19));
    bag.add(new THREE.ConeGeometry(2.6,7,7), RF, mat4(Math.cos(a)*19,21.5,Math.sin(a)*19));
  }
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 3. Wartburg — long hall on a wooded ridge with a gate tower */
function buildWartburg(){
  const {g,rec}=newMon('wartburg', -Math.PI/2);
  const bag=new GeoBag();
  const PS=M.plaster, ST=M.darkStone;
  /* the long east-west range */
  bag.add(new THREE.BoxGeometry(64,20,18), PS, mat4(0,10,0));
  pitchRoof(bag,64,18,10,M.roofRed,0,20,0);
  bag.add(new THREE.BoxGeometry(22,26,18), PS, mat4(-26,13,2));
  pitchRoof(bag,22,18,9,M.roofRed,-26,26,2);
  /* gate tower and the steep-roofed keep */
  bag.add(new THREE.BoxGeometry(12,24,12), ST, mat4(20,12,-10));
  bag.add(new THREE.ConeGeometry(8.4,10,4), M.roofGrey, mat4(20,29,-10,Math.PI/4));
  bag.add(new THREE.BoxGeometry(9,30,9), PS, mat4(30,15,6));
  bag.add(new THREE.ConeGeometry(6.4,9,4), M.roofGrey, mat4(30,34.5,6,Math.PI/4));
  /* rows of small windows */
  for(let c=0;c<12;c++){
    bag.add(new THREE.PlaneGeometry(1.5,2.4), M.windowLit, mat4(-28+c*5,12,9.2));
    bag.add(new THREE.PlaneGeometry(1.5,2.4), M.windowLit, mat4(-28+c*5,6,9.2));
  }
  bag.add(archFrameGeo(6,8,4,1.0,0.5), ST, mat4(20,3,4.4));
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 4. Zwinger — baroque pavilions around a courtyard, crown gate */
function buildZwinger(){
  const {g,rec}=newMon('zwinger', -Math.PI/2);
  const bag=new GeoBag();
  const PS=M.paleSand;
  const wall=(x,z,w,d,rot)=>{
    bag.add(new THREE.BoxGeometry(w,14,d), PS, mat4(x,7,z,rot));
    bag.add(new THREE.BoxGeometry(w+1.4,1.4,d+1.4), M.plaster, mat4(x,14.4,z,rot));
    for(let c=0;c<Math.floor(w/5);c++){
      const px=(c-(Math.floor(w/5)-1)/2)*5;
      bag.add(archFrameGeo(3.0,6.0,2.2,0.8,0.35), PS, RT(rot,x+px,1.4,z+d/2+0.2));
      bag.add(new THREE.PlaneGeometry(2.2,4.2), M.jali, RT(rot,x+px,2.4,z+d/2+0.4));
    }
  };
  wall(0,-30,80,10,0);
  wall(0,30,80,10,Math.PI);
  wall(-40,0,10,60,Math.PI/2);
  wall(40,0,10,60,-Math.PI/2);
  /* crown gate (Kronentor) */
  bag.add(new THREE.BoxGeometry(20,24,12), PS, mat4(0,12,30));
  bag.add(onionDomeGeo(6.4,9.0,16), M.copper, mat4(0,24,30));
  bag.add(new THREE.BoxGeometry(4.0,4.0,4.0), M.goldDim, mat4(0,30,30,Math.PI/4));
  bag.add(archFrameGeo(9,13,6,1.4,0.8), M.plaster, mat4(0,0,36.2));
  /* corner pavilions */
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    bag.add(new THREE.CylinderGeometry(6.4,6.8,18,10), PS, mat4(sx*40,9,sz*30));
    bag.add(onionDomeGeo(6.4,7.4,16), M.copper, mat4(sx*40,18,sz*30));
  }
  /* Nymphenbad fountain terrace */
  bag.add(new THREE.CircleGeometry(9,20).rotateX(-Math.PI/2), M.waterPool, mat4(0,1.0,-6));
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 5. Reichstag — long facade and the glass dome with mirrored cone */
function buildReichstag(){
  const {g,rec}=newMon('reichstag', -Math.PI/2);
  const bag=new GeoBag();
  const PS=M.paleSand;
  bag.add(new THREE.BoxGeometry(74,22,44), PS, mat4(0,11,0));
  bag.add(new THREE.BoxGeometry(76,2.2,46), M.plaster, mat4(0,23,0));
  bag.add(new THREE.BoxGeometry(76,1.0,46.6), PS, mat4(0,24.4,0));
  /* corner towers with little domes */
  for(const sx of [-1,1]) for(const sz of [-1,1]){
    bag.add(new THREE.BoxGeometry(9,28,9), PS, mat4(sx*32,14,sz*18));
    bag.add(onionDomeGeo(4.4,4.6,12), M.copper, mat4(sx*32,28,sz*18));
  }
  /* grand portico with six columns */
  bag.add(new THREE.BoxGeometry(30,17,5), PS, mat4(0,8.5,23));
  for(let i=0;i<6;i++) bag.add(columnGeo(1.0,14.0), PS, mat4(-12.5+i*5,3.0,25.6));
  bag.add(new THREE.BoxGeometry(31,3,6), M.plaster, mat4(0,19,25.6));
  bag.add(gableGeo(31,6,5), PS, mat4(0,20.5,25.6));
  /* window rows */
  for(let r=0;r<2;r++) for(let c=0;c<16;c++){
    bag.add(new THREE.PlaneGeometry(2.0,3.4), M.windowLit, mat4(-33+c*4.4,7+r*8,22.2));
  }
  /* the glass dome + mirrored cone + rooftop terrace */
  const dome=new THREE.Mesh(new THREE.SphereGeometry(13.5,28,16,0,Math.PI*2,0,Math.PI*0.5),
    new THREE.MeshStandardMaterial({color:0xbfe0ea, roughness:0.06, metalness:0.35, transparent:true, opacity:0.55, envMapIntensity:1.8, side:THREE.DoubleSide}));
  dome.position.set(0,26,4);
  dome.scale.set(1,0.92,1);
  g.add(dome);
  const db=new GeoBag();
  db.add(new THREE.CylinderGeometry(14,14,3.4,28), PS, mat4(0,26,4));
  db.add(new THREE.CylinderGeometry(4.6,7.4,11,16,1,true), M.glass, mat4(0,29,4));
  db.add(new THREE.CylinderGeometry(9.6,9.6,0.7,20), M.copper, mat4(0,35.6,4));
  for(let i=0;i<24;i++){
    const a=i/24*Math.PI*2;
    db.add(new THREE.BoxGeometry(0.22,15,0.22), M.basalt, mat4(Math.cos(a)*13.4, 34, 4+Math.sin(a)*13.4));
  }
  db.build(g,false);
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  MONS.find(m=>m.id==='reichstag').dome=dome;
  return rec;
}
/* 6. Holstentor — brick gate with two round towers */
function buildHolstentor(){
  const {g,rec}=newMon('holstentor', -Math.PI/2);
  const bag=new GeoBag();
  const BR=M.brick, BR2=M.brickLight;
  bag.add(new THREE.BoxGeometry(30,14,14), BR, mat4(0,7,0));
  for(const sx of [-1,1]){
    bag.add(new THREE.CylinderGeometry(7.2,8.6,24,16), BR, mat4(sx*9.6,10,0));
    bag.add(new THREE.ConeGeometry(7.6,7,16), M.copper, mat4(sx*9.6,25,0));
    bag.add(new THREE.CylinderGeometry(7.8,7.8,1.2,16), BR2, mat4(sx*9.6,22.4,0));
    for(let i=0;i<14;i++){
      const a=i/14*Math.PI*2;
      if(Math.abs(a-Math.PI/2)<0.4) continue;
      bag.add(new THREE.BoxGeometry(1.2,2.4,0.6), M.paleSand, mat4(sx*9.6+Math.cos(a)*7.4, 18, Math.sin(a)*7.4, -a));
    }
  }
  /* stepped gable and the arch */
  bag.add(new THREE.BoxGeometry(11,7,13), BR, mat4(0,17.5,0));
  for(let i=0;i<5;i++) bag.add(new THREE.BoxGeometry(9-i*1.4,1.2,13), BR2, mat4(0,21.4+i*1.2,0));
  bag.add(archFrameGeo(7.6,9.0,5.2,3.0,1.1), M.paleSand, mat4(0,1.0,7.2));
  bag.add(archGeo(6.6,8.0,4.6,3.0), M.woodDark, mat4(0,1.0,7.0));
  bag.add(new THREE.BoxGeometry(13,0.9,15), BR2, mat4(0,14.2,0));
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 7. Elbphilharmonie — glass wave on a brick warehouse */
function buildElphi(){
  const {g,rec}=newMon('elphi', -Math.PI/2);
  const bag=new GeoBag();
  /* brick base with arched openings */
  bag.add(new THREE.BoxGeometry(56,20,26), M.brick, mat4(0,10,0));
  for(let c=0;c<9;c++){
    bag.add(archFrameGeo(4.4,7.0,3.4,0.8,0.35), M.darkStone, mat4(-22+c*5.5,0.4,13.4));
  }
  bag.add(new THREE.BoxGeometry(58,1.4,28), M.paleSand, mat4(0,20.6,0));
  /* the glass body: a long box with an undulating top edge */
  const pts=[];
  const W=27;
  for(let i=0;i<=24;i++){
    const t=i/24;
    const y=6+4.2*Math.sin(t*Math.PI*2.0+0.4)*Math.sin(t*Math.PI)+2.6*Math.sin(t*Math.PI*3.2);
    pts.push(new THREE.Vector2(t*W-W/2, y));
  }
  pts.push(new THREE.Vector2(W/2,-14), new THREE.Vector2(-W/2,-14));
  const shape=new THREE.Shape(pts);
  const gwave=new THREE.ExtrudeGeometry(shape,{depth:56,bevelEnabled:false,curveSegments:1});
  gwave.rotateY(Math.PI/2);
  gwave.translate(28,0,0);
  const glassBody=new THREE.Mesh(gwave, new THREE.MeshStandardMaterial({color:0xbcd6e2, roughness:0.10, metalness:0.55, envMapIntensity:1.9, transparent:true, opacity:0.72}));
  glassBody.position.set(0,21.4,0);
  glassBody.castShadow=true; glassBody.receiveShadow=true;
  g.add(glassBody);
  /* mullion grid just inside the glass */
  const mg=new THREE.Mesh(gwave.clone(), new THREE.MeshStandardMaterial({map:mullionTex, transparent:true, roughness:0.6, opacity:0.55, side:THREE.DoubleSide, depthWrite:false}));
  mg.scale.set(0.995,0.995,0.995);
  mg.position.set(0,21.4,0);
  g.add(mg);
  /* the curved plaza between base and tower */
  bag.add(new THREE.BoxGeometry(58,1.6,10), M.paleSand, mat4(0,21.4,-16));
  bag.build(g,false);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 8. Porta Nigra — dark Roman gate, four storeys of arches */
function buildPortaNigra(){
  const {g,rec}=newMon('portaNigra', -Math.PI/2);
  const bag=new GeoBag();
  const ST=M.darkStone;
  for(const sx of [-1,1]){
    bag.add(new THREE.BoxGeometry(13,30,14), ST, mat4(sx*9.6,15,0));
    for(let r=0;r<3;r++){
      bag.add(archFrameGeo(6.0,6.4,3.6,1.2,0.55), M.rockDark, mat4(sx*9.6,r*9+1.2,7.2));
      bag.add(archGeo(5.0,5.6,3.0,1.4), M.basalt, mat4(sx*9.6,r*9+1.2,7.0));
      bag.add(new THREE.BoxGeometry(14,1.0,15), M.rockDark, mat4(sx*9.6,r*9+8.6,0));
    }
  }
  /* the linking arch over the gateway */
  bag.add(new THREE.BoxGeometry(10,8,14), ST, mat4(0,18,0));
  bag.add(archFrameGeo(8,10,5,6,1.4), ST, mat4(0,0,0));
  bag.add(new THREE.BoxGeometry(36,1.4,15), M.rockDark, mat4(0,30.4,0));
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}
/* 9. Neues Rathaus — neo-gothic with the glockenspiel tower */
function buildRathaus(){
  const {g,rec}=newMon('rathaus', -Math.PI/2);
  const bag=new GeoBag();
  const PS=M.paleSand, RF=M.roofGrey;
  bag.add(new THREE.BoxGeometry(70,24,40), PS, mat4(0,12,0));
  pitchRoof(bag,70,40,13,RF,0,24,0);
  bag.add(new THREE.BoxGeometry(72,1.6,42), M.plaster, mat4(0,25,0));
  /* clusters of pinnacles along the ridge */
  for(let i=0;i<7;i++){
    const px=-30+i*10;
    bag.add(new THREE.ConeGeometry(1.6,10,6), RF, mat4(px,34,16));
    bag.add(new THREE.ConeGeometry(1.6,10,6), RF, mat4(px,34,-16));
  }
  /* the great tower with the glockenspiel stage */
  bag.add(new THREE.BoxGeometry(15,56,15), PS, mat4(30,28,10));
  bag.add(new THREE.BoxGeometry(16.4,1.6,16.4), PS, mat4(30,56,10));
  bag.add(new THREE.ConeGeometry(9.0,14,8), RF, mat4(30,63,10));
  bag.add(new THREE.ConeGeometry(1.2,5,6), M.gold, mat4(30,72,10));
  for(let i=0;i<4;i++) bag.add(new THREE.ConeGeometry(1.4,7,6), RF, mat4(30+(i<2?-7:7),58,10+(i%2?-7:7)));
  /* glockenspiel: two tiers of arched niches with figures */
  bag.add(new THREE.BoxGeometry(13,9,1.2), M.brick, mat4(30,40,17.4));
  for(let c=0;c<6;c++){
    bag.add(archGeo(1.6,2.4,1.2,0.5), M.woodDark, mat4(30-4.6+c*1.84,40.6,18.0));
  }
  bag.add(new THREE.BoxGeometry(13,1.0,1.0), M.paleSand, mat4(30,44.6,17.4));
  /* the moving figures (animated) */
  const figures=new THREE.Group();
  const fg=new GeoBag();
  for(let c=0;c<6;c++){
    fg.add(new THREE.BoxGeometry(0.7,1.5,0.5), c%2? M.copper : M.goldDim, mat4(30-4.6+c*1.84,40.4,17.9));
    fg.add(new THREE.SphereGeometry(0.28,6,5), M.paleSand, mat4(30-4.6+c*1.84,41.3,17.9));
  }
  fg.build(figures,false);
  g.add(figures);
  ANIM.glock={obj:figures, t:0};
  /* facade detail: window rows, arcaded ground floor, gables */
  for(let r=0;r<3;r++) for(let c=0;c<12;c++){
    bag.add(archFrameGeo(2.4,4.0,2.6,0.6,0.28), M.plaster, mat4(-29+c*5.2,3.4+r*7,20.2));
    bag.add(new THREE.PlaneGeometry(1.7,3.0), M.windowLit, mat4(-29+c*5.2,4.4+r*7,20.4));
  }
  for(let c=0;c<5;c++) bag.add(gableGeo(9,5,2), PS, mat4(-26+c*13,25,20.4));
  bag.build(g);
  rec.ornament.push({obj:g,tier:3});
  return rec;
}

buildHumayun(); buildIndiaGate(); buildLotus(); buildHawa(); buildAmber();
buildMeenakshi(); buildGateway(); buildMysore();
buildHeidelberg(); buildHohenzollern(); buildWartburg(); buildZwinger(); buildReichstag();
buildHolstentor(); buildElphi(); buildPortaNigra(); buildRathaus();
window.__monCount=MONS.length;
//__CHUNK6__
