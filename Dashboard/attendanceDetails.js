/**
 * Gets the Attendance Details from firestore/firbase
 */
import {Storage} from '../storage.js';
const session = window.sessionStorage;
const loggedInUser = session.getItem("loggedInUser");
async function attendanceDataUser(){
    const db=firebase.firestore();
    db.settings({timestampsInSnapshots: true});
    let dataAttendance = db.collection('attendance').get().then(snapshot => {
        snapshot.docs.forEach(docs =>{
            var uname = [];
            let map = new Map();
            if(docs.id==="attendance-"+loggedInUser){
            for(var key in docs.data())
            {
                var value = docs.get(key);
                map.set(key,value);
            }
            Storage.attendance.push(map);
        }
        })
    }).catch(function(error){
        console.log(error);
    });
    const dataFinal = await dataAttendance;
}
export {attendanceDataUser as attendanceDataUser};