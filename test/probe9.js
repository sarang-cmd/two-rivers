const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8880,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); await p.setViewport({width:1440,height:810});
 await p.goto('http://127.0.0.1:8880/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg, T=d.THREE, rc=new T.Raycaster();
   const pts=[[0.55,0.44],[0.70,0.40],[0.62,0.47],[0.86,0.44],[0.28,0.47]];
   return pts.map(([sx,sy])=>{
     rc.setFromCamera(new T.Vector2(sx*2-1, -(sy*2-1)), d.camera);
     const h=rc.intersectObjects(d.scene.children,true)[0];
     if(!h) return null;
     const o=h.object;
     return {pt:h.point.toArray().map(v=>Math.round(v)), type:o.type,
       geo:o.geometry&&o.geometry.type, par:o.parent&&o.parent.name, mat:o.material&&o.material.color&&o.material.color.getHexString()};
   });
 });
 console.log(JSON.stringify(out));
 await b.close(); srv.close();
})();
