const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const ROOT='/home/user/two-rivers';
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join(ROOT,p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8820,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage();
 p.on('pageerror',e=>console.log('ERR',e.message));
 await p.goto('http://127.0.0.1:8820/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,9000));
 const res=await p.evaluate(()=>{
   const out=[];
   for(let z=200;z<=1400;z+=150){
     const row=[];
     for(let x=-900;x<=900;x+=150) row.push(Math.round(window.__dbg.H(x,z)));
     out.push('z='+z+' '+row.join(' '));
   }
   return out;
 });
 console.log(res.join('\n'));
 await b.close(); srv.close();
})();
