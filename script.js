fetch('data.json')
  .then(function (response) { return response.json(); })
  .then(function (data) {
    buildPage(data);
    initToggleButtons();
    initTheme();
    initNotes(); // ← ZADANIE 7: localStorage
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
   Cel: Zapisywanie danych w przeglądarce bez użycia backendu.
   ================================================================ */

var NOTES_KEY = 'cv_notatki';

function initNotes() {
  var form    = document.getElementById('notes-form');
  var input   = document.getElementById('notes-input');
  var counter = document.getElementById('notes-counter');

  // 3. Odczyt danych po odświeżeniu strony
  renderNotes();

  // 1. Możliwość dodania elementu
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) return;

    var notes = loadNotes();
    notes.push({ id: Date.now(), text: text });

    // 2. Zapis danych do localStorage
    saveNotes(notes);

    input.value = '';
    renderNotes();
    showInfo('Notatka zapisana w localStorage ✓');
  });

  updateCounter();
}

// Wczytaj tablicę notatek z localStorage
function loadNotes() {
  try {
    return JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
  } catch (e) {
    return [];
  }
}

// Zapisz tablicę notatek do localStorage
function saveNotes(notes) {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  updateCounter();
}

// 5. Widoczne działanie funkcji – renderuj listę na stronie
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

  // 4. Możliwość usunięcia elementu
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

// Krótki komunikat pod formularzem
function showInfo(msg) {
  var info = document.getElementById('notes-info');
  info.textContent = msg;
  info.style.opacity = '1';
  setTimeout(function () { info.style.opacity = '0'; }, 2500);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
