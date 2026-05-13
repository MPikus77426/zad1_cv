// ================================================================
// ZADANIE 8 – Backend
// Serwer Express: odbiera dane POST i zapisuje do wiadomosci.json
// ================================================================

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const cors    = require('cors');

const app       = express();
const PORT      = 3000;
const PLIK_DANE = path.join(__dirname, 'wiadomosci.json');

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Inicjalizacja pliku JSON
if (!fs.existsSync(PLIK_DANE)) {
  fs.writeFileSync(PLIK_DANE, JSON.stringify([], null, 2), 'utf-8');
  console.log('📄 Utworzono plik wiadomosci.json');
}

// GET /wiadomosci – zwraca wszystkie zapisane wiadomości
app.get('/wiadomosci', function (req, res) {
  var dane = JSON.parse(fs.readFileSync(PLIK_DANE, 'utf-8'));
  res.json(dane);
});

// POST /wyslij – odbiera dane z formularza i zapisuje do pliku
// 1. Wysłanie danych formularza metodą POST  ✓
// 2. Zapis danych poza przeglądarką          ✓
app.post('/wyslij', function (req, res) {
  var imie      = (req.body.imie      || '').trim();
  var email     = (req.body.email     || '').trim();
  var wiadomosc = (req.body.wiadomosc || '').trim();

  if (!imie || !email || !wiadomosc) {
    return res.status(400).json({ sukces: false, blad: 'Wszystkie pola są wymagane.' });
  }

  var nowyWpis = {
    id:        Date.now(),
    imie:      imie,
    email:     email,
    wiadomosc: wiadomosc,
    data:      new Date().toLocaleString('pl-PL')
  };

  // 2. Zapis danych poza przeglądarką – zapis do pliku na serwerze
  var dane = JSON.parse(fs.readFileSync(PLIK_DANE, 'utf-8'));
  dane.push(nowyWpis);
  fs.writeFileSync(PLIK_DANE, JSON.stringify(dane, null, 2), 'utf-8');

  console.log('✅ Nowa wiadomość zapisana w wiadomosci.json:');
  console.log('   Imię:      ', nowyWpis.imie);
  console.log('   E-mail:    ', nowyWpis.email);
  console.log('   Wiadomość: ', nowyWpis.wiadomosc);
  console.log('   Data:      ', nowyWpis.data);
  console.log('   Łącznie wiadomości:', dane.length);

  // 3. Potwierdzenie poprawnego wysłania danych
  res.status(201).json({
    sukces:    true,
    wiadomosc: 'Wiadomość została zapisana na serwerze! ✓',
    wpis:      nowyWpis,
    lacznie:   dane.length
  });
});

app.listen(PORT, function () {
  console.log('');
  console.log('🚀 Serwer uruchomiony!');
  console.log('   Strona CV:   http://localhost:' + PORT);
  console.log('   Wiadomości:  http://localhost:' + PORT + '/wiadomosci');
  console.log('   Plik danych: wiadomosci.json');
  console.log('');
});
