var users = JSON.parse(localStorage.getItem("user")) ||
  [{
    fName: "ali",
    lName: "raza",
    email: "ali@gmail.com",
    password: "123456",
    dpPath: "./img/person.jpg"
  },
  {
    fName: "haris",
    lName: "rauf",
    email: "haris@gmail.com",
    password: "abcdef",
    dpPath: "./img/person.jpg"
  }]

users.forEach(function (obj) {
  obj.fName = obj.fName.toUpperCase();
});

function alertFunction(alertText) {
  var x = document.getElementById("snackbar");
  x.className = "show";
  x.innerText = alertText;
  setTimeout(function () { x.className = x.className.replace("show", ""); }, 2000);
}

function scrollToBottom() {
  inboxContainer.scrollTop = inboxContainer.scrollHeight;
}

function loader(toDisplay) {
  document.querySelector(".loaderContainer").style.display = "block"
  setTimeout(function () {
    document.querySelector(".loaderContainer").style.display = "none";
    document.querySelector(toDisplay).style.display = "block"
  }, 1500);
};



window.onload = loader(".signUpForm");

var signUpForm = document.querySelector(".signUpForm");
var loginForm = document.querySelector(".loginForm");
var usersNavContainer = document.querySelector(".usersNavContainer");
var usersContainer = document.querySelector(".usersContainer");
var inboxContainer = document.querySelector(".msgInbox");
var messengerContainer = document.querySelector(".messengerContainer");
var imageInput = document.querySelector(".imageInput");
var closeNavBtn = document.querySelector(".closeNavbtn");
var userDp = document.querySelector(".userDp");
var currentUser = false;
var userToChat;

signUpForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var signUpData = new FormData(event.target);
  var testFName = signUpData.get("fName")
  var testLName = signUpData.get("lName")
  var testEmail = signUpData.get("email")
  var testPassword = signUpData.get("password")
  var testGender = signUpData.get("gender")
  var testDOB = signUpData.get("DOB")
  var elegibleToEnter = true;
  for (var i = 0; i < users.length; i++) {
    if (testEmail === users[i].email || testPassword == users[i].password) {
      elegibleToEnter = false;
      alertFunction("Email or password already exist");
    }
  };
  if (elegibleToEnter) {
    if (testEmail === "" || testPassword === "" || testFName === "" || testLName === "" || testGender === "" || testDOB === "") {
      alertFunction("all inputs should be filled")
    }
    else if (testPassword.length < 6) {
      alertFunction("password minimum contain 6 characters ")
    }
    else {
      users.push({
        fName: testFName,
        lName: testLName,
        email: testEmail,
        password: testPassword,
        dpPath: "./img/person.jpg"
      })
      currentUser = users[users.length - 1];
      localStorage.setItem("user", JSON.stringify(users));
      signUpForm.style.display = "none";
      loader(".usersNavContainer");
      toPrintInfo()
      for (var j = 0; j < users.length; j++) {
        if (users[j].email !== currentUser.email) {
          var userToChat = document.createElement("div");
          userToChat.classList.add("userToChat");
          usersContainer.appendChild(userToChat);
          userToChat.innerHTML = users[j].fName;
        }
      }
    }
  }
})

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  var loginData = new FormData(event.target);
  var userFound = false;
  for (var k = 0; k < users.length; k++) {
    if (loginData.get("email") === users[k].email && loginData.get("password") === users[k].password) {
      userFound = true;
      currentUser = users[k];
    }
  }
  if (userFound) {
    loginForm.style.display = "none";
    loader(".usersNavContainer");
    toPrintInfo()
    for (var j = 0; j < users.length; j++) {
      if (users[j].email !== currentUser.email) {
        userToChat = document.createElement("div");
        userToChat.classList.add("userToChat");
        usersContainer.appendChild(userToChat);
        userToChat.innerHTML = users[j].fName;
      }
    }
  }
  else {
    alertFunction("Email or password incorrect!")
  }
})

