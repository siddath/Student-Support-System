import {Storage} from '../storage.js';
const session = window.sessionStorage;
const loggedInUser = session.getItem("loggedInUser");
async function subjectListDataUser(){
    const db=firebase.firestore();
   // db.settings({timestampsInSnapshots: true});
    let dataSubjectList = db.collection('subject-list').get().then(snapshot => {
        snapshot.docs.forEach(docs =>{
            var uname = [];
            if(docs.id==="subject-list-"+loggedInUser){
            for(var key in docs.data())
            {
                //var value = docs.get(key);
                //map.set(key,value);
                //for(var ele in key)
                var value=docs.get(key);
                //console.log(value);
                Storage.subjectList.push({label: key, values: value});
                Storage.attendance.push({label: key, value: value[3]});
                //array = Array.from(map, ([name, value]) => ({ name, value }));
                //console.log(value);
            }
          //  console.log(docs.data());
        }
        })
    }).catch(function(error){
        console.log(error);
    });
    const dataFinal = await dataSubjectList;
}
export {subjectListDataUser as subjectListDataUser}