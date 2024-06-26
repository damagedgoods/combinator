
var data, keys, undo;
var helpMarksActive = false;

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const load = async (id, newCollection, helpMarks) => {  

  if (newCollection == "True") {
    await sleep(300);
    document.getElementById('successMessage').classList.add("visible");
    await sleep(1500);
    document.getElementById('successMessage').classList.remove("visible");    
    await sleep(500);
  }

  document.getElementById('reload').style.animationPlayState = 'running';

  fetch('../../data/collection/'+id)
  .then(response => response.json())
  .then(rdata => {
    data = rdata;
    sentence = document.getElementById('sentence');
    sentence.innerHTML = '';
    keys = Object.keys(data);
    i = 0;
    
    for (k in keys) {
      i++;
      el = document.createElement('span');
      el.id = keys[k];
      el.classList.add("item");
      el.classList.add("delay-"+i);
      el.style.cssText += "opacity:1;--n:"+i;
      sentence.appendChild(el);
    }
    
    run();

    if (newCollection == 'True') {
      showHelpMarks(helpMarks, 1500);
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
    await sleep(600);
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

const deleteItem = async (item) => {

  message = "Ok, I deleted that item."
  message += " <a href='javascript:undoDelete()'>Undo</a>"
  showMessage(message);
  item.parentNode.style.display = "none";

  await sleep(2000);

  if (!undo) {
    fetch("/combine/data/item/delete/"+item.id+"/")
    .then(response => response.json())
    .then(data => {
      if (data.message == "OK") {
        item.parentNode.remove();
      }
    })
    .catch(error => console.error('Error:', error));
  } else {
    document.getElementById("message").innerHTML = "No problem, canceled!";
    item.parentNode.style.display = "flex";
  }

  undo = false;
}

function undoDelete(item) {
  undo = true;
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

const shake = async (field) => {
  document.getElementById(field).classList.remove("fadeIn"); // It creates problems when manipulating the fieldError classes
  document.getElementById(field).classList.add("fieldError");
  await sleep(1000);
  document.getElementById(field).classList.remove("fieldError");
}

function validateNewCollection(event) {
  event.preventDefault();
  let name = document.getElementById('name').value;
  let fileInput = document.getElementById('fileInput').value;
  let valid = true;

  if (name.trim() === '') {
    document.getElementById('nameError').textContent = 'is mandatory';
    shake('name-container');
    valid = false;
  }

  if (fileInput === '') {
    document.getElementById('fileError').textContent = 'is mandatory';
    shake('file-container');
    valid = false;
  }

  return valid;
}

function validateName() {
  let name = document.getElementById('name').value;
  let valid = true;
  if (name.trim() === '') {
    document.getElementById('nameError').textContent = 'is mandatory';
    document.getElementById('name-container').classList.add("fieldError");        
    shake('name-container');
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
    document.getElementById('file-container').classList.add("fieldError");  
    shake('file-container');
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
  if (message) {
    document.getElementById('message').innerHTML = message;
    document.getElementById('message').classList.add("visible");
    await sleep(2500);
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

function getNamePlaceholder() {
  placeholders = ["My Radiant Mix", "My Nebulous Mix", "My Luminescent Mix", "My Astral Mix", "My Euphoric Mix", "My Resplendent Mix", "My Transcendent Mix", "My Enigmatic Mix", "My Ethereal Mix", "My Vibrant Mix", "My Whimsical Mix", "My Serene Mix", "My Eclectic Mix", "My Mystical Mix", "My Bombastic Mix"];
  return placeholders[randomNumber(0, placeholders.length - 1)];
}