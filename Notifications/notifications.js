import { Storage } from '../storage.js';
import { getLoginDetails } from '../Sign-in/loginDetails.js';
import { signOut } from '../signOut.js';
import { getNewsTags } from './newsTagsFetch.js';
import { followingDataFetch } from './followingFetch.js';
import { newsContentFetch } from './followingFetch.js';
import { pushTagToFollowing, removeTagFromFollowing } from './firestorePushRemoveTags.js';
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}
function initialize() {
    detailsOfAllUsers();
    newsTagsDisplay();
    const signOutButton = document.querySelector("#sign-out");
    signOutButton.addEventListener("click", signOut);
    var collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
    var collapseList = collapseElementList.map(function (collapseEl) {
        return new bootstrap.Collapse(collapseEl)
    });

}
function detailsOfAllUsers() {
    let usersDetails = getDetailsUsers();
}

function newsTagsDisplay() {
    let displayFollowingTags = followingTags();
}

async function followingTags() {
    let newsDataButtons = await getNewsTags();
    getFollowing();
}
async function getDetailsUsers() {
    let dataOfUsers = await getLoginDetails();
    displayDetails();
}

function checkIfFollowing(buttonId) {
    var checkIfFollowingData = Storage.following.filter(function (followingElement) {
        return followingElement === buttonId;
    });
    return checkIfFollowingData;
}

function createNewsTags() {
    const newsTagDiv = document.querySelector(".follow-news-tags")
    for (var tagElement of Storage.newsTags) {
        const newNewsTag = document.createElement("button");
        newNewsTag.classList.add("btn");
        newNewsTag.classList.add("newsTags");
        newNewsTag.append(tagElement.tag);
        newNewsTag.setAttribute("id", tagElement.tag);
        newsTagDiv.appendChild(newNewsTag);
        var dataToApplyTagColour = checkIfFollowing(tagElement.tag);
        console.log(dataToApplyTagColour);
        if (dataToApplyTagColour.length === 1) {
            newNewsTag.classList.add("btn-success");
        }
        if (dataToApplyTagColour.length === 0) {
            newNewsTag.classList.add("btn-info");
        }
    }
    const newsTagClickButtons = document.querySelectorAll(".newsTags");
    for (var i = 0; i < newsTagClickButtons.length; i++) {
        newsTagClickButtons[i].addEventListener('click', function () {
            subscribe(this.innerHTML)
        });
    }
    displayNewsContent();
}
function displayDetails() {
    const session = window.sessionStorage;
    const loggedInUser = session.getItem("loggedInUser");
    const nameDiv = document.getElementById('name');
    const classDiv = document.getElementById('class');
    const branchDiv = document.getElementById('branch');
    displayImage(loggedInUser);
    var userData = Storage.login.filter(function (item) {
        return item.username == loggedInUser;
    });
    nameDiv.innerText = userData[0].username;
    classDiv.innerText = userData[0].class;
    branchDiv.innerText = userData[0].branch;
}

function displayImage(image) {
    const userImage = document.getElementById('user-photo');
    userImage.src = '../assets/' + image + '.jpeg';
}

async function displayNewsContent() {
    console.log(Storage.following);
    for (var element of Storage.following) {
        let finalNewsContent = await newsContentFetch(element + '-news');
    }
    createNotificationModal();
}

function createNotificationModal() {
    console.log(Storage.notifications);
    const notificationsContentDiv = document.querySelector(".news-update");
    const modalsContentDiv = document.getElementById('modals-content');
    var i = 0;
    for (var contentNotifications of Storage.notifications) {
        //console.log(contentNotifications);
        const notificationModalButton = document.createElement('button');
        notificationModalButton.id = "notification-modal-" + contentNotifications.tag + "-" + i;
        notificationModalButton.classList.add("btn");
        notificationModalButton.classList.add("btn-primary");
        notificationModalButton.classList.add("notification-modal");
        notificationModalButton.innerHTML = contentNotifications.title;
        modalsContentDiv.appendChild(notificationModalButton);
        Storage.tagsIndex.push({ tag: contentNotifications.tag, index: i });
        $("#notification-modal-" + contentNotifications.tag + "-" + i).click(function () {
            bootbox.alert({
                message: contentNotifications.content,
                animate: true,
                className: "modal-dialog-scrollable",
            });
        });
        i++;
    }
}

