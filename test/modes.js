const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8894,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/pylibs/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
 const p=await b.newPage(); await p.setViewport({width:1440,height:810});
 const logs=[];
 p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 p.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') logs.push('['+m.type()+'] '+m.text().slice(0,200)); });
 await p.goto('http://127.0.0.1:8894/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,16000));
 const steps=[
  ['moon', 'document.querySelectorAll("#lightRow button")[2].click()'],
  ['festival','document.querySelectorAll("#lightRow button")[3].click()'],
  ['backgold','document.querySelectorAll("#lightRow button")[0].click()'],
  ['q_med','document.querySelectorAll("#qRow button")[1].click()'],
  ['q_low','document.querySelectorAll("#qRow button")[2].click()'],
  ['q_high','document.querySelectorAll("#qRow button")[0].click()'],
  ['density_light','document.querySelectorAll("#dRow button")[0].click()'],
  ['density_full','document.querySelectorAll("#dRow button")[1].click()'],
  ['sail','document.querySelector("#btnSail").click()'],
  ['sail_pause','document.querySelector("#btnSailPlay").click()'],
  ['sail_scrub','(()=>{const r=document.querySelector("#sailRange"); r.value="420"; r.dispatchEvent(new Event("input"));})()'],
  ['sail_exit','document.querySelector("#btnSailExit").click()'],
  ['preset_de','document.querySelectorAll("#presetRow button")[4].click()'],
  ['preset_valley','document.querySelectorAll("#presetRow button")[6].click()'],
  ['pair_domes','document.querySelector("#pairRow button").click()'],
  ['photo','document.querySelector("#btnPhoto").click()'],
  ['unphoto','document.querySelector("#btnPhoto").click()'],
  ['reset','document.querySelector("#btnReset").click()'],
 ];
 for(const [name,js] of steps){
   try{ await p.evaluate(js); }catch(e){ logs.push('[STEPFAIL '+name+'] '+e.message); }
   await new Promise(r=>setTimeout(r,1400));
   await p.screenshot({path:'/home/user/test/mode_'+name+'.png'});
   console.log('ok',name);
 }
 console.log('STATS',JSON.stringify(await p.evaluate(()=>window.__stats||null)));
 console.log(logs.length?logs.join('\n'):'NO_ERRORS');
 await b.close(); srv.close();
})();
