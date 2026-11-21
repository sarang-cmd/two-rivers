const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8887,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[];
 p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 p.on('console',m=>logs.push('['+m.type()+'] '+m.text().slice(0,200)));
 await p.goto('http://127.0.0.1:8887/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,16000));
 const f1=await p.evaluate(()=>window.__dbg.renderer.info.render.frame);
 await new Promise(r=>setTimeout(r,3000));
 const f2=await p.evaluate(()=>window.__dbg.renderer.info.render.frame);
 const extra=await p.evaluate(()=>{
   const d=window.__dbg, T=d.THREE;
   return {composer: typeof window.__COMPOSER, renderer:d.renderer.info.render};
 });
 console.log(JSON.stringify({f1,f2,extra}));
 console.log(logs.slice(-8).join('\n'));
 await b.close(); srv.close();
})();
