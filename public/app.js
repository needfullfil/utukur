/* =========================================
   VIDHWAAN KIDLAB
   ULTIMATE PRODUCTION APP.JS
========================================= */

/* =========================================
   SPLASH SCREEN
========================================= */

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      document
        .getElementById(
          "appSplash"
        )
        ?.classList.add(
          "hideSplash"
        );

    }, 700);

  }
);

/* =========================================
   GLOBAL STATE
========================================= */

const APP = {


  currentGrade: "",

  currentQuiz: null,

  currentQuizFile: "",

  currentQuestionIndex: 0,

  currentScore: 0,

  answered: false,

  loading: false

};

/* =========================================
   ELEMENTS
========================================= */

const $ = id =>
  document.getElementById(id);

const pages = {

  login: $("loginPage"),

  grades: $("gradePage"),

  quizList: $("quizListPage"),

  quiz: $("quizPage"),

  score: $("scorePage")

};

const loginBtn =
  $("loginBtn");

const loginError =
  $("loginError");


const gradeGrid =
  $("gradeGrid");

const quizGrid =
  $("quizGrid");

const quizListTitle =
  $("quizListTitle");

const questionText =
  $("questionText");

const questionImage =
  $("questionImage");

const questionImageWrap =
  $("questionImageWrap");

const optionsContainer =
  $("optionsContainer");

const answerResult =
  $("answerResult");

const explanationBox =
  $("explanationBox");

const lectureBox =
  $("lectureBox");

const lectureToggle =
  $("lectureToggle");

const nextQuestionBtn =
  $("nextQuestionBtn");

const questionCounter =
  $("questionCounter");

const finalScore =
  $("finalScore");

const scoreMessage =
  $("scoreMessage");

const installBtn =
  $("installBtn");

/* =========================================
   SAFE CLICK
========================================= */

function bindClick(
  id,
  handler
) {

  const element = $(id);

  if (element) {

    element.addEventListener(
      "click",
      handler
    );

  }

}

/* =========================================
   HELPERS
========================================= */

function safeText(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }

  return String(value).trim();

}

function smoothTop() {

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}

function showPage(page) {

  Object.values(pages)
    .forEach(p => {

      p?.classList.remove(
        "active"
      );

    });

  page?.classList.add(
    "active"
  );

  smoothTop();

}

function sleep(ms) {

  return new Promise(resolve => {

    setTimeout(
      resolve,
      ms
    );

  });

}

/* =========================================
   DAT DECODER
========================================= */

function decodeDatFile(scrambled) {

  try {

    const reversed =

      scrambled
        .split("")
        .reverse()
        .join("");

    const binary =

      Uint8Array.from(

        atob(reversed),

        char =>
          char.charCodeAt(0)

      );

    return window.MessagePack.decode(
      binary
    );

  } catch (error) {

    console.error(
      "DAT decode failed",
      error
    );

    return null;

  }

}

/* =========================================
   LOAD DAT
========================================= */

async function loadDat(url) {

  try {

    const response =
      await fetch(url, {

        cache: "no-store"

      });

    if (!response.ok) {

      throw new Error(
        `Failed loading ${url}`
      );

    }

    const text =
      await response.text();

    return decodeDatFile(text);

  } catch (error) {

    console.error(error);

    return null;

  }

}

/* =========================================
   VILLAGE LOCATION ACCESS
   FINAL PRODUCTION VERSION
========================================= */

const VILLAGE_CENTER = {

  lat: 14.239078,
  lng: 79.739651

};

const ALLOWED_RADIUS_KM = 2;

/* =========================================
   LIVE PROTECTION INTERVAL
========================================= */

let villageProtectionInterval = null;

/* =========================================
   DISTANCE CALCULATION
========================================= */

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat =

    (lat2 - lat1) *
    Math.PI / 180;

  const dLon =

    (lon2 - lon1) *
    Math.PI / 180;

  const a =

    Math.sin(dLat / 2) *
    Math.sin(dLat / 2)

    +

    Math.cos(
      lat1 * Math.PI / 180
    )

    *

    Math.cos(
      lat2 * Math.PI / 180
    )

    *

    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c =

    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;

}

/* =========================================
   RESET LOGIN BUTTON
========================================= */

function resetLoginButton() {

  APP.loading = false;

  loginBtn.disabled = false;

  loginBtn.innerHTML =

    "Enter Science Lab";

}

/* =========================================
   FORCE LOCK APP
========================================= */

function lockScienceLab(
  message
) {

  APP.loading = false;

  /* =========================
     STOP PROTECTION
  ========================= */

  if (
    villageProtectionInterval
  ) {

    clearInterval(
      villageProtectionInterval
    );

    villageProtectionInterval =
      null;

  }

  /* =========================
     RESET BUTTON
  ========================= */

  loginBtn.disabled = false;

  loginBtn.innerHTML =

    "Enter Science Lab";

  loginError.textContent =
    message;

  /* =========================
     RETURN LOGIN SCREEN
  ========================= */

  showPage(
    pages.login
  );

}

