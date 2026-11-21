const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8880,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
 const p=await b.newPage(); await p.setViewport({width:1440,height:810});
 await p.goto('http://127.0.0.1:8880/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,4000));
 const res=await p.evaluate(async()=>{
   const out={};
   const shot=(label)=>{ const t0=performance.now(); __dbg.renderer.info.reset(); __dbg.renderer.render(__dbg.scene,__dbg.camera); const t1=performance.now(); return {ms:Math.round(t1-t0), tris:__dbg.renderer.info.render.triangles, calls:__dbg.renderer.info.render.calls}; };
   out.base=shot();
   // hide terrain-sized vegetation
   const veg=[]; __dbg.scene.traverse(o=>{ if(o.isInstancedMesh) veg.push(o); });
   out.instCount=veg.length;
   veg.forEach(v=>v.visible=false);
   out.noInst=shot();
   veg.forEach(v=>v.visible=true);
   // hide all groups of monuments
   const gs=__dbg.MONS.map(m=>m.group); gs.forEach(g=>g.visible=false);
   out.noMons=shot();
   gs.forEach(g=>g.visible=true);
   return out;
 });
 console.log(JSON.stringify(res,null,1));
 await b.close(); srv.close();
})();
