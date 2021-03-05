// Firebase -------------------------------------------------------------------------------------

var firebaseConfig = {
    apiKey: "AIzaSyAtJsf9OYIx3Ul9wRSWsxSRPrNa69Z4Rj0",
    authDomain: "cardsagainsthumanity-6a896.firebaseapp.com",
    databaseURL: "https://cardsagainsthumanity-6a896-default-rtdb.firebaseio.com",
    projectId: "cardsagainsthumanity-6a896",
    storageBucket: "cardsagainsthumanity-6a896.appspot.com",
    messagingSenderId: "391885717905",
    appId: "1:391885717905:web:7cb754567c6d69ffe99a30",
    measurementId: "G-NLE09XVV78"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();



// Global Variables ------------------------------------------------------------------------------

let newgameid = "null";
let host = "null";
let name = "null";
let latestinput = "null";
let overallcode = "null";
var black = [];
var white = [];
var packs = [];


// Functions -------------------------------------------------------------------------------------

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function joingame(code){
  let data = "null";
  var gamecodes = firebase.database().ref('Games/' + code + "/");
  gamecodes.once('value', (snapshot) =>{
    data = snapshot.val();
    if(data == 'null'){
      alert("Incorrect Code");
    }else{
      newinput("Enter Name", "create");
      newgameid = code;
    }
  });
};

function newgame(input){
  let string = makeid(5);
  newgameid = string;
  firebase.database().ref('Games/' + string).set({
  });
  host = "1";
  createplayer(input);
};

function createplayer(name){
  firebase.database().ref('Games/'+ newgameid + '/' + 'players/' + name).set({
    name: 'null'
  });
  document.getElementById("GameInfo").innerText = newgameid;
  document.getElementById("StartGame").style.display = "none";
  document.getElementById("JoinGame").style.display = "none";
  document.getElementById("Leave").style.display = "block";
  document.getElementById("playeroverall").style.display = "block";
  if(host !== "1"){
    document.getElementById("options").style.display = "none";
    document.getElementById("pleasewait").style.display = "block";
    const status = firebase.database().ref('Games/' + newgameid + '/status/');
    status.on('value', (snapshot) =>{
      let started = JSON.stringify(snapshot.val());
      console.log(started);
      if(started == '{"started":1}'){
        console.log("Started");
        newround();
      }else{
        console.log("Not Starting");
      }
    });
  }else{
    document.getElementById("options").style.display = "block";
    document.getElementById("pleasewait").style.display = "none";
    const cardlist = firebase.database().ref('Games/' + newgameid + "/" + "packs/" + "packs/");
    cardlist.on('value', (snapshot) =>{
      data = (JSON.stringify(snapshot.val(), null, 3))
      var newdata1 = data.replace(/"/g,'');
      var newdata2 = newdata1.replace('[','');
      var newdata3 = newdata2.replace(/]/g,'');
      var packs = newdata3.split(',');
      document.getElementById("packlist").innerHTML = makeTableHTML(packs); 
    });
  }
  loadlist();
};

function startgame(){
  if(host == "1"){
    firebase.database().ref('Games/' + newgameid + '/' + 'details/').set({
      started: 1,
    });
  }else{
    alert("You are not host.");
  }
};

function retrieveblack(){
  const dbRefObject = firebase.database().ref().child('BlackCard');
  dbRefObject.on('value', snap =>{
      let BlackCard = (snap.val());
     console.log(BlackCard);
  });
};

function loadlist(){
  let finalHTML = null;
  var playerlist = firebase.database().ref('Games/' + newgameid + "/" + 'players/');
  playerlist.on('value', (snapshot) =>{
    console.log(newgameid);
    data = (JSON.stringify(snapshot.val(), null, 3))
    var newdata1 = data.replace(/}/g,'');
    var newdata2 = newdata1.replace(/{/g,'');
    var newdata3 = newdata2.replace(/:/g,'');
    var newdata4 = newdata3.replace(/"/g,'');
    var newdata5 = newdata4.replace(/name/g,'');
    var newdata6 = newdata5.replace(/null/g,'');
    var users = newdata6.split(',');
    document.getElementById("PlayerList").innerHTML = makeTableHTML(users); 
  });
}

function makeTableHTML(myArray) {
  var result = "<table border=0>";
  for(var i=0; i<myArray.length; i++) {
      result += "<tr>";
      for(var j=0; j<myArray[i].length; j++){
          result += "<td>"+myArray[i][j]+"</td>";
      }
      result += "</tr>";
  }
  result += "</table>";

  return result;
}

function newinput(title,code){
  document.getElementById("popuptitle").innerText = title;
  document.getElementById("inputmodal").style.display = "block";
  if(code == "join"){
    overallcode = "join";
  }if(code == "new"){
    overallcode = "startnew";
  }if(code == "create"){
    overallcode = "create";
  }

}

function submit(){
  let input = document.getElementById("input").value;
  if(input == null || input == ""){
    alert("Please Enter something");
  }else{
    if(overallcode == "join"){
      joingame(input);
      document.getElementById("inputmodal").style.display = "none";
    }if(overallcode == "startnew"){
      newgame(input);
      document.getElementById("inputmodal").style.display = "none";
    }if(overallcode == "create"){
      createplayer(input);
      document.getElementById("inputmodal").style.display = "none";
    }
  }
}

function add_deck(){
  let input = document.getElementById("cardcode").value;
  fetch('https://castapi.clrtd.com/cc/decks/' + input + '/cards')
  .then((resp) => resp.json())
  .then(function (data1){
    data = JSON.stringify(data1.calls);
    var newdata1 = data.replace(/}/g,'');
    var newdata2 = newdata1.replace(/{/g,'');
    var newdata3 = newdata2.replace(/]/g,'');
    var newdata4 = newdata3.replace(/"/g,'');
    var newdata5 = newdata4.replace(/text/g,'');
    var newdata6 = newdata5.replace(/:/g,'');
    var newdata7 = newdata6.split('[');
    black.push(newdata7);
    data = JSON.stringify(data1.responses);
    var newdata1 = data.replace(/}/g,'');
    var newdata2 = newdata1.replace(/{/g,'');
    var newdata3 = newdata2.replace(/]/g,'');
    var newdata4 = newdata3.replace(/"/g,'');
    var newdata5 = newdata4.replace(/text/g,'');
    var newdata6 = newdata5.replace(/:/g,'');
    var newdata7 = newdata6.split('[');
    white.push(newdata7);
    packs.push(input);
    firebase.database().ref('Games/'+ newgameid + '/packs').set({
      packs : packs,
    });
  });
}

function random_black(){
  console.log(getRandom(black))
}

function getRandom(arr) {
  var random1 = Math.floor((Math.random() * (arr.length)));
  console.log(random1);
  return arr[random1][Math.floor((Math.random() * (arr[random1].length)))];
}

function startgame(){
  firebase.database().ref('Games/'+ newgameid + '/status/').set({
    started: 1
  });
}

function newround(){
  firebase.database().ref('Games/'+ newgameid + '/status/').set({
    started: 0
  });
}


//------------------------------------------------------------------------------------------

