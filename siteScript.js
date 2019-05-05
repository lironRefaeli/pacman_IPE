
let usersDB;
let currentUser;
let currentDiv;
let logout = 'logout';

var settingsModal = document.getElementById('settings');
var modal = document.getElementById('about');
var span = document.getElementsByClassName("closeAbout")[0];
var settingsSpan = document.getElementsByClassName("closeSettings")[0];


$(document).ready(function () {
    
    usersDB =
    [
        {
            UserName: 'a',
            Password: 'a',
            firstName: 'amnon',
            lastName: 'ahroni',
            Email: 'amnon@gmail.com',
            BirthDate: '28/9/1760'
        }

    ];

    if (currentDiv === undefined)
        currentDiv = 'welcome';
    validationFuncs();
    LogInValidate();
    SignUpValidate();


});


function display(div_id) {
    $("#" + currentDiv).hide();
    currentDiv = div_id;

    if ((div_id == 'login' || div_id == 'register') && currentUser != null) {
        currentDiv = 'welcome';
    }

    if (div_id == 'logout') {
        currentDiv = 'welcome';
        document.getElementById('currentUserDiv').innerHTML = "";
        document.getElementById('userNameTable').innerHTML = "";
        $("#logoutDiv").empty();
        $('#registerBtn').attr("disabled", false);
        $('#loginBtn').attr("disabled", false);
        currentUser = null;
    }

    var modalGameOver = document.getElementById('gameOverModal');
    modalGameOver.style.display = "none";
    $("#" + currentDiv).show();
}

function login() {

    document.getElementById('errPassword').innerHTML = "";
    document.getElementById('errUserName').innerHTML = "";
    event.preventDefault();

    if (!$("#LogInValidate").valid())
        return;

    if (usersDB.some(user => user.UserName === LogInUserName.value && user.Password === LogInPassWord.value)) {
        currentUser = LogInUserName.value;
        document.getElementById('currentUserDiv').innerHTML = "Hi " + currentUser + " !";
        document.getElementById('userNameTable').innerHTML = "Player:" + currentUser;
        $("#logoutDiv").append('<a href="#" onclick="display(logout)"> Logout</a>');
        $('#registerBtn').attr("disabled", true);
        $('#loginBtn').attr("disabled", true);
        $('#aRegister').attr("href", "http://www.google.com/")
        display('welcome');
        settingsModal.style.display = "block";
    }
    else if (usersDB.some(user => user.UserName === LogInUserName.value)) {
        document.getElementById('errPassword').innerHTML = "Invalid Password";
    }
    else {
        document.getElementById('errUserName').innerHTML = "User does not exist";
    }
    return;
}

function displaySettings() {
    display('welcome');
    var modalGameOver = document.getElementById('gameOverModal');
    settingsModal.style.display = "block";
    modalGameOver.style.display = "none";
}

function addNewUser() {
    var validDate = checkdate();
    event.preventDefault();

    if (!validDate || !$("#registerValidate").valid()) {
        return;
    }
    var user = {
        UserName: username.value,
        Password: password.value,
        firstName: first.value,
        lastName: last.value,
        Email: Email.value,
        BirthDate: day.value + "/" + month.value + "/" + year.value
    };
    usersDB.push(user);
    display('login');
}

function LogInValidate() {
    $("#LogInValidate").validate({
        rules: {
            LogInUserName: {
                required: true,

            },
            LogInPassWord: {
                required: true,
            }
        },
        messages: {
            LogInUserName: {
                required: "You must fill username",
                UserExists: "the chosen username is invalid"
            },
            LogInPassWord: {
                required: 'You must fill password',
                PasswordCorrect: 'the chosen password is invalid'
            }
        },
    });
}

function SignUpValidate() {
    $("#registerValidate").validate({
        rules: {
            username: {
                required: true
            },
            password: {
                required: true,
                minlength: 8,
                passwordValidate: true
            },
            first: {
                noNumbers: true,
                required: true
            },
            last: {
                noNumbers: true,
                required: true
            },
            Email: {
                required: true,
                laxEmail: true
            },
            day: {
                daySelected: true
            },
            month: {
                monthSelected: true
            },
            year: {
                yearSelected: true
            }
        },
        messages: {
            username: {
                required: "You must fill username",
                UserNotExists: "the username is already exists"
            },
            password: {
                required: 'You must fill password',
                minlength: 'Password should conatin at least 8 characters',
                passwordValidate: "Password must contain letters and numbers"
            },
            first: {
                required: 'You must fill first name',
            },
            last: {
                required: 'You must fill last name',
            },
            Email: {
                required: 'You must fill email',
            }

        },
        highlight: function (element) {
            $(element).parent().addClass('error')
        }
    });
}

/* additional functions for the validation part*/
function validationFuncs() {
    jQuery.validator.addMethod("laxEmail", function (value, element) {
        // allow any non-whitespace characters as the host part
        return this.optional(element) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@(?:\S{1,63})$/.test(value);
    }, 'Please enter a valid email address.');
    $.validator.addMethod("noNumbers", function (first) {
        return /^[a-z]+$/i.test(first);
    }, "First name should not conatain numbers");
    $.validator.addMethod("noNumbers", function (first) {
        return /^[a-z]+$/i.test(first);
    }, "Last name should not conatain numbers");
    $.validator.addMethod("passwordValidate", function (password) {
        if (!(/\d/.test(password)))
            return false;
        else if (!(/[a-zA-Z]/.test(password)))
            return false;
        return true;
    }, "Password shuold contain letters and numbers only");
    $.validator.addMethod("daySelected", function (day) {
        return day > 0;
    }, "Please choose day");
    $.validator.addMethod("monthSelected", function (month) {
        return month > 0;
    }, "Please choose month");
    $.validator.addMethod("yearSelected", function (year) {
        return year > 0;
    }, "Please choose year");
}

/*Date functions*/
function checkdate() {
    var a = document.getElementById("month").selectedIndex;
    if (a == 2) {
        var b = document.getElementById("day").selectedIndex;
        if (b >= 29) {

            document.getElementById("bderror").innerHTML = "Not a valid date, please try again.";
            return false;

        }
    }
    document.getElementById("bderror").innerHTML = "";
    return true;
}

/*about modal functions*/
$('a[href="#about"]').click(function () {
    modal.style.display = "block";
});
span.onclick = function () {
    modal.style.display = "none";
}
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
$(document).keyup(function (e) {
    if (e.key === "Escape") {
        modal.style.display = "none";

    }
});

