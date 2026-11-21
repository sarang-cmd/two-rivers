const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8891,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[]; p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 await p.goto('http://127.0.0.1:8891/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg, T=d.THREE;
   const rc=new T.Raycaster();
   const rows=[];
   for(let z=1300; z<=1900; z+=60){
     const o=new T.Vector3(620,300,z);
     rc.set(o,new T.Vector3(0,-1,0));
     const h=rc.intersectObjects(d.scene.children,true).filter(x=>x.object.geometry&&x.object.geometry.type==='PlaneGeometry')[0];
     rows.push([z, h?+h.point.y.toFixed(1):null, +d.H(620,z).toFixed(1), +d.rivers.near(620,z).d.toFixed(0)]);
   }
   return rows;
 });
 console.log(JSON.stringify(out));
 console.log(logs.join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
