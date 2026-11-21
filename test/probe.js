const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8897,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=800,500']});
 const p=await b.newPage(); const logs=[]; p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 await p.goto('http://127.0.0.1:8897/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg; const T=d.THREE;
   const pts=[[-300,660],[-380,760],[-300,808],[-20,250],[150,250]];
   const res=pts.map(([x,z])=>[x,z,+d.H(x,z).toFixed(1)]);
   const s=window.__dbg.SITE; const ids=Object.keys(s).map(k=>[k,s[k].x,s[k].z,s[k].h]);
   return {res, ids};
 });
 console.log(JSON.stringify(out));
 console.log(logs.join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
