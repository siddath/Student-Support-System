/**
 * Shows a notification based on the message string passed to it
 * @param {String} messageType - The type of message to be shown - "success" or "failure"
 */
 export function showNotification(message, messageType, duration) {

    const notif = document.querySelector('.form-notification');
    notif.classList.remove(notif.classList === 1 ? '' : notif.classList[1]);
    notif.classList.add(messageType);

    notif.innerText = message;

    notif.classList.toggle('show-notif');

    setTimeout(() => {
        notif.classList.toggle('show-notif');
    }, duration);
}