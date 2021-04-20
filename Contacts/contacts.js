import {Storage} from '../storage.js';
import {signOut} from '../signOut.js';
import {getContactsDetails} from './fetchContacts.js';
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}
function initialize(){
    const signOutButton = document.querySelector("#sign-out");
    signOutButton.addEventListener("click", signOut);
    var collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
    var collapseList = collapseElementList.map(function (collapseEl) {
    return new bootstrap.Collapse(collapseEl)
    });
    loadListOfPeople();
}
function  loadListOfPeople(){
    let listOfPeople = getDetailsOfPeople();
}
async function getDetailsOfPeople(){
    let dataOfPeople = await getContactsDetails();
    console.log(Storage.contacts);
    for(var person of Storage.contacts){
        //console.log(element);
        displayDetailsOfContacts(person.values, person.name);
    }
}
function displayDetailsOfContacts(person, name){
    const facultyContentDiv = document.querySelector(".faculties-content")
    const personDiv = document.createElement('div');
    const cardDiv = document.createElement('div');
    const imgElement = document.createElement('img');
    const cardBodyDiv = document.createElement('div');
    personDiv.classList.add("person");
    cardDiv.classList.add("card");
    cardDiv.setAttribute("style","width: 18rem");
    imgElement.src='../assets/siddath.jpeg';
    imgElement.classList.add("card-img-top");
    imgElement.classList.add("img-thumbnail");
    cardBodyDiv.classList.add("card-body");
    const h5Element=document.createElement('h5');
    const pElement=document.createElement('p');
    const aElement=document.createElement('a');
    h5Element.classList.add("card-title");
    pElement.classList.add("card-text");
    aElement.classList.add("btn");
    aElement.classList.add("btn-primary");
    aElement.textContent="Send Email";
    name= replaceWithTheCapitalLetter(name);
    //console.log(replaceWithTheCapitalLetter(name));
    h5Element.textContent=person[5] + " " + name;
    aElement.href="mailto:"+person[2];
    pElement.innerHTML= "<b>Area of Expertise: </b>" + person[0] + "</Br>" + "<b>"+ person[1] +"</b>" + "</Br>" + "<b>"+ person[4] + "</b>" + "</Br>" + "<b>Affiliation: </b>" + person[3];
    cardBodyDiv.appendChild(h5Element);
    cardBodyDiv.appendChild(pElement);
    cardBodyDiv.appendChild(aElement);
    cardDiv.appendChild(imgElement);
    cardDiv.appendChild(cardBodyDiv);
    personDiv.appendChild(cardDiv);
    facultyContentDiv.appendChild(personDiv);
}

function replaceWithTheCapitalLetter(values){
    return values.charAt(0).toUpperCase() + values.slice(1);
 }
