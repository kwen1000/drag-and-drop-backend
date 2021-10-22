const API = "api/v1/org/";
const ORG_ID_1 = "5312609487";

var config = {
  disconnect: true,
  lobby: 1,
  playerName: 'Noname',
  url: 'http://3.95.229.222/',
  xhr: new XMLHttpRequest(),
  chat: "",
  chatHistory: {},
  canvas: null,
  avatar: null,
  ground: null,
  players: null,
  templateUser: null,
  avatars: [],
  
}

function getPlayerID() {

  if (!localStorage.getItem('playerID')) {
    localStorage.setItem('playerID', new Date().getTime());
  }
  return localStorage.getItem('playerID');

}

function onDisconnect() {

  config.disconnect = true;
  alert('Disconnected.');

}

function onChat() {

  config.chat = document.querySelector('.chatText').value;
  document.querySelector('.chatText').value = '';

}

function onSubmit() {

  config.playerName = document.querySelector('#username').value;
  document.querySelector('.avatar').setAttribute(
    'username', 
    document.querySelector('#username').value
  );
  config.disconnect = false;
  alert("Connected.");
  
}

function tick() {

  if (config.disconnect == true) {
    requestAnimationFrame(tick);
    return;
  }
  
  try {
    config.xhr.open(
      'POST', 
      config.url+API+ORG_ID_1+'/lobby/'+config.lobby+'/player/'+getPlayerID(),
      true);

    config.xhr.setRequestHeader('Content-Type', 'application/json');

    config.xhr.send(JSON.stringify(
      { username: config.playerName,
        posX: config.canvas.scrollLeft,
        posY: config.canvas.scrollTop,
        chat: config.chat
      }));

  } catch(err) {
    console.log(err);
    requestAnimationFrame(tick);

  }
}

function onLoad() {

  config.canvas = document.querySelector('.canvas');
  config.ground = document.querySelector('.ground');
  config.avatar = document.querySelector('.avatar');
  config.players = document.querySelector('.players');
  config.templateUser = document.querySelector('.template-user');
  config.templateUser.style.visibility = 'hidden';

  if (window.location.href.match('localhost')) {
    config.url = 'http://localhost:3000/';
  }

  config.xhr.onload = function() {
    if (config.xhr.readyState == 4 && config.xhr.status == 200) {

      let data = JSON.parse(config.xhr.response);
      
      for (var i = 0; i < data.length; i++) {

        if (!config.chatHistory[data[i]['chat']]) {
          config.chatHistory[data[i]['chat']] = true;
          document.querySelector('.chatField').innerHTML = 
            '\n' + data[i]['username'] + ': ' + data[i]['chat'] +
            document.querySelector('.chatField').innerHTML;
        }
        
        if (data[i]['playerID'] == getPlayerID()) {
          continue;
        }
        
        if (!config.avatars[i]) {
          config.avatars[i] = config.templateUser.cloneNode();
          config.avatars[i].innerHTML = config.templateUser.innerHTML;
          config.players.appendChild(config.avatars[i]);
        }
        config.avatars[i].style.visibility = 'visible';
        config.avatars[i].style.left = data[i]['posX'] + 'px';
        config.avatars[i].style.top = (data[i]['posY'] - 32) + 'px';
        config.avatars[i].setAttribute('username', data[i].username);
      }
      
    }
    requestAnimationFrame(tick);

  }
  
  tick();
}

window.onload = onLoad();
