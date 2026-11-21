const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8883,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); const logs=[];
 p.on('pageerror',e=>logs.push('[ERR] '+e.message+'\n'+(e.stack||'').split('\n').slice(0,3).join('\n')));
 p.on('console',m=>logs.push('['+m.type()+'] '+m.text().slice(0,300)));
 await p.goto('http://127.0.0.1:8883/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,12000));
 console.log(logs.slice(0,6).join('\n'));
 await b.close(); srv.close();
})();
