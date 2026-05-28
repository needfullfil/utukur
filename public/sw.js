const CACHE_NAME =
  "kidlab-v4";

/* =========================================
   STATIC ASSETS
========================================= */

const STATIC_ASSETS = [

  "/",
  "/index.html",
  "/main.css",
  "/app.js",
  "/manifest.json",

  "/icons/logo.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png"

];

/* =========================================
   INSTALL
========================================= */

self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(cache => {

          return cache.addAll(
            STATIC_ASSETS
          );

        })
        .then(() => {

          return self.skipWaiting();

        })

    );

  }
);

/* =========================================
   ACTIVATE
========================================= */

self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(keys => {

          return Promise.all(

            keys.map(key => {

              if (
                key !== CACHE_NAME
              ) {

                return caches.delete(
                  key
                );

              }

            })

          );

        })
        .then(async () => {

          /* ===============================
             ENABLE NAVIGATION PRELOAD
          =============================== */

          if (

            self.registration &&
            self.registration.navigationPreload

          ) {

            await self
              .registration
              .navigationPreload
              .enable();

          }

          return self.clients.claim();

        })

    );

  }
);

/* =========================================
   FETCH
========================================= */

self.addEventListener(
  "fetch",
  event => {

    /* ===============================
       ONLY GET REQUESTS
    =============================== */

    if (
      event.request.method !==
      "GET"
    ) {
      return;
    }

    /* ===============================
       NAVIGATION REQUESTS
    =============================== */

    if (
      event.request.mode ===
      "navigate"
    ) {

      event.respondWith(

        fetch(event.request)

          .then(response => {

            const responseClone =
              response.clone();

            caches
              .open(CACHE_NAME)
              .then(cache => {

                cache.put(
                  "/index.html",
                  responseClone
                );

              });

            return response;

          })

          .catch(() => {

            return caches.match(
              "/index.html"
            );

          })

      );

      return;

    }

    /* ===============================
       CACHE FIRST
    =============================== */

    event.respondWith(

      caches.match(
        event.request
      )

      .then(cached => {

        if (cached) {

          return cached;

        }

        return fetch(
          event.request
        )

        .then(response => {

          /* ===========================
             INVALID RESPONSE
          =========================== */

          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {

            return response;

          }

          const responseClone =
            response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {

              cache.put(
                event.request,
                responseClone
              );

            });

          return response;

        })

        .catch(() => {

          /* ===========================
             FALLBACKS
          =========================== */

          if (

            event.request.destination ===
            "image"

          ) {

            return caches.match(
              "/icons/logo.png"
            );

          }

        });

      })

    );

  }
);

/* =========================================
   MESSAGE
========================================= */

self.addEventListener(
  "message",
  event => {

    if (
      event.data &&
      event.data.type ===
      "SKIP_WAITING"
    ) {

      self.skipWaiting();

    }

  }
);
