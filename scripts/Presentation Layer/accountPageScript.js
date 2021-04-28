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
        let role = activeUser.role;
        document.getElementById("fname").innerHTML = "Име: " + activeUser.fname;
        document.getElementById("lname").innerHTML = "Фамилия: " + activeUser.lname;

        switch (Number(role)) {
            case 0:
                role = "Потребител";
                break;
            case 1:
                role = "Пожарникар";
                break;
            case 2:

                role = "Диспечер";
                break;
            case 3:
                role = "Админ";
                break;
        }

        document.getElementById("role").innerHTML = "Роля: " + role;
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
            document.getElementById("sendSignalDiv").style.display = "block";
            document.getElementById("dispatcherTabs").style.display = "block";

            getNames();
            initMapForSignal();

            if (am.getSignals() != null) {
                forEachOption(sigSel, am.getSignalsWithoutTeamSelected(), "Изберете сигнал");
                forEachOption(sigPendingSel, am.getSignalsWithTeamSelected(), "Изберете сигнал");
                forEachOption(sigAccSel, am.getAcceptedSignals(), "Изберете сигнал");
                forEachOption(sigClosedSel, am.getClosedSignals(), "Изберете сигнал");
            }

            reloadSel();

            let ids = ["displaySignal", "displayPendingSignal", "displayAcceptedSignal", "displayClosedSignal"];

            for (const id of ids) {
                document.getElementById(id).style.display = "none";
            }
        } else {
            document.getElementById("signalDiv").style.display = "none";
            document.getElementById("sendSignalDiv").style.display = "none";
            document.getElementById("dispatcherTabs").style.display = "none";
        }

        let ids = ["registerEmployee", "registerCar", "registerTeam", "adminTabs"];

        //If user is admin
        if (activeUser.role == 3) {
            document.getElementById("deleteAll").style.display = "inline";
            document.getElementById("deleteAcc").style.display = "none";
            for (const id of ids) {
                document.getElementById(id).style.display = "block";
            }
            document.getElementById("registerCar").parentElement.classList.add("is-hidden");
            document.getElementById("registerTeam").parentElement.classList.add("is-hidden");
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

/**
 * Function that initalise firefighter systems
 */
function initFirefighter() {
    if (activeUser.team == undefined || activeUser.team == null) {
        document.getElementById("team").innerHTML = "Отбор: няма";
        document.getElementById("signalP").innerHTML = "Сигнали: няма";
        document.getElementById("signalWorkButtons").style.display = "none";
        document.getElementById("fireMapSignal").classList.remove('map');
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

        for (let i = 1; i <= 6; i++) {
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
                }
            }
        }

        if (team.shifts.includes("0")) {
            workingDaysP.innerHTML += " Неделя";
        }

        document.getElementById("holidayP").innerHTML = "Почивни дни: " + team.holidays;
        document.getElementById("sickLeaveP").innerHTML = "Болнични: " + team.sickLeaves;
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
            document.getElementById("fireMapSignal").classList.remove('map');
        }
    }
}

/**
 * Loads cars in the selected elemend
 * @param {DOMElement} selectElement
 */
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

/**
 * Loads what function gives
 * in the selected elemend
 * @param {DOMElement} optionSelect 
 * @param {func} func 
 * @param {string} firstOption First option in the select element
 */
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

/**
 * initalise a map for the signal form
 */
function initMapForSignal() {
    document.getElementById("mapSignal").innerHTML = "";

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

    setTimeout(function () { map.updateSize(); }, 200);

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

/**
 * Intialise a map into div element
 * @param {string} coordinatesX Longitude
 * @param {string} coordinatesY Latitude
 * @param {string} id Id of the element
 */
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

/**
 * Place firefighter to chose from
 */
function updateCarSel() {
    let form = document.forms.registerTeam;
    let parentDiv = document.getElementById("teamMembers");
    parentDiv.innerHTML = ""
    let firefightersArray = am.getFirefighters();

    for (let i = 1; i <= form.elements.car.value.split(" ")[0]; i++) {
        let newSelect = document.createElement("Select");
        let newLabel = document.createElement("Label");
        let controlDiv = document.createElement("div");
        let selectDiv = document.createElement("div");

        newSelect.setAttribute("name", i);
        newSelect.setAttribute("id", i);
        newLabel.setAttribute("for", i);
        newLabel.classList.add("label");
        controlDiv.classList.add("control");
        selectDiv.classList.add("select")

        newLabel.innerHTML = "Пожарникар " + i + ":";

        parentDiv.appendChild(newLabel);
        parentDiv.appendChild(controlDiv);
        controlDiv.appendChild(selectDiv);
        selectDiv.appendChild(newSelect);

        newSelect.options[0] = new Option("Изберете пожарникар", "");

        parentDiv.appendChild(document.createElement("br"));

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

/**
 * Hide/Unhide element
 * @param {DOM} parentDiv The element
 * @param {string} id 
 */
function chengeParentDivDisplay(parentDiv, id) {
    if (id == "") {
        parentDiv.style.display = "none";
    } else {
        parentDiv.style.display = "block";
    }
}

carSel.onchange = updateCarSel;

/**
 * Arrow function that loads select element
 */
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
        namesP.innerHTML = "Име на изпратилия сигнала: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
    }
}

/**
 * Arrow function that loads select element
 */
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
        namesP.innerHTML = "Име на изпратилия сигнала: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
    }
}

