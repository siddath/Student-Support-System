import {Storage} from '../storage.js';
import {signOut} from '../signOut.js';
import {loadSubjectTable} from './subjectList.js';
const session = window.sessionStorage;
const loggedInUser = session.getItem("loggedInUser");
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
} else {
    initialize();
}
$(document).ready(function(){
    $('#subject-list-table-content').load("./subject_list/index.html");
    const signOutButton = document.querySelector("#sign-out");
    signOutButton.addEventListener("click", signOut);
    var collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
    var collapseList = collapseElementList.map(function (collapseEl) {
    return new bootstrap.Collapse(collapseEl)
    });
});
function initialize() {
    loadSubjectTable();
}

 function getAttendance(){
    var datapoints = [];
    for(var arr of Storage.attendance)
    {
        console.log(arr);
        datapoints.push({ label: arr.label, y: arr.value});
    }
    renderChart(datapoints);
}
function renderChart(datapoints){
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        dataPointWidth: 70,
        axisY: {
            title: "Attendance in %",           
        },
        data: [{        
            type: "column",  
            showInLegend: true, 
            legendMarkerColor: "grey",
            legendText: "Subjects",
            dataPoints: datapoints,
            // dataPoints: [      
            //     { y: 89, label: "Artifical Intelligence" },
            //     { y: 67,  label: "Professional Ethics" },
            //     { y: 55,  label: "Web Programming" },
            //     { y: 78,  label: "Total Quality Management" },
            //     { y: 80,  label: "Distributed Computing" },
            //     { y: 65, label: "Object Oriented Analysis & Design" },
            //     { y: 98,  label: "Human Computer Interface" },
            //     { y: 59,  label: "Machine Learning" }
            // ]
        }]
    });
    chart.render();
}

export {getAttendance as getAttendance};