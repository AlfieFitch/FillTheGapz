
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

const analytics = firebase.analytics();
var database = firebase.database();

// Global Variables ------------------------------------------------------------------------------

let newgameid = "null";
let host = "null";
let username = null;
let latestinput = "null";
let overallcode = "null";
var black = [];
var white = [];
var packs = [];
let storedblack = null;
let totalwhite = 0;
let playerwhite = [];
let lastpicked = null;
let picked = null;
let confirmed = "false";
let userlist =[];
let czar = "0";
let czarname = null;
let alreadyconfirmed = "false";
let rounds = 0;
let winnercard = null;
let runpicked = "false";
let norounds = 10;
let compround = 0;
let gameid=null;
let amijoining = null;
let amijoining2 = null;
let id = null;
let lastcustom = 0;
let rawwhite = [];
let lastchosen = null;
let lastchosenimage = null;
let tempwhite = [];
let tempimage = [];
let alreadyaddedimages = false;
let alreadyadded = false;
let joinlist = [];
let tempusers = [];




// Functions -------------------------------------------------------------------------------------




function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}


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
  var playerlist = firebase.database().ref('Games/' + code + "/" + 'players/');
  playerlist.once('value', (snapshot) =>{
    let data = (JSON.stringify(snapshot.val(), null, 3))
    var newdata1 = data.replace(/}/g,'');
    var newdata2 = newdata1.replace(/{/g,'');
    var newdata3 = newdata2.replace(/:/g,'');
    var newdata4 = newdata3.replace(/"/g,'');
    var newdata5 = newdata4.replace(/name/g,'');
    var newdata6 = newdata5.replace(/null/g,'');
    var newdata7 = newdata6.replace(/ /g , '');
    var newdata8 = newdata7.replace(/(\n)+/g , '');
    newdata8 = newdata8.replace(/\n/g , '');
    tempusers = newdata8.split(',');
    newgameid = code;
    if(tempusers.length == 10){
      sendalert("Sorry, this game already has 10 players.")
    }else{
    newinput("Enter Name", "create");
    }
  });
}


function numberrounds(){
  let newinput = document.getElementById("rounds").value;
  if(newinput == ""){
    sendalert("Please enter a value.")
  }else{
    norounds = parseInt(newinput);
    document.getElementById("roundsnum").innerText = newinput + ' rounds';
  }
}

function newgame(input){
  let string = makeid(5);
  newgameid = string;
  firebase.database().ref('Games/' + string).set({
  });
  firebase.database().ref('Games/' + string + "/host").set({
    status: "active",
  })
  host = "1";
  createplayer(input);
};

