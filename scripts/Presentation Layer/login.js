if (localStorage.activeUser) {
    window.location.href = "../pages/account.html";
}

function getInput() {
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;

    let am = new AccountManager(localStorage);

    if (am.login(email, pass)) {
        window.location.href = "../pages/account.html";
    } else {
        document.getElementById("error").innerHTML = "!User or password not found!";
    }
}
