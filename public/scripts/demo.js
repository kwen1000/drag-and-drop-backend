const URL = "http://3.95.229.222/"
const API = "api/v1/org/"
const ORG_ID_1 = "5312609487";
const ORG_ID_2 = "10625218974";

var lobby = 1;
var playerName = 'Noname';
var xhr = new XMLHttpRequest();

function getPlayerID() {
  if (!localStorage.getItem('playerID')) {
    localStorage.setItem('playerID', new Date().getTime());
  }
  return localStorage.getItem('playerID');
}

function onSubmit() {
  playerName = document.querySelector('#username').value;
  document.querySelector('.avatar').setAttribute(
    'username', 
    document.querySelector('#username').value
  );
}

function tick() {

  try {
    xhr.open(
      'POST', 
      URL+API+ORG_ID_1+'/lobby/'+lobby+'/player/'+getPlayerID(),
      true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send({
      username: playerName,
      posX: document.querySelector('.canvas').scrollLeft,
      posY: document.querySelector('.canvas').scrollTop
    });
  } catch {
    requestAnimationFrame(tick);
  }

}

function onLoad() {

  xhr.onload = function(result) {
    console.log(result);
    xhr = null;
    requestAnimationFrame(tick);
  }

  tick();
}

window.onload = onLoad();