/**
 * Arrow function that loads select element
 */
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
        namesP.innerHTML = "Име на изпратилия сигнала: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
        startP.innerHTML = "Начало на работа по сигнала: " + startDate.getHours() + ":" + startDate.getMinutes();
    }
}

/**
 * Arrow function that loads select element
 */
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
        namesP.innerHTML = "Име на изпратилия сигнала: " + signal.names;
        typeP.innerHTML = "Тип: " + signal.type;
        desP.innerHTML = "Описание: " + signal.description;
        startP.innerHTML = "Начало на работа по сигнала: " + startDate.getHours() + ":" + startDate.getMinutes();
        endP.innerHTML = "Край на работа по сигнала: " + endDate.getHours() + ":" + endDate.getMinutes();
        timeP.innerHTML = "Времетраене: " + signal.timeToComplete;
    }
}

/**
 * reload select elements
 */
function reloadSel() {
    let sels = [teamSel, teamPenSel, teamSigSel];

    for (const sel of sels) {
        forEachOption(sel, am.getTeamsForSignals(), "Изберете отбор");
    }
}

/**
 * reload select elements
 */
function reloadSigSel() {
    if (am.getSignals() != null) {
        forEachOption(sigSel, am.getSignalsWithoutTeamSelected(), "Изберете сигнал");
        forEachOption(sigPendingSel, am.getSignalsWithTeamSelected(), "Изберете сигнал");
    }
}

