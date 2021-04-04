ROLES = {
    USER: 0,
    FIREFIGHTER: 1,
    DISPATCHER: 2,
    ADMIN: 3
}

function User(fname, lname, email, pass, id, role) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
    this.pass = pass;
    this.id = id;
    this.role = role;
}

function AccountManager(localStorage) {
    let userArray = [];
    let ls = localStorage;

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

    function register(fname, lname, email, pass) {
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

        let user = new User(fname, lname, email, pass, ls.numberOfUsers, ROLES.ADMIN);

        if (userArray == null) {
            userArray = []
        }

        userArray.push(user);

        save();

        return 0;
    }

    function login(email, pass) {
        load();

        let index = userArray.findIndex(user => user.email.toLowerCase() == email.toLowerCase());

        if (index != -1 && userArray[index].pass == pass) {
            let activeUser = {
                fname: userArray[index].fname,
                lname: userArray[index].lname,
                email: userArray[index].email,
                pass: userArray[index].pass,
                id: userArray[index].id
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

    function checkForEnterUser(){
        return ls.isUserEnter;
    }

    return {
        getAll,
        register,
        login,
        logOut,
        deleteAccount,
        deleteAllAccount,
        checkForEnterUser
    }
}

// NB: npm install node-localstorage
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}
/*
//Tests
let am = new AccountManager(localStorage);
console.log(am.register("test", "Testov", "testtest@gmail.com", "Testtest"));
console.log(am.register("Test", "testov", "SSIvanov19@gmail.com", "Testtest"));
console.log(am.register("Stoyan", "Ivanov", "testtest@gmail.com", "Testtest"));
console.log(am.register("Stoyan", "Ivanov", "testtest@gmail.com", "Testtest"));
console.log(am.register("Stoyan", "Ivanov", "tesssssss@gmail.com", "Testtest"));
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
