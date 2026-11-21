const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const ROOT=process.argv[2]||'/home/user/two-rivers';
const SHOT=process.argv[3]||'/home/user/test/shot.png';
const WAIT=parseInt(process.argv[4]||'9000',10);
const EXTRA=process.argv[5]||'';   // extra JS to evaluate before screenshot
const PORT=parseInt(process.env.PORT||'8797',10);
const ct=f=>{const e=path.extname(f);return e==='.html'?'text/html':e==='.js'?'text/javascript':e==='.css'?'text/css':'application/octet-stream';};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(ROOT,p),(e,d)=>{if(e){r.writeHead(404);r.end('nf');return;}r.writeHead(200,{'Content-Type':ct(p)});r.end(d);});});
(async()=>{
  await new Promise(r=>srv.listen(PORT,'0.0.0.0',r)); console.log('SERVER_UP');
  const b=await puppeteer.launch({headless:'new',
    env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu:/home/user/pylibs/lib/x86_64-linux-gnu'},
    args:['--no-sandbox','--disable-setuid-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
  const p=await b.newPage();
  await p.setViewport({width:1440,height:810});
  const logs=[];
  p.on('console',m=>logs.push('['+m.type()+'] '+m.text()));
  p.on('pageerror',e=>logs.push('[PAGEERROR] '+e.message+' | '+(e.stack||'').split('\n').slice(0,5).join(' <- ')));
  p.on('requestfailed',r=>logs.push('[REQFAIL] '+r.url()+' '+(r.failure()&&r.failure().errorText)));
  p.on('response',r=>{if(r.status()>=400)logs.push('[HTTP'+r.status()+'] '+r.url());});
  try{ await p.goto('http://127.0.0.1:'+PORT+'/index.html',{waitUntil:'domcontentloaded',timeout:60000}); }
  catch(e){ console.log('GOTO_FAIL',e.message); }
  await new Promise(r=>setTimeout(r,WAIT));
  if(EXTRA){ try{ console.log('EXTRA_RES',JSON.stringify(await p.evaluate(EXTRA))); }catch(e){ console.log('EXTRA_ERR',e.message); } await new Promise(r=>setTimeout(r,2500)); }
  await p.screenshot({path:SHOT});
  const st=await p.evaluate(()=>({ready:window.__scaffoldReady||null,tris:(window.__stats&&window.__stats.tris)||null,fps:(window.__stats&&window.__stats.fps)||null}));
  console.log('STATS',JSON.stringify(st));
  console.log(logs.slice(0,120).join('\n'));
  await b.close(); srv.close(); process.exit(0);
})().catch(e=>{console.error('FATAL',e);process.exit(1);});
