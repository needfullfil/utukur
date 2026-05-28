/* =========================================
   GLOBAL ELEMENTS
========================================= */

const body =
  document.body;

const installBtn =
  document.getElementById(
    "installBtn"
  );

const appSplash =
  document.getElementById(
    "appSplash"
  );

const schoolTitle =
  document.getElementById(
    "schoolTitle"
  );

const schoolPhone =
  document.getElementById(
    "schoolPhone"
  );

const schoolInput =
  document.getElementById(
    "schoolInput"
  );

const phoneInput =
  document.getElementById(
    "phoneInput"
  );

const generateBtn =
  document.getElementById(
    "generateBtn"
  );

const qrCanvas =
  document.getElementById(
    "qrCanvas"
  );

const qrSchoolName =
  document.getElementById(
    "qrSchoolName"
  );

const qrPhone =
  document.getElementById(
    "qrPhone"
  );

const downloadCardBtn =
  document.getElementById(
    "downloadCardBtn"
  );

const qrCard =
  document.getElementById(
    "qrCard"
  );

/* =========================================
   APP STATE
========================================= */

let deferredPrompt =
  null;

/* =========================================
   SPLASH SCREEN
========================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      appSplash
        ?.classList.add(
          "hideSplash"
        );

    }, 1200);

  }
);

/* =========================================
   URL PARAMS
========================================= */

function getURLParams() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return {

    school:
      params.get("school"),

    phone:
      params.get("phone")

  };

}

/* =========================================
   SCHOOL BRANDING
========================================= */

function applySchoolBranding() {

  const params =
    getURLParams();

  const school =
    params.school ||
    localStorage.getItem(
      "schoolName"
    );

  const phone =
    params.phone ||
    localStorage.getItem(
      "schoolPhone"
    );

  if (school) {

    localStorage.setItem(
      "schoolName",
      school
    );

    schoolTitle.textContent =
      `Welcome ${school} Students`;

    qrSchoolName.textContent =
      school;

  }

  if (phone) {

    localStorage.setItem(
      "schoolPhone",
      phone
    );

    schoolPhone.textContent =
      `Admissions Contact: ${phone}`;

    qrPhone.textContent =
      `Contact: ${phone}`;

  }

}

applySchoolBranding();

/* =========================================
   PWA CHECK
========================================= */

function isPWAInstalled() {

  return (

    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||

    window.navigator.standalone ===
    true

  );

}

/* =========================================
   INSTALL PROMPT
========================================= */

window.addEventListener(

  "beforeinstallprompt",

  event => {

    event.preventDefault();

    deferredPrompt =
      event;

    if (
      !isPWAInstalled()
    ) {

      installBtn
        ?.classList.add(
          "showInstall"
        );

    }

  }
);

/* =========================================
   INSTALL CLICK
========================================= */

installBtn?.addEventListener(
  "click",
  async () => {

    if (
      !deferredPrompt
    ) {

      alert(
        "Install option not available on this device/browser."
      );

      return;

    }

    deferredPrompt.prompt();

    const choice =
      await deferredPrompt.userChoice;

    if (
      choice.outcome ===
      "accepted"
    ) {

      installBtn.classList.remove(
        "showInstall"
      );

    }

    deferredPrompt = null;

  }
);

/* =========================================
   APP INSTALLED
========================================= */

window.addEventListener(
  "appinstalled",
  () => {

    installBtn?.classList.remove(
      "showInstall"
    );

    deferredPrompt = null;

  }
);

/* =========================================
   HERO BUTTONS
========================================= */

document
  .getElementById(
    "startExperienceBtn"
  )
  ?.addEventListener(
    "click",
    () => {

      window.scrollTo({

        top:
          window.innerHeight,

        behavior:
          "smooth"

      });

    }
  );

document
  .getElementById(
    "exploreBtn"
  )
  ?.addEventListener(
    "click",
    () => {

      document
        .querySelector(
          ".featureGrid"
        )
        ?.scrollIntoView({

          behavior:
            "smooth"

        });

    }
  );

/* =========================================
   GENERATE QR
========================================= */

