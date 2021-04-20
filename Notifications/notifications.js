import {Storage} from '../storage.js';
import {getLoginDetails} from '../Sign-in/loginDetails.JS';
import {signOut} from '../signOut.js';
import {getNewsTags} from './newsTagsFetch.js';
import {followingDataFetch} from './followingFetch.js';
import {newsContentFetch} from './followingFetch.js';
import {pushTagToFollowing, removeTagFromFollowing} from './firestorePushRemoveTags.js';
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}
function initialize(){
    detailsOfAllUsers();
    newsTagsDisplay();
    const signOutButton = document.querySelector("#sign-out");
    signOutButton.addEventListener("click", signOut);
    var collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
    var collapseList = collapseElementList.map(function (collapseEl) {
    return new bootstrap.Collapse(collapseEl)
    });
    
}
function detailsOfAllUsers(){
    let usersDetails = getDetailsUsers();
}

function newsTagsDisplay(){
    let displayFollowingTags = followingTags();
}

async function followingTags(){
    let newsDataButtons = await getNewsTags();
    getFollowing();
}
async function getDetailsUsers(){
    let dataOfUsers = await getLoginDetails();
    displayDetails();
}

function checkIfFollowing(buttonId){
    //console.log(Storage.following);  
    var checkIfFollowingData = Storage.following.filter(function(followingElement) {
        var str = followingElement.fullvalue;
        var res = str.split("-");
        return res[0] === buttonId
    });
    return checkIfFollowingData;
}

function createNewsTags(){
    const newsTagDiv = document.querySelector(".follow-news-tags")
    for(var tagElement of Storage.newsTags){
        const newNewsTag = document.createElement("button");
        newNewsTag.classList.add("btn");
        newNewsTag.classList.add("newsTags");
        newNewsTag.append(tagElement.tag);
        newNewsTag.setAttribute("id", tagElement.tag);
        newsTagDiv.appendChild(newNewsTag);
        var dataToApplyTagColour = checkIfFollowing(tagElement.tag);
        //console.log(dataToApplyTagColour);
        if(dataToApplyTagColour.length === 1){
            newNewsTag.classList.add("btn-success");
        }
        if(dataToApplyTagColour.length === 0){
            newNewsTag.classList.add("btn-info");
        }
    }
    const newsTagClickButtons = document.querySelectorAll(".newsTags");
    for (var i = 0; i < newsTagClickButtons.length; i++) {
        newsTagClickButtons[i].addEventListener('click',function(){ 
            subscribe(this.innerHTML)
        });
      }
    displayNewsContent();
}
function displayDetails(){
    const session = window.sessionStorage;
    const loggedInUser = session.getItem("loggedInUser");
    const nameDiv =  document.getElementById('name');
    const classDiv =  document.getElementById('class');
    const branchDiv =  document.getElementById('branch');
    displayImage(loggedInUser);
    var userData = Storage.login.filter( function(item) {
        return item.username == loggedInUser;
    });
    //console.log(userData);
    nameDiv.innerText = userData[0].username;
    classDiv.innerText = userData[0].class;
    branchDiv.innerText = userData[0].branch;
}

function displayImage(image){
    const userImage =  document.getElementById('user-photo');
    userImage.src = '../assets/' + image + '.jpeg';
}

async function displayNewsContent(){
   for(var tag of Storage.following){
      let finalNewsContent = await newsContentFetch(tag.fullvalue);
   }
   //console.log(Storage.notifications);
   createNotificationModal();
}

function createNotificationModal(){
    const notificationsContentDiv = document.querySelector(".news-update");
    const modalsContentDiv = document.getElementById('modals-content');
    var i = 0;
    for(var contentNotifications of Storage.notifications){
        //console.log(contentNotifications);
        const notificationModalButton = document.createElement('button');
        notificationModalButton.id = "notification-modal-"+ contentNotifications.tag + "-" + i;
        notificationModalButton.classList.add("btn");
        notificationModalButton.classList.add("btn-primary");
        notificationModalButton.classList.add("notification-modal");
        notificationModalButton.innerHTML = contentNotifications.title;
        modalsContentDiv.appendChild(notificationModalButton);
        Storage.tagsIndex.push({tag: contentNotifications.tag, index: i});
        $("#notification-modal-"+contentNotifications.tag + "-"+ i).click(function(){
            bootbox.alert({
                message: contentNotifications.content,
                animate: true,
                className: "modal-dialog-scrollable",
            });  
        });
        i++;
    }
}

