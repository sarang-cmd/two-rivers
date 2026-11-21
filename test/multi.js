const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const ROOT='/home/user/two-rivers';
const WAIT=parseInt(process.argv[2]||'18000',10);
const OUT=process.argv[3]||'/home/user/test/m';
const SHOTS=JSON.parse(process.argv[4]||'[]');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join(ROOT,p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8860,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/pylibs/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
 const p=await b.newPage();
 await p.setViewport({width:1440,height:810});
 const logs=[];
 p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 p.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') logs.push('['+m.type()+'] '+m.text()); });
 await p.goto('http://127.0.0.1:8860/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,WAIT));
 for(let i=0;i<SHOTS.length;i++){
   const s=SHOTS[i];
   await p.evaluate(o=>{ __dbg.camera.position.set(o.p[0],o.p[1],o.p[2]); __dbg.controls.target.set(o.t[0],o.t[1],o.t[2]); __dbg.controls.update(); },s);
   await new Promise(r=>setTimeout(r,2200));
   await p.screenshot({path:OUT+i+'.png'});
   console.log('shot',i,OUT+i+'.png');
 }
 console.log('STATS',JSON.stringify(await p.evaluate(()=>window.__stats||null)));
 console.log(logs.slice(0,20).join('\n'));
 await b.close(); srv.close();
})();
