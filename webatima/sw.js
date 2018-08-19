var assets = ["mithril_eb39.js","styles/a4008b8e.css","scripts/vendors~index_34bd01037f2fc9512104.js","scripts/index_13ea8fe88a0774236352.js","scripts/hlib~index_11dd6f08d8b51487ff86.js"];

var cacheid = "v1";

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(cacheid).then(function(cache) {
        return cache.addAll(assets).then(function(){return self.skipWaiting();});
      })
    );
  });

function fromNetwork(request){
  return fetch(request).then(function(response){
    let responseClone = response.clone();
    caches.open(cacheid).then(function(cache) { // update cache with fetched
      cache.put(request, responseClone);
    });
    return response;
  });
}

self.addEventListener('fetch', function(event) {
    if(event.request.method !== 'GET'){
      return;
    }
    console.log(event.request.url);

    if(event.request.url.indexOf("index.html")>-1){
      event.respondWith(
        fromNetwork(event.request).catch(function(){
          caches.match(event.request).then(function(resp) {
            return resp || caches.match('offline.html');
            });
          })
        );
    }
    else{
    event.respondWith(
      caches.match(event.request).then(function(resp) {
        return resp || fromNetwork(event.request);
      }).catch(function() {
        return caches.match('offline.html');
      })
    );
  }
  });


  self.addEventListener('activate', function(event) {
    var cacheWhitelist = [cacheid];
  
    event.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (cacheWhitelist.indexOf(key) === -1) {
            return caches.delete(key);
          }
        }));
      }).then(function(){self.clients.claim();})
    );
  });

