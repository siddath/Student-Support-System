import { Storage} from '../storage.js';
import { showNotification } from '../showNotification.js';
import { getLoginDetails} from './loginDetails.js';
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}

function initialize() {
    const session = window.sessionStorage;

    session.setItem("loginAttempts", 0);
    session.setItem("isSessionValid", false);
    getLoginDetails();
    console.log(Storage.login);
    // Load sign-in page along with required functions to validate
    const formElement = document.getElementById('signin-form');
    formElement.addEventListener('submit', validateForm);
    const textFocus = document.getElementById('username-text');
    textFocus.addEventListener('focus', focusUsername);
}
 

/**
 * When the user focuses on the username text field, the error message is removed(hidden).
 */
export function focusUsername() {
    const loginErrorMessage = document.querySelector(".login-error-msg");
    loginErrorMessage.style.opacity = 0;
}

/**
 * Validates the user by first matching the the user's inputs with the regular expression pattern and then the user's inputs with the fetched data from the database.
 * @param {Event} event - Event which triggers this function
 * Regular Ex  pression for Checking password - minimum 8 characters, minimum 1 Uppercase letter,1 lowecase letter, minimum 1 digit, minimum 1 special character
 */
export function validateForm(event) {

    event.preventDefault();
    const session = window.sessionStorage;
    const loginAttempts = session.getItem("loginAttempts");
    if (loginAttempts > 2) {
        showNotification("Too many incorrect/invalid attempts, wait for 5 seconds", "failure", 5000);
        disableInput();
        session.setItem("loginAttempts", 0);
        return;
    }
    let dataSignInFinal = getLoginDetails();
    const dataObj = Storage.login;
    const username = document.getElementById('username-text').value;
    const password = document.getElementById('password-text').value;
    const loginErrorMessage = document.querySelector(".login-error-msg");
   // const pattern = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&@? "]).*$/;
   const pattern = /[a-zA-Z][0-9]/i;
    if (pattern.test(password) == false) {
      //  showNotification("Password should contain minimum 8 characters including minimum 1 uppercase letter, 1 lowercase letter, 1 digit and 1 special character", "failure", 5000);
      showNotification("Please check your credentials!!!","failure",3000)  
      session.setItem("loginAttempts", +loginAttempts + 1);
    } else {
        for (let person of dataObj) {
            if (person.username == username && person.password == password) {
                session.setItem("loggedInUser", person.username);
                showNotification('User Autenticated!', "success", 3000);
                session.setItem("isSessionValid", true);
                loginErrorMessage.style.opacity = 0;
                setTimeout(()=>{
                    window.location.href = "../Dashboard/dashboard.html";
                },4000)
            } else {
                loginErrorMessage.style.opacity = 1;
            }
        }
    }
}

function disableInput() {

    const userInputs = document.querySelectorAll("input");
    userInputs.forEach(element => element.disabled = true);

    setTimeout(() => {
        const userInputs = document.querySelectorAll("input");
        userInputs.forEach(element => element.disabled = false);
        showNotification("Please enter your credentials now", "success", 2000);
    }, 5000);
}
