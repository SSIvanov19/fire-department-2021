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
    document.getElementById("registerCar").style.display = "block";
} else {
    document.getElementById("deleteAll").style.display = "none";
    document.getElementById("registerEmployee").style.display = "none";
    document.getElementById("registerCar").style.display = "none";
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
            let employeeForm = document.forms.registerEmployee;

            let employeeOutput = am.registerUser(
                employeeForm.elements.fname.value,
                employeeForm.elements.lname.value,
                employeeForm.elements.email.value,
                employeeForm.elements.pass.value,
                employeeForm.elements.role.value,
                "Burgas"
            );

            switch (employeeOutput) {
                case 0:
                    document.getElementById("employeeError").innerHTML = "User created successfully!";
                    break;
                case 1:
                    document.getElementById("employeeError").innerHTML = "!First name should start with capital letter!";
                    break;
                case 2:
                    document.getElementById("employeeError").innerHTML = "!Last name should start with capital letter!";
                    break;
                case 3:
                    document.getElementById("employeeError").innerHTML = "!Password must be at least 8 characters!";
                    break;
                case 4:
                    document.getElementById("employeeError").innerHTML = "!There is already a user with this email address!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }
            break;
        case 5:
            let carForm = document.forms.registerCar;

            let carOutput = am.registerCar(
                carForm.elements.model.value,
                carForm.elements.registration.value,
                carForm.elements.seats.value,
                "Burgas"
            );

            switch (carOutput) {
                case 0:
                    document.getElementById("carError").innerHTML = "Car registered successfully!";
                    break;
                case 1:
                    document.getElementById("carError").innerHTML = "Number of seat must be positive number!";
                    break;
                case 2:
                    document.getElementById("carError").innerHTML = "There is alredy a car with this registation plate";
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