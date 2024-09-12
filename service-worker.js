self.addEventListener('beforeinstallprompt', (e) => {
  console.log('before install event')
});

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        './index.html',
        './app.js',
        './style.css',
        './img/48.png',
        './img/144.png',
        './img/180.png',
        './img/192.png',
        './img/196.png',
        './img/512.png',
      ])
    })
    .catch((error) => console.error(error))
  );
});

self.addEventListener('fetch', function (event) {
  if(!(event.request.url.indexOf('http') === 0)) return; // skip the request if request is not made with http protocol

  event.respondWith(caches.match(event.request).then(function (response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();

        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('/sw-test/gallery/myLittleVader.jpg');
      });
    }
  }));
});