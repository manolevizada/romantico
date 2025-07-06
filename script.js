window.addEventListener('DOMContentLoaded', () => {
  // --- PRELOAD DE IMAGENS ---
  const preloadImages = () => {
    const gameImages = [
      'imagens/1.jpeg',
      'imagens/2.jpeg',
      'imagens/3.jpeg',
      'imagens/4.jpeg',
      'imagens/5.jpeg',
      'imagens/6.jpeg'
    ];

    const stackImages = [
      'imagens/an1.jpeg',
      'imagens/an2.jpeg',
      'imagens/an3.jpeg',
      'imagens/an4.jpeg',
      'imagens/an6.jpeg',
      'imagens/an8.jpeg',
      'imagens/an9.jpeg',
      'imagens/an10.jpeg',
      'imagens/an11.jpeg',
      'imagens/an7.jpeg',
      'imagens/an12.jpeg',
      'imagens/an13.jpeg',
      'imagens/an14.jpeg',
      'imagens/an5.jpeg',
      'imagens/an15.jpeg',
      'imagens/an16.jpeg',
      'imagens/an17.jpeg'
    ];

    const allImages = [...gameImages, ...stackImages];

    allImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  };

  preloadImages();

  // Elementos de senha e cadeado - só executa se existirem
  const passwordInput = document.getElementById("password");
  const lockIcon = document.getElementById("lockIcon");
  const correctPassword = "140424";

  let enteredDigits = "";

  if (passwordInput && lockIcon) {
    function renderPassword() {
      if (enteredDigits.length === 0) {
        passwordInput.value = '●'.repeat(correctPassword.length);
        return;
      }
      
      const masked = [...correctPassword].map((_, i) => {
        return i < enteredDigits.length ? enteredDigits[i] : '●';
      }).join('');
      passwordInput.value = masked;
    }

    // Mostrar bolinhas ao carregar
    renderPassword();

    window.addDigit = function(digit) {
      if (enteredDigits.length < correctPassword.length) {
        enteredDigits += digit;
        renderPassword();
      }
    };

    window.clearPassword = function() {
      enteredDigits = "";
      renderPassword();
      resetStyles();
      setKeypadEnabled(true);
    };

    function setKeypadEnabled(enabled) {
      const buttons = document.querySelectorAll('.keypad button');
      buttons.forEach(button => {
        button.disabled = !enabled;
        if (enabled) {
          button.style.cursor = 'pointer';
          button.style.opacity = '1';
        } else {
          button.style.cursor = 'not-allowed';
          button.style.opacity = '0.6';
        }
      });
    }

    window.checkPassword = function() {
      if (enteredDigits === correctPassword) {
        lockIcon.src = "cadeadoaberto.png";
        passwordInput.style.color = "green";
        setKeypadEnabled(false);

        setTimeout(() => {
          const resultDiv = document.getElementById("result");
          const btnAvancar = document.getElementById("btnAvancar");
          if (resultDiv) resultDiv.classList.remove("hidden");
          if (btnAvancar) btnAvancar.classList.remove("hidden");
          resultDiv?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 600);

      } else {
        alert("Senha incorreta! Tente novamente.");
        window.clearPassword();
      }
    };

    function resetStyles() {
      lockIcon.src = "cadeadofechado.png";
      passwordInput.style.color = "black";
    }
  }

  // === Código do jogo ===
  const cardsArray = [
    { name: 'foto1', img: 'imagens/1.jpeg' },
    { name: 'foto2', img: 'imagens/2.jpeg' },
    { name: 'foto3', img: 'imagens/3.jpeg' },
    { name: 'foto4', img: 'imagens/4.jpeg' },
    { name: 'foto5', img: 'imagens/5.jpeg' },
    { name: 'foto6', img: 'imagens/6.jpeg' },
  ];

  let gameBoard = document.getElementById('gameBoard');
  let popup = document.getElementById('popup');
  let hasFlippedCard = false;
  let lockBoard = false;
  let firstCard, secondCard;
  let matchesFound = 0;

  if (gameBoard) {
    function createBoard() {
      gameBoard.innerHTML = '';
      let gameCards = [...cardsArray, ...cardsArray];
      gameCards.sort(() => 0.5 - Math.random());

      gameCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.name = card.name;

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        const img = document.createElement('img');
        img.src = card.img;
        img.alt = card.name;
        cardFront.appendChild(img);

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');
        cardBack.textContent = "?";

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        cardElement.appendChild(cardInner);

        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
      });

      hasFlippedCard = false;
      lockBoard = false;
      matchesFound = 0;
      if (popup) popup.classList.remove('show');
    }

    function flipCard() {
      if (lockBoard || this === firstCard) return;

      this.classList.add('flipped');

      if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
      }

      secondCard = this;
      checkForMatch();
    }

    function checkForMatch() {
      const isMatch = firstCard.dataset.name === secondCard.dataset.name;

      if (isMatch) {
        disableCards();
        matchesFound++;
        if (matchesFound === cardsArray.length) {
          if (popup) popup.classList.add('show');
        }
      } else {
        unflipCards();
      }
    }

    function disableCards() {
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);
      resetBoard();
    }

    function unflipCards() {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
      }, 1000);
    }

    function resetBoard() {
      [hasFlippedCard, lockBoard] = [false, false];
      [firstCard, secondCard] = [null, null];
    }

    function restartGame() {
      if (popup) popup.classList.remove('show');
      createBoard();
    }

    function closePopup() {
      if (popup) popup.classList.remove('show');
    }

    function voltarInicio() {
      window.location.href = 'menu.html';
    }

    createBoard();

    // Expor funções globalmente para uso em HTML
    window.restartGame = restartGame;
    window.closePopup = closePopup;
    window.voltarInicio = voltarInicio;
  }

  // === STACK DE FOTOS ===
  const photoStack = document.getElementById("photoStack");

  if (photoStack) {
    const originalImages = [
      { img: 'imagens/an1.jpeg' },
      { img: 'imagens/an2.jpeg' },
      { img: 'imagens/an3.jpeg' },
      { img: 'imagens/an4.jpeg' },
      { img: 'imagens/an6.jpeg' },
      { img: 'imagens/an8.jpeg' },
      { img: 'imagens/an9.jpeg' },
      { img: 'imagens/an10.jpeg' },
      { img: 'imagens/an11.jpeg' },
      { img: 'imagens/an7.jpeg' },
      { img: 'imagens/an12.jpeg' },
      { img: 'imagens/an13.jpeg' },
      { img: 'imagens/an14.jpeg' },
      { img: 'imagens/an5.jpeg' },
      { img: 'imagens/an15.jpeg' },
      { img: 'imagens/an16.jpeg' },
      { img: 'imagens/an17.jpeg' }
    ];

    let imagesCopy = [...originalImages];

    function renderStack() {
      photoStack.innerHTML = "";

      imagesCopy.forEach((image, i) => {
        const img = document.createElement("img");
        img.src = image.img;
        img.classList.add("photo");

        const offsetTop = i * 5;
        img.style.top = `${offsetTop}px`;
        img.style.left = `0px`;

        if (i === 0) {
          img.style.transform = "rotate(0deg)";
          img.style.cursor = "pointer";
          img.addEventListener("click", showNext);
        } else {
          img.style.transform = `rotate(${(Math.random() - 0.5) * 10}deg)`;
        }

        img.style.zIndex = imagesCopy.length - i;
        img.style.position = "absolute";
        img.style.opacity = "1";
        img.style.transition = "opacity 0.5s ease, transform 0.4s ease, top 0.4s ease";

        photoStack.appendChild(img);
      });
    }

    function showNext() {
      const currentPhoto = photoStack.querySelector(".photo");

      if (!currentPhoto) return;

      currentPhoto.style.opacity = "0";
      currentPhoto.style.transition = "opacity 0.5s ease";

      setTimeout(() => {
        const firstImage = imagesCopy.shift();
        imagesCopy.push(firstImage);
        renderStack();
      }, 500);
    }

    renderStack();
  }

  // INICIALIZAR O CONTADOR DINÂMICO (conta tempo de relacionamento)
  const yearsEl = document.getElementById('years');
  const monthsEl = document.getElementById('months');
  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');

  if (yearsEl && monthsEl && daysEl && hoursEl && minutesEl && secondsEl) {
    const startDate = new Date(2024, 3, 13, 17, 0, 0); // Abril = mês 3

    function updateCounter() {
      const now = new Date();

      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();
      let hours = now.getHours() - startDate.getHours();
      let minutes = now.getMinutes() - startDate.getMinutes();
      let seconds = now.getSeconds() - startDate.getSeconds();

      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      yearsEl.textContent = years;
      monthsEl.textContent = months;
      daysEl.textContent = days;

      hoursEl.textContent = hours.toString().padStart(2, '0');
      minutesEl.textContent = minutes.toString().padStart(2, '0');
      secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    updateCounter();
    setInterval(updateCounter, 1000);
  }
});

window.avancar = function() {
  window.location.href = "menu.html";
};

document.addEventListener('DOMContentLoaded', () => {
  const blurBox = document.querySelector('.blur-box');
  const revealBtn = document.querySelector('.reveal-btn');

  if (blurBox && revealBtn) {
    revealBtn.addEventListener('click', () => {
      blurBox.classList.add('revealed');
    });
  }
});