function createplayer(name){
  document.getElementById("inputmodal").style.display = "none";
  username = name;
  document.cookie = "playername=" + username;
  document.cookie = "gameid=" + newgameid; 
  firebase.database().ref('Games/' + newgameid + '/scores/' + username).set({
    score: 0,
  });
  firebase.database().ref('Games/'+ newgameid + '/' + 'players/' + username).set({
    name: 'null'
  });
  document.getElementById("url").innerText = "https://fillthegapz.com/?code=" + newgameid;
  document.getElementById("StartGame").style.display = "none";
  document.getElementById("JoinGame").style.display = "none";
  document.getElementById("Leave").style.display = "block";
  document.getElementById("logo").style.float = "right";  
  var checkdisconnect = firebase.database().ref('Games/' + newgameid + '/disconnectedplayers')
  checkdisconnect.on('value', (snapshot) =>{
    var daya = JSON.stringify(snapshot);
    var newdata1 = daya.replace(/"/g,'');
    if(newdata1 !== "null"){
      sendalert(newdata1 + " has disconnected");
      if(host == "1" ){
        firebase.database().ref('Games/'+ newgameid + "/players/" + newdata1).remove()
      }
      firebase.database().ref('Games/'+ newgameid + "/disconnectedplayers").remove();
    }
  });
  if(host !== "1"){
      var disconnect = firebase.database().ref('Games/' + newgameid + '/disconnectedplayers');
      disconnect.onDisconnect().set(username);
      var status67 = firebase.database().ref('Games/' + newgameid + "/" + 'host/');
      status67.on('value', (snapshot) =>{
        let value = JSON.stringify(snapshot.val());
        if(value == '{"status":"lost"}'){
          firebase.database().ref('Games/'+ newgameid).remove();
          document.cookie = "playername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "gameid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          document.cookie = "visited=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.replace("http://fillthegapz.com");
        }
      });
      document.getElementById("options").style.display = "none";
      document.getElementById("additionalplayer").style.display = "block";
      document.getElementById("pleasewait").style.display = "block";
      document.getElementById("waittext").innerText = "Please wait for the host to start the game.";
      const status = firebase.database().ref('Games/' + newgameid + '/status/');
      status.on('value', (snapshot) =>{
      let started = JSON.stringify(snapshot.val());
      if(started == '{"started":1}'){
        newround();
      }
    });
  }else{
    var disconnect = firebase.database().ref('Games/' + newgameid + '/host/status');
    disconnect.onDisconnect().set("lost");
    firebase.database().ref('Games/' + newgameid + '/lobbyname').remove;
    document.getElementById("options").style.display = "block";
    document.getElementById("pleasewait").style.display = "none";
    firebase.database().ref('Games/' + newgameid + "/packs").set({
      packs: "",
    });
    const cardlist = firebase.database().ref('Games/' + newgameid + "/" + "packs/" + "packs/");
    cardlist.on('value', (snapshot) =>{
      let data = (JSON.stringify(snapshot.val(), null, 3))
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
    if(rawwhite.length == 0 || black.length == 0){
      sendalert("Please ensure the deck has at least 1 black card and white card.")
    }else if(userlist[0].length == 1){
      sendalert("You can't play this alone.");
    }else{
        rawwhite.push(tempwhite);
        rawwhite.push(tempimage);
        firebase.database().ref('Games/' + newgameid + '/white').set({
          cards: JSON.stringify(rawwhite),
        });
        newround();
        firebase.database().ref('Games/' + newgameid + '/' + 'status/').set({
          started: 1,
        });
      }
  }
};

function loadlist(){
  var playerlist = firebase.database().ref('Games/' + newgameid + "/" + 'players/');
  playerlist.on('value', (snapshot) =>{
    let data = (JSON.stringify(snapshot.val(), null, 3))
    var newdata1 = data.replace(/}/g,'');
    var newdata2 = newdata1.replace(/{/g,'');
    var newdata3 = newdata2.replace(/:/g,'');
    var newdata4 = newdata3.replace(/"/g,'');
    var newdata5 = newdata4.replace(/name/g,'');
    var newdata6 = newdata5.replace(/null/g,'');
    var newdata7 = newdata6.replace(/ /g , '');
    var newdata8 = newdata7.replace(/(\n)+/g , '');
    newdata8 = newdata8.replace(/\n/g , '');
    var users = newdata8.split(',');
    userlist = [];
    userlist.push(users);
    document.getElementById("PlayerList").innerHTML = makeTableHTML(users,"tablerow");
    document.getElementById("additionalPlayerList").innerHTML = makeTableHTML(users,"tablerow"); 
  });
}

function makeTableHTML(myArray,class1){
  var result = "<table border=0>";
  for(var i=0; i<myArray.length; i++) {
      result += "<tr>";
      for(var j=0; j<myArray[i].length; j++){
          result += "<td  class = '" + class1 + "'>"+myArray[i][j]+"</td>";
      }
      result += "</tr>";
  }
  result += "</table>";

  return result;
}

function newinput(title,code){
  document.getElementById("homepage").style.display = "none";
  document.getElementById("popuptitle").innerText = title;
  document.getElementById("inputmodal").style.display = "block";
  if(code == "join"){
    overallcode = "join";
  }
  if(code == "new"){
    overallcode = "startnew";
  }
  if(code == "create"){
    overallcode = "create";
  }
}

function submit(){
  let input = document.getElementById("input").value;
  if(input == null || input == ""){
    sendalert("Please enter a value.")
  }else{
    if(overallcode == "join"){
      joingame(input);
    }if(overallcode == "startnew"){
      newgame(input);
      
    }if(overallcode == "create"){
      createplayer(input);
      
    }
  }
}

function add_deck(){
  let input = document.getElementById("cardcode").value;
  if(input == ""){
    sendalert("Please enter a value.");
  }else{
    packs.push(input);
    firebase.database().ref('Games/'+ newgameid + '/packs').set({
      packs : packs,
    });
    fetch('https://castapi.clrtd.com/cc/decks/' + input + '/cards')
          .then((resp) => resp.json())
          .then(function (data) {
            if(JSON.stringify(data.calls) == "[]"){
              rawwhite.push(data.responses);
            }else if(JSON.stringify(data.responses) == "[]"){
              black.push(data.calls);
            }else{
              black.push(data.calls);
              rawwhite.push(data.responses);
            }
          });
  }
}

function clear_decks(){
  black = [];
  rawwhite = [];
  tempwhite = [];
  playerwhite = [];
  tempimage = [];
  white = [];
  packs = [];
  firebase.database().ref('Games/' + newgameid + '/packs').set({
    packs: "",
  });
}

function customcards(){
  tempwhite = [];
  let customarray = ["Custom Card"];
  let input = document.getElementById("customcards").value;
  if(input == ""){
    sendalert("Please enter a value.");
  }else{
    i = 0;
    let int1 = parseInt(input);
    while(i < int1){
      var customcard = {text: customarray};
       tempwhite.push(customcard);
       i++;
    }
    if(packs.length == 0){
      alreadyadded = true;
      packs.push(input + " Custom Cards");
    }else{
      for(i in packs){
        let check = packs[i].includes("Custom");
        if(check == true){
          alreadyadded = true;
          packs[i] = input + " Custom Cards";
        }else if(check !== true && alreadyadded == false){
          alreadyadded = true;
          packs.push(input + " Custom Cards");
       }
      }
    }
    firebase.database().ref('Games/'+ newgameid + '/packs').set({
     packs : packs,
    });
  }
}

function imagecards(){
  tempimage = [];
  let customiarray = ["Image Card"];
  let input = document.getElementById("imagecards").value;
  if(input == ""){
    sendalert("Please enter a value.");
  }else{
    i = 0;
    let int1 = parseInt(input);
    while(i < int1){
       var customicard = {text: customiarray};
       tempimage.push(customicard);
       i++;
    }
    if(packs.length == 0){
      alreadyaddedimages = true;
      packs.push(input + " Image Cards");
    }else{
      for(i in packs){
       let check = packs[i].includes("Image");
        if(check == true){
          alreadyaddedimages = true;
          packs[i] = input + " Image Cards";
        }else if(check == false ){
          if(alreadyaddedimages == true){
          }else if(alreadyaddedimages == false){
            alreadyaddedimages = true;
            packs.push(input + " Image Cards");
          }else{
          }
       }
      }
    }
    firebase.database().ref('Games/'+ newgameid + '/packs').set({
      packs : packs,
    });
  }
}


function getRandom(arr) {
  var random1 = Math.floor((Math.random() * (arr.length - 1)));
  let final =  arr[random1][Math.floor((Math.random() * (arr[random1].length)))].text;
  return final;
}

function getRandomwhite(arr) {
  var random1 = Math.floor((Math.random() * (arr.length - 1)));
  let final =  arr[random1][Math.floor((Math.random() * (arr[random1].length)))];
  return final;
}




async function newround(){
  if(host == "1"){
  firebase.database().ref('Games/' + newgameid + '/readyornot/').set({
    data: 'not',
  });
  czarname = getRandomwhite(userlist);
  firebase.database().ref('Games/' + newgameid + '/czar/').set({
    czar: czarname,
  });
  getblack();
  await getblack();
  firebase.database().ref('Games/' + newgameid + '/readyornot/').set({
    data: 'ready',
  });
  }
  gotczar();
}

async function getblack(){
  let new_black = getRandom(black);
  let blackiteration = 0;
  if(new_black.length ==  "2"){
    firebase.database().ref('Games/' + newgameid + '/card/').set({
      black: new_black
    });
  }else if(blackiteration == 10){
    sendalert("Please ensure the deck some single pick cards - cards that require more than 1 white cards are currently incompatible.")
    firebase.database().ref('Games/' + newgameid + '/card/').set({
      black: "Incompatible Deck",
    });
  }else{
    blackiteration = blackiteration + 1;
    getblack();
  }
  return;
}



function gotczar(){
  const readyornot = firebase.database().ref("Games/" + newgameid + '/readyornot/')
  readyornot.on('value', (snapshot) =>{
    let readydata = JSON.stringify(snapshot);
    if(readydata == '{"data":"ready"}'){
      gotczar();
    }
  })
}

function gotczar(){

  const statusting = firebase.database().ref('Games/' + newgameid + '/playerstatus/');
  statusting.on('value', (snapshot) =>{
    string = JSON.stringify(snapshot.val());
    let string1 = string.replace(/"/g,'');
    let string2 = string1.replace("{",'');
    let string3 = string2.replace('}','');
    let string4 = string3.replace("status",'');
    let string5 = string4.replace(":",'');
    let int1 = parseInt(string5);
    if(int1 == 1){
      document.getElementById("pickeddisplay").innerHTML ="<h1 class = 'pickedtext'>" +  JSON.stringify(int1) + " player picked </h1>";
    }else{
      document.getElementById("pickeddisplay").innerHTML ="<h1 class = 'pickedtext'>" +  JSON.stringify(int1) + " players picked </h1>";
    }
  });
  firebase.database().ref('Games/' + newgameid + '/confirmpicked').set({
    picked: 'false',
  });
  const scoreboard = firebase.database().ref('Games/' + newgameid + '/scores/');
  scoreboard.on('value', (snapshot) =>{
  let scorearray = [];
  let score = JSON.stringify(snapshot.val());
  let score1 = score.replace(/{/g , '');
  let score2 = score1.replace(/"/g , '');
  let score4 = score2.replace(/score/g, '');
  let score5 = score4.replace(/}/g,'');
  let score6 = score5.split(',');
  scorearray.push(score6);
  let final = '';
  for(i in scorearray[0]){
      let smallarray = [];
      let ting = scorearray[0][i];
      let newting = ting.split('::');
      smallarray.push(newting);
      final = final + '<tr class="scorerow"><td class = "scoremain">' + smallarray[0][0] + '</td><td class = "scoremain">' + smallarray[0][1] + '</td></tr>';
  }
  let finalpoop = '<div><table class = "scoreover">' + final +'</table></div>';
  document.getElementById("scoreboard").innerHTML = finalpoop;
  });
  const status = firebase.database().ref('Games/' + newgameid + '/endofround/');
  status.on('value', (snapshot) =>{
    let check = JSON.stringify(snapshot.val());
    if(check == '{"started":"5"}'){
      gamefinished();
      return;
    };
  });
  runpicked = "false";
  firebase.database().ref('Games/'+ newgameid + '/czarpick/').set({
    pick : "null",
  });
  alreadyconfirmed = "false";
  firebase.database().ref('Games/'+ newgameid + '/pickedwhite/').remove();
  czar = "0";
  lastpicked = null;
  document.getElementById("confirmselection").style.display = "none";
  document.getElementById("whiteboxesparent").style.display = "block";
  document.getElementById("pickerselection").style.display = "none";
  firebase.database().ref('Games/'+ newgameid + '/playerstatus/').set({
    status : "0",
  });
  confirmed = "false";
  if(host == "1"){
    if(compround == norounds){
      firebase.database().ref('Games/'+ newgameid + '/endofround/').set({
        started: "5"
      });
    }
    compround = compround + 1;
    firebase.database().ref('Games/'+ newgameid + '/status/').set({
      started: 0
    });
  }

  const retrieveczar = firebase.database().ref('Games/' + newgameid + '/czar/');
  retrieveczar.on('value', (snapshot) =>{
    let string1 = JSON.stringify(snapshot.val());
    let string2 = string1.replace('{"czar":"', '');
    string3 = string2.replace('"}','');
    if(string3 == username){
      czar = "1";
    }else{
      czar = "0";
    }
    document.getElementById("czardisplay").innerHTML = "<h1>The Current King is " + string3 + "</h1>";
    const retrieveround = firebase.database().ref('Games/' + newgameid + '/currentround');
    retrieveround.on('value', (snapshot) =>{
    let string1 = JSON.stringify(snapshot.val());
    string1 = string1.replace(/"/g,'');
    string1 = string1.replace('{number:','');
    string1 = string1.replace('}','');
    document.getElementById("rounddisplay").innerHTML = "<h1 class = 'roundtext'>"+string1+"</h1>";
    getwhite();
    const status = firebase.database().ref('Games/' + newgameid + '/card').child('black');
    status.once('value', (snapshot) =>{
      storedblack = JSON.stringify(snapshot.val());
      var newdata = storedblack.replace("[", "");
      var newdata1 = newdata.replace(/\",\"/g , " ͟ ͟ ͟ ͟ ͟ ͟ ͟ ͟ ͟ ͟ ͟ ͟    " );
      var newdata2 = newdata1.replace(/\\n/g,' ');
      var newdata3 = newdata2.replace(/"/g ,'');
      var newdata4 = newdata3.replace("]", "");
      newdata4 = newdata4.replace(/\\/g,"");
      document.getElementById("blackcontent").innerHTML = newdata4;
    });
    
    if(czar == "1"){
      selectionconfirmed();
      document.getElementById("whiteboxes").style.display = "none";
      document.getElementById("czarnotif").style.display = "block";
      document.getElementById("confirmselection").style.display = "none";
    }else{
      if(window.matchMedia("(max-width: 1000px)").matches) {
        document.getElementById("whiteboxes").style.display = "grid";
      }else {
        document.getElementById("whiteboxes").style.display = "block";
      }
      document.getElementById("confirmselection").style.display = "block";
    }
    document.getElementById("playeroverall").style.display = "none";
    document.getElementById("pleasewait").style.display = "none";
    document.getElementById("options").style.display = "none";
    document.getElementById("additionalplayer").style.display = "none";
    document.getElementById("Game").style.display = "inline";
    document.getElementById("waittext").innerText = "Please wait for the next round to start.";
    })
  });
  if(host == "1"){
    let rounddisplay = "round " + JSON.stringify(compround) + " of " + JSON.stringify(norounds);
    firebase.database().ref('Games/' +newgameid + '/currentround').set({
      number: rounddisplay,
    })
  }
  
}

function getwhite(){
    if(playerwhite.length < 12){
      const whitecards = firebase.database().ref('Games/' + newgameid + '/white/cards');
      whitecards.once('value', (snapshot) =>{
        var splited = snapshot.val();
        splited = splited.split("},{");
        white.push(splited);
        let randomwhite = getRandomwhite(white);
        randomwhite = randomwhite.replace('[[{','');
        let randomwhite1 = randomwhite.replace('"text":["' , '');
        let randomwhite2 = randomwhite1.replace('"]' , '');
        let randomwhite3 = randomwhite2.replace(/\\n/g,'');
        let randomwhite4 = randomwhite3.replace(/\n/g,'');
        let randomwhite5 = randomwhite4.replace(/}]]/g,'');
        let randomwhite6 = randomwhite5.replace(/\\/g , '');
        let commacheck = randomwhite6.includes(",");
        let duplicatecheck = playerwhite.includes(randomwhite6);
        if(commacheck == true){
          getwhite();
        }else if(duplicatecheck == true && randomwhite6 !== "Custom Card" && randomwhite6 !== "Image Card"){
          getwhite();
        }else{
          playerwhite.push(randomwhite6);
          getwhite();
        }
      });
    };
  let innerhtml = "";
  for(i in playerwhite){
    let imagecheck = playerwhite[i].includes("https://");
    if(imagecheck == true){
      playerwhite[i] = playerwhite[i].replace("[img]",'');
      playerwhite[i] = playerwhite[i].replace("[/img]",'');
      innerhtml = innerhtml + '<div class = "singlebutton"><button class = "whitebutton" id = "' + i + '" onClick="whiteselected(' + i + ');"><img src="' + playerwhite[i] + '"class="whiteimage"></button></div>';

    }else{
      innerhtml = innerhtml + '<div class = "singlebutton"><button class = "whitebutton" id = "' + i + '" onClick="whiteselected('+ i + ');">' + playerwhite[i] + '</button></div>'
    }
  }
    document.getElementById("whiteboxes").innerHTML = innerhtml; 
};

function whiteselected(id){
  if(lastpicked !== null){
  document.getElementById(lastpicked).style.color = "";
  }
  let cardval = document.getElementById(id).innerHTML;
  if(cardval == "Custom Card" || cardval == lastchosen){
    let input = prompt("Enter what you would like the card to say");
    if(input === ""){
      sendalert("Please enter a value.");
      whiteselected(id);
    }else if(input){
      lastchosen = input;
      document.getElementById(id).innerText = input;
      playerwhite[id] = input;
    }else{
      sendalert("Please enter a value.");
      whiteselected(id);
    }
  }
  if(cardval == "Image Card" || cardval == lastchosenimage){
    let input = prompt("Enter the link to the image");
    if(input === ""){
      sendalert("Please enter a value.");

      whiteselected(id);
    }else if(input){
      let innerhtml = "<img src='" + input + "' class='whiteimage'>";
      lastchosenimage = '<img src="' + input + '" class="whiteimage">';
      document.getElementById(id).innerHTML = innerhtml;
      playerwhite[id] = input;
    }else{
      sendalert("Please enter a value.")
      whiteselected(id);
    }
  }
  if(confirmed == "false"){
    if(id !== lastpicked){
      if(lastpicked !== null){
        document.getElementById(lastpicked).classList.add("whitebutton");
       document.getElementById(lastpicked).classList.remove("SelectedWhiteCard");
      }
      document.getElementById(id).classList.add("SelectedWhiteCard");
      document.getElementById(id).classList.remove("whitebutton");
      lastpicked = id;
     
    }
    picked = playerwhite[id];
    document.getElementById("confirmselection").innerHTML = '<button id="confirmselectionpoop" style="display:none;" class="confirmslectionbutton" onclick="selectionconfirmed(' + id + ');">Confirm Selection</button>';
    document.getElementById("confirmselection").style.display = "block";
    document.getElementById("confirmselectionpoop").style.display = "block";
    
  }else{

  }
}

function selectionconfirmed(id){
  if(czar == "1" && host == "1"){
    const status = firebase.database().ref('Games/' + newgameid + '/playerstatus/');
    status.on('value', (snapshot) =>{
      string = JSON.stringify(snapshot.val());
      let string1 = string.replace(/"/g,'');
      let string2 = string1.replace("{",'');
      let string3 = string2.replace('}','');
      let string4 = string3.replace("status",'');
      let string5 = string4.replace(":",'');
      let int1 = parseInt(string5);
      if(int1 == (userlist[0].length - 1)){
        firebase.database().ref('Games/'+ newgameid + '/status/').set({
          started : '3',
        });
        selectiontime();
      }
    });
  }else if(czar == "1" && host !== "1"){
    const status = firebase.database().ref('Games/' + newgameid + '/status/');
      status.on('value', (snapshot) =>{
        let check = JSON.stringify(snapshot.val())
        if(check == '{"started":"3"}'){
          selectiontime()
        };
      });
  }else{
  if(alreadyconfirmed == "false"){
  alreadyconfirmed = "true"
  let pickedcard = playerwhite[id];
  let string = null;
  document.getElementById("confirmselectionpoop").style.backgroundColor = "#FD4444";
  document.getElementById("confirmselectionpoop").style.color = "white";
  var x = document.getElementsByClassName('whitebutton');
  var i;
  for (i = 0; i < x.length; i++) {
    x[i].classList.add("whitebuttonselected");
  }
  let topush = pickedcard;
  firebase.database().ref('Games/'+ newgameid + '/pickedwhite/').child(username).set({
    topush,
  });
  if(id > -1){
    playerwhite.splice(id, 1);
  }
  const status = firebase.database().ref('Games/' + newgameid + '/playerstatus/');
  confirmed = "true";
  status.once('value', (snapshot) =>{
    string = JSON.stringify(snapshot.val());
    let string1 = string.replace(/"/g,'');
    let string2 = string1.replace("{",'');
    let string3 = string2.replace('}','');
    let string4 = string3.replace("status",'');
    let string5 = string4.replace(":",'');
    let int1 = parseInt(string5);
    if(string5 == "null"){
      int1 = 0;
    }
    let newint = int1 + 1;
    firebase.database().ref('Games/'+ newgameid + '/playerstatus/').set({
      status : newint,
    });
    if(host == "1"){
      status.on('value', (snapshot) =>{
        string = JSON.stringify(snapshot.val());
        let string1 = string.replace(/"/g,'');
        let string2 = string1.replace("{",'');
        let string3 = string2.replace('}','');
        let string4 = string3.replace("status",'');
        let string5 = string4.replace(":",'');
        let int1 = parseInt(string5);
        let user69 = (userlist[0].length - 1);
        let subtract = null;
        if(user69 == 0){
          subtract = 0;
        }else{
          subtract = 1;
        }
        if(int1 == (userlist[0].length - 1)){
          firebase.database().ref('Games/'+ newgameid + '/status/').set({
            started : '3',
          });
          selectiontime();
        }
      });
    }else{
      const status = firebase.database().ref('Games/' + newgameid + '/status/');
      status.on('value', (snapshot) =>{
        let check = JSON.stringify(snapshot.val())
        if(check == '{"started":"3"}'){
          selectiontime()
        };
      });
    } 
    confirmed = "true";
  });
}
}
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


function selectiontime(){
  let finalhtml = "";
  let selectedwhitecards = [];
  document.getElementById("whiteboxes").style.display = "none";
  if(czar !== "1"){
  document.getElementById("confirmselectionpoop").style.backgroundColor = "";
  document.getElementById("confirmselectionpoop").style.color = "";
  document.getElementById("confirmselectionpoop").style.display = "none";
  }
  document.getElementById("czarnotif").style.display = "none";
  document.getElementById("confirmselection").style.display = "none";
  const status = firebase.database().ref('Games/' + newgameid + '/pickedwhite/');
  status.once('value', (snapshot) =>{
    let picker = JSON.stringify(snapshot.val());
    selectedwhitecards.push(picker.split('"},"'));
    for(i in selectedwhitecards[0]){
      let daid = "'" + "card" + i + "'";
      let selection = [];
      let string1 = selectedwhitecards[0][i];
      let string2 = string1.replace(/{/g , '');
      let string3 = string2.replace(/"/g, '');
      let string4 = string3.replace("topush" , '');
      let string5 = string4.replace(/}/g , '');
      let string6 = string5.split('::');
      selection.push(string6);
      let imagecheck = playerwhite[i].includes("https://");
      if(imagecheck == true){
        if(czar == "1"){
          console.log("czarimage");
          let ting = "'" + selection[0][0] + "'"
          finalhtml = finalhtml + '<div class = "selectoverall"><button onclick = "czarselected('+daid + ',' + ting +');" class = "czarselect" id = "' + daid + '"><h1 class = "mainfunny"><img src="' + selection[0][1] + '"class="whiteimage"></img></h1><h1 class = "author" style = "display:none;">'+ selection[0][0] +'</h1></button></div>';
        }else{
          finalhtml = finalhtml + '<div class = "selectoverall"><button class = "select" id = "' + daid + '"><h1 class = "mainfunny"><img src="' + selection[0][1] + '"class="whiteimage"></img></h1><h1 class = "author" style = "display:none;">'+ selection[0][0] +'</h1></button></div>';
        }
      }else{
        if(czar == "1"){
          let ting = "'" + selection[0][0] + "'"
          finalhtml = finalhtml + '<div class = "selectoverall"><button onclick = "czarselected('+daid + ',' + ting +');" class = "czarselect" id = "' + daid + '"><h1 class = "mainfunny">' + selection[0][1] + '</h1><h1 class = "author" style = "display:none;">'+ selection[0][0] +'</h1></button></div>';
        }else{
          finalhtml = finalhtml + '<div class = "selectoverall"><button class = "select" id = "' + daid + '"><h1 class = "mainfunny">' + selection[0][1] + '</h1><h1 class = "author" style = "display:none;">'+ selection[0][0] +'</h1></button></div>';
       }
      }
    }
    document.getElementById("pickerselection").innerHTML = finalhtml;
    if(window.matchMedia("(max-width: 1000px)").matches) {
      document.getElementById("pickerselection").style.display = "grid";
    }else {
      document.getElementById("pickerselection").style.display = "block";
    }
    const status = firebase.database().ref('Games/' + newgameid + '/czarpick/');
    status.on('value', (snapshot) =>{
      if(runpicked == "false"){
        let newval = JSON.stringify(snapshot.val());
        if(newval !== '{"pick":"null"}'){
          czarhaspicked(newval);
          runpicked = "true";
        }
      };
    });
    });
};

function czarselected(skeeid,author){
  skeeid = "'" + skeeid + "'";
  firebase.database().ref('Games/'+ newgameid + '/czarpick/').set({
    pick : skeeid,
  });
  firebase.database().ref('Games/'+ newgameid + '/winner/').set({
    name: author,
  });
  firebase.database().ref('Games/' + newgameid + '/confirmpicked').set({
    picked: 'true',
  })
}

function czarhaspicked(cardid){
  let newcardid = cardid.replace('{"pick":' , '');
  newcardid = newcardid.replace('}' , '');
  newcardid = newcardid.replace(/"/g , '');
  var xting = document.getElementsByClassName('author');
  var i;
  for (i = 0; i < xting.length; i++) {
    xting[i].style.display="block";
  }
  document.getElementById(newcardid).style.backgroundColor = "#8a720b";
  document.getElementById(newcardid).style.color = "white";
  if(host == "1"){
    incrementscoreboard();
  }

  if(host == "1"){
    setTimeout(() => {  startgame(); }, 10000);
  }
}

function incrementscoreboard(){
  let value = null;
  let alreadyincrememented = false;
  const check = firebase.database().ref('Games/' + newgameid + '/confirmpicked/');
  check.on('value', (snapshot) =>{
    value = JSON.stringify(snapshot.val());
    if(value == '{"picked":"true"}' && alreadyincrememented == false){
      const status = firebase.database().ref('Games/' + newgameid + '/winner/');
      status.once('value', (snapshot) =>{
          let one = JSON.stringify(snapshot.val());
          let two = one.replace(/{name:/ , '');
          let three = two.replace('}' , '');
          let finalfour = three.replace(/"/g , '');
          let splitfour = finalfour.split(':');
          let finalfinalpee = splitfour[1];
          const scroe = database.ref('Games/' + newgameid + '/scores/' + finalfinalpee)
          scroe.set({
            score: firebase.database.ServerValue.increment(1),
          });  
          alreadyincrememented = true;
        });
      }
  });
}

function leavegame(){
  document.cookie = "playername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "gameid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "visited=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "tojoin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  firebase.database().ref('Games/'+ newgameid + '/players/' + username).remove();
  window.location.replace("http://fillthegapz.com");
}

function gamefinished(){
  getpodium();
  document.getElementById("endofgame").style.display = "block";
  document.getElementById("whiteboxesparent").style.display = "none";
  document.getElementById("Game").style.display = "none";
  document.getElementById("blackcard").style.display = "none";
}

function lobbyname(){
  let name = document.getElementById("lobname").value;
  if(name == "" || name == null){
    sendalert("Please enter a value.");
  }else if(name.length > 14){
    sendalert("Must be less than 14 characters.");

  }else{
    firebase.database().ref('Games/'+ newgameid + '/lobbyname/').set({
      name: name + "$" + newgameid,
    });
    document.getElementById("lobnamedisp").innerText = "Public: "+ name;
  }
}

function checkstatus(dacode,id){
  let variable = dacode;
  amijoining = "";
  if(dacode == ""){
    variable = id;
  }
  const gameactivelink = firebase.database().ref('Games/' + variable + '/host/');
  gameactivelink.once('value', (snapshot) =>{
    gameactive = JSON.stringify(snapshot.val())
    if(gameactive == '{"status":"active"}'){
     amijoining = "join";
    }else{
     amijoining = "inactive";
    }
    aftercheck(dacode, id);
  });
}


window.onload = function(){
  //checkscreen();
  firebase.auth().signInAnonymously();
  let url = new URLSearchParams(location.search);
  let dacode = url.get('code');
  if(dacode !== null){
    document.cookie = "tojoin=" + dacode;
    window.location.replace("/");
  }
  dacode = getCookie("tojoin");
  id = getCookie('gameid');
  checkstatus(dacode, id);
}

function aftercheck (dacode, id){
  let hasbeen = getCookie("visited");
  if(id == dacode){
    if(amijoining == "join"){
      if(hasbeen == id){
        RejoinGame(id);
      }else{
        joingame(dacode);
        document.cookie = "visited=" + dacode;
      }
    }
  }else if(dacode !== ""){
    if(amijoining == "join"){
      joingame(dacode);
      document.cookie = "visited=" + dacode;
    }
 
  }else if(id !== ""){
    if(amijoining == "join"){
      RejoinGame(id);
    }

  }
  const scoreboard = firebase.database().ref('Games/');
  scoreboard.on('value', (snapshot) =>{
    let overallhtml = "";
    let pubgames = [];
    let array = [];
    let tin = snapshot.val();
    for(i in tin){
      array.push(tin[i]);
    }
    for(i in array){
      let val = array[i].lobbyname;
      if(val !== undefined){
        pubgames.push(val);
      }
    }
    if(pubgames.length == 0){
      overallhtml = "<h1 class = 'nogames'>There are no public Games.</h1>";
    }
    for(i in pubgames){
      let val = pubgames[i];
      let temparray = [];
      val = JSON.stringify(val);
      val = val.replace('{"name":"','');
      val = val.replace('"}','');
      let toarray = val.split('$');
      temparray.push(toarray);
      overallhtml = overallhtml + "<div class ='gamenameover'><div class = 'gamename'><h1 class = 'nametext'>"+ temparray[0][0] +"</h1></div><button onclick = 'joining("+ JSON.stringify(temparray[0][1]) + ");' class = 'gamesbutton'>Join</button></div>";
    }
    document.getElementById("gamesoverall").innerHTML = overallhtml;
    document.getElementById("loaderoverall").style.display = "none";
    if (window.matchMedia("(max-width: 1500px)").matches) {
      document.getElementById("body").style.overflowY = "auto";
    }
  }); 
}

function joining(game){
  joingame(game);
}

function RejoinGame(id){
  const status = firebase.database().ref('Games/' + id);
  status.once('value', (snapshot) =>{
    let check = JSON.stringify(snapshot.val());
    if(check !== 'null'){
      gameid = id;
      document.getElementById("rejoinoverall").style.display = 'block';
    };
 });
}

function discardgame(){
  let nameting = getCookie('playername');
  firebase.database().ref('Games/'+ gameid + '/players/' + nameting).remove();
  document.cookie = "playername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "gameid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "visited=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "tojoin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.getElementById("rejoinoverall").style.display = 'none';
}

function rejoindagame(){
  document.getElementById("homepage").style.display = "none";
  document.getElementById("rejoinoverall").style.display = "none";
  newgameid = getCookie('gameid');
  createplayer(getCookie('playername'));
  const status = firebase.database().ref('Games/' + newgameid + '/status/');
  status.once('value', (snapshot) =>{
    let check = JSON.stringify(snapshot.val());
    if(check == '{"started":0}'){
      newround();
    };
  });
}

window.addEventListener("pagehide", function(e){
  firebase.database().ref('Games/'+ gameid + '/players/' + username).remove();
}, false);

function getpodium(){
  const status = firebase.database().ref('Games/' + newgameid + '/scores');
  status.once('value', (snapshot) =>{
    let scores = JSON.stringify(snapshot.val());
    let scorelist = scores.split(',');
    let namelist = [];
    let cleanscorelist = [];
    for(i in scorelist){
      let current = scorelist[i];
      let name = current.replace(/{/g,"");
      name = name.replace(/:/g,"");
      name = name.replace(/"/g,'');
      name = name.replace(/}/g,'');
      name = name.replace('score','');
      name = name.replace('{"','');
      namelist.push(name);
      let playerscore = current.replace(/\D/g,'');
      cleanscorelist.push(parseInt(playerscore));
    }
    let newscorelist = cleanscorelist.sort().reverse();
    let iterations = 0;
    let alreadypodium = [];
    for(i in newscorelist){
      let checkingnow = newscorelist[i];
      for(j in cleanscorelist){
        let compare = cleanscorelist[j]
        if(compare == checkingnow){
          for(k in namelist){
            let numcheck = namelist[k].includes(JSON.stringify(cleanscorelist[j]));
            let name = namelist[j].replace(/\d/g, "");
            if(numcheck == true && alreadypodium.includes(name) == false && iterations < 4){
              iterations = iterations + 1;
              document.getElementById('podiumnames' + iterations).innerText = name;
              document.getElementById('podiumpoints' + iterations).innerText = cleanscorelist[j] + ' Points';
              alreadypodium.push(name);
            }
          }
        }
      }
    }
  });

  const restarting = firebase.database().ref('Games/' + newgameid + '/restarting/');
  restarting.on('value', (snapshot) =>{
    let check = JSON.stringify(snapshot.val());
    if(check == '{"data":"True"}'){
      restartgameadditional();
    }
  });
}

function restartgame(){
  document.getElementById("whiteboxesparent").style.display = "none";
  document.getElementById("endofgame").style.display = "none";
  document.getElementById("Game").style.display = "none";
  firebase.database().ref('Games/'+ newgameid + '/restarting/').set({
    data: 'True',
  });
  document.getElementById("options").style.display = "block";
  document.getElementById("url").innerText = "https://fillthegapz.com/?code=" + newgameid;
  document.getElementById("StartGame").style.display = "none";
  document.getElementById("JoinGame").style.display = "none";
  document.getElementById("Leave").style.display = "block";
  document.getElementById("additionalplayer").style.display = "block";
  document.getElementById("options").style.display = "block";
  document.getElementById("pleasewait").style.display = "none";
}

function restartgameadditional(){
  if(host !== "1"){
  document.getElementById("options").style.display = "none";
  document.getElementById("additionalplayer").style.display = "block";
  document.getElementById("pleasewait").style.display = "block";
  document.getElementById("waittext").innerText = "Please wait for the host to start the game.";
  document.getElementById("whiteboxesparent").style.display = "none";
  document.getElementById("Game").style.display = "none";
  document.getElementById("endofgame").style.display = "none";
  }
  firebase.database().ref('Games/' + newgameid + '/scores/' + username).set({
    score: 0,
  });
}


window.addEventListener("resize", function() {
  if(window.matchMedia("(max-width: 1500px)").matches) {
    document.getElementById("body").style.overflowY = "auto";
  }else {
    document.getElementById("body").style.overflowY = "hidden";
    window.scrollTo(0,0); 
  }
  if(window.matchMedia("(min-width: 400px)").matches) {
    document.getElementById("screentosmall").style.display = "none";
  } else {
    document.getElementById("screentosmall").style.display = "block";
  }
  if(window.matchMedia("(min-width: 1000px)").matches) {
    if(document.getElementById("whiteboxes").style.display == "grid"){
      document.getElementById("whiteboxes").style.display = "block";
    }
  }
  if(window.matchMedia("(max-width: 1000px)").matches) {
    if(document.getElementById("whiteboxes").style.display == "block"){
      document.getElementById("whiteboxes").style.display = "grid";
    }
  }
})

function sendalert(value){
  document.getElementById("warning").style.display = "block";
  document.getElementById("warningtext").innerText = value;
  sleep(3000).then(() => {
    document.getElementById("warning").style.display = "none";
  });
}

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}


function back(){
  document.getElementById("inputmodal").style.display = "none";
  document.getElementById("homepage").style.display = "block";
}


//------------------------------------------------------------------------------------------

