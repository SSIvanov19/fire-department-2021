/**
 * Enum for roles of users
 * @readonly
 * @enum {number}
 */
ROLES = {
    USER: 0,
    FIREFIGHTER: 1,
    DISPATCHER: 2,
    ADMIN: 3
}

/**
 * This is array of admin objects.
 * It represents every admin in the system
 * @type {array}
 */
let admins = [{
    fname: "Стоян",
    lname: "Иванов",
    region: "Бургас",
    email: "admin@burgas.bg",
    pass: "!@Ad@!min#$",
    role: ROLES.ADMIN
}]

/**
 * This constructor function will create
 * a team object and return it.
 * @constructor
 * @param {array} employees Array of employees ids
 * @param {number} car Id of car
 * @param {string} starOfWorkingDay When the team start working
 * @param {string} endOfWorkingDay When the team end working
 * @param {array} shifts Array of numbers, when the team is on shift
 * @param {string} holidays String with start and end of holidays
 * @param {string} sickLeaves String with start and end of sick leaves 
 * @param {string} businessTrips String with start and end of business trips
 * @param {number} id Number, which represent the id of the team
 * @param {number} signal  Id of signal setted to the team
 * @returns {Object} The team object
 */
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

/**
 * This constructor function will create
 * a user object and return it.
 * @constructor
 * @param {string} fname First name of the user
 * @param {string} lname Last name of the user
 * @param {string} email Email of the user
 * @param {string} pass Password of the user
 * @param {number} id Id of the user
 * @param {ROLES} role Role of the user
 * @param {string} region Region of the user 
 * @param {number} team Team of the user
 * @returns {Object} The user object
 */
