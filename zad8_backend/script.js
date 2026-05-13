fetch('data.json')
  .then(function (response) { return response.json(); })
  .then(function (data) {
    buildPage(data);
    initToggleButtons();
    initTheme();
    initNotes();      // ← ZADANIE 7: localStorage
    initWiadomosc();  // ← ZADANIE 8: Backend (fetch POST)
  });

function buildPage(data) {
  document.getElementById('header-name').textContent  = data.name;
  document.getElementById('header-title').textContent = data.title;

  var contact = data.contact;
  document.getElementById('kontakt-body').innerHTML =
    '<p>E-mail: <a href="mailto:' + contact.email + '">' + contact.email + '</a></p>' +
    '<p>Telefon: <a href="tel:' + contact.phone.replace(/\s/g, '') + '">' + contact.phone + '</a></p>' +
    '<p>Miasto: ' + contact.city + '</p>' +
    '<p><a href="' + contact.github + '" target="_blank">GitHub</a> &nbsp;|&nbsp; <a href="' + contact.linkedin + '" target="_blank">LinkedIn</a></p>';

  document.getElementById('o-mnie-text').textContent = data.about;

  var skillsList = document.getElementById('umiejetnosci-body');
  data.skills.forEach(function (skill) {
    var li = document.createElement('li');
    li.textContent = skill;
    skillsList.appendChild(li);
  });

  var expEl = document.getElementById('doswiadczenie-body');
  data.experience.forEach(function (item) {
    var article = document.createElement('article');
    article.innerHTML = '<h3>' + item.title + '</h3><p>' + item.period + '</p><p>' + item.description + '</p>';
    expEl.appendChild(article);
  });

  var edu = data.education;
  document.getElementById('edukacja-body').innerHTML =
    '<p><strong>' + edu.school + '</strong> – ' + edu.field + '</p><p>' + edu.period + '</p>';

  var projectsList = document.getElementById('projekty-body');
  data.projects.forEach(function (project) {
    var li = document.createElement('li');
    li.innerHTML = '<strong>' + project.name + '</strong> – ' + project.description;
    projectsList.appendChild(li);
  });
}

function initToggleButtons() {
  document.querySelectorAll('.toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetEl = document.getElementById(btn.getAttribute('data-target'));
      if (!targetEl) return;
      var isHidden = targetEl.classList.toggle('hidden');
      btn.textContent = isHidden ? 'Pokaż' : 'Ukryj';
    });
  });
}

function initTheme() {
  var themeBtn = document.getElementById('themeBtn');
  themeBtn.addEventListener('click', function () {
    var isRed = document.body.classList.toggle('theme-red');
    themeBtn.textContent = isRed ? 'Motyw: Zielony 🟢' : 'Motyw: Czerwony 🔴';
  });
}

/* ================================================================
   ZADANIE 7 – Local Storage
   ================================================================ */

var NOTES_KEY = 'cv_notatki';

function initNotes() {
  var form = document.getElementById('notes-form');
  var input = document.getElementById('notes-input');

  renderNotes();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;
    var notes = loadNotes();
    notes.push({ id: Date.now(), text: text });
    saveNotes(notes);
    input.value = '';
    renderNotes();
    showInfo('Notatka zapisana w localStorage ✓');
  });

  updateCounter();
}

function loadNotes() {
  try { return JSON.parse(localStorage.getItem(NOTES_KEY)) || []; }
  catch (e) { return []; }
}

function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  updateCounter();
}

function renderNotes() {
  var notes = loadNotes();
  var list  = document.getElementById('notes-list');
  var empty = document.getElementById('notes-empty');
  list.innerHTML = '';
  if (notes.length === 0) {
    empty.style.display = 'block';
  } else {
    empty.style.display = 'none';
    notes.forEach(function (note) {
      var li = document.createElement('li');
      li.className = 'note-item';
      li.innerHTML =
        '<span class="note-text">' + escapeHtml(note.text) + '</span>' +
        '<button class="note-delete-btn" data-id="' + note.id + '" title="Usuń notatkę">✕</button>';
      list.appendChild(li);
    });
  }
  list.querySelectorAll('.note-delete-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id    = Number(btn.getAttribute('data-id'));
      var notes = loadNotes().filter(function (n) { return n.id !== id; });
      saveNotes(notes);
      renderNotes();
      showInfo('Notatka usunięta z localStorage');
    });
  });
}

