const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8890,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[];
 p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 p.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') logs.push('[C] '+m.text().slice(0,300)); });
 await p.goto('http://127.0.0.1:8890/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg; if(!d) return 'no dbg';
   const t=d.scene.getObjectByName('terrain380');
   const pos=t&&t.geometry.attributes.position.array;
   let nan=0; for(let i=0;i<pos.length;i++) if(!isFinite(pos[i])) nan++;
   const bb=t&&t.geometry.boundingSphere;
   const bad=[]; for(let i=0;i<pos.length/3;i++){ if(!isFinite(pos[i*3])||!isFinite(pos[i*3+1])||!isFinite(pos[i*3+2])) bad.push([i,pos[i*3],pos[i*3+1],pos[i*3+2], d.H(pos[i*3],pos[i*3+2])]); }
   return {bad:bad.slice(0,5), nan, count:pos?pos.length/3:0, bb: bb?[bb.center.toArray().map(v=>Math.round(v)), Math.round(bb.radius)]:null,
     cam:d.camera.position.toArray().map(v=>Math.round(v)), mons:d.MONS.length};
 });
 console.log(JSON.stringify(out));
 console.log(logs.slice(0,6).join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
