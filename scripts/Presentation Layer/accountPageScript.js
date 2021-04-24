let am = new AccountManager(localStorage);
let activeUser = am.getActiveUser();
let carSel = document.getElementById("car");
let sigSel = document.getElementById("signals");
let sigPendingSel = document.getElementById("signalsPending");
let sigAccSel = document.getElementById("signalsAccepted");
let sigClosedSel = document.getElementById("signalsClosed");
let teamSel = document.getElementById("teams");
let teamPenSel = document.getElementById("teamsPendingSignal");
let teamSigSel = document.getElementById("signalTeam");

window.onload = () => {
    let isEnter = (am.checkForEnterUser() == 'true');

    if (isEnter) {
        document.getElementById("fname").innerHTML = "Име: " + activeUser.fname;
        document.getElementById("lname").innerHTML = "Фамилия: " + activeUser.lname;
        document.getElementById("role").innerHTML = "Роля: " + activeUser.role;
        document.getElementById("region").innerHTML = "Регион: " + activeUser.region;

        //If user is firefighter
        if (activeUser.role == 1) {
            initFirefighter();
            document.getElementById("firefighter-stats").style.display = 'block';
            document.getElementById("firefighterTeamManagment").style.display = "block";
        } else {
            document.getElementById("firefighter-stats").style.display = 'none';
            document.getElementById("firefighterTeamManagment").style.display = "none";
        }

        //If user is dispatcher
        if (activeUser.role == 2) {
            document.getElementById("signalDiv").style.display = "block";

            getNames();
            initMapForSignal();

            if (am.getSignals() != null) {
                forEachOption(sigSel, am.getSignalsWithoutTeamSelected(), "Изберете сигнал");
                forEachOption(sigPendingSel, am.getSignalsWithTeamSelected(), "Изберете сигнал");
                forEachOption(sigAccSel, am.getAcceptedSignals(), "Изберете сигнал");
                forEachOption(sigClosedSel, am.getClosedSignals(), "Изберете сигнал");
            }

            let sels = [teamSel, teamPenSel, teamSigSel];

            for (const sel of sels) {
                forEachOption(sel, am.getTeamsForSignals(), "Изберете отбор");
            }

            let ids = ["displaySignal", "displayPendingSignal", "displayAcceptedSignal", "displayClosedSignal"];

            for (const id of ids) {
                document.getElementById(id).style.display = "none";
            }
        } else {
            document.getElementById("signalDiv").style.display = "none";
        }

        let ids = ["registerEmployee", "registerCar", "registerTeam"];

        //If user is admin
        if (activeUser.role == 3) {
            document.getElementById("deleteAll").style.display = "inline";
            document.getElementById("deleteAcc").style.display = "none";
            for (const id of ids) {
                document.getElementById(id).style.display = "block";
            }
            forEachCar(carSel);
        } else {
            document.getElementById("deleteAll").style.display = "none";
            document.getElementById("deleteAcc").style.display = "inline";
            for (const id of ids) {
                document.getElementById(id).style.display = "none";
            }
        }
    } else {
        window.location.href = "../index.html";
    }

    // Initialize all input of type date
    var calendars = bulmaCalendar.attach('[type="date"]', {
        dateFormat: 'DD/MM/YYYY',
        lang: 'bg',
        minDate: new Date(),
        weekStart: 1
    })
}

