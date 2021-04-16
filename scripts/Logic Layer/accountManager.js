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

function Teams(employees, car, starOfWorkingDay, endOfWorkingDay, shifts, holidays, sickLeaves, businessTrips) {
    this.employees = employees;
    this.car = car;
    this.starOfWorkingDay = starOfWorkingDay;
    this.endOfWorkingDay = endOfWorkingDay;
    this.shifts = shifts;
    this.holidays = holidays;
    this.sickLeaves = sickLeaves;
    this.businessTrips = businessTrips;
}

function User(fname, lname, email, pass, id, role, region) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.pass = pass;
    this.id = id;
    this.role = role;
    this.region = region;
}

function Car(model, registrationPlate, numberOfSeats, region) {
    this.model = model;
    this.registrationPlate = registrationPlate;
    this.numberOfSeats = numberOfSeats;
    this.region = region;
}

function AccountManager(localStorage) {
    let userArray = [];
    let ls = localStorage;
    let teamArray = [];
    let carArray = [];

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
        carArray = JSON.parse(ls.getItem('cars'));
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

    function hasDuplicates(array) {
        return (new Set(array)).size !== array.length;
    }

    function checkIfLoginUserIsAdmin(email, pass) {
        let index = admins.findIndex(admin => admin.email.toLowerCase() == email.toLowerCase());

        if (index != -1 && admins[index].pass == pass) {
            let activeUser = {
                fname: admins[index].fname,
                lname: admins[index].lname,
                email: admins[index].email,
                pass: admins[index].pass,
                role: admins[index].role,
                region: admins[index].region,
            };

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
            carArray = JSON.parse(ls.getItem('cars'));
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

        let car = new Car(model, registrationPlate, numberOfSeats, region);

        if (carArray == null) {
            carArray = []
        }

        carArray.push(car);

        ls.setItem("cars", JSON.stringify(carArray));

        return 0;
    }

    const getCircularReplacer = () => {
        const seen = new WeakSet();
        return (key, value) => {
          if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
              return;
            }
            seen.add(value);
          }
          return value;
        };
      };
      
    function registerTeam(employees, car, starOfWorkingDay, endOfWorkingDay, shifts, holidays, sickLeaves, businessTrips) {
        if (teamArray != null) {
            teamArray = JSON.parse(ls.getItem('teams'));
        }

        if (hasDuplicates(employees)){
            return 1;
        }

        if (ls.numberOfTeams == undefined || ls.numberOfTeams == 0) {
            ls.numberOfTeams = 1;
        } else {
            ls.numberOfTeams++;
        }

        let team = new Teams(employees, car, starOfWorkingDay, endOfWorkingDay, shifts, holidays, sickLeaves, businessTrips);

        if (teamArray == null) {
            teamArray = []
        }

        teamArray.push(team);

        ls.setItem("teams", JSON.stringify(teamArray, getCircularReplacer()));

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
            let activeUser = {
                fname: userArray[index].fname,
                lname: userArray[index].lname,
                email: userArray[index].email,
                pass: userArray[index].pass,
                id: userArray[index].id,
                role: userArray[index].role,
                region: userArray[index].region
            };

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

        userArray.splice(activeUser.id - 1, 1);

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

    function getFirefighters() {
        load();
        if (userArray != null) {
            return userArray.filter(user => user.role == ROLES.FIREFIGHTER);
        } else {
            return 0;
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
        getFirefighters
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
