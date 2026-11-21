const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8881,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage();
 await p.goto('http://127.0.0.1:8881/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg;
   const rows=[];
   for(const z of [1500,1760,2600]){
     const r=[];
     for(let x=300;x<=1000;x+=50) r.push([x, +d.H(x,z).toFixed(1), +d.rivers.near(x,z).d.toFixed(0)]);
     rows.push([z,r]);
   }
   return rows;
 });
 console.log(JSON.stringify(out));
 await b.close(); srv.close();
})();