function User(fname, lname, email, pass, id, role, region = "Бургас", team = null) {
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

/**
 * This constructor function will create
 * a car object and return it.
 * @constructor
 * @param {string} model Car model
 * @param {string} registrationPlate Car regestration plate 
 * @param {number} numberOfSeats Number of seats in the car
 * @param {string} region Region of the car
 * @param {number} id Id of the car
 * @param {boolean} inTeam Boolean type of varible that represent if car is in use by a team
 * @returns {Object} The car object
 */
function Car(model, registrationPlate, numberOfSeats, region, id, inTeam = false) {
    this.model = model;
    this.registrationPlate = registrationPlate;
    this.numberOfSeats = numberOfSeats;
    this.region = region;
    this.id = id;
    this.inTeam = inTeam;
}

/**
 * This constructor function will create
 * a signal object and return it.
 * @constructor
 * @param {string} title The title of the signal
 * @param {string} names The names of the sender of the signal 
 * @param {string} type The type of signal 
 * @param {string} coordinatesX The longitude coordinate of the signal
 * @param {string} coordinatesY The latitude coordinate of the signal
 * @param {string} description The description of the singal
 * @param {number} id The id of the signal
 * @param {number} team The id of the team setted to the signal
 * @param {boolean} isClosed Is the signal closed
 * @param {string} start Start of working on the signal
 * @param {string} end End of working on the signal
 * @param {string} timeToComplete Time taken to complete the signal
 * @returns {Object} The signal object
 */
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

/**
 * This constructor function about account managment
 * @constructor
 * @param {localStorage} localStorage  
 * @returns {Object} 
 */
function AccountManager(localStorage) {
    /**
     * Array that hold the users.
     * @type {array}
     */
    let userArray = [];

    /**
     * localStorage.
     * @type {localStorage}
     */
    let ls = localStorage;

    /**
     * Array that hold the teams.
     * @type {array}
     */
    let teamArray = [];

    /**
     * Array that hold the cars.
     * @type {array}
     */
    let carArray = [];

    /**
     * Array that hold the signals.
     * @type {array}
     */
    let signalArray = [];

    /**
     * Function to save the users in localStorage.
     */
    function save() {
        ls.setItem("users", JSON.stringify(userArray));
    }

    /**
     * Function to save the users in localStorage.
     * @returns {array} Array of all acounts.
     */
    function getAll() {
        load();
        let accounts = userArray;
        return accounts;
    }

    /**
     * Function to load the users.
     */
    function load() {
        userArray = JSON.parse(ls.getItem('users'));
    }

    /**
     * Function to find a user by email.
     * @param {string} email Email of the user 
     * @returns {object} The user.
     */
    function findUserByEmail(email) {
        load();
        return userArray.find(user => user.email.toLowerCase() == email.toLowerCase());
    }

    /**
     * Function to find a car by registration plate.
     * @param {string} registrationPlate Registration plate of the car
     * @returns {Object} The car.
     */
    function findCarByRP(registrationPlate) {
        carArray = getCars();
        return carArray.find(car => car.registrationPlate == registrationPlate);
    }

    /**
     * Function to validate the input.
     * @param {string} fname First name
     * @returns {boolean} Is fname validated?
     */
    function validateFname(fname) {
        return Boolean(fname == fname.toLowerCase());
    }

    /**
     * Function to validate the input.
     * @param {string} lname Last name
     * @returns {boolean} Is lname validated?
     */
    function validateLname(lname) {
        return Boolean(lname == lname.toLowerCase());
    }

    /**
     * Function to validate the input.
     * @param {string} pass Password
     * @returns {boolean} Is pass validated?
     */
    function validatePass(pass) {
        return Boolean(pass.length < 8);
    }

    /**
     * Function to validate the input.
     * @param {string} email Email
     * @returns {boolean} Is email validated?
     */
    function validateEmail(email) {
        let atposition = email.indexOf("@");
        let dotposition = email.lastIndexOf(".");

        return (atposition < 1 || dotposition < atposition + 2 || dotposition + 2 >= email.length)
    }

    /**
     * Function that checks for duplicates .
     * @param {array} array 
     * @returns {boolean} Does the array have duplicates?
     */
    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    /**
     * Check if array is empty.
     * @param {array} arr Array
     * @returns {boolean} Is array empty?
     */
    function isArrayEmpty(arr) {
        return (Array.isArray(arr) && !arr.length)
    }

    /**
     * Check if login user is admin.
     * @param {string} email Email
     * @param {string} pass Password
     * @returns {boolean} Is user admin?
     */
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

    /**
     * Function for registering a car.
     * @param {string} model The model of the car
     * @param {string} registrationPlate The registration plate of the car
     * @param {number} numberOfSeats Number of seats in the car
     * @param {string} region The region of the car
     * @returns {number} Error code.
     */
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

        if (model == "") {
            return 3;
        }

        if (registrationPlate == "") {
            return 4;
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

    /**
     * Function for registering a team.
     * @param {array} employees Array of employees ids
     * @param {number} car Id of the car use by the team
     * @param {string} starOfWorkingDay When the team start working
     * @param {string} endOfWorkingDay When the team end working
     * @param {array} shifts Array of numbers, when the team is on shift
     * @param {string} holidays String with start and end of holidays
     * @param {string} sickLeaves String with start and end of sick leaves 
     * @param {string} businessTrips String with start and end of business trips
     * @returns {number} Error code.
     */
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

    /**
     * Function for registering a user.
     * @param {string} fname First name of the user
     * @param {string} lname Last name of the user
     * @param {string} email Email of the user
     * @param {string} pass Password of the user
     * @param {number} role Role of the user
     * @param {string} region Region of the user
     * @returns {number} Error code.
     */
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

    /**
     * Function that check is user credentials are correct.
     * @param {string} email Email of the user
     * @param {string} pass Password of the user
     * @returns {boolean} Are credentials correct?
     */
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

    /**
     * Function that logout a user
     */
    function logOut() {
        ls.isUserEnter = false;
        delete ls.activeUser;
    }

    /**
     * Function that delete a user account
     */
    function deleteAccount() {
        load();

        let activeUser = getActiveUser();

        let index = userArray.findIndex(user => user.id == activeUser.id);
        userArray.splice(index, 1);

        delete ls.activeUser;

        ls.isUserEnter = false;
        ls.numberOfUsers--;
        save();
    }

    /**
     * Function that gets the
     * active user from localeStorage.
     * @returns {Object} Active User
     */
    function getActiveUser() {
        return JSON.parse(ls.getItem("activeUser"));
    }

    /**
     * Function that delete all accounts
     */
    function deleteAllAccount() {
        ls.clear();
    }

    /**
     * Function that check if user is logged.
     * @returns {boolean} Is user entered?
     */
    function checkForEnterUser() {
        return ls.isUserEnter;
    }

    /**
     * Function that get all cars.
     * @returns {array} Array of car objects.
     */
    function getCars() {
        return JSON.parse(ls.getItem('cars'));
    }

    /**
     * Function that get all signals.
     * @returns {array} Array of signal objects.
     */
    function getSignals() {
        return JSON.parse(ls.getItem('signals'));
    }

    /**
     * Function that get all teams.
     * @returns {array} Array of team objects.
     */
    function getTeams() {
        return JSON.parse(ls.getItem('teams'));
    }

    /**
     * Function that get all signal that can accept the signal.
     * @returns {array} Array of signal objects.
     */
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

            if (parseInt(team.starOfWorkingDay) < parseInt(team.endOfWorkingDay)) {
                if (!(parseInt(team.starOfWorkingDay) < today.getHours() && today.getHours() < parseInt(team.endOfWorkingDay))) {
                    if (parseInt(team.starOfWorkingDay) == today.getHours()) {
                        if (parseInt(team.starOfWorkingDay.split(":")[1]) > today.getMinutes()) {
                            continue;
                        }
                    } else if (parseInt(team.endOfWorkingDay) == today.getHours()) {
                        if (parseInt(team.endOfWorkingDay.split(":")[1]) < today.getMinutes()) {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
            } else if (parseInt(team.starOfWorkingDay) > parseInt(team.endOfWorkingDay)) {
                if (!(parseInt(team.starOfWorkingDay) < today.getHours() || today.getHours() < parseInt(team.endOfWorkingDay))) {
                    if (parseInt(team.starOfWorkingDay) == today.getHours()) {
                        if (parseInt(team.starOfWorkingDay.split(":")[1]) > today.getMinutes()) {
                            continue;
                        }
                    } else if (parseInt(team.endOfWorkingDay) == today.getHours()) {
                        if (parseInt(team.endOfWorkingDay.split(":")[1]) < today.getMinutes()) {
                            continue;
                        }
                    } else {
                        continue;
                    }
                }
            } else if (parseInt(team.starOfWorkingDay) == parseInt(team.endOfWorkingDay)) {
                if (parseInt(team.starOfWorkingDay.split(":")[1]) < parseInt(team.endOfWorkingDay.split(":")[1])) {
                    if (!(parseInt(team.starOfWorkingDay.split(":")[1]) < today.getHours() && today.getHours() < parseInt(team.endOfWorkingDay.split(":")[1]))) {
                        continue;
                    }
                } else if (parseInt(team.starOfWorkingDay.split(":")[1]) > parseInt(team.endOfWorkingDay.split(":")[1])) {
                    if (!(parseInt(team.starOfWorkingDay.split(":")[1]) < today.getHours() || today.getHours() < parseInt(team.endOfWorkingDay.split(":")[1]))) {
                        continue;
                    }
                }
            } else {
                console.log("A wild error appeared");
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

    /**
     * Function that converts from string to date
     * @param {string} input date in DD.MM.YYYY format
     * @returns {Date} Date
     */
    function parseDate(input) {
        var parts = input.match(/(\d+)/g);
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }

    /**
     * Function that get signal with a id.
     * @param {number} id Id of the signal
     * @returns {Signal} Signal object. 
     */
    function getSignalsWithId(id) {
        return JSON.parse(ls.getItem('signals')).find(signal => signal.id == id);
    }

    /**
     * Function that get signals that have teams.
     * @returns {array} Array of signals.
     */
    function getSignalsWithTeamSelected() {
        return JSON.parse(ls.getItem('signals')).filter(signal => signal.team != null).filter(signal => signal.start == null);
    }

    /**
     * Function that get signals that don't have teams.
     * @returns {array} Array of signals.
     */
    function getSignalsWithoutTeamSelected() {
        return JSON.parse(ls.getItem('signals')).filter(signal => signal.team == null).filter(signal => signal.isClosed != true);
    }

    /**
     * Function that get signals that are accepted.
     * @returns {array} Array of signals.
     */
    function getAcceptedSignals() {
        return JSON.parse(ls.getItem('signals')).filter(signal => signal.team != null).filter(signal => signal.start != null);
    }

    /**
     * Function that get signals that are closed.
     * @returns {array} Array of signals.
     */
    function getClosedSignals() {
        return JSON.parse(ls.getItem('signals')).filter(signal => signal.isClosed == true);
    }

    /**
     * Function that get all firefighters.
     * @returns {array} Array of firefighters.
     */
    function getFirefighters() {
        load();
        if (userArray != null) {
            return userArray.filter(user => user.role == ROLES.FIREFIGHTER);
        } else {
            return 0;
        }
    }

    /**
     * Function that save signal to the localStorage
     * @param {string} title The title of the signal
     * @param {string} names The names of the sender of the signal 
     * @param {string} type The type of signal 
     * @param {string} coordinatesX The longitude coordinate of the signal
     * @param {string} coordinatesY The latitude coordinate of the signal
     * @param {string} description The description of the singal
     * @param {number} team The id of the team setted to the signal
     * @returns {number} Error code,
 */
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

    /**
     * Function that assign team for a signal
     * @param {number} signalId Id of the signal
     * @param {number} teamId Id of the team
     * @returns {number} Error code.
     */
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

    /**
     * Function that delete a signal.
     * @param {number} signalId Id of the signal
     * @returns {number} Error code.
     */
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

    /**
     * Function that return a team with id.
     * @param {number} id Id of the team
     * @returns {Team} Team object.
     */
    function getTeamWithId(id) {
        let teams = getTeams();

        return teams.find(team => team.id == id);
    }

    /**
     * Function that return a car with id. 
     * @param {number} id Id of the car
     * @returns {Car} Car object.
     */
    function getCarWithId(id) {
        let cars = getCars();

        return cars.find(car => car.id == id);
    }

    /**
     * Function that return a user with id. 
     * @param {number} id Id of the user
     * @returns {User} User object.
     */
    function getUserWithId(id) {
        load()

        return userArray.find(user => user.id == id);
    }

    /**
     * Function that save the time of start of working.
     * @param {number} id Id of the signal 
     */
    function startWorking(id) {
        let signals = getSignals();
        signals[signals.findIndex(signal => signal.id == id)].start = new Date();

        ls.setItem("signals", JSON.stringify(signals));
    }

    /**
     * Function that save the time of end of working.
     * @param {number} id Id of the signal 
     */
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

    /**
     * Function that estimate the time between two time
     * @param {string} start Start time
     * @param {string} end End Time
     * @returns {string} Time difference
     */
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

    /**
     * Return the number of signals.
     * @returns {number} Number of signals
     */
    function getNumberOfSignals() {
        return localStorage.numberOfSignals;
    }

    /**
     * Return the number of fires.
     * @returns {number} Number of fires
     */
    function getNumberOfFires() {
        if (getSignals() == null) {
            return 0;
        } else {
            return getSignals().filter(signal => signal.type == "Fire").length;
        }
    }

    /**
     * Return the number of floods.
     * @returns {number} Number of floods
     */
    function getNumberOfFloods() {
        if (getSignals() == null) {
            return 0;
        } else {
            return getSignals().filter(signal => signal.type == "Flood").length;
        }
    }

    /**
     * Return the number of teams.
     * @returns {number} Number of teams
     */
    function getNumberOfTeam() {
        return ls.numberOfTeams;
    }

    /**
     * Return the number of rescues.
     * @returns {number} Number of rescues
     */
    function getNumberOfRescues() {
        if (getSignals() == null) {
            return 0;
        } else {
            return getSignals().filter(signal => signal.type == "Rescue").length;
        }
    }

    /**
     * Return the number of cars.
     * @returns {number} Number of cars
     */
    function getNumberOfCars() {
        return ls.numberOfCars;
    }

    /**
     * Return the number of free cars.
     * @returns {number} Number of free cars
     */
    function getNumberOfFreeCars() {
        if (getCars() == null) {
            return 0;
        } else {
            return getCars().filter(car => car.inTeam == false).length;
        }
    }

    /**
     * Function that prevent Cross Site Scripting
     * by replacing (escaping) special HTML characters.
     * @param {string} unsafe The unsafe string
     * @returns The modified safe string
     */
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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
        getNumberOfRescues,
        getActiveUser,
        isArrayEmpty,
        escapeHtml
    }
}

//QA Area - Tests
// NB: npm install node-localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
/*
let am = new AccountManager(localStorage);
console.log(am.login("admin@burgas.bg", "!@Ad@!min#$"));
/*
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