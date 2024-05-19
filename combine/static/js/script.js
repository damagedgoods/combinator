
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
  }
}

function submitItem(item) {
  console.log("Submitting item");
  console.log(item.value)

  // Send item to server, including Part ID and new value
  fetch("/combine/data/item/new/", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      "X-CSRFToken": csrfcookie(),
    },
    body: JSON.stringify({
      part: "10000",
      value: "POOOOO",
    })
  })
  .catch(error => console.error('Error:', error));

  newId = "999";
  newName = item.value;

  // If response is OK, get the ID and add the element to the list
  var newNode = document.createElement("li")
  newNode.innerHTML = "<span>"+newName+"</span><a href='#'' id="+newId+" onclick='deleteItem(this)'' class='deleteAction'><i class='deleteIcon'></i></a>"
  item.parentNode.parentNode.appendChild(newNode);

  // Enable next submit by showing again the +
  item.value = "";
  item.style.display = "None";
  item.parentNode.getElementsByClassName("addItem")[0].style.display = "inline-block";
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