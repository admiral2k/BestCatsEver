
// === Favorites logic ===
const favorites = new Set();

const favoriteButton = document.getElementById("fav-btn")

// Найдём контейнер сетки избранного (это .row после заголовка)
const favGrid =
    document.querySelector('.fav-random-cat-label')?.nextElementSibling ||
    document.querySelector('.row.row-cols-1.row-cols-md-2.g-3.justify-content-center');

// Вспомогалки
const fileNameFromSrc = (src) => src.split('/').pop();
const buildImagePath = (fileName) => `../assets/images/random-cats/${fileName}`;

function updateFavButton() {
    const name = fileNameFromSrc(randomCatImagePlaceholder.src || '');
    console.log(name)
    console.log(favorites)
    console.log(favorites.has(name))
    if (favorites.has(name)) {
        favoriteButton.classList.remove('btn-warning');
        favoriteButton.classList.add('btn-danger');
        favoriteButton.textContent = 'Remove';
        favoriteButton.setAttribute('aria-pressed', 'true');
    } else {
        favoriteButton.classList.remove('btn-danger');
        favoriteButton.classList.add('btn-warning');
        favoriteButton.textContent = 'Favorite!';
        favoriteButton.setAttribute('aria-pressed', 'false');
    }
}

function createFavCard(fileName) {
    const card = document.createElement('div');
    card.className = 'card position-relative fav-random-cat-card border-0 bg-transparent p-0';
    card.dataset.filename = fileName;
    card.innerHTML = `
    <button type="button"
            class="btn-close btn-close-white position-absolute top-0 end-0 m-2"
            aria-label="Close"></button>
    <img src="${buildImagePath(fileName)}" class="card-img fav-fill" alt="Cat">
    <div class="fav-overlay"></div>
  `;
    return card;
}

// Переключение избранного по кнопке
favoriteButton.addEventListener('click', () => {
    const name = fileNameFromSrc(randomCatImagePlaceholder.src || '');
    if (!name) return;

    if (!favorites.has(name)) {
        favorites.add(name);
        const card = createFavCard(name);
        if (favGrid) animateInsertCard(card, favGrid);
        updateFavButton();
    }
    else {
        // Удалить из избранного — если карточка есть, «нажмём» её крестик,
        // чтобы сработала существующая анимация FLIP + удаление
        const card = document.querySelector(`.fav-random-cat-card[data-filename="${name}"]`);
        if (card) {
            const close = card.querySelector('.btn-close');
            if (close) close.click();
            favorites.delete(name);
            updateFavButton();
        }
    }
});

let isSwitching = false;

async function showAnotherCat() {
  if (isSwitching) return;

  const currentImageIndex = fileNameFromSrc(randomCatImagePlaceholder.src || '');
  let nextCatImageIndex;
  do {
    nextCatImageIndex = getRandomInt(1, amountOfImages) + ".jpg";
  } while (currentImageIndex === nextCatImageIndex);

  const nextSrc = buildImagePath(nextCatImageIndex);
  isSwitching = true;
  showAnotherButton?.setAttribute('disabled', 'disabled');

  // 1) запускаем фейдаут старой
  randomCatImagePlaceholder.classList.add('is-switching');

  try {
    // 2) ждём одновременно: (а) конец фейдаута, (б) предзагрузку новой
    await Promise.all([
      onceTransitionEnd(randomCatImagePlaceholder, 'opacity', 350),
      preload(nextSrc)
    ]);

    // 3) подменяем src, готовим фейдин
    randomCatImagePlaceholder.src = nextSrc;
    updateFavButton();

    // 4) на следующий кадр убираем класс — запустится фейдин
    await new Promise(r => requestAnimationFrame(r));
    randomCatImagePlaceholder.classList.remove('is-switching');

    // 5) дождёмся завершения фейдина (не обязательно, но аккуратно)
    await onceTransitionEnd(randomCatImagePlaceholder, 'opacity', 350);
  } catch (e) {
    console.warn('Failed to load image:', nextSrc, e);
    // откатим визуал, чтобы не застрять в 0 opacity
    randomCatImagePlaceholder.classList.remove('is-switching');
  } finally {
    isSwitching = false;
    showAnotherButton?.removeAttribute('disabled');
  }
}