async function generateQRCode() {

  const school =
    schoolInput.value
      .trim();

  const phone =
    phoneInput.value
      .trim();

  if (
    !school ||
    !phone
  ) {

    alert(
      "Please enter school name and mobile number."
    );

    return;

  }

  const finalURL =

    `${window.location.origin}/?school=${encodeURIComponent(
      school
    )}&phone=${encodeURIComponent(
      phone
    )}`;

  qrSchoolName.textContent =
    school;

  qrPhone.textContent =
    `Contact: ${phone}`;

  localStorage.setItem(
    "schoolName",
    school
  );

  localStorage.setItem(
    "schoolPhone",
    phone
  );

  await QRCode.toCanvas(

    qrCanvas,

    finalURL,

    {

      width: 260,

      margin: 2,

      color: {

        dark:
          "#050816",

        light:
          "#ffffff"

      }

    }

  );

  document
    .getElementById(
      "qrPreview"
    )
    ?.classList.add(
      "showQR"
    );

  qrCard.scrollIntoView({

    behavior:
      "smooth",

    block:
      "center"

  });

}

generateBtn?.addEventListener(
  "click",
  generateQRCode
);

/* =========================================
   DOWNLOAD QR CARD
========================================= */

downloadCardBtn?.addEventListener(
  "click",
  async () => {

    try {

      const canvas =
        await html2canvas(
          qrCard,
          {

            scale: 3,

            backgroundColor:
              null,

            useCORS:
              true

          }
        );

      const link =
        document.createElement(
          "a"
        );

      const school =
        qrSchoolName.textContent
          .replace(/\s+/g, "-");

      link.download =
        `${school}-KidLab-QR.png`;

      link.href =
        canvas.toDataURL(
          "image/png"
        );

      link.click();

    } catch (error) {

      console.error(error);

      alert(
        "Unable to download QR card."
      );

    }

  }
);

/* =========================================
   PREMIUM MOTION
========================================= */

const observer =
  new IntersectionObserver(

    entries => {

      entries.forEach(
        entry => {

          if (
            entry.isIntersecting
          ) {

            entry.target.classList.add(
              "showElement"
            );

          }

        }
      );

    },

    {

      threshold:
        0.15

    }

  );

document
  .querySelectorAll(

    ".featureCard, .experienceCard, #generatorCard, #ctaCard"

  )

  .forEach(
    element => {

      observer.observe(
        element
      );

    }
  );

/* =========================================
   PARALLAX
========================================= */

window.addEventListener(
  "scroll",
  () => {

    const scroll =
      window.scrollY;

    const phone =
      document.getElementById(
        "phoneMockup"
      );

    if (phone) {

      phone.style.transform =

        `translateY(${scroll * 0.06}px)`;

    }

  }
);

/* =========================================
   FLOATING PARTICLES
========================================= */

const particles =
  document.querySelectorAll(
    "#bgEffects span"
  );

particles.forEach(
  (particle, index) => {

    particle.style.animationDelay =

      `${index * 1.2}s`;

  }
);

/* =========================================
   CTA BUTTON
========================================= */

document
  .getElementById(
    "ctaBtn"
  )
  ?.addEventListener(
    "click",
    () => {

      document
        .querySelector(
          "#generatorCard"
        )
        ?.scrollIntoView({

          behavior:
            "smooth"

        });

    }
  );

/* =========================================
   TOUCH OPTIMIZATION
========================================= */

document.addEventListener(
  "touchstart",
  () => {},
  {
    passive: true
  }
);

/* =========================================
   DISABLE DOUBLE TAP ZOOM
========================================= */

let lastTouchEnd = 0;

document.addEventListener(
  "touchend",
  event => {

    const now =
      Date.now();

    if (
      now - lastTouchEnd <=
      300
    ) {

      event.preventDefault();

    }

    lastTouchEnd = now;

  },

  {
    passive: false
  }
);

/* =========================================
   DEVICE DETECTION
========================================= */

function isMobile() {

  return /Android|iPhone|iPad|iPod/i
    .test(
      navigator.userAgent
    );

}

if (isMobile()) {

  body.classList.add(
    "mobileDevice"
  );

}

/* =========================================
   SERVICE WORKER
========================================= */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "DOMContentLoaded",
    () => {

      navigator
        .serviceWorker
        .register(
          "/sw.js"
        )
        .catch(
          console.error
        );

    }
  );

}

/* =========================================
   CONSOLE BRANDING
========================================= */

console.log(

  "%cKidLab by Vidhwaan",

  `
    color: white;
    background: #050816;
    padding: 12px 18px;
    font-size: 18px;
    font-weight: 700;
    border-radius: 12px;
  `

);

console.log(
  "Interactive Science Learning Platform"
);