function getFollowing() {
    let dataFollowing = getFollowingData();
}
async function getFollowingData() {
    let followingDataFinal = await followingDataFetch();
    createNewsTags();
}

async function updateFollowingList() {
    let updatedFollowingData = await followingDataFetch();
}
async function subscribe(buttonId) {
    const checkFollowResult = checkIfFollowing(buttonId);
    if (checkFollowResult.length === 1) {
        var str = checkFollowResult[0];
        console.log(str);
        var res = str.split("-");
        console.log("Button Removed: " + buttonId);
        const tagButton = document.getElementById(str);
        let removedData = await removeTagFromFollowing(buttonId);
        Storage.following = [];
        tagButton.classList.remove("btn-success");
        tagButton.classList.add("btn-info");
        let updateFollowing = await updateFollowingList();
        let removeNotificationContent = await removeModals(buttonId);
        //let removedNotificationContent = await removeModal(buttonId);
    }

    if (checkFollowResult.length === 0) {
        const tagButton = document.getElementById(buttonId);
        tagButton.classList.remove("btn-info");
        tagButton.classList.add("btn-success");
        Storage.following = [];
        let pushedData = await pushTagToFollowing(buttonId);
        console.log("Button Pushed: " + buttonId);
        let updateFollowing = await updateFollowingList();
        let updatedNotificationsContent = await pushModal(buttonId);
        //Storage.following.push({followingTag: buttonId, fullvalue : buttonId+'-news'});
    }
    console.log(Storage.following);
    console.log(Storage.notifications);

}

async function pushModal(tag) {
    const modalsContentDiv = document.getElementById('modals-content');
    let updatedNewsContent = await newsContentFetch(tag + '-news');
    const lengthOfNotifications = Storage.notifications.length;
    const indexOfNotificationNeeded = lengthOfNotifications - 1;
    var newNotificationData = Storage.notifications[indexOfNotificationNeeded];
    const notificationModalButton = document.createElement('button');
    notificationModalButton.id = "notification-modal-" + newNotificationData.tag + "-" + indexOfNotificationNeeded;
    notificationModalButton.classList.add("btn");
    notificationModalButton.classList.add("btn-primary");
    notificationModalButton.classList.add("notification-modal");
    notificationModalButton.innerHTML = newNotificationData.title;
    Storage.tagsIndex.push({ tag: newNotificationData.tag, index: indexOfNotificationNeeded });
    modalsContentDiv.appendChild(notificationModalButton);
    $("#notification-modal-" + newNotificationData.tag + "-" + indexOfNotificationNeeded).click(function () {
        bootbox.alert({
            message: newNotificationData.content,
            animate: true,
            className: "modal-dialog-scrollable",
        });
    });
}

async function removeModals(tag) {
    const notificationModalDiv = document.getElementById('modals-content').children;
    for (var tagsIndexElement of Storage.tagsIndex) {
        if (tagsIndexElement.tag === tag) {
            const tagRemoveModal = document.getElementById('notification-modal-' + tag + '-' + tagsIndexElement.index);
            tagRemoveModal.remove();
            Storage.tagsIndex = arrayRemove(Storage.tagsIndex, tagsIndexElement.index);
            console.log(Storage.tagsIndex);
        }
    }
}

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele.index != value;
    });
}

function displayChatBot() {
    const chatbot = document.querySelector('.chatbot');
    if (chatbot.style.display == 'none') {
        chatbot.style.display = 'flex';

    }

    else if (chatbot.style.display == 'flex') {
        chatbot.style.display = 'none';
    }
}