function initFirefighter() {
    if (activeUser.team == undefined || activeUser.team == null) {
        document.getElementById("team").innerHTML = "Отбор: няма";
        document.getElementById("signalP").innerHTML = "Сигнали: няма";
    } else {
        document.getElementById("team").innerHTML = "Отбор: " + activeUser.team;

        let team = am.getTeamWithId(activeUser.team);
        let car = am.getCarWithId(team.car);

        document.getElementById("teamCar").innerHTML = "Кола: " + car.model + " " + car.registrationPlate;

        let memberInTeamP = document.getElementById("membersInTeam");
        memberInTeamP.innerHTML = "Съотборници:";

        let iterations = team.employees.length;

        for (const member of team.employees) {
            let user = am.getUserWithId(member);

            if (!--iterations) {
                memberInTeamP.innerHTML += " " + user.fname + " " + user.lname;
            } else {
                memberInTeamP.innerHTML += " " + user.fname + " " + user.lname + ",";
            }
        }

        document.getElementById("startOfDay").innerHTML = "Начало на смяната: " + team.starOfWorkingDay;
        document.getElementById("endOfDay").innerHTML = "Край на смяната: " + team.endOfWorkingDay;

        let workingDaysP = document.getElementById("workingDays");
        workingDaysP.innerHTML = "Работни дни:";

        for (let i = 1; i <= 7; i++) {
            if (team.shifts.includes(i.toString())) {
                switch (i) {
                    case 1:
                        workingDaysP.innerHTML += " Понеделник";
                        break;
                    case 2:
                        workingDaysP.innerHTML += " Вторник";
                        break;
                    case 3:
                        workingDaysP.innerHTML += " Сряда";
                        break;
                    case 4:
                        workingDaysP.innerHTML += " Четвъртък";
                        break;
                    case 5:
                        workingDaysP.innerHTML += " Петък";
                        break;
                    case 6:
                        workingDaysP.innerHTML += " Събота";
                        break;
                    case 6:
                        workingDaysP.innerHTML += " Неделя";
                        break;
                }
            }
        }

        document.getElementById("holidayP").innerHTML = "Почивни дни: " + team.holidays;
        document.getElementById("sickLeaveP").innerHTML = "Sick Leaves: " + team.sickLeaves;
        document.getElementById("BusinessTripP").innerHTML = "Командировка: " + team.businessTrips;

        if (team.signal != null) {
            signal = am.getSignalsWithId(team.signal)

            document.getElementById("signalP").innerHTML = "Сигнал: " + signal.id;
            document.getElementById("signalNameP").innerHTML = "Заглавие: " + signal.title;
            document.getElementById("signalTypeP").innerHTML = "Тип: " + signal.type;
            document.getElementById("signalDesP").innerHTML = "Описание: " + signal.description;
            initMap(signal.coordinatesX, signal.coordinatesY, "fireMapSignal");

            if (signal.isClosed) {
                document.getElementById("startWorkingButton").style.display = "none";
                document.getElementById("endWorkingButton").style.display = "none";
            } else {
                if (signal.start == null) {
                    document.getElementById("startWorkingButton").style.display = "block";
                    document.getElementById("endWorkingButton").style.display = "none";
                } else {
                    document.getElementById("startWorkingButton").style.display = "none";
                    document.getElementById("endWorkingButton").style.display = "block";
                }
            }
        } else {
            document.getElementById("signalP").innerHTML = "Сигнал: няма";
            document.getElementById("signalWorkButtons").style.display = "none";
        }
    }
}

function forEachCar(selectElement) {
    let cars = am.getCars();

    for (i = selectElement.length - 1; i >= 0; i--) {
        selectElement.remove(i);
    }

    selectElement.options[0] = new Option("Изберете кола", "");

    if (cars != null) {
        cars.forEach(element => {
            if (element.inTeam == false) {
                selectElement.options[selectElement.options.length] = new Option(element.model + " " + element.registrationPlate, element.numberOfSeats + " " + element.id);
            }
        });
    }
}

function forEachOption(optionSelect, func, firstOption) {
    let options = func;

    for (i = optionSelect.length - 1; i >= 0; i--) {
        optionSelect.remove(i);
    }

    optionSelect.options[0] = new Option(firstOption, "");

    if (options != null) {
        options.forEach(element => {
            optionSelect.options[optionSelect.options.length] = new Option(element.title ?? element.id, element.id);
        });
    }
}

/**
 * Function to get the names
 * of the user, which is entered
 */
function getNames() {
    document.getElementById("Signalnames").value = activeUser.fname + " " + activeUser.lname;
}

function initMapForSignal() {
    let map = new ol.Map({
        target: 'mapSignal',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([27.461014, 42.510578]),
            zoom: 12
        })
    });

    map.on('click', (m) => {
        map.getLayers().getArray()
            .filter(layer => layer.get('name') === 'Marker')
            .forEach(layer => map.removeLayer(layer));

        let layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [
                    new ol.Feature({
                        geometry: new ol.geom.Point([m.coordinate[0], m.coordinate[1]])
                    })
                ]
            }),
            name: 'Marker'
        });
        map.addLayer(layer);

        coordinatesX = m.coordinate[0];
        coordinatesY = m.coordinate[1];
    });
}

