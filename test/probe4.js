const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8893,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[]; p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 await p.goto('http://127.0.0.1:8893/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg, T=d.THREE, S=window.__SAIL;
   const rc=new T.Raycaster(); rc.far=400;
   const res=[];
   for(const u of [0.04,0.26,0.5,0.72,0.94]){
     const q=S.curve.getPointAt(u);
     const a=S.curve.getPointAt(Math.min(0.999,u+0.01));
     const o=new T.Vector3(q.x,5.4,q.z), dir=new T.Vector3(a.x-o.x, 0.8, a.z-o.z).normalize();
     rc.set(o,dir);
     const hits=rc.intersectObjects(d.scene.children,true).slice(0,3).map(h=>({
       d:+h.distance.toFixed(1), obj:h.object.name||h.object.type,
       par:(h.object.parent&&h.object.parent.name)||'',
       col:h.object.material&&h.object.material.color?h.object.material.color.getHexString():'',
       pt:h.point.toArray().map(v=>Math.round(v))}));
     res.push({u, pos:[Math.round(q.x),Math.round(q.z)], hits});
   }
   return res;
 });
 console.log(JSON.stringify(out,null,1));
 console.log(logs.join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
