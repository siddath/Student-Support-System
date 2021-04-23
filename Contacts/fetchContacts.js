/**
 * Gets the Contact Details from firestore/firbase
 */
 import {Storage} from '../storage.js';
 async function getContactsDetails(){
    const db=firebase.firestore();
    db.settings({timestampsInSnapshots: true});
    let dataContacts = db.collection('contacts').get().then(snapshot => {
        snapshot.docs.forEach(docs =>{
           // console.log(docs.data());
            if(docs.id==="contacts-siddath"){
            for(let key in docs.data())
            {
                let value= [];
                value = docs.get(key);
                console.log(value);
                Storage.contacts.push({name: key, values: value});
            }
        }
        })
    }).catch(function(error){
        console.log(error);
    });
    const dataFinal = await dataContacts;
 }
 export {getContactsDetails as getContactsDetails}

 /*
 Order of fetched results
 1. Area of Expertise
 2. Title
 3. mailID
 4. Affiliation
 5. Degrees 
 6. Identifier (Male/Female)
 */
