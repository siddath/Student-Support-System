if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}
function initialize() {

    const session = window.sessionStorage;

    session.setItem("loginAttempts", 0);
    session.setItem("isSessionValid", false);
    session.setItem("loggedInUser", "");

    // Load sign-in page along with required functions to validate
    window.location.href = "./Sign-in/signIn.html";
}
