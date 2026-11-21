const puppeteer=require('puppeteer');const http=require('http');const fs=require('fs');const path=require('path');
const srv=http.createServer((q,r)=>{let p=q.url.split('?')[0];if(p==='/')p='/index.html';fs.readFile(path.join('/home/user/two-rivers',p),(e,d)=>{if(e){r.writeHead(404);r.end();return;}r.writeHead(200,{'Content-Type':'text/html'});r.end(d);});});
(async()=>{
 await new Promise(r=>srv.listen(8888,'0.0.0.0',r));
 const b=await puppeteer.launch({headless:'new',env:{...process.env,LD_LIBRARY_PATH:'/home/user/.cache/chromedeps/usr/lib/x86_64-linux-gnu'},args:['--no-sandbox','--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader']});
 const p=await b.newPage(); p.on('pageerror',e=>console.log('[ERR]',e.message));
 await p.goto('http://127.0.0.1:8888/index.html',{waitUntil:'domcontentloaded'});
 await new Promise(r=>setTimeout(r,16000));
 const out=await p.evaluate(()=>{
   const d=window.__dbg, T=d.THREE;
   const m=d.scene.getObjectByName('terrain380');
   m.visible=false;
   d.renderer.render(d.scene,d.camera);
   const gl=d.renderer.getContext();
   const px=new Uint8Array(4); gl.readPixels(500,200,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);
   const sky=[...px];
   m.visible=true;
   d.renderer.render(d.scene,d.camera);
   const px2=new Uint8Array(4); gl.readPixels(500,200,1,1,gl.RGBA,gl.UNSIGNED_BYTE,px2);
   return {sky, with:[...px2], mat:m.material.type, vc:m.material.vertexColors,
     colorAttr:!!m.geometry.attributes.color, geoVerified:m.geometry.attributes.position.count};
 });
 console.log(JSON.stringify(out));
 await p.screenshot({path:'/home/user/test/chk3.png'});
 await b.close(); srv.close();
})();
