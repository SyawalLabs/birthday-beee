
(() => {
  "use strict";

  // Mengambil elemen HTML
  const form = document.getElementById("birthdayForm");

  const introScreen = document.getElementById("introScreen");
  const loadingScreen = document.getElementById("loadingScreen");
  const birthdayScreen = document.getElementById("birthdayScreen");

  const nameInput = document.getElementById("personName");
  const ageInput = document.getElementById("personAge");

  const displayName = document.getElementById("displayName");
  const displayAge = document.getElementById("displayAge");

  const progress = document.getElementById("loadingProgress");

  const audio = document.getElementById("birthdayAudio");
  const musicButton = document.getElementById("musicButton");
  const musicButtonText = document.getElementById("musicButtonText");

  const secretButton = document.getElementById("secretButton");
  const secretMessage = document.getElementById("secretMessage");

  const replayButton = document.getElementById("replayButton");
  const heartsLayer = document.querySelector(".floating-hearts");

  let loadingTimer = null;
  let heartTimer = null;

  // Menampilkan halaman tertentu
  function showScreen(screenToShow) {
    [introScreen, loadingScreen, birthdayScreen].forEach(screen => {
      screen.classList.toggle(
        "d-none",
        screen !== screenToShow
      );
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // Memulai animasi kejutan
  function launchSurprise(name, age) {
    displayName.textContent = name;
    displayAge.textContent = age;

    showScreen(loadingScreen);
    progress.style.width = "0%";

    let value = 0;

    clearInterval(loadingTimer);

    loadingTimer = setInterval(() => {
      value = Math.min(
        value + Math.floor(Math.random() * 17) + 8,
        100
      );

      progress.style.width = `${value}%`;

      if (value >= 100) {
        clearInterval(loadingTimer);

        setTimeout(() => {
          showScreen(birthdayScreen);
          createHeartBurst();
          startFloatingHearts();
        }, 350);
      }
    }, 190);
  }

  // Validasi form
  form.addEventListener("submit", event => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const age = Number(ageInput.value);

    const validName = name.length > 0;
    const validAge =
      ageInput.value !== "" &&
      Number.isInteger(age) &&
      age >= 1 &&
      age <= 120;

    nameInput.classList.toggle(
      "is-invalid",
      !validName
    );

    ageInput.classList.toggle(
      "is-invalid",
      !validAge
    );

    if (!validName || !validAge) {
      (!validName ? nameInput : ageInput).focus();
      return;
    }

    launchSurprise(name, age);
  });

  // Menghilangkan tanda error ketika input diperbaiki
  [nameInput, ageInput].forEach(input => {
    input.addEventListener("input", () => {
      input.classList.remove("is-invalid");
    });
  });

  // Tombol musik
  musicButton.addEventListener("click", async () => {
    if (audio.paused) {
      try {
        await audio.play();

        musicButton.classList.add("is-playing");
        musicButton.setAttribute("aria-pressed", "true");
        musicButtonText.textContent = "Jeda Musik";

      } catch (error) {
        musicButtonText.textContent = "Tambahkan lagu.mp3";

        setTimeout(() => {
          musicButtonText.textContent = "Putar Musik";
        }, 2400);
      }

    } else {
      audio.pause();

      musicButton.classList.remove("is-playing");
      musicButton.setAttribute("aria-pressed", "false");
      musicButtonText.textContent = "Putar Musik";
    }
  });

  // Pesan rahasia
  secretButton.addEventListener("click", () => {
    const isHidden =
      secretMessage.classList.contains("d-none");

    secretMessage.classList.toggle(
      "d-none",
      !isHidden
    );

    secretButton.innerHTML = isHidden
      ? '<i class="bi bi-heart-fill me-2"></i>Pesan Sudah Terbuka'
      : '<i class="bi bi-envelope-heart-fill me-2"></i>Buka Pesan Rahasia';

    if (isHidden) {
      createHeartBurst();
    }
  });

  // Kembali ke halaman awal
  replayButton.addEventListener("click", () => {
    audio.pause();
    audio.currentTime = 0;

    musicButton.classList.remove("is-playing");
    musicButton.setAttribute("aria-pressed", "false");
    musicButtonText.textContent = "Putar Musik";

    form.reset();

    nameInput.classList.remove("is-invalid");
    ageInput.classList.remove("is-invalid");

    secretMessage.classList.add("d-none");

    secretButton.innerHTML =
      '<i class="bi bi-envelope-heart-fill me-2"></i>Buka Pesan Rahasia';

    clearInterval(loadingTimer);
    clearInterval(heartTimer);

    showScreen(introScreen);
  });

  // Membuat efek ledakan hati
  function createHeartBurst() {
    const symbols = ["♡", "♥", "✦", "💗", "✨"];

    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.45;

    for (let i = 0; i < 24; i++) {
      const heart = document.createElement("span");

      heart.className = "celebration-heart";

      heart.textContent =
        symbols[Math.floor(Math.random() * symbols.length)];

      heart.style.left = `${originX}px`;
      heart.style.top = `${originY}px`;

      heart.style.color = [
        "#f45b9a",
        "#ff9fc4",
        "#df347c",
        "#f7bf4b"
      ][i % 4];

      heart.style.fontSize =
        `${Math.random() * 1.2 + 0.8}rem`;

      heart.style.setProperty(
        "--x",
        `${(Math.random() - 0.5) * window.innerWidth * 0.85}px`
      );

      heart.style.setProperty(
        "--y",
        `${(Math.random() - 0.5) * window.innerHeight * 0.7}px`
      );

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1600);
    }
  }

  // Hati yang melayang di halaman ucapan
  function startFloatingHearts() {
    clearInterval(heartTimer);

    heartTimer = setInterval(() => {
      if (birthdayScreen.classList.contains("d-none")) {
        return;
      }

      const heart = document.createElement("span");

      heart.className = "floating-heart";

      heart.textContent =
        Math.random() > 0.35 ? "♡" : "♥";

      heart.style.left = `${Math.random() * 100}%`;

      heart.style.fontSize =
        `${Math.random() * 1.2 + 0.7}rem`;

      heart.style.animationDuration =
        `${Math.random() * 2 + 4}s`;

      heartsLayer.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 6500);

    }, 550);
  }

})();
