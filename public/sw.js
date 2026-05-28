/* =========================================
   VIDHWAAN KIDLAB
   ULTRA PRODUCTION SW.JS
========================================= */

/* =========================================
   CACHE VERSION
========================================= */

const CACHE_NAME =
  "kidlab-v6";

/* =========================================
   STATIC ASSETS
========================================= */

const STATIC_ASSETS = [

  "/",
  "/index.html",
  "/main.css",
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

          /* =========================
             NAVIGATION PRELOAD
          ========================= */

          if (

            self.registration &&
            self.registration.navigationPreload

          ) {

            await self
              .registration
              .navigationPreload
              .enable();

          }

          /* =========================
             TAKE CONTROL
          ========================= */

          await self.clients.claim();

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

    /* =========================
       ONLY GET REQUESTS
    ========================= */

    if (
      event.request.method !==
      "GET"
    ) {
      return;
    }

    const requestUrl =
      new URL(
        event.request.url
      );

    /* =====================================
       NEVER CACHE APP.JS
    ===================================== */

    if (

      requestUrl.pathname.includes(
        "app.js"
      )

    ) {

      event.respondWith(

        fetch(event.request, {

          cache: "no-store"

        })

      );

      return;

    }

    /* =====================================
       NEVER CACHE HTML
    ===================================== */

    if (

      event.request.mode ===
      "navigate"

    ) {

      event.respondWith(

        fetch(event.request, {

          cache: "no-store"

        })

        .catch(() => {

          return caches.match(
            "/index.html"
          );

        })

      );

      return;

    }

    /* =====================================
       CACHE FIRST FOR SAFE STATIC FILES
    ===================================== */

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

          /* =========================
             INVALID RESPONSE
          ========================= */

          if (
            !response ||
            response.status !== 200
          ) {

            return response;

          }

          /* =========================
             CACHE SAFE FILES ONLY
          ========================= */

          if (

            requestUrl.pathname.endsWith(".png") ||
            requestUrl.pathname.endsWith(".jpg") ||
            requestUrl.pathname.endsWith(".jpeg") ||
            requestUrl.pathname.endsWith(".svg") ||
            requestUrl.pathname.endsWith(".webp") ||
            requestUrl.pathname.endsWith(".css") ||
            requestUrl.pathname.endsWith(".json") ||
            requestUrl.pathname.endsWith(".dat")

          ) {

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

          }

          return response;

        })

        .catch(() => {

          /* =========================
             IMAGE FALLBACK
          ========================= */

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
