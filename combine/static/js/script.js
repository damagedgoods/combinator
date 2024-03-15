
var data, keys;

function load(id) {

  fetch('../../data/collection/'+id)
  .then(response => response.json())
  .then(rdata => {
    data = rdata;
    list = document.getElementById('items');
    list.innerHTML = '';
    keys = Object.keys(data);
    for (k in keys) {
      el = document.createElement('li');
      el.id = keys[k];
      list.appendChild(el);
    }
    run();
  })
  .catch(error => {
    console.error('Se produjo un error al cargar el archivo JSON:', error);
  });
}

function run() {
  for (k in keys) {
    items = data[keys[k]];
    document.getElementById(keys[k]).textContent = items[randomNumber(0, items.length-1)];
  }
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeCollection() {

  var items = document.getElementsByClassName("collection-item");
  for (i=0; i< items.length; i++) {
    item = items[i];
    if (item.style.opacity != "1") {
      item.style.opacity = "1";
    } else {
      item.style.opacity = "0";
    }
  }
}