const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8882,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); p.on('pageerror',e=>console.log('[ERR]',e.message));
 await p.goto('http://127.0.0.1:8882/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg, T=d.THREE;
   const rc=new T.Raycaster();
   const rows=[];
   for(const z of [500,900,1300,1700,2600]){
     const o=new T.Vector3(0,400,z); rc.set(o,new T.Vector3(0,-1,0));
     rows.push(['z',z,'H(0,z)',+d.H(0,z).toFixed(1),'H(-200,z)',+d.H(-200,z).toFixed(1),'H(200,z)',+d.H(200,z).toFixed(1)]);
   }
   /* find the river centre at those z by scanning terrain height */
   const mins=[];
   for(const z of [500,1300,2600]){
     let bx=0,bh=99;
     for(let x=-600;x<=900;x+=10){ const hh=d.H(x,z); if(hh<bh){bh=hh;bx=x;} }
     mins.push([z, bx, +bh.toFixed(2)]);
   }
   return {rows, mins};
 });
 console.log(JSON.stringify(out));
 await b.close(); srv.close();
})();
