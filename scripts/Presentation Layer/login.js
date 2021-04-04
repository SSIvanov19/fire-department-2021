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
    let email = document.getElementById("email").value;
    let pass = document.getElementById("pass").value;

    let am = new AccountManager(localStorage);

    if (am.login(email, pass)) {
        window.location.href = "../pages/account.html";
    } else {
        document.getElementById("error").innerHTML = "!User or password not found!";
    }
}
