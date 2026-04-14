// ── script.js ──────────────────────────────────────────

// 1. ZMIANA MOTYWU (zielony / czerwony)
const themeBtn = document.getElementById('themeBtn');

themeBtn.addEventListener('click', function () {
  const isRed = document.body.classList.toggle('theme-red');

  if (isRed) {
    themeBtn.textContent = 'Motyw: Zielony 🟢';
  } else {
    themeBtn.textContent = 'Motyw: Czerwony 🔴';
  }
});


// 2. UKRYWANIE / POKAZYWANIE SEKCJI CV
const toggleButtons = document.querySelectorAll('.toggle-btn');

toggleButtons.forEach(function (btn) {
  btn.addEventListener('click', function () {
    const targetId = btn.getAttribute('data-target');
    const targetEl = document.getElementById(targetId);

    if (!targetEl) return;

    const isHidden = targetEl.classList.toggle('hidden');

    btn.textContent = isHidden ? 'Pokaż' : 'Ukryj';
  });
});
