const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8896,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--disable-background-timer-throttling','--disable-renderer-backgrounding','--disable-backgrounding-occluded-windows','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
 const p=await b.newPage(); await p.setViewport({width:1440,height:810});
 const logs=[]; p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 await p.goto('http://127.0.0.1:8896/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,15000));
 const n=parseInt(process.argv[2]||'7');
 for(let i=0;i<n;i++){
   await p.evaluate(i=>{document.querySelectorAll('#presetRow button')[i].click();},i);
   await new Promise(r=>setTimeout(r,9000));
   await p.screenshot({path:'/home/user/test/vw'+i+'.png'});
   console.log('view',i);
 }
 console.log(logs.join('\n')||'NO_ERRORS');
 await b.close(); srv.close();
})();
