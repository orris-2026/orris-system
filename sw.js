/* أورس v15 — Service Worker: الصفحة من الشبكة أولاً · الصور والقاموس والمكتبات من الجهاز · يفتح بدون إنترنت · الإشعارات */
const C='orris-v15';
const ASSETS=['./','./index.html','./icon-192.png','./logo-w.png','./logo-n.png','./bal-hd.jpg','./bal-ft.jpg','./i18n-en.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
const LIB=/cdn\.jsdelivr\.net\/npm\/(@supabase\/supabase-js|jsqr)|fonts\.(googleapis|gstatic)\.com/;
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  /* المكتبات والخطوط: من الجهاز مع تحديث بالخلفية */
  if(LIB.test(r.url)){e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>{const f=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>m);return m||f})));return}
  if(u.origin!==location.origin)return;
  /* الصفحة نفسها: الشبكة أولاً (دايماً آخر نسخة) */
  if(r.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname)){e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put('./index.html',cp))}return res}).catch(()=>caches.match('./index.html').then(m=>m||new Response('أورس — لا يوجد اتصال بالإنترنت',{headers:{'Content-Type':'text/plain; charset=utf-8'}}))));return}
  /* الصور والقاموس: من الجهاز */
  if(/\.(png|jpg|json|webmanifest)$/.test(u.pathname)){e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}))));return}
});
self.addEventListener('push',e=>{let d={};try{d=e.data.json()}catch(x){d={title:'أورس',body:e.data&&e.data.text()}}
  e.waitUntil(self.registration.showNotification(d.title||'أورس',{body:d.body||'',icon:'icon-192.png',badge:'badge-96.png',dir:'rtl',lang:'ar',tag:d.tag||undefined,data:{url:d.url||''}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url='./index.html'+(e.notification.data&&e.notification.data.url?'#/'+e.notification.data.url:'');
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(L=>{for(const c of L){if('focus' in c){c.navigate(url).catch(()=>{});return c.focus()}}return self.clients.openWindow(url)}))});
