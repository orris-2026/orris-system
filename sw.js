/* أورس — Service Worker: الشبكة أولاً (لا نسخ قديمة) + صفحة احتياطية بدون إنترنت + الإشعارات */
const C='orris-v14b';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./index.html','./icon-192.png']).catch(()=>{})));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);if(u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{if(res.ok&&(r.mode==='navigate'||/\.png$/.test(u.pathname))){const cp=res.clone();caches.open(C).then(c=>c.put(r.mode==='navigate'?'./index.html':r,cp))}return res}).catch(()=>caches.match(r.mode==='navigate'?'./index.html':r).then(m=>m||new Response('أورس — لا يوجد اتصال بالإنترنت',{headers:{'Content-Type':'text/plain; charset=utf-8'}}))))});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={title:'أورس',body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'أورس',{body:d.body||'',icon:'icon-192.png',badge:'badge-96.png',dir:'rtl',lang:'ar',tag:d.tag||undefined,data:{url:d.url||''}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url='./index.html'+(e.notification.data&&e.notification.data.url?'#/'+e.notification.data.url:'');
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(L=>{for(const c of L){if('focus' in c){c.navigate(url).catch(()=>{});return c.focus()}}return self.clients.openWindow(url)}))});
