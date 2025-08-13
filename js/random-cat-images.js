
  document.addEventListener('click', function (e) {
    const closeBtn = e.target.closest('.btn-close');
    if (!closeBtn) return;

    const card = closeBtn.closest('.fav-random-cat-card');
    if (!card) return;

    // 1. Получаем начальные позиции всех карточек
    const cards = Array.from(document.querySelectorAll('.fav-random-cat-card'));
    const startRects = new Map(cards.map(c => [c, c.getBoundingClientRect()]));

    // 2. Удаляем карточку с fade-эффектом
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.remove();

      // 3. Получаем новые позиции
      const endRects = new Map();
      document.querySelectorAll('.fav-random-cat-card').forEach(c => {
        endRects.set(c, c.getBoundingClientRect());
      });

      // 4. Анимируем сдвиг
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
    }, 100); // время fade
  });