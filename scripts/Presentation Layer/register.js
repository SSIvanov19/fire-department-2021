window.onload = () => {
  let am = new AccountManager(localStorage);
  let isTrue = (am.checkForEnterUser() == 'true');

  if (isTrue) {
    window.location.href = "../pages/account.html";
  }
}

/**
 * Function that gets the input 
 * and send it to the backend.
 * @function getInputRegister
 */
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
      document.getElementById("error").innerHTML = "Първото име трябва да започва с главна буква!";
      break;
    case 2:
      document.getElementById("error").innerHTML = "Фамилното име трябва да започва с главна буква!";
      break;
    case 3:
      document.getElementById("error").innerHTML = "Паролата трябва да е най-малко 8 символа!";
      break;
    case 4:
      document.getElementById("error").innerHTML = "Вече има регестриран потребител с такъв e-mail!";
      break;
    case 5:
      document.getElementById("error").innerHTML = "Въведеният e-mail е невалиден!";
      break;
    default:
      console.log("A wild error appeared");
      break;
  }
}
