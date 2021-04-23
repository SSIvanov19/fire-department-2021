ROLES = {
    USER: 0,
    FIREFIGHTER: 1,
    DISPATCHER: 2,
    ADMIN: 3
}

let admins = [{
    fname: "Stoyan",
    lname: "Ivanov",
    region: "Burgas",
    email: "admin@burgas.bg",
    pass: "!@Ad@!min#$",
    role: ROLES.ADMIN
}]

function Teams(employees, car, starOfWorkingDay, endOfWorkingDay, shifts, holidays, sickLeaves, businessTrips, id, signal = null) {
    this.employees = employees;
    this.car = car;
    this.starOfWorkingDay = starOfWorkingDay;
    this.endOfWorkingDay = endOfWorkingDay;
    this.shifts = shifts;
    this.holidays = holidays;
    this.sickLeaves = sickLeaves;
    this.businessTrips = businessTrips;
    this.id = id;
    this.signal = signal;
}

function User(fname, lname, email, pass, id, role, region = "burgas", team = null) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.pass = pass;
    this.id = id;
    this.role = role;
    this.region = region;
    if (role = ROLES.FIREFIGHTER) {
        this.team = team
    }
}

function Car(model, registrationPlate, numberOfSeats, region, id, inTeam = false) {
    this.model = model;
    this.registrationPlate = registrationPlate;
    this.numberOfSeats = numberOfSeats;
    this.region = region;
    this.id = id;
    this.inTeam = inTeam;
}

function Signal(title, names, type, coordinatesX, coordinatesY, description, id, team = null, isClosed = false, start = null, end = null, timeToComplete = null) {
    this.title = title;
    this.names = names;
    this.type = type;
    this.coordinatesX = coordinatesX;
    this.coordinatesY = coordinatesY;
    this.description = description;
    this.id = id;
    this.team = team;
    this.isClosed = isClosed;
    this.start = start;
    this.end = end;
    this.timeToComplete = timeToComplete;
}