/**
 * Process the input from forms and send it to the backend
 * @param {number} input 
 * @param {number} form 
 */
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
                am.escapeHtml(employeeForm.elements.fname.value),
                am.escapeHtml(employeeForm.elements.lname.value),
                am.escapeHtml(employeeForm.elements.email.value),
                am.escapeHtml(employeeForm.elements.pass.value),
                am.escapeHtml(employeeForm.elements.role.value),
                "Бургас"
            );

            let employeeError = document.getElementById("employeeError");

            switch (employeeOutput) {
                case 0:
                    updateCarSel();
                    employeeError.innerHTML = "Работникът е регестриран успешно!";
                    break;
                case 1:
                    employeeError.innerHTML = "Първото име трябва да започва с главна буква!";
                    break;
                case 2:
                    employeeError.innerHTML = "Фамилното име трябва да започва с главна буква!";
                    break;
                case 3:
                    employeeError.innerHTML = "Паролата трябва да е най-малко 8 символа!";
                    break;
                case 4:
                    employeeError.innerHTML = "Вече има регестриран потребител с такъв e-mail!";
                    break;
                case 5:
                    employeeError.innerHTML = "Въведеният e-mail е невалиден!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }
            break;
        case 5:
            let carForm = document.forms.registerCar;

            let carOutput = am.registerCar(
                am.escapeHtml(carForm.elements.model.value),
                am.escapeHtml(carForm.elements.registration.value),
                am.escapeHtml(carForm.elements.seats.value),
                "Бургас"
            );

            let carError = document.getElementById("carError");

            switch (carOutput) {
                case 0:
                    forEachCar(carSel);
                    carError.innerHTML = "Колата е регестрирана успешно!";
                    break;
                case 1:
                    carError.innerHTML = "Броят на местата трябва да е по-голям от 0!";
                    break;
                case 2:
                    carError.innerHTML = "Вече има кола регестрирана с този регистрационен номер!";
                    break;
                case 3:
                    carError.innerHTML = "Моля посочете модел!";
                    break;
                case 4:
                    carError.innerHTML = "Моля посочете регистрационен номер!";
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
                am.escapeHtml(teamForm.elements.car.value.split(" ")[1]),
                am.escapeHtml(teamForm.elements.startTime.value),
                am.escapeHtml(teamForm.elements.endTime.value),
                shifts,
                am.escapeHtml(teamForm.elements.holiday.value),
                am.escapeHtml(teamForm.elements.sick.value),
                am.escapeHtml(teamForm.elements.trip.value)
            );

            let teamError = document.getElementById("teamError");

            switch (teamOutput) {
                case 0:
                    forEachCar(carSel);
                    updateCarSel();
                    teamError.innerHTML = "Отборът е регестриран успешно!";
                    break;
                case 1:
                    teamError.innerHTML = "Има работник с повече от една позиция!";
                    break;
                case 2:
                    teamError.innerHTML = "Трябва да изберете поне един пожарникар!";
                    break;
                case 3:
                    teamError.innerHTML = "Трябва да изберете кола за екипа!";
                    break;
                case 4:
                    teamError.innerHTML = "Трябва да изберете час за начало на смяната!";
                    break;
                case 5:
                    teamError.innerHTML = "Трябва да изберете час за край на смяната!!";
                    break;
                case 6:
                    teamError.innerHTML = "Трябва да изберете дни, през които отбора ще е на работа!";
                    break;
                case 7:
                    teamError.innerHTML = "Трябва да изберете дни за отпуска!";
                    break;
                case 8:
                    teamError.innerHTML = "Трябва да изберете дни за болнични!";
                    break;
                case 9:
                    teamError.innerHTML = "Трябва да изберете дни за командировка!";
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
                am.escapeHtml(signalForm.elements.signals.value),
                am.escapeHtml(signalForm.elements.teams.value)
            )

            switch (signalOutput1) {
                case 0:
                    document.getElementById("displaySignal").style.display = "none";
                    document.getElementById("displayPendingSignal").style.display = "none";

                    reloadSigSel()
                    reloadSel();

                    break;
                case 1:
                    document.getElementById("signalError").innerHTML = "Няма избран сигнал!";
                    document.getElementById("signalPendingError").innerHTML = "Няма избран сигнал!";
                    break;
                case 2:
                    document.getElementById("signalError").innerHTML = "Няма избран отбор!";
                    document.getElementById("signalPendingError").innerHTML = "Няма избран отбор!";
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
                    reloadSigSel();

                    document.getElementById("displaySignal").style.display = "none";
                    document.getElementById("displayPendingSignal").style.display = "none";

                    reloadSel();

                    break;
                case 1:
                    document.getElementById("signalError").innerHTML = "Няма избран сигнал!";
                    document.getElementById("signalPendingError").innerHTML = "Няма избран сигнал!";
                    break;
                default:
                    console.log("A wild error appeared");
                    break;
            }
            break;
        case 11:
            let signalForm5 = document.forms.signalSubmitForm;

            let output = am.submitSignalForm(
                am.escapeHtml(signalForm5.elements.title.value),
                am.escapeHtml(signalForm5.elements.names.value),
                am.escapeHtml(signalForm5.elements.type.value),
                coordinatesX,
                coordinatesY,
                am.escapeHtml(signalForm5.elements.des.value),
                am.escapeHtml(signalForm5.elements.teams.value)
            );

            let error = document.getElementById("error");

            switch (output) {
                case 0:
                    reloadSigSel();

                    document.getElementById("displaySignal").style.display = "none";
                    document.getElementById("displayPendingSignal").style.display = "none";

                    reloadSel();

                    getNames();
                    error.innerHTML = "Сигналът е изпратен!";
                    break;
                case 1:
                    error.innerHTML = "Сигналът трябва да има име!";
                    break;
                case 2:
                    error.innerHTML = "Моля, попълнете вашите имена!";
                    break;
                case 3:
                    error.innerHTML = "Сигналът трябва да има тип!";
                    break;
                case 4:
                    error.innerHTML = "Моля, изберете адрес от картата!";
                    break;
                case 5:
                    error.innerHTML = "Сигналът трябва да има описание!";
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
                if (confirm("Наистина ли искате да започнете да работите?")) {
                    am.startWorking(signal.id);
                }
            } else {
                if (confirm("Наистина ли искат да спрете да работите?")) {
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