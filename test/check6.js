const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8885,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[];
 p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 p.on('console',m=>logs.push('['+m.type()+'] '+m.text().slice(0,300)));
 p.on('error', e=>logs.push('[PAGEERR] '+e.message));
 await p.goto('http://127.0.0.1:8885/index.html',{waitUntil:'domcontentloaded'});
 for(let i=0;i<8;i++){
   await new Promise(r=>setTimeout(r,2500));
   const s=await p.evaluate(()=>({f:window.__frames, lost:window.__dbg?window.__dbg.renderer.getContext().isContextLost():null, t:performance.now()|0})).catch(e=>'ERR '+e.message);
   console.log(i, JSON.stringify(s));
 }
 console.log(logs.slice(-12).join('\n'));
 await b.close(); srv.close();
})();
