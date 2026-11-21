const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const ROOT='/home/user/test/mini';
const s=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join(ROOT,p),(e,d)=>{if(e){r.writeHead(404);r.end('nf');return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>s.listen(8794,'0.0.0.0',r)); console.log('UP');
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage();
 p.on('console',m=>console.log('LOG',m.text()));
 p.on('requestfailed',r=>console.log('RF',r.url(),r.failure().errorText));
 try{ await p.goto('http://127.0.0.1:8794/index.html',{waitUntil:'domcontentloaded',timeout:20000}); console.log('NAV OK'); }catch(e){console.log('NAV FAIL',e.message);}
 await new Promise(r=>setTimeout(r,6000));
 console.log('READY', await p.evaluate(()=>window.__scaffoldReady));
 await b.close(); s.close();
})();