function initMap(coordinatesX, coordinatesY, id) {
    document.getElementById(id).innerHTML = "";
    let map = new ol.Map({
        target: id,
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

    setTimeout(function () { map.updateSize(); }, 200);
}


function updateCarSel() {
    let form = document.forms.registerTeam;
    let parentDiv = document.getElementById("teamMembers");
    parentDiv.innerHTML = ""
    let firefightersArray = am.getFirefighters();

    for (let i = 1; i <= form.elements.car.value.split(" ")[0]; i++) {
        let newSelect = document.createElement("Select");
        let newLabel = document.createElement("Label");

        newSelect.setAttribute("name", i);
        newSelect.setAttribute("id", i);
        newLabel.setAttribute("for", i);

        newLabel.innerHTML = "Пожарникар " + i + ":";

        parentDiv.appendChild(newLabel);
        parentDiv.appendChild(document.createElement("br"));
        parentDiv.appendChild(newSelect);
        parentDiv.appendChild(document.createElement("br"));

        newSelect.options[0] = new Option("Изберете пожарникар", "");

        if (firefightersArray == 0) {
            continue;
        }

        for (const firefighter of firefightersArray) {
            if (firefighter.team == null) {
                newSelect.options[newSelect.options.length] = new Option(firefighter.fname + " " + firefighter.lname + " " + firefighter.email, firefighter.id);
            }
        }
    }
}

function chengeParentDivDisplay(parentDiv, id) {
    if (id == "") {
        parentDiv.style.display = "none";
    } else {
        parentDiv.style.display = "block";
    }
}

carSel.onchange = updateCarSel;

sigSel.onchange = () => {
    let id = document.forms.signalForm.elements.signals.value;
    let parentDiv = document.getElementById("displaySignal");
    let titleP = document.getElementById("title");
    let namesP = document.getElementById("names");
    let typeP = document.getElementById("type");
    let desP = document.getElementById("des");

    let signal = am.getSignalsWithId(id);

    if (signal != undefined) {
        initMap(signal.coordinatesX, signal.coordinatesY, "map");
    }

    chengeParentDivDisplay(parentDiv, id);

    if (signal != undefined) {
        titleP.innerHTML = "Заглавие: " + signal.title;
        namesP.innerHTML = "Име: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
    }
}

sigPendingSel.onchange = () => {
    let id = document.forms.signalPendingForm.elements.signalsPending.value;
    let parentDiv = document.getElementById("displayPendingSignal");
    let titleP = document.getElementById("titlePendingSignal");
    let teamP = document.getElementById("teamPendingSignal");
    let namesP = document.getElementById("namesPendingSignal");
    let typeP = document.getElementById("typePendingSignal");
    let desP = document.getElementById("desPendingSignals");

    let signal = am.getSignalsWithId(id);

    if (signal != undefined) {
        initMap(signal.coordinatesX, signal.coordinatesY, "mapPendingSignal");
    }

    chengeParentDivDisplay(parentDiv, id);

    if (signal != undefined) {
        titleP.innerHTML = "Заглавие: " + signal.title;
        teamP.innerHTML = "Отбор: " + signal.team;
        namesP.innerHTML = "Име: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
    }
}

sigAccSel.onchange = () => {
    let id = document.forms.signalAcceptedForm.elements.signals.value;

    let parentDiv = document.getElementById("displayAcceptedSignal");
    let titleP = document.getElementById("titleAcceptedSignal");
    let teamP = document.getElementById("teamAcceptedSignal");
    let namesP = document.getElementById("namesAcceptedSignal");
    let typeP = document.getElementById("typeAcceptedSignal");
    let desP = document.getElementById("desAcceptedSignals");
    let startP = document.getElementById("startOfWorkingAccSig");

    let signal = am.getSignalsWithId(id);

    if (signal != undefined) {
        initMap(signal.coordinatesX, signal.coordinatesY, "mapAcceptedSignal");
    }

    chengeParentDivDisplay(parentDiv, id);

    let startDate = new Date(signal.start);

    if (signal != undefined) {
        titleP.innerHTML = "Заглавие: " + signal.title;
        teamP.innerHTML = "Отбор: " + signal.team;
        namesP.innerHTML = "Име: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
        startP.innerHTML = "Начало на смяната: " + startDate.getHours() + ":" + startDate.getMinutes();
    }
}

sigClosedSel.onchange = () => {
    let id = document.forms.signalClosedForm.elements.signals.value;

    let parentDiv = document.getElementById("displayClosedSignal");
    let titleP = document.getElementById("titleClosedP");
    let namesP = document.getElementById("namesClosedP");
    let typeP = document.getElementById("typeClosedP");
    let desP = document.getElementById("desClosedP");
    let startP = document.getElementById("startOfWorkingClosedP");
    let endP = document.getElementById("endOfWorkingClosedP");
    let timeP = document.getElementById("timeTakenP");

    let signal = am.getSignalsWithId(id);

    if (signal != undefined) {
        initMap(signal.coordinatesX, signal.coordinatesY, "mapClosedMap");
    }

    chengeParentDivDisplay(parentDiv, id);

    let startDate = new Date(signal.start);
    let endDate = new Date(signal.end);

    if (signal != undefined) {
        titleP.innerHTML = "Заглавие: " + signal.title;
        namesP.innerHTML = "Име: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
        startP.innerHTML = "Начало на смяната: " + startDate.getHours() + ":" + startDate.getMinutes();
        endP.innerHTML = "Край на смяната: " + endDate.getHours() + ":" + endDate.getMinutes();
        timeP.innerHTML = "Времетраене: " + signal.timeToComplete;
    }
}

function getInput(input, form = null) {
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
                "Бургас"
            );

            switch (employeeOutput) {
                case 0:
                    updateCarSel();
                    document.getElementById("employeeError").innerHTML = "User created successfully!";
                    break;
                case 1:
                    document.getElementById("employeeError").innerHTML = "First name should start with capital letter!";
                    break;
                case 2:
                    document.getElementById("employeeError").innerHTML = "Last name should start with capital letter!";
                    break;
                case 3:
                    document.getElementById("employeeError").innerHTML = "Password must be at least 8 characters!";
                    break;
                case 4:
                    document.getElementById("employeeError").innerHTML = "There is already a user with this email address!";
                    break;
                case 5:
                    document.getElementById("employeeError").innerHTML = "The email is invalid!";
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
                "Бургас"
            );

            switch (carOutput) {
                case 0:
                    forEachCar(carSel);
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

            for (let i = 1; i <= teamForm.elements.car.value.split(" ")[0]; i++) {
                if (teamForm.elements[i].value != "") {
                    firefightersArray.push(teamForm.elements[i].value);
                }
            }

            checkboxes.forEach((elements) => {
                shifts.push(elements.value);
            });

            let teamOutput = am.registerTeam(
                firefightersArray,
                teamForm.elements.car.value.split(" ")[1],
                teamForm.elements.startTime.value,
                teamForm.elements.endTime.value,
                shifts,
                teamForm.elements.holiday.value,
                teamForm.elements.sick.value,
                teamForm.elements.trip.value
            );

            switch (teamOutput) {
                case 0:
                    forEachCar(carSel);
                    updateCarSel();
                    document.getElementById("teamError").innerHTML = "Team registered successfully!";
                    break;
                case 1:
                    document.getElementById("teamError").innerHTML = "There are more than one person in the samo position!";
                    break;
                case 2:
                    document.getElementById("teamError").innerHTML = "You must select at least one firefighter!";
                    break;
                case 3:
                    document.getElementById("teamError").innerHTML = "You must select a car for the team!";
                    break;
                case 4:
                    document.getElementById("teamError").innerHTML = "You must select a start hour of a working day!";
                    break;
                case 5:
                    document.getElementById("teamError").innerHTML = "You must select a end hour of a working day!";
                    break;
                case 6:
                    document.getElementById("teamError").innerHTML = "You must select working days of the week!";
                    break;
                case 7:
                    document.getElementById("teamError").innerHTML = "You must select a holiday!";
                    break;
                case 8:
                    document.getElementById("teamError").innerHTML = "You must select a sick leave!";
                    break;
                case 9:
                    document.getElementById("teamError").innerHTML = "You must select a business trip!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }

            break;
        }
        case 7:
            let signalForm;
            if (form == 1) {
                signalForm = document.forms.signalForm;
            } else if (form == 2) {
                signalForm = document.forms.signalPendingForm
            }

            let signalOutput1 = am.assignTeamForSignal(
                signalForm.elements.signals.value,
                signalForm.elements.teams.value
            )

            switch (signalOutput1) {
                case 0:
                    document.getElementById("displaySignal").style.display = "none";
                    document.getElementById("displayPendingSignal").style.display = "none";

                    if (JSON.parse(localStorage.getItem("signals")) != null) {
                        forEachOption(sigSel, am.getSignalsWithoutTeamSelected(), "Изберете сигнал");
                        forEachOption(sigPendingSel, am.getSignalsWithTeamSelected(), "Изберете сигнал");
                    }

                    forEachOption(teamSel, am.getTeamsForSignals(), "Изберете отбор");
                    forEachOption(teamPenSel, am.getTeamsForSignals(), "Изберете отбор");
                    forEachOption(signalTeam, am.getTeamsForSignals(), "Изберете отбор");
                    break;
                case 1:
                    document.getElementById("signalError").innerHTML = "You don't have signal selected!";
                    document.getElementById("signalPendingError").innerHTML = "You don't have signal selected!";
                    break;
                case 2:
                    document.getElementById("signalError").innerHTML = "You don't have team selected!";
                    document.getElementById("signalPendingError").innerHTML = "You don't have team selected!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }

            break;
        case 8:
            let signalForm2;
            if (form == 1) {
                signalForm2 = document.forms.signalForm;
            } else if (form == 2) {
                signalForm2 = document.forms.signalPendingForm
            }

            let signalOutput2 = am.deleteSignal(signalForm2.elements.signals.value);

            switch (signalOutput2) {
                case 0:
                    if (JSON.parse(localStorage.getItem("signals")) != null) {
                        forEachOption(sigSel, am.getSignalsWithoutTeamSelected(), "Изберете сигнал");
                        forEachOption(sigPendingSel, am.getSignalsWithTeamSelected(), "Изберете сигнал");
                    }

                    document.getElementById("displaySignal").style.display = "none";
                    document.getElementById("displayPendingSignal").style.display = "none";

                    forEachOption(teamSel, am.getTeamsForSignals(), "Изберете отбор");
                    forEachOption(teamPenSel, am.getTeamsForSignals(), "Изберете отбор");
                    forEachOption(signalTeam, am.getTeamsForSignals(), "Изберете отбор");
                    break;
                case 1:
                    document.getElementById("signalError").innerHTML = "You don't have signal selected!";
                    document.getElementById("signalPendingError").innerHTML = "Signal deleted successfully!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }
            break;
        case 11:
            let signalForm5 = document.forms.signalSubmitForm;

            let output = am.submitSignalForm(
                signalForm5.elements.title.value,
                signalForm5.elements.names.value,
                signalForm5.elements.type.value,
                coordinatesX,
                coordinatesY,
                signalForm5.elements.des.value,
                signalForm5.elements.teams.value
            );

            switch (output) {
                case 0:
                    if (JSON.parse(localStorage.getItem("signals")) != null) {
                        forEachOption(sigSel, am.getSignalsWithoutTeamSelected(), "Изберете сигнал");
                        forEachOption(sigPendingSel, am.getSignalsWithTeamSelected(), "Изберете сигнал");
                    }

                    document.getElementById("displaySignal").style.display = "none";
                    document.getElementById("displayPendingSignal").style.display = "none";

                    forEachOption(teamSel, am.getTeamsForSignals(), "Изберете отбор");
                    forEachOption(teamPenSel, am.getTeamsForSignals(), "Изберете отбор");
                    forEachOption(signalTeam, am.getTeamsForSignals(), "Изберете отбор");

                    getNames();
                    document.getElementById("error").innerHTML = "Signal submit!";
                    break;
                case 1:
                    document.getElementById("error").innerHTML = "Title can not be empty!";
                    break;
                case 2:
                    document.getElementById("error").innerHTML = "Names can not be empty!";
                    break;
                case 3:
                    document.getElementById("error").innerHTML = "There must be type selected!";
                    break;
                case 4:
                    document.getElementById("error").innerHTML = "The must be a description!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }

            break;
        case 12:
            let team = am.getTeamWithId(activeUser.team);
            let signal = am.getSignalsWithId(team.signal)

            if (signal.start == null) {
                if (confirm("Do you really wand to start working")) {
                    am.startWorking(signal.id);
                }
            } else {
                if (confirm("Do you really wand to end working")) {
                    am.endWorking(signal.id);
                }
            }
            location.reload();

            break;
        default:
            console.log("A wild error appeared");
            break;
    }
}