/* =========================================
   VERIFY LOCATION ACCESS
========================================= */

function verifyVillageAccess(
  onSuccess = () => {},
  isSilentCheck = false
) {

  /* =========================
     GEOLOCATION SUPPORT
  ========================= */

  if (
    !navigator.geolocation
  ) {

    if (!isSilentCheck) {

      loginError.textContent =

        "Location is not supported on this device.";

      resetLoginButton();

    }

    return;

  }

  /* =========================
     REQUEST LOCATION
  ========================= */

  navigator.geolocation.getCurrentPosition(

    position => {

      const userLat =
        position.coords.latitude;

      const userLng =
        position.coords.longitude;

      const distance =

        calculateDistance(

          userLat,
          userLng,

          VILLAGE_CENTER.lat,
          VILLAGE_CENTER.lng

        );

      /* =====================
         INSIDE VILLAGE
      ===================== */

      if (
        distance <=
        ALLOWED_RADIUS_KM
      ) {

        onSuccess();

      }

      /* =====================
         OUTSIDE VILLAGE
      ===================== */

      else {

        lockScienceLab(

          "This Science Lab works only inside Utukur village."

        );

      }

    },

    error => {

      /* =====================
         SILENT BACKGROUND CHECK
      ===================== */

      if (
        isSilentCheck
      ) {

        lockScienceLab(

          "Live village location required."

        );

        return;

      }

      /* =====================
         NORMAL LOGIN FLOW
      ===================== */

      APP.loading = false;

      loginBtn.disabled = false;

      loginBtn.innerHTML =

        "Enter Science Lab";

      /* =====================
         PERMISSION DENIED
      ===================== */

      if (
        error.code === 1
      ) {

        loginError.textContent =

          "Please allow location access and try again.";

      }

      /* =====================
         POSITION UNAVAILABLE
      ===================== */

      else if (
        error.code === 2
      ) {

        loginError.textContent =

          "Please turn on device location and try again.";

      }

      /* =====================
         TIMEOUT
      ===================== */

      else if (
        error.code === 3
      ) {

        loginError.textContent =

          "Location is taking too long. Please try again.";

      }

      /* =====================
         UNKNOWN ERROR
      ===================== */

      else {

        loginError.textContent =

          "Unable to access location.";

      }

    },

    {

      enableHighAccuracy: false,

      timeout: 20000,

      maximumAge: 300000

    }

  );

}

/* =========================================
   START LIVE PROTECTION
========================================= */

function startVillageProtection() {

  /* =========================
     PREVENT DUPLICATES
  ========================= */

  if (
    villageProtectionInterval
  ) {

    clearInterval(
      villageProtectionInterval
    );

  }

  /* =========================
     EVERY 15 MINUTES
  ========================= */

  villageProtectionInterval =

    setInterval(() => {

      verifyVillageAccess(
        () => {},
        true
      );

    }, 900000);

  /* =========================
     APP RETURN CHECK
  ========================= */

  document.addEventListener(

    "visibilitychange",

    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        verifyVillageAccess(
          () => {},
          true
        );

      }

    }

  );

}

/* =========================================
   ENTER SCIENCE LAB
========================================= */

async function login() {

  if (APP.loading) {
    return;
  }

  APP.loading = true;

  loginBtn.disabled = true;

  loginBtn.innerHTML =

    "Checking Village Access...";

  loginError.textContent = "";

  verifyVillageAccess(

    () => {

      loginBtn.innerHTML =

        "Welcome To Science Lab ✨";

      setTimeout(() => {

        APP.loading = false;

        openGrades();

        startVillageProtection();

      }, 700);

    },

    false

  );

}

/* =========================================
   LOGIN BUTTON
========================================= */

bindClick(
  "loginBtn",
  login
);

/* =========================================
   AUTO LOGIN
========================================= */

async function autoLogin() {

  showPage(
    pages.login
  );

}

/* =========================================
   OPEN GRADES
========================================= */

