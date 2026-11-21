const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8895,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
 const p=await b.newPage(); await p.setViewport({width:1440,height:810});
 const logs=[]; p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 await p.goto('http://127.0.0.1:8895/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,14000));
 await p.click('#btnSail');
 await new Promise(r=>setTimeout(r,2500));
 const us=[0.04,0.26,0.5,0.72,0.94];
 for(let i=0;i<us.length;i++){
   await p.evaluate(u=>{const r=document.querySelector('#sailRange'); r.value=Math.round(u*1000);
     r.dispatchEvent(new Event('input',{bubbles:true}));},us[i]);
   await new Promise(r=>setTimeout(r,3200));
   await p.screenshot({path:'/home/user/test/sail'+i+'.png'});
   console.log('sail',i);
 }
 const st=await p.evaluate(()=>{const d=window.__dbg;return {p:d.camera.position.toArray().map(v=>Math.round(v)),t:d.controls.target.toArray().map(v=>Math.round(v))};});
 console.log(JSON.stringify(st));
 console.log(logs.join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
