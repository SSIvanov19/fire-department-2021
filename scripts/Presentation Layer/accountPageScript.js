let activeUser = JSON.parse(localStorage.getItem("activeUser"));
if (localStorage.isUserEnter) {
    document.getElementById("fname").innerHTML = "First Name: " + activeUser.fname;
    document.getElementById("lname").innerHTML = "Last Name: " + activeUser.lname;
    document.getElementById("role").innerHTML = "Role: " + activeUser.role;
    document.getElementById("region").innerHTML = "Region: " + activeUser.region;
} else {
    window.location.href = "../index.html";
}

if (activeUser.role == 3) {
    document.getElementById("deleteAll").style.display = "inline";
    document.getElementById("registerEmployee").style.display = "block";
} else {
    document.getElementById("deleteAll").style.display = "none";
    document.getElementById("registerEmployee").style.display = "none";
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
        case 4:
            let form = document.forms.register;

            let output = am.registerUser(form.elements.fname.value,
                form.elements.lname.value,
                form.elements.email.value,
                form.elements.pass.value,
                form.elements.role.value,
                "Burgas"
            );

            switch (output) {
                case 0:
                    document.getElementById("error").innerHTML = "User created successfully!";
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
            break;
        default:
            console.log("A wild error appeared");
            break;
    }
}