function openGrades() {

  showPage(
    pages.grades
  );

  gradeGrid.innerHTML = "";

  [

    "grade2",
    "grade3",
    "grade4",
    "grade5",
    "grade6",
    "grade7",
    "grade8"

  ].forEach(grade => {

    const card =
      document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <div class="cardTitle">
        ${grade.replace("grade", "Grade ")}
      </div>
    `;

    card.onclick = () => {

      APP.currentGrade = grade;

      openQuizList();

    };

    gradeGrid.appendChild(card);

  });

}

/* =========================================
   QUIZ LIST
========================================= */

async function openQuizList() {

  showPage(
    pages.quizList
  );

  quizGrid.innerHTML = "";

  quizListTitle.textContent =

    APP.currentGrade.replace(
      "grade",
      "Grade "
    );

  const index =
    await loadDat(

      `./data/grades/${APP.currentGrade}/index.dat`

    );

  if (
    !index ||
    !index.files
  ) {

    quizGrid.innerHTML = `
      <div class="card">
        <div class="cardTitle">
          No Quizzes Available
        </div>
      </div>
    `;

    return;

  }

  const progress =
    JSON.parse(

      localStorage.getItem(
        "scienceProgress"
      ) || "{}"

    );

  const unlocked =
    progress[
      APP.currentGrade
    ] || 1;

  index.files.forEach(
    (file, indexNum) => {

      const quizNumber =
        indexNum + 1;

      const isUnlocked =
        quizNumber <= unlocked;

      const card =
        document.createElement("div");

      card.className =

        isUnlocked
          ? "card"
          : "card locked";

      card.innerHTML = `
        <div class="cardTitle">
          Quiz ${quizNumber}
        </div>

        ${
          isUnlocked
            ? ""
            : `
              <div class="lockIcon">
                🔒
              </div>
            `
        }
      `;

      if (isUnlocked) {

        card.onclick = () => {

          loadQuiz(file);

        };

      }

      quizGrid.appendChild(card);

    }
  );

}

/* =========================================
   LOAD QUIZ
========================================= */

async function loadQuiz(file) {

  const quiz =
    await loadDat(

      `./data/grades/${APP.currentGrade}/${file}`

    );

  if (
    !quiz ||
    !quiz.questions
  ) {

    alert(
      "Unable to load quiz"
    );

    return;

  }

  APP.currentQuiz = quiz;

  APP.currentQuizFile = file;

  APP.currentQuestionIndex = 0;

  APP.currentScore = 0;

  APP.answered = false;

  showPage(
    pages.quiz
  );

  renderQuestion();

}

/* =========================================
   RENDER QUESTION
========================================= */

function renderQuestion() {

  const question =

    APP.currentQuiz.questions[
      APP.currentQuestionIndex
    ];

  if (!question) {
    return;
  }

  APP.answered = false;

  nextQuestionBtn.style.display =
    "none";

  answerResult.textContent = "";

  explanationBox.style.display =
    "none";

  lectureBox.style.display =
    "none";

  lectureToggle.textContent =
    "View Lecture";

  questionCounter.textContent =

    `Question ${
      APP.currentQuestionIndex + 1
    } / ${
      APP.currentQuiz.questions.length
    }`;

  questionText.innerHTML =
    safeText(question.q);

  /* IMAGE */

  questionImage.style.opacity =
    "0.3";

  if (question.img) {

    questionImage.loading =
      "lazy";

    questionImage.decoding =
      "async";

    questionImage.src =
      question.img;

    questionImage.onload =
      () => {

        questionImage.style.opacity =
          "1";

      };

    questionImage.onerror =
      () => {

        questionImageWrap.style.display =
          "none";

      };

    questionImageWrap.style.display =
      "block";

  } else {

    questionImage.removeAttribute(
      "src"
    );

    questionImageWrap.style.display =
      "none";

  }

  /* OPTIONS */

  optionsContainer.innerHTML = "";

  question.o.forEach(
    (option, index) => {

      const button =
        document.createElement(
          "button"
        );

      button.className =
        "optionBtn";

      button.textContent =
        safeText(option);

      button.onclick = () => {

        selectAnswer(
          index,
          button
        );

      };

      optionsContainer.appendChild(
        button
      );

    }
  );

  /* EXPLANATION */

  explanationBox.textContent =
    safeText(question.e);

  /* LECTURE */

  const lecture =
    Array.isArray(question.l)
      ? question.l
      : [question.l];

  lectureBox.innerHTML =

    lecture
      .filter(Boolean)
      .map(paragraph => {

        return `
          <p class="lectureParagraph">
            ${safeText(paragraph)}
          </p>
        `;

      })
      .join("");

  smoothTop();

}

/* =========================================
   SELECT ANSWER
========================================= */

function selectAnswer(
  selectedIndex,
  button
) {

  if (APP.answered) {
    return;
  }

  APP.answered = true;

  const question =

    APP.currentQuiz.questions[
      APP.currentQuestionIndex
    ];

  const buttons =

    document.querySelectorAll(
      ".optionBtn"
    );

  buttons.forEach(
    (btn, index) => {

      btn.disabled = true;

      if (
        index === question.a
      ) {

        btn.classList.add(
          "correct"
        );

      }

    }
  );

  if (
    selectedIndex ===
    question.a
  ) {

    APP.currentScore++;

    answerResult.textContent =
      "✅ Correct";

    answerResult.style.color =
      "#2ecc71";

  } else {

    button.classList.add(
      "wrong"
    );

    answerResult.textContent =
      "❌ Wrong";

    answerResult.style.color =
      "#ff6b6b";

  }

  explanationBox.style.display =
    "block";

  nextQuestionBtn.style.display =
    "block";

}

/* =========================================
   NEXT QUESTION
========================================= */

bindClick(
  "nextQuestionBtn",
  () => {

    APP.currentQuestionIndex++;

    if (

      APP.currentQuestionIndex >=
      APP.currentQuiz.questions.length

    ) {

      finishQuiz();

      return;

    }

    renderQuestion();

  }
);

/* =========================================
   FINISH QUIZ
========================================= */

function finishQuiz() {

  showPage(
    pages.score
  );

  finalScore.textContent =

    `${APP.currentScore} / ${APP.currentQuiz.questions.length}`;

  const passed =

    APP.currentScore ===
    APP.currentQuiz.questions.length;

  if (passed) {

    scoreMessage.textContent =
      "Perfect Score — Next Quiz Unlocked";

    unlockNextQuiz();

  } else {

    scoreMessage.textContent =
      "Retry quiz to unlock next level.";

  }

}

/* =========================================
   UNLOCK NEXT QUIZ
========================================= */

function unlockNextQuiz() {

  const progress =
    JSON.parse(

      localStorage.getItem(
        "scienceProgress"
      ) || "{}"

    );

  /* ==============================
     CURRENT QUIZ NUMBER
  ============================== */

  const currentQuizNumber =

    APP.currentQuestionIndex >= 0

      ? parseInt(

          APP.currentQuizFile
            .replace(".dat", "")
            .replace(/[^\d]/g, "")

        )

      : 1;

  /* ==============================
     NEXT QUIZ
  ============================== */

  const nextQuizNumber =
    currentQuizNumber + 1;

  /* ==============================
     CURRENT UNLOCKED
  ============================== */

  const alreadyUnlocked =

    progress[
      APP.currentGrade
    ] || 1;

  /* ==============================
     ONLY UNLOCK NEXT
  ============================== */

  if (
    nextQuizNumber >
    alreadyUnlocked
  ) {

    progress[
      APP.currentGrade
    ] = nextQuizNumber;

    localStorage.setItem(

      "scienceProgress",

      JSON.stringify(
        progress
      )

    );

  }

}

/* =========================================
   LECTURE TOGGLE
========================================= */

bindClick(
  "lectureToggle",
  () => {

    if (!APP.answered) {
      return;
    }

    const visible =

      lectureBox.style.display ===
      "block";

    lectureBox.style.display =

      visible
        ? "none"
        : "block";

    lectureToggle.textContent =

      visible
        ? "View Lecture"
        : "Hide Lecture";

  }
);

/* =========================================
   BUTTONS
========================================= */

bindClick(
  "retakeBtn",
  () => {

    loadQuiz(
      APP.currentQuizFile
    );

  }
);

bindClick(
  "backToGrades",
  openGrades
);

bindClick(
  "backToQuizList",
  openQuizList
);

bindClick(
  "backToQuizPageBtn",
  openQuizList
);

bindClick(
  "logoutBtn",
  () => {

    location.reload();

  }
);

/* =========================================
   IMAGE FAILBACK
========================================= */

questionImage?.addEventListener(
  "error",
  () => {

    questionImageWrap.style.display =
      "none";

  }
);

/* =========================================
   PWA INSTALL
========================================= */

/* =========================================
   PWA INSTALL
========================================= */

let deferredPrompt = null;

/* =========================================
   CHECK IF ALREADY INSTALLED
========================================= */

function isPWAInstalled() {

  return (

    window.matchMedia(
      "(display-mode: standalone)"
    ).matches ||

    window.navigator.standalone === true

  );

}

/* =========================================
   SHOW INSTALL ONLY IF POSSIBLE
========================================= */

window.addEventListener(

  "beforeinstallprompt",

  event => {

    event.preventDefault();

    deferredPrompt = event;

    if (
      !isPWAInstalled()
    ) {

      installBtn?.classList.add(
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
   HIDE AFTER INSTALL
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
   SERVICE WORKER
========================================= */

if (
  "serviceWorker" in navigator
) {

  window.addEventListener(
    "load",
    () => {

      navigator.serviceWorker
        .register("./sw.js")
        .catch(console.error);

    }
  );

}

/* =========================================
   MOBILE TOUCH
========================================= */

document.body.style.touchAction =
  "pan-y";

/* =========================================
   START
========================================= */

autoLogin();
