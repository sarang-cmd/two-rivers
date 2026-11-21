const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8889,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[];
 p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 p.on('console',m=>logs.push('['+m.type()+'] '+m.text().slice(0,200)));
 await p.goto('http://127.0.0.1:8889/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,16000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg; if(!d) return 'no dbg';
   const r=d.renderer;
   const gl=r.getContext();
   const px=new Uint8Array(4);
   gl.readPixels(700,380,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);
   return {px:[...px], info:r.info.render, cam:d.camera.position.toArray().map(v=>Math.round(v)),
     tgt:d.controls.target.toArray().map(v=>Math.round(v)),
     far:d.camera.far, near:d.camera.near,
     fog:d.scene.fog&&d.scene.fog.density};
 });
 console.log(JSON.stringify(out));
 await p.screenshot({path:'/home/user/test/chk.png'});
 console.log(logs.slice(-12).join('\n'));
 await b.close(); srv.close();
})();
