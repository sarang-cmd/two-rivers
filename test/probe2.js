const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8898,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
 const p=await b.newPage(); await p.setViewport({width:1440,height:810});
 const logs=[]; p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 await p.goto('http://127.0.0.1:8898/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 await p.evaluate(()=>{const d=window.__dbg; d.camera.position.set(452,166,250); d.controls.target.set(150,14,250); d.controls.update();});
 await new Promise(r=>setTimeout(r,2500));
 const out=await p.evaluate(()=>{
   const d=window.__dbg, T=d.THREE, cam=d.camera;
   cam.updateMatrixWorld(); cam.updateProjectionMatrix();
   const list=d.MONS.map(m=>{
     const v=m.group.position.clone(); v.y+=8;
     v.project(cam);
     return {id:m.id, sx:Math.round((v.x*0.5+0.5)*1440), sy:Math.round((-v.y*0.5+0.5)*810), z:+v.z.toFixed(3), d:Math.round(cam.position.distanceTo(m.group.position))};
   }).filter(o=>o.z<1).sort((a,b)=>a.d-b.d);
   return list.slice(0,14);
 });
 console.log(JSON.stringify(out));
 console.log(logs.join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
