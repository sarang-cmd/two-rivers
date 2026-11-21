const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8895,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/pylibs/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
 const p=await b.newPage(); await p.setViewport({width:1440,height:810});
 const logs=[]; p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 await p.goto('http://127.0.0.1:8895/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,15000));
 const views=JSON.parse(process.argv[2]);
 for(let i=0;i<views.length;i++){
   await p.evaluate(v=>{ __dbg.camera.position.set(v.p[0],v.p[1],v.p[2]); __dbg.controls.target.set(v.t[0],v.t[1],v.t[2]); __dbg.controls.update(); },views[i]);
   await new Promise(r=>setTimeout(r,2500));
   await p.screenshot({path:'/home/user/test/pv'+i+'.png'});
   console.log('shot',i);
 }
 console.log(logs.join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
