const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8884,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[];
 p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 await p.goto('http://127.0.0.1:8884/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,12000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg, r=d.renderer;
   // time a bare render with and without the terrain
   const t=d.scene.getObjectByName('terrain380');
   const time=(n)=>{ r.info.reset(); const t0=performance.now(); for(let i=0;i<n;i++) r.render(d.scene,d.camera); return (performance.now()-t0)/n; };
   const withT=time(2);
   t.visible=false; const noT=time(2); t.visible=true;
   return {subdiv:window.__SUBDIV, tris:r.info.render.triangles, calls:r.info.render.calls, withT:Math.round(withT), noT:Math.round(noT),
     types:(()=>{const c={};d.scene.traverse(o=>{if(o.isMesh||o.isPoints||o.isSprite){const k=o.type;c[k]=(c[k]||0)+1;}});return c;})()};
 });
 console.log(JSON.stringify(out));
 console.log(logs.join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
