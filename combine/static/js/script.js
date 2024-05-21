
var data, keys;

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function load(id) {

  console.log("I'm gonna call");
  fetch('../../data/collection/'+id)
  .then(response => response.json())
  .then(rdata => {
    console.log("Tengo respuesta");
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

const run = async () => {

  var items = document.getElementsByClassName('item');
  for (i=0; i< items.length; i++) {
    el = items[i];
    el.style.opacity = 0;
  }

  for (k in keys) {
    await sleep(200)
    items = data[keys[k]];
    console.log("key: "+k+", "+keys[k]+", data "+data[keys[k]]);
    document.getElementById(keys[k]).textContent = items[randomNumber(0, items.length-1)];
    document.getElementById(keys[k]).style.opacity = 1;
    
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

function deleteItem(item) {
  fetch("/combine/data/item/delete/"+item.id+"/")
  .then(response => response.json())
  .then(data => {
    if (data.message == "OK") {
      item.parentNode.remove();
    }
  })
  .catch(error => console.error('Error:', error));
}

function addItem(item) {
  item.style.display = "None";
  inputField = item.parentNode.getElementsByClassName("newItem")[0];
  inputField.style.display = "inline-block";
  inputField.focus();
}

function checksubmit(event) {

  if (event.key === "Enter") {
    submitItem(inputField);
  } else if (event.key === "Escape") {
    cancelsubmit()
  }
}

function cancelsubmit() {
  fields = document.getElementsByClassName("newItem")
  for (var i=0; i<fields.length; i++) {
    f = fields[i];
    f.value=""
    f.style.display = "None";
    f.parentNode.getElementsByClassName("addItem")[0].style.display = "inline-block";
  }
}

function submitItem(item) {

  if (item.value.trim() == "") {
    cancelsubmit();
    return;
  }

  fetch("/combine/data/item/new/", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "X-CSRFToken": csrfcookie(),
    },
    body: JSON.stringify({
      "part": item.id,
      "value": item.value,
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.message == "OK") {
      // If response is OK, get the ID and add the element to the list
      var newNode = document.createElement("li")
      newNode.innerHTML = "<span>"+item.value+"</span><a id="+data.id+" onclick='deleteItem(this)'' class='deleteAction'><i class='deleteIcon'></i></a>"
      item.parentNode.parentNode.getElementsByTagName("ul")[0].appendChild(newNode);

      // Enable next submit by showing again the +
      item.value = "";
      item.style.display = "None";
      item.parentNode.getElementsByClassName("addItem")[0].style.display = "inline-block";
    }
  })
  .catch(error => console.error('Error:', error))

}

var csrfcookie = function() {
  var cookieValue = null,
      name = 'csrftoken';
  if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
          var cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
};

function validateNewCollection(event) {
  event.preventDefault()
  console.log("Validating");
  return false;
}