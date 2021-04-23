import {Storage} from '../storage.js';
const session = window.sessionStorage;
const loggedInUser = session.getItem("loggedInUser");
async function pushTagToFollowing(tagId){
    const i = Storage.following.length + 1;
    const db=firebase.firestore();
    var followingDocRef = db.collection('following').doc('following-'+loggedInUser);
    var setWithMerge = followingDocRef.set({
        following: firebase.firestore.FieldValue.arrayUnion(tagId),
    }, { merge: true })
    .then(() => {
        console.log("Document successfully written!");
    })
    .catch((error) => {
        console.error("Error writing document: ", error);
    });

    const dataFinal = await setWithMerge;
}

async function removeTagFromFollowing(id){
    const db=firebase.firestore();
    var docRefToRemove = db.collection('following').doc('following-'+loggedInUser);
    var removeFollowingTag = docRefToRemove.update({
        following: firebase.firestore.FieldValue.arrayRemove(id),
    });

    const dataFinal = await removeFollowingTag;
}
export {pushTagToFollowing as pushTagToFollowing, removeTagFromFollowing as removeTagFromFollowing};