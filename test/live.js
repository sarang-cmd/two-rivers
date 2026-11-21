const puppeteer=require('puppeteer');
(async()=>{
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--window-size=1440,810']});
 const p=await b.newPage(); await p.setViewport({width:1440,height:810});
 const logs=[]; p.on('pageerror',e=>logs.push('[ERR] '+e.message));
 p.on('requestfailed',r=>logs.push('[FAIL] '+r.url().slice(0,120)));
 await p.goto('https://sarang-cmd.github.io/two-rivers/',{waitUntil:'domcontentloaded',timeout:60000});
 await new Promise(r=>setTimeout(r,20000));
 const st=await p.evaluate(()=>!!window.__dbg);
 await p.screenshot({path:'/home/user/test/live.png'});
 console.log('dbg',st, logs.slice(0,5).join(' | ')||'NO_ERRORS');
 await b.close();
})();
