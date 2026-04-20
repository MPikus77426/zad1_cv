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



// 3. WALIDACJA FORMULARZA KONTAKTOWEGO
function setField(inputId, errId, valid, msg) {
  var input = document.getElementById(inputId);
  var err   = document.getElementById(errId);
  input.classList.remove('input-error', 'input-ok');
  if (valid === true)  { input.classList.add('input-ok');    err.textContent = ''; }
  if (valid === false) { input.classList.add('input-error'); err.textContent = msg; }
}

function validateImie(val) {
  if (!val.trim())      return 'Imię jest wymagane.';
  if (/\d/.test(val))   return 'Imię nie może zawierać cyfr.';
  return null;
}
function validateNazwisko(val) {
  if (!val.trim())      return 'Nazwisko jest wymagane.';
  if (/\d/.test(val))   return 'Nazwisko nie może zawierać cyfr.';
  return null;
}
function validateEmail(val) {
  if (!val.trim())                              return 'E-mail jest wymagany.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Podaj poprawny adres e-mail.';
  return null;
}
function validateWiadomosc(val) {
  if (!val.trim()) return 'Wiadomość jest wymagana.';
  return null;
}

var formFields = [
  { inputId: 'f-imie',      errId: 'err-imie',      validate: validateImie },
  { inputId: 'f-nazwisko',  errId: 'err-nazwisko',  validate: validateNazwisko },
  { inputId: 'f-email',     errId: 'err-email',     validate: validateEmail },
  { inputId: 'f-wiadomosc', errId: 'err-wiadomosc', validate: validateWiadomosc },
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
 / POKAZYWANIE SEKCJI CV
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
