const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8886,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[];
 p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 p.on('console',m=>logs.push('['+m.type()+'] '+m.text().slice(0,300)));
 await p.goto('http://127.0.0.1:8886/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,16000));
 const out=await p.evaluate(()=>{
   // is anything still scheduling frames?
   const before=window.__dbg.renderer.info.render.frame;
   return new Promise(res=>{
     let n=0;
     const loop=()=>{ n++; if(n<3) requestAnimationFrame(loop); };
     requestAnimationFrame(loop);
     setTimeout(()=>res({before, after:window.__dbg.renderer.info.render.frame, rafAlive:n, stats:window.__stats}),1200);
   });
 });
 console.log(JSON.stringify(out));
 // try forcing a resize
 await p.setViewport({width:1440,height:810});
 await new Promise(r=>setTimeout(r,4000));
 await p.screenshot({path:'/home/user/test/chk5.png'});
 const fr=await p.evaluate(()=>window.__dbg.renderer.info.render.frame);
 console.log('frame now',fr);
 const frames=[];
for(let i=0;i<4;i++){ await new Promise(r=>setTimeout(r,1500)); const v=await p.evaluate(()=>window.__frames); frames.push(v); }
console.log('frames',frames.join(','));
console.log(logs.slice(-10).join('\n'));
 await b.close(); srv.close();
})();
