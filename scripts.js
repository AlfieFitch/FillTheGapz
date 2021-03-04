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
    name : "Game",
  });
  host = "1";
  createplayer(input);
};

function createplayer(name){
  firebase.database().ref('Games/'+ newgameid + '/' + 'players/' + name).set({
    name : 'null',
  });
  document.getElementById("GameInfo").innerText = newgameid;
  document.getElementById("StartGame").style.display = "none";
  document.getElementById("JoinGame").style.display = "none";
  document.getElementById("Leave").style.display = "block";
  document.getElementById("PlayerList").style.display = "block";
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



//------------------------------------------------------------------------------------------