function getFollowing()
{
    let dataFollowing = getFollowingData();
}
async function getFollowingData(){
    let followingDataFinal = await followingDataFetch();
    //console.log(Storage.following);
    createNewsTags();
}

async function updateFollowingList(){
    let updatedFollowingData = await followingDataFetch();
}
async function subscribe(buttonId){
    const checkFollowResult = checkIfFollowing(buttonId); 
    // console.log("Before Operation : ")  
    // console.log(Storage.following);
    if(checkFollowResult.length === 1){
        var str = checkFollowResult[0].fullvalue;
        var res = str.split("-");
        console.log("Button Removed: " + buttonId);
        const tagButton = document.getElementById(res[0]);
        let removedData = await removeTagFromFollowing(buttonId);
        Storage.following = [];
        tagButton.classList.remove("btn-success");
        tagButton.classList.add("btn-info");
        let updateFollowing = await updateFollowingList();
        let removeNotificationContent = await removeModals(buttonId);
        //let removedNotificationContent = await removeModal(buttonId);
    }

     if(checkFollowResult.length === 0){
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
    // console.log("After Operation : ")  
    // console.log(Storage.following);
}

async function pushModal(tag){  
    const modalsContentDiv = document.getElementById('modals-content');
    let updatedNewsContent = await newsContentFetch(tag+'-news');
    //console.log(Storage.notifications);
    const lengthOfNotifications = Storage.notifications.length;
    const indexOfNotificationNeeded = lengthOfNotifications - 1;
   // console.log(indexOfNotificationNeeded);
    var newNotificationData = Storage.notifications[indexOfNotificationNeeded];
    const notificationModalButton = document.createElement('button');
    notificationModalButton.id = "notification-modal-"+ newNotificationData.tag + "-" + indexOfNotificationNeeded;
    notificationModalButton.classList.add("btn");
    notificationModalButton.classList.add("btn-primary");
    notificationModalButton.classList.add("notification-modal");
    notificationModalButton.innerHTML = newNotificationData.title;
    Storage.tagsIndex.push({tag: newNotificationData.tag, index: indexOfNotificationNeeded});
    modalsContentDiv.appendChild(notificationModalButton);
    $("#notification-modal-" + newNotificationData.tag + "-" + indexOfNotificationNeeded).click(function(){
        bootbox.alert({
            message: newNotificationData.content,
            animate: true,
            className: "modal-dialog-scrollable",
            });  
        });
}

async function removeModals(tag){
     const notificationModalDiv = document.getElementById('modals-content').children;
    // console.log(notificationModalDiv.length);
    // for(var i = 0; i < notificationModalDiv.length; i++){
    //     //notificationModalDiv.remove();
    //     console.log(notificationModalDiv[i]);
    //     notificationModalDiv[i].remove();
    // }
    // for(var notifElement of notificationModalDiv){
    //     console.log(notifElement);
    //     notifElement.remove();
    // }
    // Storage.notifications = [];
    // getFollowing();
    for(var tagsIndexElement of Storage.tagsIndex){
        if(tagsIndexElement.tag === tag){
            const tagRemoveModal = document.getElementById('notification-modal-'+tag+'-'+tagsIndexElement.index);
            tagRemoveModal.remove();
            Storage.tagsIndex= arrayRemove(Storage.tagsIndex, tagsIndexElement.index);
            console.log(Storage.tagsIndex);
        }
    }
}

function arrayRemove(arr, value) { 
    
    return arr.filter(function(ele){ 
        return ele.index != value; 
    });
}

function displayChatBot(){
        // var div = document.createElement("div");
        // document.getElementsByTagName('body')[0].appendChild(div);
        // div.outerHTML = "<div id='botDiv' style='height: 38px; position: fixed; bottom: 0; z-index: 1000; background-color: #fff'><div id='botTitleBar' style='height: 38px; width: 400px; position:fixed; cursor: pointer;'></div><iframe width='400px' height='600px' src='BOTFRAMEWORK_WEB_EMBED_URL'></iframe></div>"; 
    
        // document.querySelector('body').addEventListener('click', function (e) {
        //     e.target.matches = e.target.matches || e.target.msMatchesSelector;
        //     if (e.target.matches('#botTitleBar')) { 
        //         var botDiv = document.querySelector('#botDiv'); 
        //         botDiv.style.height = botDiv.style.height == '600px' ? '38px' : '600px';
        //     };
        // });
        const chatbot = document.querySelector('.chatbot');
        if(chatbot.style.display == 'none')
        {
            chatbot.style.display = 'flex';
           
        }
        
        else if(chatbot.style.display == 'flex'){
            chatbot.style.display = 'none';
        }
}