function updateCounter() {
  var counter = document.getElementById('notes-counter');
  if (!counter) return;
  var count = loadNotes().length;
  counter.textContent = count === 0 ? '' : '(' + count + ')';
}

function showInfo(msg) {
  var info = document.getElementById('notes-info');
  info.textContent = msg;
  info.style.opacity = '1';
  setTimeout(function () { info.style.opacity = '0'; }, 2500);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ================================================================
   ZADANIE 8 – Backend
   Cel: Wysyłanie danych formularza metodą POST do serwera
   i zapis poza przeglądarką (plik wiadomosci.json na serwerze).
   ================================================================ */

var SERVER_URL = 'http://localhost:3000';

function initWiadomosc() {
  var form      = document.getElementById('msg-form');
  var submitBtn = document.getElementById('msg-submit-btn');

  // Przy załadowaniu strony pobierz istniejące wiadomości z serwera
  pobierzWiadomosci();

  // 1. Wysłanie danych formularza metodą POST
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var imie      = document.getElementById('msg-imie').value.trim();
    var email     = document.getElementById('msg-email').value.trim();
    var wiadomosc = document.getElementById('msg-tresc').value.trim();

    if (!imie || !email || !wiadomosc) return;

    submitBtn.disabled    = true;
    submitBtn.textContent = 'Wysyłanie…';

    // fetch() z metodą POST – komunikacja frontend ↔ backend
    fetch(SERVER_URL + '/wyslij', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imie: imie, email: email, wiadomosc: wiadomosc })
    })
      .then(function (response) { return response.json(); })
      .then(function (data) {
        if (data.sukces) {
          // 3. Potwierdzenie poprawnego wysłania danych
          pokazStatus('✅ ' + data.wiadomosc, 'success');
          form.reset();
          // Odśwież listę wiadomości z serwera
          pobierzWiadomosci();
        } else {
          pokazStatus('❌ Błąd: ' + (data.blad || 'Nieznany błąd'), 'error');
        }
      })
      .catch(function (err) {
        pokazStatus('❌ Nie można połączyć się z serwerem. Upewnij się, że serwer działa (node server.js).', 'error');
        console.error('Błąd połączenia:', err);
      })
      .finally(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Wyślij wiadomość →';
      });
  });
}

// Pobiera wszystkie wiadomości z serwera (GET /wiadomosci)
function pobierzWiadomosci() {
  fetch(SERVER_URL + '/wiadomosci')
    .then(function (response) { return response.json(); })
    .then(function (dane) {
      renderWiadomosci(dane);
      aktualizujLicznikWiad(dane.length);
    })
    .catch(function () {
      // Serwer niedostępny – nie pokazuj listy
      document.getElementById('msg-list-wrap').style.display = 'none';
    });
}

// Renderuje listę wiadomości z serwera
function renderWiadomosci(dane) {
  var wrap = document.getElementById('msg-list-wrap');
  var list = document.getElementById('msg-list');
  list.innerHTML = '';

  if (dane.length === 0) {
    wrap.style.display = 'none';
    return;
  }

  wrap.style.display = 'block';

  // Wyświetl od najnowszej
  dane.slice().reverse().forEach(function (w) {
    var li = document.createElement('li');
    li.className = 'msg-item';
    li.innerHTML =
      '<strong>' + escapeHtml(w.imie) + ' &lt;' + escapeHtml(w.email) + '&gt;</strong>' +
      escapeHtml(w.wiadomosc) +
      '<div class="msg-meta">📅 ' + escapeHtml(w.data) + '</div>';
    list.appendChild(li);
  });
}

// Aktualizuje licznik przy nagłówku sekcji
function aktualizujLicznikWiad(count) {
  var counter = document.getElementById('msg-counter');
  if (!counter) return;
  counter.textContent = count === 0 ? '' : '(' + count + ')';
}

// 3. Wyświetla komunikat o statusie wysyłania
function pokazStatus(msg, typ) {
  var status = document.getElementById('msg-status');
  status.textContent = msg;
  status.className   = 'msg-status ' + typ;
  status.style.display = 'block';
  setTimeout(function () { status.style.display = 'none'; }, 5000);
}