function toPrintInfo() {
  document.querySelector(".userName").innerHTML = `${currentUser.fName} ${currentUser.lName}`;
  document.querySelector(".userEmail").innerHTML = currentUser.email;
  userDp.style.backgroundImage = `url(${currentUser.dpPath})`;
  usersContainer.innerHTML = "";
}

document.querySelector(".loginLink").addEventListener("click", function () {
  signUpForm.style.display = "none";
  loginForm.style.display = "block";
})

document.querySelector(".signUpLink").addEventListener("click", function () {
  signUpForm.style.display = "block";
  loginForm.style.display = "none ";
})

function openNav() {
  document.querySelector(".sidebar").style.width = "280px";

}

function closeNav() {
  document.querySelector(".sidebar").style.width = "0";
}

document.querySelector(".changeDpIcon").addEventListener("click", function () {
  var dpInput = document.querySelector(".dpSelectFile");
  dpInput.click();
  dpInput.addEventListener("change", function () {
    var changeDpPath = dpInput.files[0];
    if (changeDpPath) {
      var changeDpPath = URL.createObjectURL(changeDpPath);
      userDp.style.backgroundImage = `url(${changeDpPath})`;
    }
  })
})

document.querySelector(".logoutBtn").addEventListener("click", function () {
  loader(".loginForm");
  usersNavContainer.style.display = "none";
  currentUser = false
  closeNavBtn.click()
})

document.querySelector(".signoutBtn").addEventListener("click", function () {
  if (confirm("you really want to delete account?")) {
    var currentUserIndex = users.findIndex(function (user) {
      return user.email === currentUser.email;
    });
    users.splice(currentUserIndex, 1);
    localStorage.setItem("user", JSON.stringify(users));
    usersNavContainer.style.display = "none";
    loader(".signUpForm");
  }
})

document.querySelector("#backIcon").addEventListener("click", function () {
  messengerContainer.style.display = "none";
  loader(".usersNavContainer");
})

usersContainer.addEventListener("click", function (event) {
  if (event.target.className === "userToChat") {
    loader(".messengerContainer");
    usersNavContainer.style.display = "none";
    messengerContainer.querySelector(".recieverName").innerText = event.target.textContent;
  }
})

document.querySelector(".imageSelectBtn").addEventListener("click", function () {
  imageInput.click();
})

document.querySelector(".sndBtn").addEventListener("click", function () {
  var imageToSend = imageInput.files[0]
  if (imageToSend) {
    var imageUrl = URL.createObjectURL(imageToSend);
    var sendedMsg = document.createElement("div");
    sendedMsg.classList.add("sendedMsg");
    sendedMsg.innerHTML = `<img src=${imageUrl} alt='image'>`;
    document.querySelector(".msgInbox").appendChild(sendedMsg);
    scrollToBottom();
    alertFunction("Image has been sent");
    imageInput.value = "";
  }
  else {
    var msgToSend = document.querySelector(".msgField").value;
    if (msgToSend === "") {
      alertFunction("please fill some text!");
    }
    else {
      var sendedMsg = document.createElement("div");
      sendedMsg.classList.add("sendedMsg");
      sendedMsg.textContent = msgToSend;
      var monthsName = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
      var getTime = new Date;
      var hour = getTime.getHours();
      var minute = getTime.getMinutes();
      var month = monthsName[getTime.getMonth()];
      var date = getTime.getDate();
      var msgSndTime = `${date} ${month}, ${hour}:${minute}`;
      var msgSndTimeContainer = document.createElement("p");
      msgSndTimeContainer.classList.add("msgSndTime");
      msgSndTimeContainer.innerText = msgSndTime;
      inboxContainer.appendChild(sendedMsg);
      sendedMsg.appendChild(msgSndTimeContainer);
      scrollToBottom()
      alertFunction("message has been sent");
      document.querySelector(".msgField").value = "";
    }
  }
})