function onceTransitionEnd(el, prop = 'opacity', timeout = 300) {
  return new Promise((resolve) => {
    let done = false;
    const onEnd = (e) => {
      if (e.target === el && e.propertyName === prop) {
        done = true;
        el.removeEventListener('transitionend', onEnd);
        resolve();
      }
    };
    el.addEventListener('transitionend', onEnd);
    // страховка, если transition не сработал
    setTimeout(() => {
      if (!done) {
        el.removeEventListener('transitionend', onEnd);
        resolve();
      }
    }, timeout);
  });
}

function preload(src) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(src);
    im.onerror = reject;
    im.src = src; // src назначаем ПОСЛЕ onload/onerror
  });
}



// Random Cat Logic
const amountOfImages = 17
const showAnotherButton = document.getElementById("show-another-btn")
const randomCatImagePlaceholder = document.getElementById("random-cat-image")

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


showAnotherButton.addEventListener("click", showAnotherCat)

// Show new cat with each page update
showAnotherCat()

// Favorite Cards logic
document.addEventListener('click', function (e) {
    const closeBtn = e.target.closest('.btn-close');
    if (!closeBtn) return;

    const card = closeBtn.closest('.fav-random-cat-card');
    if (!card) return;

    // Имя файла этой карточки (сохраняем ДО remove())
    const removedName = card.dataset.filename;

    // 1. Начальные позиции всех карточек
    const cards = Array.from(document.querySelectorAll('.fav-random-cat-card'));
    const startRects = new Map(cards.map(c => [c, c.getBoundingClientRect()]));

    // 2. Fade+scale для удаляемой карточки
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';

    setTimeout(() => {
        card.remove();

        // Обновим структуру избранного
        if (removedName) {
            favorites.delete(removedName);
            // Если текущая большая картинка — та же, обновим кнопку
            const currentName = fileNameFromSrc(randomCatImagePlaceholder.src || '');
            if (currentName === removedName) updateFavButton();
        }

        // 3. Новые позиции
        const endRects = new Map();
        document.querySelectorAll('.fav-random-cat-card').forEach(c => {
            endRects.set(c, c.getBoundingClientRect());
        });

        // 4. FLIP-анимация сдвига остальных
        endRects.forEach((endRect, c) => {
            const startRect = startRects.get(c);
            const dx = startRect.left - endRect.left;
            const dy = startRect.top - endRect.top;
            c.style.transform = `translate(${dx}px, ${dy}px)`;
            c.style.transition = 'transform 0s';
            requestAnimationFrame(() => {
                c.style.transform = '';
                c.style.transition = 'transform 0.5s ease';
            });
        });
    }, 100);
});

function animateInsertCard(card, container) {
    // 1) снимем стартовые позиции существующих карточек
    const beforeCards = Array.from(container.querySelectorAll('.fav-random-cat-card'));
    const startRects = new Map(beforeCards.map(c => [c, c.getBoundingClientRect()]));

    // 2) подготовим новую карточку (чуть уменьшенная и прозрачная)
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    card.style.transition = 'opacity .25s ease, transform .25s ease';

    // 3) вставим карточку (в начало, как у тебя)
    container.prepend(card);

    // 4) снимем конечные позиции (уже с новой карточкой)
    const afterCards = Array.from(container.querySelectorAll('.fav-random-cat-card'));
    const endRects = new Map(afterCards.map(c => [c, c.getBoundingClientRect()]));

    // 5) для старых карточек: FLIP-сдвиг из старых позиций в новые
    beforeCards.forEach(c => {
        const s = startRects.get(c);
        const e = endRects.get(c);
        const dx = s.left - e.left;
        const dy = s.top - e.top;

        c.style.transform = `translate(${dx}px, ${dy}px)`;
        c.style.transition = 'transform 0s';
        requestAnimationFrame(() => {
            c.style.transform = '';
            c.style.transition = 'transform .5s ease';
        });
    });

    // 6) для новой карточки: плавный fade/scale до нормального состояния
    requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = '';
    });
}