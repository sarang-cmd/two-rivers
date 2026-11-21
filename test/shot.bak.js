const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '/home/user/two-rivers';
const SHOT = process.argv[3] || '/home/user/test/shot.png';
const WAIT = parseInt(process.argv[4] || '9000', 10);
const WB   = parseFloat(process.argv[5] || '0');   // extra world-build seconds
const URL  = process.argv[6] || '';

const server = http.createServer((req,res)=>{
  let p = decodeURIComponent(req.url.split('?')[0]);
  if(p==='/') p='/index.html';
  const f = path.join(ROOT,p);
  fs.readFile(f,(e,d)=>{
    if(e){ res.writeHead(404); res.end('nf'); return; }
    const ext=path.extname(f);
    const ct = ext==='html'?'text/html': ext==='js'?'text/javascript':'application/octet-stream';
    res.writeHead(200,{'Content-Type':ct}); res.end(d);
  });
});
(async()=>{
  await new Promise(r=>server.listen(8791,r));
  const browser = await puppeteer.launch({headless:'new',
    env:{...process.env, LD_LIBRARY_PATH:'/home/user/pylibs/usr/lib/x86_64-linux-gnu:/home/user/pylibs/lib/x86_64-linux-gnu'},
    args:['--no-sandbox','--disable-setuid-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
  const page = await browser.newPage();
  await page.setViewport({width:1440,height:810});
  const logs=[];
  page.on('console',m=>{ logs.push('['+m.type()+'] '+m.text()); });
  page.on('pageerror',e=>{ logs.push('[PAGEERROR] '+e.message); });
  page.on('requestfailed',r=>{ logs.push('[REQFAIL] '+r.url()+' '+(r.failure()&&r.failure().errorText)); });
  await page.goto('http://127.0.0.1:8791/index.html',{waitUntil:'domcontentloaded',timeout:60000});
  await new Promise(r=>setTimeout(r,WAIT));
  if(URL){ await page.goto('http://127.0.0.1:8791/'+URL,{waitUntil:'domcontentloaded',timeout:60000}); await new Promise(r=>setTimeout(r,2500)); }
  await page.screenshot({path:SHOT});
  const stats = await page.evaluate(()=>({ready:window.__scaffoldReady||null, Three:!!window.THREE}));
  console.log('STATS', JSON.stringify(stats));
  console.log(logs.slice(0,80).join('\n'));
  await browser.close();
  server.close();
  process.exit(0);
})().catch(e=>{ console.error('FATAL',e); process.exit(1); });
