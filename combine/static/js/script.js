
var data, keys;
var helpMarksActive = false;

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const load = async (id, newCollection, helpMarks) => {  

  if (newCollection == "True") {
    await sleep(300);    
    document.getElementById('successMessage').style.opacity = 1;
    document.getElementById('successMessage').style.display = "block";
    await sleep(2000);    
    document.getElementById('successMessage').style.opacity = 0;
    document.getElementById('successMessage').style.display = "None";
    await sleep(300);
  }

  document.getElementById('reload').style.animationPlayState = 'running';

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
    
    run();

    if (newCollection == 'True') {
      showHelpMarks(helpMarks, 1000);
    }
  })
  .catch(error => {
    console.error('Se produjo un error al cargar el archivo JSON:', error);
  });
}

const run = async () => {

  var items = document.getElementsByClassName('item');

  for (i=0; i< items.length; i++) {
    items[i].style.opacity = 0;
  }

  for (k in keys) {
    await sleep(200);
    items = data[keys[k]];
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
  if (item.style.opacity != "1") {
    item.style.opacity = "1";
  } else {
    item.style.opacity = "0";
  }
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
  event.preventDefault();
  let name = document.getElementById('name').value;
  // let password = document.getElementById('password').value;
  let fileInput = document.getElementById('fileInput').value;
  let valid = true;

  if (name.trim() === '') {
    document.getElementById('nameError').textContent = 'is mandatory';
    valid = false;
  }

  if (fileInput === '') {
    document.getElementById('fileError').textContent = 'is mandatory';
    valid = false;
  }

  return valid;
}

function validateName() {
  let name = document.getElementById('name').value;
  let valid = true;
  if (name.trim() === '') {
    document.getElementById('nameError').textContent = 'is mandatory';
    valid = false;
  } else {
    document.getElementById('nameError').textContent = '';
    valid = true;
  }
  return valid;
}

function validateFile() {
  let fileValue = document.getElementById('fileInput').value;
  let valid = true;
  if (fileValue.trim() === '') {
    document.getElementById('fileError').textContent = 'is mandatory';
    valid = false;
  } else {
    document.getElementById('fileError').textContent = '';
    valid = true;
  }
  return valid;
}

function submitNewCollection(event) {

  if (validateNewCollection(event)) {
    this.submit();
  }
}

function updateFileName() {
  const input = document.getElementById('fileInput');
  const fileNameDisplay = document.getElementById('upload-button');
  
  if (input.files.length > 0) {    
    fileNameDisplay.textContent = input.files[0].name;
  } else {
    fileNameDisplay.textContent = 'No file chosen';
  }
}

const showMessage = async (message) => {

  await sleep(500);

  if (message) {
    document.getElementById('message').innerHTML = message;
    document.getElementById('message').classList.add("visible");
    await sleep(2300);
    document.getElementById('message').classList.remove("visible");

  } else {
  }
}

const showHelpMarks = async (helpMarks, delay) => {

  await sleep(delay);

  if (helpMarksActive) {
    var items = document.getElementsByClassName("helpMarks");
    for (var i=0; i < items.length; i++) {
      items[i].classList.remove("visibleHelpMarks");
      await sleep(200);
    }
    helpMarksActive = false;
  } else {
    await sleep(delay);
    for (var i=0; i < helpMarks.length; i++) {
      document.getElementById(helpMarks[i]).classList.add("visibleHelpMarks");
      await sleep(200);
    }
    helpMarksActive = true;
  }
}