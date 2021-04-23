import {Storage} from '../storage.js';
const session = window.sessionStorage;
const loggedInUser = session.getItem("loggedInUser");
async function subjectListDataUser(){
    const db=firebase.firestore();
    let dataSubjectList = db.collection('subject-list').get().then(snapshot => {
        snapshot.docs.forEach(docs =>{
            var uname = [];
            if(docs.id==="subject-list-"+loggedInUser){
            for(var key in docs.data())
            {
                var value=docs.get(key);
                Storage.subjectList.push({label: key, values: value});
                Storage.attendance.push({label: key, value: value[3]});
            }
        }
        })
    }).catch(function(error){
        console.log(error);
    });
    const dataFinal = await dataSubjectList;
}
export {subjectListDataUser as subjectListDataUser}