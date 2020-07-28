function goSomewhere(x){
  location = x;
}
function displaychatforever(x){
  setInterval(function(){displaychat(x)},1)
}
function displaychat(x){
  if(localStorage.getItem("userToken")){
    db.collection('ChatRooms')
    .doc(x)
    .get()
    .then(function (snapshot){
      var i = 0;
      document.getElementById("displaychat").innerHTML = "";
      while(i <= snapshot.data().chat.length-1){
        var pre = document.createElement('pre');
        pre.innerHTML = snapshot.data().people[i]+": "+snapshot.data().chat[i]
        pre.style['fontSize'] = "17px";
        var hr = document.createElement('hr');
        hr.style["width"] = "100%";
        var chat = document.getElementById("displaychat")
        chat.appendChild(pre);
        chat.appendChild(hr);
        i++
      }
    })
  }
}
function messagechat(x){
  var userToken = localStorage.getItem("userToken");
  var message = document.getElementById('messagechat').value;
  var person = localStorage.getItem("person");
  console.log(person)
  var userToken = localStorage.getItem("userToken");
  document.getElementById("statuscheck").innerText = "Sending...";
  db.collection('ChatRooms')
  .doc(x)
  .get()
  .then(function (snapshot){
    var allmessages = snapshot.data().chat
    allmessages.push(message);
    var allpeople = snapshot.data().people
    allpeople.push(person);
    db.collection('ChatRooms')
    .doc(x)
    .update({
      chat: allmessages,
      people: allpeople
    })
    .then(function (snapshot){
      document.getElementById("statuscheck").innerText = "Sent!";
      document.getElementById("messagechat").value = "";
      setTimeout(function(){document.getElementById("statuscheck").innerText = ""}, 3000);
    })
  })

}
function signup(){
  var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;
      var displayname = document.getElementById('displayname').value;
  db.collection('Users')
  .where("username","==",username)
  .get()
  .then(function (snapshot){
    if(snapshot.empty){
      var everything = {
        username: username,
        password: password,
        displayname: displayname,
        avatar: "https://avatars.dicebear.com/api/bottts/"+Math.random().toString(36).slice(2)+".svg"
      }
      db.collection('Users')
      .add(everything)
      .then(function (snapshot){
        db.collection('Users')
        .where("username","==",username)
        .get()
        .then(function (snapshot){
          localStorage.setItem("userToken",snapshot.docs[0].id);
          localStorage.setItem("person",snapshot.docs[0].data().displayname);
          location = "chat/general.html"
        })
      })
    }else{
      alert("That Username Already Exists")
    }
    })
  }
  function login(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    db.collection('Users')
    .where("username","==",username)
    .get()
    .then(function (snapshot){
      if(snapshot.empty){
        alert("That User Doesn't Exist");
      }else{
        localStorage.setItem("person",snapshot.docs[0].data().displayname);
        localStorage.setItem("userToken",snapshot.docs[0].id);
        location = "chat/general.html"
      }
    })
  }