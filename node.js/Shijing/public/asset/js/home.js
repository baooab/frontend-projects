var poems = document.querySelectorAll('.card');

for (var i = 0; i < poems.length; i++) {
  poems[i].addEventListener('dblclick', function (event) {
    this.classList.toggle('is-brief');
  });
  poems[i].addEventListener('touchstart', function (event) {
    this.classList.toggle('is-brief');
  });
}
