if (localStorage.activeUser) {
  window.location.href = "../pages/account.html";
}

if (localStorage.activeUser) {
  document.getElementById("userLogin").style.display = "inline";
  document.getElementById("userNotLogin").style.display = "none";
} else {
  document.getElementById("userLogin").style.display = "none";
  document.getElementById("userNotLogin").style.display = "inline";
}

function getInput() {
  //Get input from user
  let fname = document.getElementById("fname").value;
  let lname = document.getElementById("lname").value;
  let email = document.getElementById("email").value;
  let pass = document.getElementById("pass").value;

  let am = new AccountManager(localStorage);

  let output = am.register(fname, lname, email, pass);

  if (output == 0) {
    window.location.href = "../pages/login.html";
    return 0;
  } else if (output == 1) {
    document.getElementById("error").innerHTML = "!First name should start with capital letter!";
    //return 1;
  } else if (output == 2) {
    document.getElementById("error").innerHTML = "!Last name should start with capital letter!";
    //return 2;
  } else if (output == 3) {
    document.getElementById("error").innerHTML = "!Password must be at least 8 characters!";
    //return 0;
  } else if (output == 4) {
    document.getElementById("error").innerHTML = "!There is already a user with this email address!";
    //return 0;
  }else {
    console.log("A wild error appeared");
    //return 0;
  }
}
