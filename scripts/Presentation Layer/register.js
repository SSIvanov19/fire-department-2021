if (localStorage.activeUser) {
  window.location.href = "../pages/account.html";
}

function getInput() {
  //Get input from user
  let fname = document.getElementById("fname").value;
  let lname = document.getElementById("lname").value;
  let email = document.getElementById("email").value;
  let pass = document.getElementById("pass").value;

  let am = new AccountManager(localStorage);

  let output = am.registerUser(fname, lname, email, pass, 0, "Burgas");

  switch (output) {
    case 0:
      window.location.href = "../pages/login.html";
      break;
    case 1:
      document.getElementById("error").innerHTML = "!First name should start with capital letter!";
      break;
    case 2:
      document.getElementById("error").innerHTML = "!Last name should start with capital letter!";
      break;
    case 3:
      document.getElementById("error").innerHTML = "!Password must be at least 8 characters!";
      break;
    case 4:
      document.getElementById("error").innerHTML = "!There is already a user with this email address!";
      break;
    default:
      console.log("A wild error appeared");
      break;
  }
}
