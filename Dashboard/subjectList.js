import {subjectListDataUser} from './subjectListFetch.js';
import {Storage} from '../storage.js';
import {getAttendance} from './dashboard.js';
function loadSubjectTable(){
    getSubjectList();
}
function getSubjectList(){
    let subjectListData = finalSubjectListData();
}
async function finalSubjectListData(){
    let subjectListDataFetched = await subjectListDataUser();
    console.log(Storage.subjectList);
    for(var arr of Storage.subjectList)
    {
        loadTable(arr.label,arr.values[1],arr.values[2],arr.values[0]);
    }
    getAttendance();
}
function loadTable(subjectName, facultyName, assignmentNo, creditsNo){
    const table = document.getElementById("subject-table");
    const rowDiv = document.createElement("div");
    const subjectNameDiv = document.createElement("div");
    const facultyNameDiv = document.createElement("div");
    const assignementsDiv = document.createElement("div");
    const creditsDiv = document.createElement("div");
    rowDiv.classList.add("row");
    table.appendChild(rowDiv); 
    subjectNameDiv.classList.add("cell");
    facultyNameDiv.classList.add("cell");
    assignementsDiv.classList.add("cell");
    creditsDiv.classList.add("cell");
    subjectNameDiv.textContent=subjectName;
    facultyNameDiv.textContent=facultyName;
    assignementsDiv.textContent=assignmentNo;
    creditsDiv.textContent=creditsNo;
    rowDiv.appendChild(subjectNameDiv);
    rowDiv.appendChild(facultyNameDiv);
    rowDiv.appendChild(assignementsDiv);
    rowDiv.appendChild(creditsDiv);   
 
}
export {loadSubjectTable as loadSubjectTable};

// area of expertise
// title
//emailID
//affiliation
//Degree