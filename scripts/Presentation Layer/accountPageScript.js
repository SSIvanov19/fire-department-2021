if (localStorage.isUserEnter) {
    let activeUser = JSON.parse(localStorage.getItem("activeUser"));
    document.getElementById("fname").innerHTML = "First Name: " + activeUser.fname;
    document.getElementById("lname").innerHTML = "Last Name: " + activeUser.lname;
} else {
    window.location.href = "../index.html";
}

if (localStorage.activeUser) {
    document.getElementById("userLogin").style.display = "inline";
    document.getElementById("userNotLogin").style.display = "none";
} else {
    document.getElementById("userLogin").style.display = "none";
    document.getElementById("userNotLogin").style.display = "inline";
}

function getInput(input) {
    let am = new AccountManager(localStorage);

    switch (input) {
        case 1:
            am.logOut();
            window.location.href = "../index.html";
            break;
        case 2:
            am.deleteAccount();
            window.location.href = "../index.html";
            break;
        case 3:
            am.deleteAllAccount();
            window.location.href = "../index.html";
            break;
        default:
            console.log("A wild error ");
            break;
    }
}