const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8892,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[]; p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 await p.goto('http://127.0.0.1:8892/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg, T=d.THREE, S=window.__SAIL;
   const rc=new T.Raycaster(); rc.far=400;
   const q=S.curve.getPointAt(0.26), a=S.curve.getPointAt(0.27);
   const o=new T.Vector3(q.x,5.4,q.z), dir=new T.Vector3(a.x-o.x,0.5,a.z-o.z).normalize();
   rc.set(o,dir);
   const h=rc.intersectObjects(d.scene.children,true)[0];
   if(!h) return 'nohit';
   const m=h.object;
   return {type:m.type, geo:m.geometry&&m.geometry.type, params:m.geometry&&m.geometry.parameters,
     mat:m.material&&m.material.type, trans:m.material&&m.material.transparent,
     pos:m.position.toArray().map(v=>+v.toFixed(1)), scale:m.scale.toArray(), rot:[m.rotation.x,m.rotation.y,m.rotation.z],
     dist:h.distance, name:m.name, anc:(m.parent&&m.parent.name)};
 });
 console.log(JSON.stringify(out));
 console.log(logs.join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
