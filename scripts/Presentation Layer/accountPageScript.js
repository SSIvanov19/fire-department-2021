let activeUser = JSON.parse(localStorage.getItem("activeUser"));
let carSel = document.getElementById("car");
let sigSel = document.getElementById("signals");
let isSignalShown = false;

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
    document.getElementById("registerTeam").style.display = "block";
} else {
    document.getElementById("deleteAll").style.display = "none";
    document.getElementById("registerEmployee").style.display = "none";
    document.getElementById("registerCar").style.display = "none";
    document.getElementById("registerTeam").style.display = "none";
}

function forEachCar() {
    let am = new AccountManager(localStorage);
    let cars = am.getCars();

    for (i = carSel.length - 1; i >= 0; i--) {
        carSel.remove(i);
    }

    carSel.options[0] = new Option("Select Car", "");

    if (cars != null) {
        cars.forEach(element => {
            carSel.options[carSel.options.length] = new Option(element.model + " " + element.registrationPlate, element.numberOfSeats);
        });
    }
}

function forEachSignal() {
    let am = new AccountManager(localStorage);
    let signals = am.getSignals();

    for (i = sigSel.length - 1; i >= 0; i--) {
        sigSel.remove(i);
    }

    sigSel.options[0] = new Option("Select signal", "");

    console.log(signals);

    if (signals != null) {
        signals.forEach((element, index) => {
            sigSel.options[sigSel.options.length] = new Option(element.title, index);
        });
    }
}

function initMap(coordinatesX, coordinatesY) {
    document.getElementById("map").innerHTML = "";
    var map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [
                        new ol.Feature({
                            geometry: new ol.geom.Point([coordinatesX, coordinatesY])
                        })
                    ]
                }),
                name: 'Marker'
            })
        ],
        view: new ol.View({
            center: [coordinatesX, coordinatesY],
            zoom: 12
        })
    });
}

window.onload = () => {
    forEachCar();
    forEachSignal();

    document.getElementById("holiday").setAttribute("data-min-date", new Date().toString());
    document.getElementById("sick").setAttribute("data-min-date", new Date().toString());
    document.getElementById("trip").setAttribute("data-min-date", new Date().toString());
    document.getElementById("displaySignal").style.display = "none";

    // Initialize all input of type date
    var calendars = bulmaCalendar.attach('[type="date"]')
}

carSel.onchange = () => {
    let am = new AccountManager(localStorage);
    let form = document.forms.registerTeam;
    let parentDiv = document.getElementById("teamMembers");
    parentDiv.innerHTML = ""
    let firefightersArray = am.getFirefighters();

    for (let i = 1; i <= form.elements.car.value; i++) {
        let newSelect = document.createElement("Select");
        let newLabel = document.createElement("Label");

        newSelect.setAttribute("name", i);
        newSelect.setAttribute("id", i);
        newLabel.setAttribute("for", i);

        newLabel.innerHTML = "Firefighter " + i + ":";

        parentDiv.appendChild(newLabel);
        parentDiv.appendChild(document.createElement("br"));
        parentDiv.appendChild(newSelect);
        parentDiv.appendChild(document.createElement("br"));

        newSelect.options[0] = new Option("Select a firefighter");

        firefightersArray.forEach(element => {
            newSelect.options[newSelect.options.length] = new Option(element.fname + " " + element.lname + " " + element.email, element.id);
        });
    }
}

sigSel.onchange = () => {
    let index = document.forms.signal.elements.signals.value;
    let am = new AccountManager(localStorage);
    let parentDiv = document.getElementById("displaySignal");
    let titleP = document.getElementById("title");
    let namesP = document.getElementById("names");
    let typeP = document.getElementById("type");
    let desP = document.getElementById("des");

    let signals = am.getSignals();

    if (signals[index] != undefined) {
        initMap(signals[index].coordinatesX, signals[index].coordinatesY);
    }

    if (isSignalShown) {
        parentDiv.style.display = "none";
        isSignalShown = false;
    } else {
        parentDiv.style.display = "block";
        isSignalShown = true;
    }

    if (signals[index] != undefined) {
        titleP.innerHTML = "Title: " + signals[index].title;
        namesP.innerHTML = "Name: " + signals[index].names;
        typeP.innerHTML = "Type: " + signals[index].type;
        desP.innerHTML = "Short description: " + signals[index].description;
    }


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
                    location.reload();
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
                    forEachCar();
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
        case 6: {
            let teamForm = document.forms.registerTeam;
            let checkboxes = document.querySelectorAll(`input[name=days]:checked`);
            let firefightersArray = [];
            let shifts = [];

            for (let i = 1; i <= teamForm.elements.car.value; i++) {
                firefightersArray.push(teamForm.elements[i].value)
            }

            checkboxes.forEach((elements) => {
                shifts.push(elements.value);
            });

            let teamOutput = am.registerTeam(
                firefightersArray,
                teamForm.elements.car.value,
                teamForm.elements.startTime.value,
                teamForm.elements.endTime.value,
                shifts,
                teamForm.elements.holiday.value,
                teamForm.elements.sick.value,
                teamForm.elements.trip
            );

            switch (teamOutput) {
                case 0:
                    document.getElementById("teamError").innerHTML = "Team registered successfully!";
                    break;
                case 1:
                    document.getElementById("teamError").innerHTML = "There are more than one person in the samo position!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }

            break;
        }
        default:
            console.log("A wild error appeared");
            break;
    }
}