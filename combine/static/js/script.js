
var data, keys;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function load(id) {

  fetch('../../data/collection/'+id)
  .then(response => response.json())
  .then(rdata => {
    data = rdata;
    list = document.getElementById('items');
    list.innerHTML = '';
    keys = Object.keys(data);
    i = 0;
    for (k in keys) {
      i++;
      el = document.createElement('li');
      el.id = keys[k];
      el.classList.add("item");
      el.style.cssText += "opacity:1;--n:"+i;
      list.appendChild(el);
    }
    
    run()
  })
  .catch(error => {
    console.error('Se produjo un error al cargar el archivo JSON:', error);
  });
}

function run() {

  var items = document.getElementsByClassName('item');
  for (i=0; i< items.length; i++) {
    el = items[i];    
    el.style.opacity = 0;
  }

  sleep(400).then(() => {
    for (k in keys) {
      items = data[keys[k]];
      document.getElementById(keys[k]).textContent = items[randomNumber(0, items.length-1)];
      document.getElementById(keys[k]).style.opacity = 1;
    }      
  })

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

function toggleShare() {
  var item = document.getElementById("share-url");
  console.log(item);
  if (item.style.opacity != "1") {
    item.style.opacity = "1";
  } else {
    item.style.opacity = "0";
  }
}

function copyURL(collection_id) {
  var item = document.getElementById("share-url-link");
  navigator.clipboard.writeText("http://damagedgoods.pythonanywhere.com/combine/collection/"+collection_id);
  item.innerHTML = "Copied!"
  sleep(1000).then(() => {
    document.getElementById("share-url").style.opacity = "0";
    sleep(1000).then(() => {
      item.innerHTML = "Click to copy URL";
    })
  })
}