/**
 * Gets the User Details from firestore/firbase
 */
import {Storage} from '../storage.js';
async function getLoginDetails(){
    const db=firebase.firestore();
    //db.settings({timestampsInSnapshots: true});
    let users =  db.collection('users').get().then((snapshot) => {
        snapshot.docs.forEach(doc =>{
            Storage.login.push({'username': doc.data().username, 'password' : doc.data().password, 'branch' : doc.data().branch, 'class' : doc.data().class, 'id' : doc.data().id});
        })
    }).catch(function(error){
        console.log(error);
    });
    const dataFinal = await users;
}

export {getLoginDetails as getLoginDetails};