function AccountManager(localStorage) {
    let userArray = [];
    let ls = localStorage;
    let teamArray = [];
    let carArray = [];
    let signalArray = [];

    function save() {
        ls.setItem("users", JSON.stringify(userArray));
    }

    function getAll() {
        load();
        let accounts = userArray;
        return accounts;
    }

    function load() {
        userArray = JSON.parse(ls.getItem('users'));
    }

    function findUserByEmail(email) {
        load();
        return userArray.find(user => user.email.toLowerCase() == email.toLowerCase());
    }

    function findCarByRP(registrationPlate) {
        carArray = getCars();
        return carArray.find(car => car.registrationPlate == registrationPlate);
    }

    function validateFname(fname) {
        return Boolean(fname == fname.toLowerCase());
    }

    function validateLname(lname) {
        return Boolean(lname == lname.toLowerCase());
    }

    function validatePass(pass) {
        return Boolean(pass.length < 8);
    }

    function validateEmail(email) {
        let atposition = email.indexOf("@");
        let dotposition = email.lastIndexOf(".");

        return (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= email.length)
    }

    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    function isArrayEmpty(arr) {
        return (Array.isArray(arr) && !arr.length)
    }

    function checkIfLoginUserIsAdmin(email, pass) {
        let index = admins.findIndex(admin => admin.email.toLowerCase() == email.toLowerCase());

        if (index != -1 && admins[index].pass == pass) {
            let activeUser = new User(
                admins[index].fname,
                admins[index].lname,
                admins[index].email,
                admins[index].pass,
                admins[index].id,
                admins[index].role,
                admins[index].region,
                admins[index].team
            );

            ls.isUserEnter = true;
            ls.setItem("activeUser", JSON.stringify(activeUser));

            save();
            return true;
        } else {
            return false;
        }
    }

    function registerCar(model, registrationPlate, numberOfSeats, region) {
        if (numberOfSeats <= 0) {
            return 1;
        }

        if (carArray != null) {
            carArray = getCars();
        }

        if (carArray != null) {
            if (findCarByRP(registrationPlate)) {
                return 2;
            }
        }

        if (ls.numberOfCars == undefined || ls.numberOfCars == 0) {
            ls.numberOfCars = 1;
        } else {
            ls.numberOfCars++;
        }

        let car = new Car(model, registrationPlate, numberOfSeats, region, ls.numberOfCars);

        if (carArray == null) {
            carArray = []
        }

        carArray.push(car);

        ls.setItem("cars", JSON.stringify(carArray));

        return 0;
    }

    function registerTeam(employees, car, starOfWorkingDay, endOfWorkingDay, shifts, holidays, sickLeaves, businessTrips) {
        if (teamArray != null) {
            teamArray = getTeams();
        }

        if (car == undefined) {
            return 3;
        }

        if (isArrayEmpty(employees)) {
            return 2;
        }

        if (hasDuplicates(employees)) {
            return 1;
        }

        if (starOfWorkingDay == "") {
            return 4;
        }

        if (endOfWorkingDay == "") {
            return 5;
        }

        if (isArrayEmpty(shifts)) {
            return 6;
        }

        if (holidays == "") {
            return 7;
        }

        if (sickLeaves == "") {
            return 8;
        }

        if (businessTrips == "") {
            return 9;
        }

        if (ls.numberOfTeams == undefined || ls.numberOfTeams == 0) {
            ls.numberOfTeams = 1;
        } else {
            ls.numberOfTeams++;
        }

        load();

        for (const users of userArray) {
            for (const emoployeId of employees) {
                if (users.id == emoployeId) {
                    users.team = ls.numberOfTeams;
                }
            }
        }

        carArray = JSON.parse(ls.getItem("cars"));

        carArray[carArray.findIndex(cars => cars.id == car)].inTeam = true;

        ls.setItem("cars", JSON.stringify(carArray));

        save();

        let team = new Teams(employees, car, starOfWorkingDay, endOfWorkingDay, shifts, holidays, sickLeaves, businessTrips, ls.numberOfTeams);

        if (teamArray == null) {
            teamArray = []
        }

        teamArray.push(team);

        ls.setItem("teams", JSON.stringify(teamArray));

        return 0;
    }

    function registerUser(fname, lname, email, pass, role, region) {
        if (userArray != null) {
            load();
        }

        if (validateFname(fname)) {
            return 1;
        }

        if (validateLname(lname)) {
            return 2;
        }

        if (validatePass(pass)) {
            return 3;
        }

        if (userArray != null) {
            if (findUserByEmail(email)) {
                return 4;
            }
        }

        if (validateEmail(email)) {
            return 5;
        }

        if (ls.numberOfUsers == undefined || ls.numberOfUsers == 0) {
            ls.numberOfUsers = 1;
        } else {
            ls.numberOfUsers++;
        }

        let user = new User(fname, lname, email, pass, ls.numberOfUsers, role, region);

        if (userArray == null) {
            userArray = []
        }

        userArray.push(user);

        save();

        return 0;
    }

    function login(email, pass) {
        load();

        if (checkIfLoginUserIsAdmin(email, pass)) {
            return true;
        }

        if (userArray == null) {
            return false;
        }

        let index = userArray.findIndex(user => user.email.toLowerCase() == email.toLowerCase());

        if (index != -1 && userArray[index].pass == pass) {
            let activeUser = new User(
                userArray[index].fname,
                userArray[index].lname,
                userArray[index].email,
                userArray[index].pass,
                userArray[index].id,
                userArray[index].role,
                userArray[index].region,
                userArray[index].team
            );

            ls.isUserEnter = true;
            ls.setItem("activeUser", JSON.stringify(activeUser));

            save();
            return true;

        }

        return false;
    }

    function logOut() {
        ls.isUserEnter = false;
        delete ls.activeUser;
    }

    function deleteAccount() {
        load();

        let activeUser = JSON.parse(ls.getItem("activeUser"));

        let index = userArray.findIndex(user => user.id == activeUser.id);
        userArray.splice(index, 1);

        delete ls.activeUser;

        ls.isUserEnter = false;
        ls.numberOfUsers--;
        save();
    }

    function deleteAllAccount() {
        ls.clear();
    }

    function checkForEnterUser() {
        return ls.isUserEnter;
    }

    function getCars() {
        return JSON.parse(ls.getItem('cars'));
    }

    function getSignals() {
        return JSON.parse(ls.getItem('signals'));
    }

    function getTeams() {
        return JSON.parse(ls.getItem('teams'));
    }

    function getTeamsForSignals() {
        let teams = getTeams();
        let today = new Date();
        let returnArr = [];

        if (teams == null) {
            return null;
        }

        for (const team of teams) {
            if (team.signal != null) {
                continue;
            }

            if (team.shifts.find(day => day == today.getDay()) == undefined) {
                continue;
            }

            if (parseInt(team.starOfWorkingDay) > today.getHours()) {
                continue;
            }

            if (parseInt(team.endOfWorkingDay) < today.getHours()) {
                continue;
            }

            let startOfHoliday = parseDate(team.holidays.slice(0, 10));
            let endOfHoliday = parseDate(team.holidays.slice(13, 23));

            let startOfSickLeaves = parseDate(team.sickLeaves.slice(0, 10));
            let endOfSickLeaves = parseDate(team.sickLeaves.slice(13, 23));

            let startOfBusinessTrips = parseDate(team.businessTrips.slice(0, 10));
            let endOfBusinessTrips = parseDate(team.businessTrips.slice(13, 23));

            if (startOfHoliday.getTime() <= today.getTime() && endOfHoliday.getTime() >= today.getTime()) {
                continue;
            }

            if (startOfSickLeaves.getTime() <= today.getTime() && endOfSickLeaves.getTime() >= today.getTime()) {
                continue;
            }

            if (startOfBusinessTrips.getTime() <= today.getTime() && endOfBusinessTrips.getTime() >= today.getTime()) {
                continue;
            }

            returnArr.push(team);
        }

        return returnArr;
    }

    function parseDate(input) {
        var parts = input.match(/(\d+)/g);
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }


    function getSignalsWithId(id) {
        return JSON.parse(ls.getItem('signals')).find(signal => signal.id == id);
    }

    function getSignalsWithTeamSelected(id) {
        return JSON.parse(ls.getItem('signals')).filter(signal => signal.team != null).filter(signal => signal.start == null);
    }

    function getSignalsWithoutTeamSelected(id) {
        return JSON.parse(ls.getItem('signals')).filter(signal => signal.team == null).filter(signal => signal.isClosed != true);
    }

    function getAcceptedSignals(id) {
        return JSON.parse(ls.getItem('signals')).filter(signal => signal.team != null).filter(signal => signal.start != null);
    }

    function getClosedSignals(id) {
        return JSON.parse(ls.getItem('signals')).filter(signal => signal.isClosed == true);
    }

    function getFirefighters() {
        load();
        if (userArray != null) {
            return userArray.filter(user => user.role == ROLES.FIREFIGHTER);
        } else {
            return 0;
        }
    }

    function submitSignalForm(title, names, type, coordinatesX, coordinatesY, description, team = null) {
        if (signalArray != null) {
            signalArray = getSignals();
        }

        if (title == "") {
            return 1;
        }

        if (names == "") {
            return 2;
        }

        if (type == "") {
            return 3;
        }

        if (coordinatesX == null || coordinatesY == null) {
            return 4;
        }

        if (description == "") {
            return 5;
        }

        if (ls.numberOfSignals == undefined || ls.numberOfSignals == 0) {
            ls.numberOfSignals = 1;
        } else {
            ls.numberOfSignals++;
        }


        if (team == "") {
            team = null
        }

        if (team != null) {
            let teams = getTeams();
            teams[teams.findIndex(singleTeam => singleTeam.id == team)].signal = team;
            ls.setItem('teams', JSON.stringify(teams));
        }

        let signal = new Signal(title, names, type, coordinatesX, coordinatesY, description, ls.numberOfSignals, team);

        if (signalArray == null) {
            signalArray = []
        }

        signalArray.push(signal);

        ls.setItem('signals', JSON.stringify(signalArray));

        return 0;
    }

    function assignTeamForSignal(signalId, teamId) {
        if (signalId == "") {
            return 1;
        }

        if (teamId == "") {
            return 2;
        }

        let signals = getSignals();
        let teams = getTeams();

        if (teams.findIndex(team => team.signal == signalId) != -1) {
            teams[teams.findIndex(team => team.signal == signalId)].signal = null;
        }

        signals[signals.findIndex(signal => signal.id == signalId)].team = teamId;
        teams[teams.findIndex(team => team.id == teamId)].signal = signalId;

        ls.setItem('signals', JSON.stringify(signals));
        ls.setItem('teams', JSON.stringify(teams))

        return 0;
    }

    function deleteSignal(signalId) {
        if (signalId == "") {
            return 1;
        }

        let signals = getSignals();
        let teams = getTeams();

        if (teams.findIndex(team => team.signal == signalId) != -1) {
            teams[teams.findIndex(team => team.signal == signalId)].signal = null;
        }
        let index = signals.findIndex(signal => signal.id == signalId);


        signals.splice(index, 1);

        ls.setItem('signals', JSON.stringify(signals));
        ls.setItem('teams', JSON.stringify(teams));
        ls.numberOfSignals--;

        return 0;
    }

    function getTeamWithId(id) {
        let teams = getTeams();

        return teams.find(team => team.id == id);
    }

    function getCarWithId(id) {
        let cars = getCars();

        return cars.find(car => car.id == id);
    }

    function getUserWithId(id) {
        load()

        return userArray.find(user => user.id == id);
    }

    function startWorking(id) {
        let signals = getSignals();
        signals[signals.findIndex(signal => signal.id == id)].start = new Date();

        ls.setItem("signals", JSON.stringify(signals));
    }

    function endWorking(id) {
        let teams = getTeams()
        let signals = getSignals();

        signals[signals.findIndex(signal => signal.id == id)].end = new Date();
        signals[signals.findIndex(signal => signal.id == id)].isClosed = true;

        let signal = signals.find(signal => signal.id == id);

        signals[signals.findIndex(signal => signal.id == id)].timeToComplete = diff(signal.start, signal.end);

        teams[teams.findIndex(team => team.signal == id)].signal = null;
        signals[signals.findIndex(signal => signal.id == id)].team = null;

        ls.setItem("signals", JSON.stringify(signals));
        ls.setItem("teams", JSON.stringify(teams));
    }

    function diff(start, end) {
        let startDate = new Date(start);
        let endDate = new Date(end);
        let diff = endDate.getTime() - startDate.getTime();
        let hours = Math.floor(diff / 1000 / 60 / 60);
        diff -= hours * 1000 * 60 * 60;
        let minutes = Math.floor(diff / 1000 / 60);

        if (hours < 0)
            hours = hours + 24;

        return (hours <= 9 ? "0" : "") + hours + ":" + (minutes <= 9 ? "0" : "") + minutes;
    }

    function getNumberOfSignals() {
        return localStorage.numberOfSignals;
    }

    function getNumberOfFires() {
        if (getSignals() == null) {
            return 0;
        } else {
            return getSignals().filter(signal => signal.type == "Fire").length;
        }
    }

    function getNumberOfFloods() {
        if (getSignals() == null) {
            return 0;
        } else {
            return getSignals().filter(signal => signal.type == "Flood").length;
        }
    }

    function getNumberOfTeam() {
        return ls.numberOfTeams;
    }

    function getNumberOfRescues() {
        if (getSignals() == null) {
            return 0;
        } else {
            return getSignals().filter(signal => signal.type == "Rescue").length;
        }
    }

    function getNumberOfCars() {
        return ls.numberOfCars;
    }

    function getNumberOfFreeCars() {
        if (getCars() == null) {
            return 0;
        } else {
            return getCars().filter(car => car.inTeam == false).length;
        }
    }

    return {
        getAll,
        registerUser,
        login,
        logOut,
        deleteAccount,
        deleteAllAccount,
        checkForEnterUser,
        registerTeam,
        registerCar,
        getCars,
        getFirefighters,
        submitSignalForm,
        getSignals,
        getTeams,
        assignTeamForSignal,
        getSignalsWithId,
        getTeamsForSignals,
        getSignalsWithTeamSelected,
        getSignalsWithoutTeamSelected,
        deleteSignal,
        getTeamWithId,
        getCarWithId,
        getUserWithId,
        startWorking,
        endWorking,
        getAcceptedSignals,
        getClosedSignals,
        getNumberOfSignals,
        getNumberOfFires,
        getNumberOfFloods,
        getNumberOfFloods,
        getNumberOfTeam,
        getNumberOfCars,
        getNumberOfFreeCars,
        getNumberOfRescues
    }
}

