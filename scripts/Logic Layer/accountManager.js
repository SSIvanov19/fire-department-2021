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

function Teams(employ1Id, employ2Id, employ3Id, employ4Id, employ5Id, employ6Id, car, starOfWorkingDay, endOfWorkingDay, shifts, holidays, sickLeaves, businessTrips) {
    this.employ1Id = employ1Id;
    this.employ2Id = employ2Id;
    this.employ3Id = employ3Id;
    this.employ4Id = employ4Id;
    this.employ5Id = employ5Id;
    this.employ6Id = employ6Id;
    this.car = car;
    this.starOfWorkingDay = starOfWorkingDay;
    this.endOfWorkingDay = endOfWorkingDay;
    this.shifts = shifts;
    this.holidays = holidays;
    this.sickLeaves = sickLeaves;
    this.businessTrips = businessTrips;
}

function User(fname, lname, email, pass, id, role) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.pass = pass;
    this.id = id;
    this.role = role;
}

function Employ(fname, lname, email, pass, id, role, region) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.pass = pass;
    this.id = id;
    this.role = role;
    this.region = region;
}

function AccountManager(localStorage) {
    let userArray = [];
    let ls = localStorage;
    let teamArray = [];

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

    function validateFname(fname) {
        return Boolean(fname == fname.toLowerCase());
    }

    function validateLname(lname) {
        return Boolean(lname == lname.toLowerCase());
    }

    function validatePass(pass) {
        return Boolean(pass.length < 8);
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

    function registerTeam(employ1Id, employ2Id, employ3Id, employ4Id, employ5Id, employ6Id, car, starOfWorkingDay, endOfWorkingDay, shifts, holidays, sickLeaves, businessTrips) {
        if (teamArray != null) {
            teamArray = JSON.parse(ls.getItem('teams'));
        }

        if (ls.numberOfTeams == undefined || ls.numberOfTeams == 0) {
            ls.numberOfTeams = 1;
        } else {
            ls.numberOfTeams++;
        }

        let team = new Teams(employ1Id, employ2Id, employ3Id, employ4Id, employ5Id, employ6Id, car, starOfWorkingDay, endOfWorkingDay, shifts, holidays, sickLeaves, businessTrips);

        if (teamArray == null) {
            teamArray = []
        }

        teamArray.push(team);

        ls.setItem("teams", JSON.stringify(teamArray));

        return 0;
    }

    function registerEmploy(fname, lname, email, pass, role, region) {
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

        let employ = new Employ(fname, lname, email, pass, ls.numberOfUsers, role, region);

        if (userArray == null) {
            userArray = []
        }

        userArray.push(employ);

        save();

        return 0;
    }

    function registerUser(fname, lname, email, pass) {
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

        let user = new User(fname, lname, email, pass, ls.numberOfUsers, ROLES.USER);

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

        let index = userArray.findIndex(user => user.email.toLowerCase() == email.toLowerCase());

        if (index != -1 && userArray[index].pass == pass) {
            let activeUser = {
                fname: userArray[index].fname,
                lname: userArray[index].lname,
                email: userArray[index].email,
                pass: userArray[index].pass,
                id: userArray[index].id,
                role: userArray[index].role
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

    return {
        getAll,
        registerUser,
        login,
        logOut,
        deleteAccount,
        deleteAllAccount,
        checkForEnterUser,
        registerEmploy,
        registerTeam
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
