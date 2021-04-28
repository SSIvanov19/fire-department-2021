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
  let am = new AccountManager(localStorage);

  //Get input from user
  let fname = am.escapeHtml(document.getElementById("fname").value);
  let lname = am.escapeHtml(document.getElementById("lname").value);
  let email = am.escapeHtml(document.getElementById("email").value);
  let pass = am.escapeHtml(document.getElementById("pass").value);

  let output = am.registerUser(fname, lname, email, pass, 0, "Бургас");

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