// NB: npm install node-localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
/*
let am = new AccountManager(localStorage);
console.log(am.login("admin@burgas.bg", "!@Ad@!min#$"));
/*
//Tests
let am = new AccountManager(localStorage);
console.log(am.registerUser("test", "Testov", "testtest@gmail.com", "Testtest"));
console.log(am.registerUser("Test", "testov", "SSIvanov19@gmail.com", "Testtest"));
console.log(am.registerUser("Stoyan", "Ivanov", "testtest@gmail.com", "Testtest"));
console.log(am.registerUser("Stoyan", "Ivanov", "testtest@gmail.com", "Testtest"));
console.log(am.registerUser("Stoyan", "Ivanov", "tesssssss@gmail.com", "Testtest"));
console.log(am.getAll());
console.log(am.login("test", "test"))
console.log(am.login("TeSTtest@gmail.com", "Testtest"));
console.log(am.login("testtest@gmail.com", "testtest"));
console.log(am.login("tesssssss@gmail.com", "Testtest"));

/* Expected Output
1
2
0
4
0
[
  {
    fname: 'Stoyan',
    lname: 'Ivanov',
    email: 'testtest@gmail.com',
    pass: 'Testtest',
    id: '1',
    role: 3
  },
  {
    fname: 'Stoyan',
    lname: 'Ivanov',
    email: 'tesssssss@gmail.com',
    pass: 'Testtest',
    id: '2',
    role: 3
  }
]
false
true
false
true
*/
