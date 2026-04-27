fetch('data.json')
  .then(function (response) { return response.json(); })
  .then(function (data) {
    buildPage(data);
    initToggleButtons();
    initTheme();
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
