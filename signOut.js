/**
 * Signs out the current user
 */
 export function signOut() {

    window.sessionStorage.setItem("isSessionValid", false);
    window.location.href = '../app.html';
}