// ── script.js ──────────────────────────────────────────

// 1. POBIERANIE DANYCH Z JSON I BUDOWANIE HTML
fetch('data.json')
  .then(function (response) { return response.json(); })
  .then(function (data) {
    buildPage(data);
    initToggleButtons();
    initTheme();
    initForm();
  });

function buildPage(data) {
  // Header
  document.getElementById('header-name').textContent  = data.name;
  document.getElementById('header-title').textContent = data.title;

  // Kontakt
  var contact = data.contact;
  var kontaktEl = document.getElementById('kontakt-body');
  kontaktEl.innerHTML =
    '<p>E-mail: <a href="mailto:' + contact.email + '">' + contact.email + '</a></p>' +
    '<p>Telefon: <a href="tel:' + contact.phone.replace(/\s/g, '') + '">' + contact.phone + '</a></p>' +
    '<p>Miasto: ' + contact.city + '</p>' +
    '<p>' +
      '<a href="' + contact.github + '" target="_blank" rel="noopener noreferrer">GitHub</a>' +
      ' &nbsp;|&nbsp; ' +
      '<a href="' + contact.linkedin + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>' +
    '</p>';

  // O mnie
  document.getElementById('o-mnie-text').textContent = data.about;

  // Umiejętności – lista dynamiczna
  var skillsList = document.getElementById('umiejetnosci-body');
  data.skills.forEach(function (skill) {
    var li = document.createElement('li');
    li.textContent = skill;
    skillsList.appendChild(li);
  });

  // Doświadczenie
  var expEl = document.getElementById('doswiadczenie-body');
  data.experience.forEach(function (item) {
    var article = document.createElement('article');
    article.innerHTML =
      '<h3>' + item.title + '</h3>' +
      '<p>' + item.period + '</p>' +
      '<p>' + item.description + '</p>';
    expEl.appendChild(article);
  });

  // Edukacja
  var edu = data.education;
  document.getElementById('edukacja-body').innerHTML =
    '<p><strong>' + edu.school + '</strong> – ' + edu.field + '</p>' +
    '<p>' + edu.period + '</p>';

  // Projekty – lista dynamiczna
  var projectsList = document.getElementById('projekty-body');
  data.projects.forEach(function (project) {
    var li = document.createElement('li');
    li.innerHTML = '<strong>' + project.name + '</strong> – ' + project.description;
    projectsList.appendChild(li);
  });
}

// 2. POKAZYWANIE/UKRYWANIE SEKCJI
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

// 3. ZMIANA MOTYWU
function initTheme() {
  var themeBtn = document.getElementById('themeBtn');
  themeBtn.addEventListener('click', function () {
    var isRed = document.body.classList.toggle('theme-red');
    themeBtn.textContent = isRed ? 'Motyw: Zielony 🟢' : 'Motyw: Czerwony 🔴';
  });
}

// 4. WALIDACJA FORMULARZA
function initForm() {
  function setField(inputId, errId, valid, msg) {
    var input = document.getElementById(inputId);
    var err   = document.getElementById(errId);
    input.classList.remove('input-error', 'input-ok');
    if (valid)  { input.classList.add('input-ok');    err.textContent = ''; }
    if (!valid) { input.classList.add('input-error'); err.textContent = msg; }
  }

  var formFields = [
    {
      inputId: 'f-imie', errId: 'err-imie',
      validate: function (v) {
        if (!v.trim())    return 'Imię jest wymagane.';
        if (/\d/.test(v)) return 'Imię nie może zawierać cyfr.';
        return null;
      }
    },
    {
      inputId: 'f-nazwisko', errId: 'err-nazwisko',
      validate: function (v) {
        if (!v.trim())    return 'Nazwisko jest wymagane.';
        if (/\d/.test(v)) return 'Nazwisko nie może zawierać cyfr.';
        return null;
      }
    },
    {
      inputId: 'f-email', errId: 'err-email',
      validate: function (v) {
        if (!v.trim())                              return 'E-mail jest wymagany.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Podaj poprawny adres e-mail.';
        return null;
      }
    },
    {
      inputId: 'f-wiadomosc', errId: 'err-wiadomosc',
      validate: function (v) {
        if (!v.trim()) return 'Wiadomość jest wymagana.';
        return null;
      }
    }
  ];

  formFields.forEach(function (f) {
    var input = document.getElementById(f.inputId);
    input.addEventListener('blur', function () {
      var err = f.validate(input.value);
      setField(f.inputId, f.errId, err === null, err || '');
    });
    input.addEventListener('input', function () {
      if (input.classList.contains('input-error') || input.classList.contains('input-ok')) {
        var err = f.validate(input.value);
        setField(f.inputId, f.errId, err === null, err || '');
      }
    });
  });

  document.getElementById('submitBtn').addEventListener('click', function () {
    var allValid = true;
    formFields.forEach(function (f) {
      var input = document.getElementById(f.inputId);
      var err   = f.validate(input.value);
      setField(f.inputId, f.errId, err === null, err || '');
      if (err) allValid = false;
    });

    var successBox = document.getElementById('form-success');
    if (allValid) {
      successBox.style.display = 'block';
      formFields.forEach(function (f) {
        var input = document.getElementById(f.inputId);
        input.value = '';
        input.classList.remove('input-ok', 'input-error');
        document.getElementById(f.errId).textContent = '';
      });
      setTimeout(function () { successBox.style.display = 'none'; }, 4000);
    } else {
      successBox.style.display = 'none';
    }
  });
}
